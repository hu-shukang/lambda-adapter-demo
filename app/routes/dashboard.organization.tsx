import { Outlet } from '@remix-run/react';

export default function OrganizationLayout() {
  return (
    <div>
      <h1>organization layout</h1>
      <Outlet />
    </div>
  );
}
