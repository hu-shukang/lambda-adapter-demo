import { Link } from '@remix-run/react';
import Title from '~/components/common/title';
import { Button } from '~/components/ui/button';

export default function UserPage() {
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-2">
        <Title text="ユーザ一覧" />
        <div className="space-x-2">
          <Link to="/dashboard/user/add">
            <Button>ユーザ作成</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
