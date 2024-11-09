import { useLocation, useNavigate } from '@remix-run/react';
import { confirmResetPassword } from 'aws-amplify/auth';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import ConfirmResetPasswordForm from '~/components/auth/confirm-reset-password-form';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { ConfirmResetPasswordInput } from '~/models/user.model';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit: SubmitHandler<ConfirmResetPasswordInput> = async (data) => {
    try {
      await confirmResetPassword({
        username: data.username,
        confirmationCode: data.confirmationCode,
        newPassword: data.password,
      });
      navigate('/auth/signin');
    } catch (e: any) {
      const message = e.message;
      setError(message);
    }
  };

  return (
    <div className="md:w-[350px]">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl text-center mb-4">パスワードリセット確認</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">
        リセットボタンを押下して、メールも認証コードを取得します。
      </h6>
      <ConfirmResetPasswordForm onSubmit={onSubmit} username={state.username} />
    </div>
  );
}
