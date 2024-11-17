import { useLoaderData } from '@remix-run/react';
import { ResourceAPI } from '~/.server/apis/resource.api';
import Title from '~/components/common/title';

export const loader = ResourceAPI.loader.query;

export default function ResourcePage() {
  const dataLoader = useLoaderData<typeof loader>();

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="リソース一覧" />
      </div>
      <div>{dataLoader?.data && JSON.stringify(dataLoader.data)}</div>
    </div>
  );
}
