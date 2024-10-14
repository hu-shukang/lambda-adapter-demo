import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { ZodSchema } from 'zod';
import { Cookie } from './cookie.util';
import { Cognito } from './cognito.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { Resp } from './response.util';

type CustomActionFunctionArgs = {
  bodyData?: any;
  paramsData?: any;
  queryData?: any;
  payload?: CognitoIdTokenPayload;
};

type CustomActionFunction<T extends CustomActionFunctionArgs> = (
  args: ActionFunctionArgs & T,
) => ReturnType<ActionFunction>;

export class ActionWrapper<T extends CustomActionFunctionArgs> {
  private actionFunc: CustomActionFunction<T>;
  private payload: CognitoIdTokenPayload | undefined;

  private constructor(actionFunc: CustomActionFunction<T>) {
    this.actionFunc = actionFunc;
  }

  static init<T extends CustomActionFunctionArgs>(loaderFunc: CustomActionFunction<T>) {
    return new ActionWrapper<T>(loaderFunc);
  }

  withBodyValid<TBody>(schema: ZodSchema<TBody>) {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      let bodyData;
      try {
        const formData = await args.request.formData();
        const form = Object.fromEntries(formData);
        bodyData = schema.parse(form);
        console.log(`[bodyData]: ${JSON.stringify(bodyData)}`);
      } catch (error) {
        return await Resp.json(args.request, { error: 'Invalid request body', details: error }, { status: 400 });
      }

      return originalAction({ ...args, bodyData });
    };
    return this;
  }

  withParamsValid<TParam>(schema: ZodSchema<TParam>) {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      let paramData;
      try {
        paramData = schema.parse(args.params);
        console.log(`[paramData]: ${JSON.stringify(paramData)}`);
      } catch (error) {
        return await Resp.json(
          args.request,
          { error: 'Invalid request path parameter', details: error },
          { status: 400 },
        );
      }

      return originalAction({ ...args, paramData });
    };
    return this;
  }

  withQueryValid<TQuery>(schema: ZodSchema<TQuery>) {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      let queryData;
      try {
        const url = new URL(args.request.url);
        const data = Object.fromEntries(url.searchParams.entries());
        queryData = schema.parse(data);
        console.log(`[queryData]: ${JSON.stringify(queryData)}`);
      } catch (error) {
        return await Resp.json(
          args.request,
          { error: 'Invalid request path parameter', details: error },
          { status: 400 },
        );
      }

      return originalAction({ ...args, queryData });
    };
    return this;
  }

  withLogin() {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      if (!this.payload) {
        const { pathname, search } = new URL(args.request.url);
        const redirectUrl = encodeURIComponent(`${pathname}${search}`);
        return await Resp.redirect(args.request, `/auth/signin?signinRequired=true&redirectUrl=${redirectUrl}`, {
          status: 301,
        });
      }
      return originalAction({ ...args });
    };
    return this;
  }

  action() {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      const idToken = await Cookie.idToken.parse(args.request.headers.get('Cookie'));
      if (idToken) {
        this.payload = await Cognito.verifier.verify(idToken);
      }
      return originalAction({ ...args, payload: this.payload });
    };

    return this.actionFunc as unknown as ActionFunction;
  }
}

type CustomLoaderFunctionArgs = {
  paramsData?: any;
  queryData?: any;
  payload?: CognitoIdTokenPayload;
};

type CustomLoaderFunction<T extends CustomLoaderFunctionArgs> = (
  args: LoaderFunctionArgs & T,
) => ReturnType<LoaderFunction>;

export class LoaderWrapper<T extends CustomLoaderFunctionArgs> {
  private loaderFunc: CustomLoaderFunction<T>;
  private payload: CognitoIdTokenPayload | undefined;

  private constructor(actionFunc: CustomLoaderFunction<T>) {
    this.loaderFunc = actionFunc;
  }

  static init<T extends CustomLoaderFunctionArgs>(loaderFunc: CustomLoaderFunction<T>) {
    return new LoaderWrapper<T>(loaderFunc);
  }

  withParamsValid<TParam>(schema: ZodSchema<TParam>) {
    const originalLoader = this.loaderFunc;
    this.loaderFunc = async (args) => {
      let paramData;
      try {
        paramData = schema.parse(args.params);
      } catch (error) {
        return await Resp.json(
          args.request,
          { error: 'Invalid request path parameter', details: error },
          { status: 400 },
        );
      }

      return originalLoader({ ...args, paramData });
    };
    return this;
  }

  withQueryValid<TQuery>(schema: ZodSchema<TQuery>) {
    const originalLoader = this.loaderFunc;
    this.loaderFunc = async (args) => {
      let queryData;
      try {
        const url = new URL(args.request.url);
        const data = Object.fromEntries(url.searchParams.entries());
        queryData = schema.parse(data);
      } catch (error) {
        return await Resp.json(
          args.request,
          { error: 'Invalid request path parameter', details: error },
          { status: 400 },
        );
      }

      return originalLoader({ ...args, queryData });
    };
    return this;
  }

  withLogin() {
    const originalLoader = this.loaderFunc;
    this.loaderFunc = async (args) => {
      if (!this.payload) {
        const { pathname, search } = new URL(args.request.url);
        const redirectUrl = encodeURIComponent(`${pathname}${search}`);
        return await Resp.redirect(args.request, `/auth/signin?signinRequired=true&redirectUrl=${redirectUrl}`, {
          status: 301,
        });
      }
      return originalLoader({ ...args });
    };
    return this;
  }

  loader() {
    const originalLoader = this.loaderFunc;
    this.loaderFunc = async (args) => {
      const idToken = await Cookie.idToken.parse(args.request.headers.get('Cookie'));
      if (idToken) {
        this.payload = await Cognito.verifier.verify(idToken);
      }
      return originalLoader({ ...args, payload: this.payload });
    };
    return this.loaderFunc as unknown as LoaderFunction;
  }
}
