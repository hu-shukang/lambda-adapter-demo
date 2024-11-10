import { useNavigate } from '@remix-run/react';
import { resetPassword } from 'aws-amplify/auth';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import ResetPasswordForm from '~/components/auth/reset-password-form';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { ResetPasswordInput } from '~/models/user.model';

export default function ResetPasswordPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ResetPasswordInput> = async (data) => {
    try {
      await resetPassword({ username: data.username });
      navigate('/auth/sign/password/reset-confirm', { state: data });
    } catch (e: any) {
      const message = e.message;
      setError(message);
    }
  };

  return (
    <div className="w-full md:w-[350px]">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl text-center mb-4">パスワードリセット</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">
        リセットボタンを押下して、メールも認証コードを取得します。
      </h6>
      <ResetPasswordForm onSubmit={onSubmit} />
    </div>
  );
}
