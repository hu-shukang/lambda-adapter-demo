import { Outlet, UIMatch } from '@remix-run/react';
import { OrganizationAPI } from '~/.server/apis/organization.api';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '組織管理',
    href: '/dashboard/organization',
  }),
};

export const loader = OrganizationAPI.loaders.query;

export default function OrganizationLayout() {
  return <Outlet />;
}
