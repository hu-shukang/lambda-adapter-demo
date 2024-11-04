import { Outlet, UIMatch } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';
import { UserAPI } from '~/.server/apis/user.api';
import BreadcrumbNav from '~/components/common/breadcrumb-nav';
import UserMenu from '~/components/common/user-menu';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザアカウント',
    href: '/account',
  }),
};

export const loader = UserAPI.loader.get;

export default function AccountLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* header */}
      <div className="h-[60px] sticky top-0 z-10 w-screen bg-primary flex items-center px-10">
        <div className="flex items-center h-[30px] text-white">
          <RiBubbleChartFill size={36} className="mr-4" />
          <span>ユーザアカウント</span>
        </div>
        <UserMenu />
      </div>
      <BreadcrumbNav />

      {/* content */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* footer */}
      <div className="h-[60px] w-screen bg-primary flex items-center justify-center px-10 mt-6 text-white text-sm">
        <div>copyright@hushukang</div>
      </div>
    </div>
  );
}
