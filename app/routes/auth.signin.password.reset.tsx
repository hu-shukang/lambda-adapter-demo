import { useNavigate } from '@remix-run/react';
import { resetPassword } from 'aws-amplify/auth';
import { SubmitHandler } from 'react-hook-form';
import UsernameForm from '~/components/auth/username-form';
import { UsernameInput } from '~/models/user.model';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<UsernameInput> = async (data) => {
    try {
      const output = await resetPassword({ username: data.username });

      navigate('/auth/signin/confirmation-code', {
        state: { username: data.username, nextStep: output.nextStep.resetPasswordStep },
      });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full md:w-[350px]">
      <h1 className="text-3xl text-center mb-4">パスワードリセット</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザIDかメールアドレスをご入力ください</h6>
      <UsernameForm onSubmit={onSubmit} />
    </div>
  );
}
