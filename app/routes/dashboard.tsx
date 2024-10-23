import { Link, Outlet, UIMatch } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';
import { AuthAPI } from '~/.server/apis/auth.api';
import BreadcrumbNav from '~/components/common/breadcrumb-nav';
import UserMenu from '~/components/common/user-menu';
import { Button } from '~/components/ui/button';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'Dashboard',
    href: '/dashboard',
  }),
};

export const loader = AuthAPI.loaders.checkLogin;

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
      <BreadcrumbNav />

      <Outlet />
    </div>
  );
}
