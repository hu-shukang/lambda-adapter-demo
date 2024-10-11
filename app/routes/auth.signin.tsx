import { ActionFunction } from '@remix-run/node';
import { json, useActionData, useNavigate, useSearchParams, useSubmit } from '@remix-run/react';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { authService } from '~/.server/services/auth.service';
import { Cognito } from '~/.server/utils/cognito.util';
import { Cookie } from '~/.server/utils/cookie.util';
import { ActionWrapper } from '~/.server/utils/request.util';
import SigninForm from '~/components/auth/signin-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { SigninInput, signinInputSchema } from '~/models/user.model';
import { useUserStore } from '~/stores/user.store';

export const action = ActionWrapper.init<{ bodyData: SigninInput }>(async ({ bodyData }) => {
  const token = await authService.signin(bodyData);
  if (!token) {
    return json('cannot signin', { status: 401 });
  }
  const payload = await Cognito.verifier.verify(token);
  const cookieHeader = await Cookie.idToken.serialize(token);
  return json(
    { message: 'Signin successful', payload: payload },
    {
      headers: {
        'Set-Cookie': cookieHeader,
      },
    },
  );
})
  .withBodyValid(signinInputSchema)
  .action();

export default function SigninPage() {
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();
  const navigate = useNavigate();
  const setPayload = useUserStore((state) => state.setPayload);
  const [searchParams] = useSearchParams();
  const signinRequired = searchParams.get('signinRequired');
  const redirectUrl = searchParams.get('redirectUrl');

  const onSubmit: SubmitHandler<SigninInput> = (data) => {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    submit(formData, { method: 'post' });
  };

  useEffect(() => {
    if (actionData?.message === 'Signin successful') {
      setPayload(actionData.payload);
      navigate(redirectUrl || '/');
    }
  }, [actionData, navigate, redirectUrl, setPayload]);

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
