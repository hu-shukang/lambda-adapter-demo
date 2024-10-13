import { Link } from '@remix-run/react';
import { LoaderWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { Button } from '~/components/ui/button';

export const loader = LoaderWrapper.init(async ({ request }) => {
  return await Resp.json(request, { success: true });
})
  .withLogin()
  .loader();

export default function DashboardPage() {
  return (
    <div>
      <h2>Dashboard Main Page</h2>
      <Link to={'/'}>
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
