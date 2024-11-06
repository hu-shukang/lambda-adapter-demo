import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AccountUpdateInput, accountUpdateInputSchema, UserInfoView } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  onSubmit: SubmitHandler<AccountUpdateInput>;
  defaultValues: UserInfoView;
};

export default function AccountForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<AccountUpdateInput>({
    defaultValues: {
      name: defaultValues.name,
      employeeNo: defaultValues.employeeNo,
      picture: defaultValues.picture,
    },
    resolver: zodResolver(accountUpdateInputSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormControl>
            <Input />
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
}
