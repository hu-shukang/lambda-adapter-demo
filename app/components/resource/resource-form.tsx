import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { ResourceMetadataInput, ResourceMetadataView, typeValues } from '~/models/resource.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import ColorPicker from '../ui/color-picker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  onSubmit: SubmitHandler<ResourceMetadataInput>;
  defaultValues?: ResourceMetadataView;
};

export default function ResourceForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<ResourceMetadataInput>({
    defaultValues: defaultValues || {
      name: '',
      color: '#0094ff',
      items: [
        {
          fieldName: '',
          label: '',
          description: '',
          type: 'text',
          validation: '',
          options: [],
          order: 0,
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' });

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
          render={() => (
            <FormItem className="space-y-2">
              <FormLabel>項目</FormLabel>
              <div>
                {fields.map((field, index) => (
                  <div key={field.id}>
                    <FormField
                      control={form.control}
                      name={`items.${index}.fieldName`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="フィールド名" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="ラベル" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="説明" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="w-[300px]">
                                <SelectValue placeholder="Select a Type" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.validation`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="バリデーション" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
