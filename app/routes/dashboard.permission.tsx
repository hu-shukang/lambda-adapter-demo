import { Outlet, UIMatch } from '@remix-run/react';
import { PermissionAPI } from '~/.server/apis/permission.api';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '権限管理',
    href: '/dashboard/permission',
  }),
};

export const loader = PermissionAPI.loaders.queryPermission;

export default function PermissionLayout() {
  return <Outlet />;
}
