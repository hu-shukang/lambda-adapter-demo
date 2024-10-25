import { Outlet, UIMatch } from '@remix-run/react';
import { OrganizationAPI } from '~/.server/apis/organization.api';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ管理',
    href: '/dashboard/user',
  }),
};

export const loader = OrganizationAPI.loaders.query;

export default function UserLayout() {
  return <Outlet />;
}
