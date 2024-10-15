import { Link } from '@remix-run/react';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { Button } from '~/components/ui/button';

export const loader = RequestWrapper.init(async ({ request }) => {
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
