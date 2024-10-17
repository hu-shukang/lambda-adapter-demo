import { useSearchParams, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput } from '~/models/user.model';
import { signIn, signOut, signInWithRedirect } from 'aws-amplify/auth';
import { useState } from 'react';
import { toSignin } from '~/lib/auth.client';

export default function SigninPage() {
  const [error, setError] = useState<string>();
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    try {
      await signOut();
      await signIn({ ...data });
      toSignin(submit, redirectUrl);
    } catch (e: any) {
      console.log(e);
      setError('ログイン失敗。ユーザ名あるいはパスワードが不正');
    }
  };

  const signinByGoogle = async () => {
    console.log('signin by google');
    await signOut();
    await signInWithRedirect({
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
