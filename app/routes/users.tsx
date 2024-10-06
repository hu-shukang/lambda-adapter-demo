import { Outlet } from '@remix-run/react';

export default function UsersLayout() {
  return (
    <div>
      <h1>Users Layout</h1>

      <Outlet />
    </div>
  );
}
