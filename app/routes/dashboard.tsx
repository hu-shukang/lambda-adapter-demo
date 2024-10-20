import { Outlet, useMatches } from '@remix-run/react';
import { RiBubbleChartFill } from '@remixicon/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import UserMenu from '~/components/common/user-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb';

export const handle = {
  breadcrumb: () => <BreadcrumbLink href="/dashboard">dashboard</BreadcrumbLink>,
};

export const loader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export default function DashboardLayout() {
  const matches = useMatches();
  return (
    <div>
      <div className="h-[60px] sticky top-0 w-screen bg-primary flex items-center justify-between px-10">
        <div className="flex items-center h-[30px] text-white">
          <RiBubbleChartFill size={36} className="mr-4" />
          <span>Dashboard</span>
        </div>
        <UserMenu />
      </div>
      <Breadcrumb>
        <BreadcrumbList>
          {matches
            .filter((match) => match.handle && (match.handle as any).breadcrumb)
            .map((match, index) => (
              <>
                <BreadcrumbItem key={index}>{(match.handle as any).breadcrumb(match)}</BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </div>
  );
}
