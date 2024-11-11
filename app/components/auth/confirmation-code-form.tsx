import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Button } from '../ui/button';
import { ConfirmationCodeInput, confirmationCodeInputSchema } from '~/models/user.model';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import Separator from '../ui/separator';
import { useLocation, useNavigate } from '@remix-run/react';
import { useCallback } from 'react';

type Props = {
  onSubmit: SubmitHandler<ConfirmationCodeInput>;
};

export default function ConfirmationCodeForm({ onSubmit }: Props) {
  const { state } = useLocation();
  const navigate = useNavigate();

  const form = useForm<ConfirmationCodeInput>({
    resolver: zodResolver(confirmationCodeInputSchema),
    defaultValues: {
      confirmationCode: '',
    },
  });

  const back = useCallback(() => {
    if (state?.nextStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      navigate('/auth/signin/password/reset');
    } else {
      navigate('/auth/signin');
    }
  }, [navigate, state?.nextStep]);

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
        <Button type="submit" className="flex w-full">
          次へ
        </Button>
        <Separator text="あるいは" />
        <Button type="button" variant="outline" className="w-full" onClick={back}>
          認証コードが届いてない？前の画面に戻る
        </Button>
      </form>
    </Form>
  );
}
