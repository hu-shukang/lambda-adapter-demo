import { ActionFunction, json } from '@remix-run/node';
import { useActionData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { RequestWrapper } from '~/.server/utils/request.util';
import SignupForm from '~/components/auth/signup-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SignupInput, signupInputSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(signupInputSchema);
  console.log(data);
  return json({ success: true });
};

export default function SignupPage() {
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<SignupInput> = (data) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('rePassword', data.rePassword);

    submit(formData, { method: 'post' });
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
