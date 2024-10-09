import { SubmitHandler, useForm } from 'react-hook-form';
import { SignupConfirmInput, signupConfirmInputSchema } from '~/models/user.model';
import PropTypes from 'prop-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useUserStore } from '~/stores/user.store';
import { Button } from '../ui/button';

const SignupConfirmForm: React.FC<{ onSubmit: SubmitHandler<SignupConfirmInput> }> = ({ onSubmit }) => {
  const username = useUserStore((state) => state.username);
  const form = useForm<SignupConfirmInput>({
    resolver: zodResolver(signupConfirmInputSchema),
    defaultValues: {
      username: username,
      confirmationCode: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="confirmationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>認証コード</FormLabel>
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
              <FormDescription>メールに記載された認証コードを記入する</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

SignupConfirmForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignupConfirmForm;
