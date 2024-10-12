import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import { ZodSchema } from 'zod';
import { Cookies } from './cookie.util';
import { Cognito } from './cognito.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

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
        return json({ error: 'Invalid request body', details: error }, { status: 400 });
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
        return json({ error: 'Invalid request path parameter', details: error }, { status: 400 });
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
        return json({ error: 'Invalid request path parameter', details: error }, { status: 400 });
      }

      return originalAction({ ...args, queryData });
    };
    return this;
  }

  withLogin() {
    const originalAction = this.actionFunc;
    this.actionFunc = async (args) => {
      let payload: CognitoIdTokenPayload | undefined = undefined;
      let idToken;
      try {
        idToken = Cookies.init(args.request).getIdToken();
        if (!idToken) {
          throw new Error('no idToken');
        }
        payload = await Cognito.verifier.verify(idToken);
      } catch (error) {
        console.log(`[login fail]idToken: ${idToken}`);
        return redirect('/auth/signin?signinRequired=true', { status: 301 });
      }
      return originalAction({ ...args, payload });
    };
    return this;
  }

  action() {
    const wrappedAction: ActionFunction = async (args) => {
      try {
        return await this.actionFunc(args as ActionFunctionArgs & T);
      } catch (error: any) {
        if (error.name === 'UserNotFoundException') {
          return json({ error: 'ログイン失敗' }, { status: 400 });
        }
        // 如果需要，可以返回一个统一的错误响应，或者重定向到错误页面
        return json({ error: 'An unexpected error occurred' }, { status: 500 });
      }
    };

    return wrappedAction;
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
        return json({ error: 'Invalid request path parameter', details: error }, { status: 400 });
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
        return json({ error: 'Invalid request path parameter', details: error }, { status: 400 });
      }

      return originalLoader({ ...args, queryData });
    };
    return this;
  }

  withLogin() {
    const originalLoader = this.loaderFunc;
    this.loaderFunc = async (args) => {
      let payload: CognitoIdTokenPayload | undefined = undefined;
      let idToken;
      try {
        idToken = Cookies.init(args.request).getIdToken();
        if (!idToken) {
          throw new Error('no idToken');
        }
        payload = await Cognito.verifier.verify(idToken);
      } catch (error) {
        console.log(`[login fail] idToken: ${idToken}`);
        const { pathname, search } = new URL(args.request.url);

        const redirectUrl = encodeURIComponent(`${pathname}${search}`);
        return redirect(`/auth/signin?signinRequired=true&redirectUrl=${redirectUrl}`, { status: 301 });
      }
      return originalLoader({ ...args, payload });
    };
    return this;
  }

  loader() {
    return this.loaderFunc as unknown as LoaderFunction;
  }
}
