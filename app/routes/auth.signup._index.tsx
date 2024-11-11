import { ActionFunction } from '@remix-run/node';
import { useActionData, useNavigate } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SignupForm from '~/components/auth/signup-form';
import { SignupInput } from '~/models/user.model';
import { useUserStore } from '~/stores/user.store';
import { signUp } from 'aws-amplify/auth';
import { CONST } from '~/lib/const';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [progressing, setProgressing] = useState(false);
  const actionData = useActionData<ActionFunction>();
  const setUsername = useUserStore((state) => state.setUsername);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupInput> = async (data) => {
    setProgressing(true);
    try {
      const result = await signUp({
        username: data.username,
        password: data.password,
        options: { userAttributes: { email: data.email } },
      });
      console.log(result);
      setUsername(data.username);
      navigate('/auth/signup/confirm');
    } catch (e: any) {
      const message = e.message as string;
      if (message.includes(CONST.ERROR_CODE.AUTH.EXIST_WITH_GOOGLE)) {
        toast.error(CONST.ERROR_MSG.AUTH.EXIST_WITH_GOOGLE);
      }
      console.error(e);
    } finally {
      setProgressing(false);
    }
  };

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  return (
    <div className="w-full md:w-[350px]">
      <h1 className="text-3xl text-center mb-4">ユーザ登録</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザを新規登録お願いします。</h6>
      <SignupForm onSubmit={onSubmit} progressing={progressing} />
    </div>
  );
}
