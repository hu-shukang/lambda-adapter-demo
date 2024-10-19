import { Outlet } from '@remix-run/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';

export const loader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export default function DashboardLayout() {
  return (
    <div>
      <h1>Dashboard Layout</h1>
      <Outlet />
    </div>
  );
}
