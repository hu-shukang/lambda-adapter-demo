import { LoaderFunctionArgs } from '@remix-run/node';
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
