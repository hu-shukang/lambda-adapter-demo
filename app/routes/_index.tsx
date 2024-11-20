import { Link } from '@remix-run/react';
import ItemForm from '~/components/resource/item-form';
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
        <ItemForm
          onSubmit={(data) => {
            console.log(data);
          }}
          order={1}
        />
      </div>
    </div>
  );
}
