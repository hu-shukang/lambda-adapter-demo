import { ActionFunction } from '@remix-run/node';
import { useActionData, useNavigate } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import SignupForm from '~/components/auth/signup-form';
import { SignupInput } from '~/models/user.model';
import { useUserStore } from '~/stores/user.store';
import { signUp } from 'aws-amplify/auth';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CONST } from '~/lib/const';
import { useState } from 'react';
import InfoDialog from '~/components/common/info-dialog';

export default function SignupPage() {
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [error, setError] = useState<React.ReactElement>();
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
    } catch (e: any) {
      const message = e.message as string;
      if (message.includes(CONST.ERROR_CODE.AUTH.EXIST_WITH_GOOGLE)) {
        setError(() => <div>{CONST.ERROR_MSG.AUTH.EXIST_WITH_GOOGLE}</div>);
        setOpenInfoDialog(true);
      }
      console.error(e);
    }
  };

  return (
    <div className="md:w-[350px]">
      {actionData?.error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{actionData?.error}</AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl text-center mb-4">ユーザ登録</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">ユーザを新規登録お願いします。</h6>
      <SignupForm onSubmit={onSubmit} />
      <InfoDialog
        open={openInfoDialog}
        setOpen={setOpenInfoDialog}
        content={error}
        description="ユーザ登録時にエラーが発生しました。"
        onSubmit={() => setOpenInfoDialog(false)}
      />
    </div>
  );
}
