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
      try {
        const formData = await args.request.formData();
        const form = Object.fromEntries(formData);
        const bodyData = schema.parse(form);
        console.log(`[bodyData]: ${JSON.stringify(bodyData)}`);
        args.context.bodyData = bodyData;
      } catch (error) {
        return json({ error: 'Invalid request body', details: error }, { status: 400 });
      }

      return originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withParamsValid(schema: ZodSchema) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      try {
        const paramData = schema.parse(args.params);
        console.log(`[paramData]: ${JSON.stringify(paramData)}`);
        args.context.paramData = paramData;
      } catch (error) {
        return json({ error: 'Invalid request params', details: error }, { status: 400 });
      }

      return originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public withQueryValid(schema: ZodSchema) {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      try {
        const url = new URL(args.request.url);
        const data = Object.fromEntries(url.searchParams.entries());
        const queryData = schema.parse(data);
        console.log(`[queryData]: ${JSON.stringify(queryData)}`);
        args.context.queryData = queryData;
      } catch (error) {
        return json({ error: 'Invalid request query', details: error }, { status: 400 });
      }

      return originalFunc({ ...args });
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

      return originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  private invoke() {
    const originalFunc = this.func;
    const newFunc = async (args: Parameters<T>[0]) => {
      const idToken = await Cookie.idToken.parse(args.request.headers.get('Cookie'));
      if (idToken) {
        args.context.payload = await Cognito.verifier.verify(idToken);
      }

      return originalFunc({ ...args });
    };
    this.func = newFunc as T;
    return this;
  }

  public action() {
    this.invoke();
    return this.func as ActionFunction;
  }

  public loader() {
    this.invoke();
    return this.func as LoaderFunction;
  }
}
