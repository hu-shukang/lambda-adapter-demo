import { json } from '@remix-run/react';
import { LoaderWrapper } from '~/.server/utils/request.util';

export const loader = LoaderWrapper.init(() => {
  return json({ success: true });
})
  .withLogin()
  .loader();

export default function DashboardPage() {
  return <div>Dashboard Main Page</div>;
}
