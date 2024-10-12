import { ActionFunction } from '@remix-run/node';
import { useActionData, useNavigate } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SignupForm from '~/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SignupInput } from '~/models/user.model';
import { useUserStore } from '~/stores/user.store';
import { signUp } from 'aws-amplify/auth';

export default function SignupPage() {
  const actionData = useActionData<ActionFunction>();
  const setUsername = useUserStore((state) => state.setUsername);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupInput> = async (data) => {
    try {
      const result = await signUp({
        username: data.username,
        password: data.password,
        options: { userAttributes: { email: data.email } },
      });
      console.log(result);
      setUsername(data.username);
      navigate('/auth/confirm');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Card className="w-[600px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>ユーザ登録</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <SignupForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
