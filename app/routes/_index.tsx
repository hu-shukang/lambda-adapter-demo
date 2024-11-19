import { Link } from '@remix-run/react';
import ValidationFields from '~/components/resource/validation-fields';
import { Button } from '~/components/ui/button';

export default function Index() {
  return (
    <div>
      <div>Home Page</div>
      <Link to={'/dashboard'}>
        <Button>Go to Dashboard</Button>
      </Link>
      <Link to={'/account'}>
        <Button>Go to account</Button>
      </Link>
      <div>
        <ValidationFields type="number" />
      </div>
    </div>
  );
}
