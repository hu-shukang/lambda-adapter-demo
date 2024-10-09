import { ActionFunction, json } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { RequestWrapper } from '~/.server/utils/request.util';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput, signinInputSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(signinInputSchema);
  console.log(data);
  return json({ success: true });
};

export default function LoginPage() {
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<SigninInput> = (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    submit(formData, { method: 'post' });
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
          <SigninForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
