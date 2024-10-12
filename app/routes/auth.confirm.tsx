import { SubmitHandler } from 'react-hook-form';
import SignupConfirmForm from '~/components/auth/signup-confirm-form';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
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
    <div>
      <Card className="w-[600px] mx-auto mt-10">
        <CardHeader>
          <CardTitle>認証コード入力</CardTitle>
        </CardHeader>
        <CardContent>
          <SignupConfirmForm onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
