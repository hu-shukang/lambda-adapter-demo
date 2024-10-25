import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { OrganizationInput } from '~/models/organization.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: 'ユーザ作成',
    href: '/dashboard/user/add',
  }),
};

export default function UserAddPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.user');
  const submit = useSubmit();

  const onSubmit: SubmitHandler<OrganizationInput> = async (data) => {
    const formData = getFormDataFromObject(data);
    submit(formData, { method: 'POST' });
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="組織を新規作成" />
      </div>
      <div className="w-[300px]">
        <OrganizationForm onSubmit={onSubmit} organizations={loaderData?.data || []} />
      </div>
    </div>
  );
}
