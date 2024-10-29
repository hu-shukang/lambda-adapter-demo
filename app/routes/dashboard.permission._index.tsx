import { Link } from '@remix-run/react';
import Title from '~/components/common/title';
import { Button } from '~/components/ui/button';

export default function PermissionPage() {
  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-2">
        <Title text="権限一覧" />
        <div className="space-x-2">
          <Link to="/dashboard/permission/add">
            <Button>新規作成</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
