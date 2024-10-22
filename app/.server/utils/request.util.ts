import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { ZodSchema } from 'zod';
import { Cookie } from './cookie.util';
import { Cognito } from './cognito.util';

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
      const form = Object.fromEntries(formData);
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
      console.log(`[paramData]: ${JSON.stringify(parseResult.data)}`);
      args.context.paramData = parseResult.data;

      return await originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withQueryValid(schema: ZodSchema) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const url = new URL(args.request.url);
      const data = Object.fromEntries(url.searchParams.entries());
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

  private invoke() {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const idToken = await Cookie.idToken.parse(args.request.headers.get('Cookie'));
      try {
        if (idToken) {
          args.context.payload = await Cognito.verifier.verify(idToken);
        }
      } catch (e) {
        const headers = new Headers();
        headers.append('Set-Cookie', await Cookie.idToken.serialize('', { maxAge: -1 }));
        headers.append('Set-Cookie', await Cookie.refreshToken.serialize('', { maxAge: -1 }));
        return redirect('/auth/signin?signinRequired=true', { status: 301, headers: headers });
      }
      return await originalFunc({ ...args });
    };
    return newFunc;
  }

  public action() {
    this.func = this.invoke() as T;
    return this.func as ActionFunction;
  }

  public loader() {
    this.func = this.invoke() as T;
    return this.func as LoaderFunction;
  }
}
