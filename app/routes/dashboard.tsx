import { Outlet } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import UserMenu from '~/components/common/user-menu';

export const loader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export default function DashboardLayout() {
  return (
    <div>
      <div className="h-[60px] sticky top-0 w-screen bg-primary flex items-center justify-between px-10">
        <div className="flex items-center h-[30px] text-white">
          <RiBubbleChartFill size={36} className="mr-4" />
          <span>Dashboard</span>
        </div>
        <UserMenu />
      </div>
      <Outlet />
    </div>
  );
}
