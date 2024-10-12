import { useNavigate, useSearchParams } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput } from '~/models/user.model';
import { signIn, signOut } from 'aws-amplify/auth';
import { useState } from 'react';

export default function SigninPage() {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    try {
      await signOut();
      await signIn({ ...data });
      navigate(redirectUrl || '/');
    } catch (e: any) {
      console.log(e);
      if (e.name === 'UserAlreadyAuthenticatedException') {
        return navigate(redirectUrl || '/');
      }
      setError('ログイン失敗。ユーザ名あるいはパスワードが不正');
    }
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
          <SigninForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
