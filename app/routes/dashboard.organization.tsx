import { Outlet, UIMatch } from '@remix-run/react';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '組織管理',
    href: '/dashboard/organization',
  }),
};

export const loader = RequestWrapper.init(async ({ request }) => {
  const items = await organizationService.query();
  return Resp.json(request, items);
}).loader();

export default function OrganizationLayout() {
  return <Outlet />;
}
