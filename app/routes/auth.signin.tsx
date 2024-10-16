import { useSearchParams, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput } from '~/models/user.model';
import { signIn, signOut, signInWithRedirect } from 'aws-amplify/auth';
import { useState } from 'react';

export default function SigninPage() {
  const [error, setError] = useState<string>();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');

  const toSignin = () => {
    const provider = 'CognitoIdentityServiceProvider';
    const userPoolClientId = window.ENV.USER_POOL_CLIENT_ID;
    const authUser = localStorage.getItem(`${provider}.${userPoolClientId}.LastAuthUser`);
    const idToken = localStorage.getItem(`${provider}.${userPoolClientId}.${authUser}.idToken`);
    const refreshToken = localStorage.getItem(`${provider}.${userPoolClientId}.${authUser}.refreshToken`);
    if (!idToken || !refreshToken) {
      throw new Error('login success, but no token');
    }
    const formData = new FormData();
    formData.append('idToken', idToken);
    formData.append('refreshToken', refreshToken);
    formData.append('redirectUrl', redirectUrl || '/');
    submit(formData, { method: 'POST', action: '/api/auth/signin' });
  };

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    try {
      await signOut();
      await signIn({ ...data });
      toSignin();
    } catch (e: any) {
      console.log(e);
      if (e.name === 'UserAlreadyAuthenticatedException') {
        return toSignin();
      }
      setError('ログイン失敗。ユーザ名あるいはパスワードが不正');
    }
  };

  const signinByGoogle = () => {
    signInWithRedirect({
      provider: 'Google',
    });
  };

  return (
    <div>
      <Card className="w-[600px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>ユーザログイン</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500">{error}</p>}
          {signinRequired && <p className="text-red-500">お先にサインインしてください</p>}
          <SigninForm onSubmit={onSubmit} signinByGoogle={signinByGoogle} />
        </CardContent>
      </Card>
    </div>
  );
}
