import { LoaderFunction } from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';
import UserAvator from '~/components/common/user-avator';
import { UserInfoView } from '~/models/user.model';

export default function AccountPage() {
  const loaderDataForUserInfo = useRouteLoaderData<LoaderFunction>('routes/account');
  const userInfoView = loaderDataForUserInfo?.data as UserInfoView | undefined;

  if (!userInfoView) {
    return <div>no user</div>;
  }

  return (
    <div>
      <div>name: {userInfoView.name}</div>
      <UserAvator picture={userInfoView.picture} />
    </div>
  );
}
