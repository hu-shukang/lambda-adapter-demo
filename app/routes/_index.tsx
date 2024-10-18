import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

export default function Index() {
  return (
    <div>
      <div>Home Page</div>
      <Link to={'/dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
    </div>
  );
}
