import { LoaderFunction } from '@remix-run/node';
import { useLoaderData, useRouteLoaderData } from '@remix-run/react';
import { UserAPI } from '~/.server/apis/user.api';
import Title from '~/components/common/title';
import UserList from '~/components/user/user-list';
import UserQueryForm from '~/components/user/user-query-form';
import { UserInfo, UserQueryInput } from '~/models/user.model';

export const loader = UserAPI.loader.query;

export default function UserPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const queryData = useLoaderData<LoaderFunction>();

  const querySubmit = async (data: UserQueryInput) => {
    console.log(data);
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
      <div>
        <UserQueryForm onSubmit={querySubmit} />
      </div>
      <UserList
        data={queryData.data || []}
        organizations={loaderData?.data || []}
        updateHandler={updateHandler}
        removeHandler={removeHandler}
      />
    </div>
  );
}
