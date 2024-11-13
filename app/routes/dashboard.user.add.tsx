import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { UIMatch, useActionData, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
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
  const actionData = useActionData<ActionFunction>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<UserInfoInput> = async (data) => {
    const formData = getFormDataFromObject(data);
    submit(formData, { method: 'POST' });
  };

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

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
        />
      </div>
    </div>
  );
}
