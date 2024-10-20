import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button';

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
