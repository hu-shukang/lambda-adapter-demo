import { ActionFunction, ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from '@remix-run/node';
import { ZodSchema } from 'zod';

export class RequestWrapper {
  private args: LoaderFunctionArgs;

  constructor(args: LoaderFunctionArgs) {
    this.args = args;
  }

  public async data<T>(schema: ZodSchema<T>): Promise<T> {
    const formData = await this.args.request.formData();
    const formDataObject = Object.fromEntries(formData);
    return this.validate(formDataObject, schema);
  }

  public params<T>(schema: ZodSchema<T>): T {
    return this.validate(this.args.params, schema);
  }

  public query<T>(schema: ZodSchema<T>): T {
    const url = new URL(this.args.request.url);
    const data = Object.fromEntries(url.searchParams.entries());
    return this.validate(data, schema);
  }

  private validate<T>(data: Record<string, any>, schema: ZodSchema<T>) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error(result.error);
      throw new Error(`Form data validation error: ${result.error.message}`);
    }
    return result.data;
  }
}

type CustomActionFunctionArgs = {
  bodyData?: any;
  paramsData?: any;
  queryData?: any;
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

  withSignin() {
    const originalLoader = this.actionFunc;
    this.actionFunc = async (args) => {
      const { request } = args;
      const userId = await this.checkUserSignedIn(request);

      if (!userId) {
        throw redirect('/auth/signin');
      }

      return originalLoader(args);
    };
    return this;
  }

  withBodyValid<TBody>(schema: ZodSchema<TBody>) {
    const originalLoader = this.actionFunc;
    this.actionFunc = async (args) => {
      let bodyData;

      try {
        const formData = await args.request.formData();
        const form = Object.fromEntries(formData);
        bodyData = schema.parse(form);
      } catch (error) {
        return json({ error: 'Invalid request body', details: error }, { status: 400 });
      }

      return originalLoader({ ...args, bodyData });
    };
    return this;
  }

  withParamsValid<TParam>(schema: ZodSchema<TParam>) {
    const originalLoader = this.actionFunc;
    this.actionFunc = async (args) => {
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
    const originalLoader = this.actionFunc;
    this.actionFunc = async (args) => {
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

  action() {
    return this.actionFunc as unknown as ActionFunction;
  }

  private async checkUserSignedIn(request: Request) {
    const cookieHeader = request.headers.get('Cookie');
    const userId = cookieHeader ? 'user123' : null;
    return userId;
  }
}
