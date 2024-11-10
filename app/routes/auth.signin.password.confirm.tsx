import { useLocation, useNavigate, useSubmit } from '@remix-run/react';
import { confirmSignIn } from 'aws-amplify/auth';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import ConfirmSigninForm from '~/components/auth/confirm-signin-form';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { toSignin } from '~/lib/auth.client';
import { ConfirmSigninInput } from '~/models/user.model';

export default function InitPasswordConfirmPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const submit = useSubmit();
  const { state } = useLocation();

  if (!state.username) {
    return navigate('/auth/signin');
  }

  const onSubmit: SubmitHandler<ConfirmSigninInput> = async (data) => {
    try {
      await confirmSignIn({ challengeResponse: data.password });
      toSignin(submit);
    } catch (e: any) {
      setError(e.message);
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
      <h1 className="text-3xl text-center mb-4">パスワード変更</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">パスワードをご入力ください。</h6>
      <ConfirmSigninForm onSubmit={onSubmit} username={state.username} />
    </div>
  );
}
