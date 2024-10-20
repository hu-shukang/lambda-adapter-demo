import { SubmitHandler } from 'react-hook-form';
import SignupConfirmForm from '~/components/auth/signup-confirm-form';
import { SignupConfirmInput } from '~/models/user.model';
import { confirmSignUp } from 'aws-amplify/auth';
import { useNavigate } from '@remix-run/react';

export default function AuthConfirmPage() {
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignupConfirmInput> = async (data) => {
    try {
      await confirmSignUp({ ...data });
      navigate('/auth/signin');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="w-[350px]">
      <h1 className="text-3xl text-center mb-4">認証コード入力</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">メールに記載されたコードをご入力ください。</h6>
      <SignupConfirmForm onSubmit={onSubmit} />
    </div>
  );
}
