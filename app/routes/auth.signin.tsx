import { Outlet } from '@remix-run/react';

export default function SigninLayout() {
  return (
    <div>
      <h1>Signin Layout</h1>
      <Outlet />
    </div>
  );
}
