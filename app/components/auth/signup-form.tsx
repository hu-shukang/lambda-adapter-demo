import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SignupInput, signupInputSchema } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link } from '@remix-run/react';

type Props = {
  onSubmit: SubmitHandler<SignupInput>;
};

export default function SignupForm({ onSubmit }: Props) {
  const form = useForm<SignupInput>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      rePassword: '',
    },
    resolver: zodResolver(signupInputSchema),
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
                <Input placeholder="ユーザ名" {...field} />
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
              <FormControl>
                <Input placeholder="メール" {...field} />
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
          新規登録
        </Button>
        <Link to="/auth/signin">
          <Button variant="outline" className="flex w-full mt-4">
            サインイン画面に戻る
          </Button>
        </Link>
      </form>
    </Form>
  );
}
