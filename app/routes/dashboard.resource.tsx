import { Outlet, UIMatch } from '@remix-run/react';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'リソース管理',
    href: '/dashboard/resource',
  }),
};

export default function ResourceLayout() {
  return <Outlet />;
}
