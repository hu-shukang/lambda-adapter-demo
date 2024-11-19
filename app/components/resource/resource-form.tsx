import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ResourceMetadataInput, ResourceMetadataView } from '~/models/resource.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import ColorPicker from '../ui/color-picker';
import ItemTable from './item-table';

type Props = {
  onSubmit: SubmitHandler<ResourceMetadataInput>;
  defaultValues?: ResourceMetadataView;
};

export default function ResourceForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<ResourceMetadataInput>({
    defaultValues: defaultValues || {
      name: '',
      color: '#0094ff',
      items: [],
    },
  });
  const { append, remove, update, replace } = useFieldArray({ control: form.control, name: 'items' });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>リソース名</FormLabel>
              <FormControl>
                <Input placeholder="リソース名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>カラー</FormLabel>
              <FormControl>
                <ColorPicker color={field.value} setColor={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="items"
          render={({ field }) => (
            <ItemTable items={field.value} remove={remove} append={append} update={update} replace={replace} />
          )}
        />
      </form>
    </Form>
  );
}
