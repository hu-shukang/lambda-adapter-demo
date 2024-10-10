import { ActionFunction } from '@remix-run/node';
import { json, redirect, useActionData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { authService } from '~/.server/services/auth.service';
import { Cookie } from '~/.server/utils/cookie.util';
import { RequestUtil } from '~/.server/utils/request.util';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput, signinInputSchema } from '~/models/user.model';

export const action = RequestUtil.init(async ({ bodyData }) => {
  const token = await authService.signin(bodyData);
  if (!token) {
    return json('cannot signin', { status: 401 });
  }
  const cookieHeader = await Cookie.create('token', 'token');
  return redirect('/', {
    headers: {
      'Set-Cookie': cookieHeader,
    },
  });
})
  .withBodyValid<SigninInput>(signinInputSchema)
  .action();

export default function SigninPage() {
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<SigninInput> = (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
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
