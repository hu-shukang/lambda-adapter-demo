import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ConfirmSigninInput, confirmSigninInputSchema } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type Props = {
  onSubmit: SubmitHandler<ConfirmSigninInput>;
  username: string;
};

export default function ConfirmSigninForm({ username, onSubmit }: Props) {
  const form = useForm<ConfirmSigninInput>({
    resolver: zodResolver(confirmSigninInputSchema),
    defaultValues: {
      username: username,
      password: '',
      rePassword: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="ユーザID" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="パスワード" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rePassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="パスワード再入力" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="flex w-full">
          パスワード更新
        </Button>
      </form>
    </Form>
  );
}
