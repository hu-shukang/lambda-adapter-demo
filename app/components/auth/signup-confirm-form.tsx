import { SubmitHandler, useForm } from 'react-hook-form';
import { SignupConfirmInput, signupConfirmInputSchema } from '~/models/user.model';
import PropTypes from 'prop-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="confirmationCode"
          render={({ field }) => (
            <FormItem className="flex justify-center">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot className="h-[40px] w-[40px]" index={0} />
                    <InputOTPSlot className="h-[40px] w-[40px]" index={1} />
                    <InputOTPSlot className="h-[40px] w-[40px]" index={2} />
                    <InputOTPSlot className="h-[40px] w-[40px]" index={3} />
                    <InputOTPSlot className="h-[40px] w-[40px]" index={4} />
                    <InputOTPSlot className="h-[40px] w-[40px]" index={5} />
                  </InputOTPGroup>
                </InputOTP>
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
};

SignupConfirmForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default SignupConfirmForm;
