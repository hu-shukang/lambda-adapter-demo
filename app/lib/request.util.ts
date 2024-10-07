import { LoaderFunctionArgs } from '@remix-run/node';

export class RequestWrapper {
  private args: LoaderFunctionArgs;

  constructor(args: LoaderFunctionArgs) {
    this.args = args;
  }

  public async data<T = Record<string, any>>(): Promise<T> {
    const formData = await this.args.request.formData();
    return Object.fromEntries(formData) as T;
  }

  public params<T = Record<string, any>>(): T {
    return this.args.params as T;
  }

  public query<T = Record<string, any>>(): T {
    const url = new URL(this.args.request.url);
    const params = Object.fromEntries(url.searchParams.entries());
    return params as T;
  }
}
