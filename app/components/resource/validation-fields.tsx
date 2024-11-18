/**
 * text: required, min, max, email, url, pattern
 * number: required, min, max, integer
 * date: required, min, max
 * boolean: required
 * select: required, options
 * textarea: required, min, max
 */

import { ControllerRenderProps, SubmitHandler, useForm } from 'react-hook-form';
import { ResourceMetadataInput, TypeEnum, ValidationInput } from '~/models/resource.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';

type Props = {
  type: TypeEnum;
  field: ControllerRenderProps<ResourceMetadataInput, `items.${number}.validation`>;
};

export default function ValidationFields({ type, field }: Props) {
  const form = useForm<ValidationInput>({
    defaultValues: {
      type: type,
      required: false,
      min: undefined,
      max: undefined,
      email: false,
      url: false,
      pattern: undefined,
      integer: false,
      options: [{ value: '', label: '' }],
    },
  });

  const onSubmit: SubmitHandler<ValidationInput> = (data) => {
    console.log(data);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="required"
            render={({ field }) => (
              <FormItem>
                <FormLabel>必須</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {type === 'text' && (
            <>
              <FormField
                control={form.control}
                name="min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最小文字数</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>最大文字数</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          form.setValue('pattern', undefined);
                          form.setValue('email', false);
                          field.onChange(checked);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パターン</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(event) => {
                          form.setValue('url', false);
                          form.setValue('email', false);
                          field.onChange(event);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
