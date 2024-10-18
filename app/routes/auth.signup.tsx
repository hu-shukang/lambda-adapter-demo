import { ActionFunction } from '@remix-run/node';
import { useActionData, useNavigate } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SignupForm from '~/components/auth/signup-form';
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
      navigate('/auth/signup/confirm');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-[350px]">
      <h1 className="text-3xl text-center mb-4">ユーザ登録</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザを新規登録お願いします。</h6>
      <SignupForm onSubmit={onSubmit} />
    </div>
  );
}
