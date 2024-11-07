import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AccountUpdateInput, accountUpdateInputSchema, UserInfoView } from '~/models/user.model';
import { Form, FormControl, FormItem, FormLabel } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  onSubmit: SubmitHandler<AccountUpdateInput>;
  defaultValues: UserInfoView;
};

export default function AccountForm({ onSubmit, defaultValues }: Props) {
  const form = useForm<AccountUpdateInput>({
    defaultValues: {
      name: defaultValues.name,
      picture: defaultValues.picture,
    },
    resolver: zodResolver(accountUpdateInputSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>メールアドレス</FormLabel>
          <FormControl>
            <Input value={defaultValues.email} disabled={true} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>社員番号</FormLabel>
          <FormControl>
            <Input value={defaultValues.employeeNo} disabled={true} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>組織</FormLabel>
          <FormControl>
            <Input value={defaultValues.organization} disabled={true} />
          </FormControl>
        </FormItem>
        <FormItem>
          <FormLabel>ステータス</FormLabel>
          <FormControl>
            <Input value={defaultValues.status} disabled={true} />
          </FormControl>
        </FormItem>
      </form>
    </Form>
  );
}
