import { useSearchParams, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
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
    <div className="w-[350px]">
      <h1 className="text-3xl text-center mb-4">サインイン</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザ名とパスワードをご入力ください。</h6>
      <SigninForm onSubmit={onSubmit} signinByGoogle={signinByGoogle} />
    </div>
  );
}
