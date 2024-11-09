import { SubmitHandler, useForm } from 'react-hook-form';
import { ResetPasswordInput, resetPasswordInputSchema } from '~/models/user.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

type Props = {
  onSubmit: SubmitHandler<ResetPasswordInput>;
};

export default function ResetPasswordForm({ onSubmit }: Props) {
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordInputSchema),
    defaultValues: {
      username: '',
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
        <Button type="submit" className="flex w-full">
          リセット
        </Button>
      </form>
    </Form>
  );
}
