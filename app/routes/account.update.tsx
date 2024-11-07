import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useRouteLoaderData } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import AccountForm from '~/components/account/AccountForm';
import { AccountUpdateInput, UserInfoView } from '~/models/user.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'アカウント設定',
    href: '/account',
  }),
};

export default function AccountUpdatePage() {
  const loaderDataForUserInfo = useRouteLoaderData<LoaderFunction>('routes/account');
  const userInfoView = loaderDataForUserInfo?.data as UserInfoView | undefined;

  if (!userInfoView) {
    return <div>no user</div>;
  }

  const onSubmit: SubmitHandler<AccountUpdateInput> = async (data) => {
    console.log(data);
  };
  return (
    <div>
      <AccountForm onSubmit={onSubmit} defaultValues={userInfoView} />
    </div>
  );
}
