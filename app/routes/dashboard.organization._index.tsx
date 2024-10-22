import { Link, useRouteLoaderData } from '@remix-run/react';
import Title from '~/components/common/title';
import OrganizationList from '~/components/organization/organization-list';
import { Button } from '~/components/ui/button';
import { OrganizationInfo } from '~/models/organization.model';

export default function OrganizationPage() {
  const loaderData = useRouteLoaderData<OrganizationInfo[]>('routes/dashboard.organization');

  return (
    <div className="container px-4 mx-auto">
      <div className="flex justify-between items-center mb-2">
        <Title text="組織一覧" />
        <div className="space-x-2">
          <Button variant="outline">削除</Button>
          <Link to="/dashboard/organization/add">
            <Button>新規作成</Button>
          </Link>
        </div>
      </div>
      <OrganizationList data={loaderData || []} />
    </div>
  );
}
