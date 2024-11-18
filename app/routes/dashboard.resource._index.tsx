import { useLoaderData } from '@remix-run/react';
import { useCallback } from 'react';
import { ResourceAPI } from '~/.server/apis/resource.api';
import Title from '~/components/common/title';
import ResourceList from '~/components/resource/resource-list';
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
      <div className="mb-2">
        <Title text="リソース一覧" />
      </div>
      <ResourceList data={dataLoader?.data || []} updateHandler={updateHandler} removeHandler={removeHandler} />
    </div>
  );
}
