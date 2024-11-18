import { UIMatch } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import Title from '~/components/common/title';
import ResourceForm from '~/components/resource/resource-form';
import { ResourceMetadataInput } from '~/models/resource.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '新規作成',
    href: '/dashboard/resource/add',
  }),
};

export default function ResourceAddPage() {
  const onSubmit: SubmitHandler<ResourceMetadataInput> = async (data) => {
    console.log(data);
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="リソースを新規作成" />
      </div>
      <ResourceForm onSubmit={onSubmit} />
    </div>
  );
}
