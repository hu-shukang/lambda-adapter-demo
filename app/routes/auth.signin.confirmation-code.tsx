import { useLocation, useNavigate } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import ConfirmationCodeForm from '~/components/auth/confirmation-code-form';
import { ConfirmationCodeInput } from '~/models/user.model';

export default function ConfirmationCodePage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const onSubmit: SubmitHandler<ConfirmationCodeInput> = async (data) => {
    if (state.nextStep === 'CONFIRM_RESET_PASSWORD_WITH_CODE') {
      navigate('/auth/signin/password/reset-confirm', {
        state: { ...state, confirmationCode: data.confirmationCode },
      });
    } else {
      throw new Error('miss next step!');
    }
  };

  return (
    <div className="w-full md:w-[350px]">
      <h1 className="text-3xl text-center mb-4">認証コード入力</h1>
      <h6 className="text-sm text-gray-500 text-center mb-4">メールに届いた6桁の認証コードをご入力ください。</h6>
      <ConfirmationCodeForm onSubmit={onSubmit} />
    </div>
  );
}
