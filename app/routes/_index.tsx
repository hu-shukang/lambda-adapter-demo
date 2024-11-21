import { Link } from '@remix-run/react';
import ResourceForm from '~/components/resource/resource-form';
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
      <div className="w-[800px] mt-4 mx-auto">
        <ResourceForm onSubmit={(data) => console.log(data)} />
      </div>
    </div>
  );
}
