import { SubmitHandler, useForm } from 'react-hook-form';
import { ResourceMetadataItemView, typeValues } from '~/models/resource.model';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  onSubmit: SubmitHandler<ResourceMetadataItemView>;
  defaultValues?: ResourceMetadataItemView;
  order: number;
};

export default function ItemForm({ onSubmit, defaultValues, order }: Props) {
  const form = useForm<ResourceMetadataItemView>({
    defaultValues: defaultValues || {
      order: order,
      fieldName: '',
      label: '',
      type: 'text',
      description: '',
      validation: '',
    },
  });
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} readOnly={true} disabled={true} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="項目名" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ラベル" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {typeValues.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
