import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useRouteLoaderData } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import Title from '~/components/common/title';
import UserForm from '~/components/user/user-form';
import { UserInfoInput } from '~/models/user.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ作成',
    href: '/dashboard/user/add',
  }),
};

export default function UserAddPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');

  const onSubmit: SubmitHandler<UserInfoInput> = async (data) => {
    console.log(data);
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="ユーザを新規作成" />
      </div>
      <div className="w-[300px]">
        <UserForm onSubmit={onSubmit} organizations={loaderData?.data || []} />
      </div>
    </div>
  );
}
