import { useLocation, useNavigate, useSubmit } from '@remix-run/react';
import { confirmSignIn } from 'aws-amplify/auth';
import { SubmitHandler } from 'react-hook-form';
import PasswordForm from '~/components/auth/password-form';
import { toSignin } from '~/lib/auth.client';
import { PasswordInput } from '~/models/user.model';
import { toast } from 'sonner';

export default function InitPasswordConfirmPage() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useLocation();

  const onSubmit: SubmitHandler<PasswordInput> = async (data) => {
    if (!state?.username) {
      return navigate('/auth/signin');
    }
    try {
      await confirmSignIn({ challengeResponse: data.password });
      toSignin(submit);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full md:w-[350px]">
      <h1 className="text-3xl text-center mb-4">パスワード変更</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">パスワードをご入力ください。</h6>
      <PasswordForm onSubmit={onSubmit} />
    </div>
  );
}
