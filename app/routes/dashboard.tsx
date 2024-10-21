import { Link, Outlet } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import BreadcrumbNav from '~/components/common/breadcrumb-nav';
import UserMenu from '~/components/common/user-menu';
import { Button } from '~/components/ui/button';

export const handle = {
  breadcrumb: {
    text: 'Dashboard',
    href: '/dashboard',
  },
};

export const loader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export default function DashboardLayout() {
  return (
    <div>
      <div className="h-[60px] sticky top-0 w-screen bg-primary flex items-center px-10">
        <div className="flex items-center h-[30px] text-white">
          <RiBubbleChartFill size={36} className="mr-4" />
          <span>Dashboard</span>
        </div>
        <div className="space-x-2 ml-4 mr-auto">
          <Link to="/">
            <Button variant="ghost" className="text-white">
              Home
            </Button>
          </Link>
        </div>
        <UserMenu />
      </div>
      <div className="p-4">
        <BreadcrumbNav />
      </div>

      <Outlet />
    </div>
  );
}
