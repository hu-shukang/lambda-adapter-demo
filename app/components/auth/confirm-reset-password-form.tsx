import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ConfirmResetPasswordInput, confirmResetPasswordInputSchema } from '~/models/user.model';

type Props = {
  username: string;
  onSubmit: SubmitHandler<ConfirmResetPasswordInput>;
};

export default function ConfirmResetPasswordForm({ username, onSubmit }: Props) {
  const form = useForm<ConfirmResetPasswordInput>({
    resolver: zodResolver(confirmResetPasswordInputSchema),
    defaultValues: {
      username: username,
      confirmationCode: '',
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
                <Input placeholder="ユーザID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmationCode"
          render={({ field }) => (
            <FormItem className="flex justify-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
          提出
        </Button>
      </form>
    </Form>
  );
}
