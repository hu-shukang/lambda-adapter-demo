import { ActionFunction, LoaderFunction } from '@remix-run/node';
import { useActionData, useLoaderData, useNavigate, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { UserAPI } from '~/.server/apis/user.api';
import Title from '~/components/common/title';
import UserList from '~/components/user/user-list';
import UserQueryForm from '~/components/user/user-query-form';
import { getFormDataFromObject, getQueryDataFromObject } from '~/lib/form.util.client';
import { UserQueryInput, UserView } from '~/models/user.model';

export const loader = UserAPI.loader.query;
export const action = UserAPI.actions.delete;

export default function UserPage() {
  const organizationDataLoader = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const actionData = useActionData<ActionFunction>();
  const queryData = useLoaderData<LoaderFunction>();
  const submit = useSubmit();
  const navigate = useNavigate();

  const querySubmit = async (data: UserQueryInput) => {
    const condition = getQueryDataFromObject(data);
    submit(condition, { method: 'GET' });
  };

  const updateHandler = (id: string) => {
    navigate(`/dashboard/user/${id}/update`);
  };

  const removeHandler = (info: UserView) => {
    const form = getFormDataFromObject({ id: info.id });
    submit(form, { method: 'DELETE' });
  };

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success('削除しました');
    }
  }, [actionData]);

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="ユーザ一覧" />
      </div>
      <UserQueryForm onSubmit={querySubmit} organizations={organizationDataLoader?.data.organizations || []} />
      <UserList
        data={queryData.data || []}
        organizations={organizationDataLoader?.data.organizations || []}
        updateHandler={updateHandler}
        removeHandler={removeHandler}
      />
    </div>
  );
}
