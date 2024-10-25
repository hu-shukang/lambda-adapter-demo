import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserQueryInput, userQueryInputSchema } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';

type Props = {
  onSubmit: SubmitHandler<UserQueryInput>;
  defaultValues?: UserQueryInput | undefined;
};

export default function UserQueryForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<UserQueryInput>({
    defaultValues: defaultValues || {
      sort: 'SK_TIME',
      status: undefined,
      name: undefined,
      organization: undefined,
    },
    resolver: zodResolver(userQueryInputSchema),
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-4 flex items-center">
        <FormField
          control={form.control}
          name="sort"
          render={({ field }) => (
            <FormItem>
              <FormLabel>並び順</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SK_TIME">作成順</SelectItem>
                  <SelectItem value="ORGANIZATION_USER">組織順</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザ名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザ名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
