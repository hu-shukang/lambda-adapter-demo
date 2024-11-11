import { useLocation, useNavigate } from '@remix-run/react';
import { confirmResetPassword } from 'aws-amplify/auth';
import { SubmitHandler } from 'react-hook-form';
import PasswordForm from '~/components/auth/password-form';
import { PasswordInput } from '~/models/user.model';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit: SubmitHandler<PasswordInput> = async (data) => {
    try {
      await confirmResetPassword({
        username: state.username,
        confirmationCode: state.confirmationCode,
        newPassword: data.password,
      });
      navigate('/auth/signin');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div className="w-full md:w-[350px]">
      <h1 className="text-3xl text-center mb-4">パスワードリセット確認</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">
        リセットボタンを押下して、メールも認証コードを取得します。
      </h6>
      <PasswordForm onSubmit={onSubmit} />
    </div>
  );
}
