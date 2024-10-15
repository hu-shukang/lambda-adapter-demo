import { type MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { RequestWrapper } from '~/.server/utils/req.util';
import { Resp } from '~/.server/utils/response.util';
import { Button } from '~/components/ui/button';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = RequestWrapper.init(async ({ request }) => {
  return await Resp.json(request, { message: 'successful' });
})
  .withLogin()
  .loader();

export default function Index() {
  return (
    <div>
      <div>Home Page</div>
      <div>ログインしないと入れない</div>
      <Link to={'/dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
