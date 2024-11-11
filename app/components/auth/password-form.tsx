import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PasswordInput, passwordInputSchema } from '~/models/user.model';

type Props = {
  onSubmit: SubmitHandler<PasswordInput>;
};

export default function PasswordForm({ onSubmit }: Props) {
  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordInputSchema),
    defaultValues: {
      password: '',
      rePassword: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          パスワードリセット
        </Button>
      </form>
    </Form>
  );
}
