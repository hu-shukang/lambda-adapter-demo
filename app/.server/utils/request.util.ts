import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { ZodSchema } from 'zod';
import { Cookie } from './cookie.util';
import { Cognito } from './cognito.util';
import { BaseError } from '~/models/error.model';
import { IdTokenPayload } from '~/models/user.model';
import { SQS } from './sqs.util';
import { UserActionLog } from '~/models/log.model';
import { dateUtil } from '~/lib/date.util';
import { formDataToObject } from './form.util';

type RequestOptions = {
  actionLog: boolean;
};

export class RequestWrapper<T extends LoaderFunction | ActionFunction> {
  private func: T;

  private constructor(func: T) {
    this.func = func;
  }

  public static init<T extends LoaderFunction | ActionFunction>(func: T) {
    return new RequestWrapper(func);
  }

  public withBodyValid(schema: ZodSchema) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const formData = await args.request.formData();
      const form = formDataToObject(formData);
      const parseResult = schema.safeParse(form);
      if (!parseResult.success) {
        return json({ error: 'Invalid request body', details: parseResult.error.errors }, { status: 400 });
      }
      console.log(`[bodyData]: ${JSON.stringify(parseResult.data)}`);
      args.context.bodyData = parseResult.data;

      return await originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withParamsValid(schema: ZodSchema) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const parseResult = schema.safeParse(args.params);
      if (!parseResult.success) {
        return json({ error: 'Invalid request path parameters', details: parseResult.error.errors }, { status: 400 });
      }
      console.log(`[paramsData]: ${JSON.stringify(parseResult.data)}`);
      args.context.paramsData = parseResult.data;

      return await originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withQueryValid(schema: ZodSchema, defaultValues?: Record<string, string>) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const url = new URL(args.request.url);
      let data = Object.fromEntries(url.searchParams.entries());
      if (defaultValues) {
        data = { ...defaultValues, ...data };
      }
      const parseResult = schema.safeParse(data);
      if (!parseResult.success) {
        return json({ error: 'Invalid request query strings', details: parseResult.error.errors }, { status: 400 });
      }
      console.log(`[queryData]: ${JSON.stringify(parseResult.data)}`);
      args.context.queryData = parseResult.data;
      return await originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withLogin() {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      if (!args.context.payload) {
        console.log('no payload');
        const { pathname, search } = new URL(args.request.url);
        const redirectUrl = encodeURIComponent(`${pathname}${search}`);
        return redirect(`/auth/signin?signinRequired=true&redirectUrl=${redirectUrl}`, {
          status: 301,
        });
      }

      return await originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  private invoke(options?: RequestOptions | undefined) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const idToken = await Cookie.idToken.parse(args.request.headers.get('Cookie'));
      try {
        if (idToken) {
          args.context.payload = (await Cognito.verifier.verify(idToken)) as IdTokenPayload;
        }
      } catch (e) {
        console.log(e);
        const headers = new Headers();
        headers.append('Set-Cookie', await Cookie.idToken.serialize('', { maxAge: -1 }));
        headers.append('Set-Cookie', await Cookie.refreshToken.serialize('', { maxAge: -1 }));
        return redirect('/auth/signin?signinRequired=true', { status: 301, headers: headers });
      }
      try {
        const resp = await originalFunc({ ...args });
        if (options?.actionLog && args.context.payload) {
          const action: UserActionLog = {
            email: args.context.payload.email,
            name: args.context.payload['cognito:username'],
            ip: args.request.headers.get('X-Forwarded-For') as string,
            action: '',
            time: dateUtil.utc(),
          };
          await SQS.log.sendUserAction(action);
        }
        return resp;
      } catch (e: any) {
        if (e instanceof BaseError) {
          return json({ error: e.message, code: e.code }, { status: e.status });
        } else {
          throw json({ error: e.message, code: '' }, { status: 500 });
        }
      }
    };
    return newFunc;
  }

  public action(options?: RequestOptions | undefined) {
    this.func = this.invoke(options) as T;
    return this.func as ActionFunction;
  }

  public loader(options?: RequestOptions | undefined) {
    this.func = this.invoke(options) as T;
    return this.func as LoaderFunction;
  }
}
