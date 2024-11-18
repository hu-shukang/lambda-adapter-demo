import { Link, useLoaderData } from '@remix-run/react';
import { useCallback } from 'react';
import { ResourceAPI } from '~/.server/apis/resource.api';
import Title from '~/components/common/title';
import ResourceList from '~/components/resource/resource-list';
import { Button } from '~/components/ui/button';
import { TagView } from '~/models/user.model';

export const loader = ResourceAPI.loader.query;

export default function ResourcePage() {
  const dataLoader = useLoaderData<typeof loader>();

  const updateHandler = useCallback((tag: TagView) => {
    console.log('update', tag);
  }, []);

  const removeHandler = useCallback((tag: TagView) => {
    console.log('remove', tag);
  }, []);

  return (
    <div className="page-container">
      <div className="flex justify-between items-center mb-2">
        <Title text="リソース一覧" />
        <Link to="/dashboard/resource/add">
          <Button>新規作成</Button>
        </Link>
      </div>
      <ResourceList data={dataLoader?.data || []} updateHandler={updateHandler} removeHandler={removeHandler} />
    </div>
  );
}
