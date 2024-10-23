import { Outlet, UIMatch } from '@remix-run/react';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ管理',
    href: '/dashboard/user',
  }),
};

export default function UserLayout() {
  return <Outlet />;
}
