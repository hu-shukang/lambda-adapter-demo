import { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { UserAPI } from '~/.server/apis/user.api';
import Title from '~/components/common/title';
import UserList from '~/components/user/user-list';
import UserQueryForm from '~/components/user/user-query-form';
import { getQueryDataFromObject } from '~/lib/form.util.client';
import { UserInfo, UserQueryInput } from '~/models/user.model';

export const loader = UserAPI.loader.query;

export default function UserPage() {
  const organizationDataLoader = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const queryData = useLoaderData<LoaderFunction>();
  const submit = useSubmit();

  const querySubmit = async (data: UserQueryInput) => {
    const condition = getQueryDataFromObject(data);
    submit(condition, { method: 'GET' });
  };

  const updateHandler = (pk: string) => {
    console.log(pk);
  };

  const removeHandler = (info: UserInfo) => {
    console.log(info);
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="ユーザ一覧" />
      </div>
      <UserQueryForm onSubmit={querySubmit} />
      <UserList
        data={queryData.data || []}
        organizations={organizationDataLoader?.data || []}
        updateHandler={updateHandler}
        removeHandler={removeHandler}
      />
    </div>
  );
}
