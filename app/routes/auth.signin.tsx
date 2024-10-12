import { ActionFunction } from '@remix-run/node';
import { useActionData, useNavigate, useSearchParams } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput } from '~/models/user.model';
import { signIn } from 'aws-amplify/auth';

export default function SigninPage() {
  const actionData = useActionData<ActionFunction>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');

  const onSubmit: SubmitHandler<SigninInput> = async (data) => {
    try {
      await signIn({ ...data });
      navigate(redirectUrl || '/');
    } catch (e) {
      console.log(e);
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
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          {signinRequired && <p className="text-red-500">お先にサインインしてください</p>}
          <SigninForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
