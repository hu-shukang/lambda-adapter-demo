import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useNavigation, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { UserAPI } from '~/.server/apis/user.api';
import Title from '~/components/common/title';
import UserForm from '~/components/user/user-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { UserInfoInput } from '~/models/user.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ作成',
    href: '/dashboard/user/add',
  }),
};

export const action = UserAPI.actions.create;

export default function UserAddPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const submit = useSubmit();
  const navigation = useNavigation();

  const onSubmit: SubmitHandler<UserInfoInput> = async (data) => {
    const formData = getFormDataFromObject(data);
    submit(formData, { method: 'POST' });
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="ユーザを新規作成" />
      </div>
      <div>
        <UserForm
          onSubmit={onSubmit}
          organizations={loaderData?.data.organizations || []}
          tags={loaderData?.data.tags || []}
          progressing={navigation.state === 'submitting'}
        />
      </div>
    </div>
  );
}
