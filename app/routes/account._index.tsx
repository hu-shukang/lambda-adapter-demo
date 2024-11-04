import { LoaderFunction } from '@remix-run/node';
import { useRouteLoaderData } from '@remix-run/react';

export default function AccountPage() {
  const loaderDataForUserInfo = useRouteLoaderData<LoaderFunction>('routes/account');
  return (
    <div>
      <div>account page</div>
      {loaderDataForUserInfo?.data && <div>{JSON.stringify(loaderDataForUserInfo.data)}</div>}
    </div>
  );
}
