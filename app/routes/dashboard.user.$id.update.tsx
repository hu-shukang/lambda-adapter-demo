import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useLoaderData, useNavigation, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { UserAPI } from '~/.server/apis/user.api';
import Title from '~/components/common/title';
import UserForm from '~/components/user/user-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { UserInfoInput } from '~/models/user.model';

export const handle = {
  breadcrumb: (match: UIMatch) => ({
    text: 'ユーザ更新',
    href: `/dashboard/user/${match.params.id}/update`,
  }),
};

export const action = UserAPI.actions.update;
export const loader = UserAPI.loader.get;

export default function UserAddPage() {
  const organizationDataLoader = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const loaderData = useLoaderData<LoaderFunction>();
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
          organizations={organizationDataLoader?.data.organizations || []}
          tags={organizationDataLoader?.data.tags || []}
          progressing={navigation.state === 'submitting'}
          defaultValues={loaderData?.data}
          disabledFileds={['id']}
        />
      </div>
    </div>
  );
}
