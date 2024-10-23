import { Outlet, UIMatch } from '@remix-run/react';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ管理',
    href: '/dashboard/user',
  }),
};

export const loader = RequestWrapper.init(async ({ request }) => {
  const items = await organizationService.query();
  return Resp.json(request, { success: true, data: items });
}).loader();

export default function UserLayout() {
  return <Outlet />;
}
