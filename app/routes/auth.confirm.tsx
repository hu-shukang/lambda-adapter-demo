import { ActionFunction } from '@remix-run/node';
import { redirect, useActionData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { authService } from '~/.server/services/auth.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import SignupConfirmForm from '~/components/auth/signup-confirm-form';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { SignupConfirmInput, signupConfirmInputSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(signupConfirmInputSchema);
  await authService.confirm(data);
  return redirect('/auth/signin');
};

export default function AuthConfirmPage() {
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<SignupConfirmInput> = (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('confirmationCode', data.confirmationCode);
    submit(formData, { method: 'post' });
  };

  return (
    <div>
      <Card className="w-[600px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>認証コード入力</CardTitle>
        </CardHeader>
        <CardContent>
          {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
          <SignupConfirmForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
