import { useNavigate, useSearchParams, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
import { SigninInput } from '~/models/user.model';
import { signIn, signOut, signInWithRedirect } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { toSignin } from '~/lib/auth.client';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CONST } from '~/lib/const';
import { useGlobalStore } from '~/stores/global.store';

export default function SigninPage() {
  const [error, setError] = useState<string>();
  const [progressing, setProgressing] = useState(false);
  const submit = useSubmit();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');
  const setRedirect = useGlobalStore((state) => state.setRedirect);

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    try {
      setProgressing(true);
      await signOut();
      const signInResult = await signIn({ ...data });
      if (signInResult.nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        navigate('/auth/signin/password/confirm', { state: { username: data.username } });
      } else {
        toSignin(submit, redirectUrl);
      }
    } catch (e: any) {
      const message = e.message;
      console.log(message);
      if (message.includes(CONST.ERROR_CODE.AUTH.USER_BLOCKED)) {
        setError(CONST.ERROR_MSG.AUTH.USER_BLOCKED);
      } else {
        setError('ユーザ名かパスワードは正しくありません。');
      }
    } finally {
      setProgressing(false);
    }
  };

  const signinByGoogle = async () => {
    setRedirect(redirectUrl);
    await signOut();
    await signInWithRedirect({
      provider: 'Google',
    });
  };

  useEffect(() => {
    if (signinRequired) {
      setError('お先にサインインしてください。');
    }
  }, [signinRequired]);

  return (
    <div className="w-full md:w-[350px]">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl text-center mb-4">サインイン</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザ名とパスワードをご入力ください。</h6>
      <SigninForm onSubmit={onSubmit} signinByGoogle={signinByGoogle} progressing={progressing} />
    </div>
  );
}
