import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { OrganizationAPI } from '~/.server/apis/organization.api';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { OrganizationInput } from '~/models/organization.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '新規作成',
    href: '/dashboard/organization/add',
  }),
};

export const action = OrganizationAPI.actions.create;

export default function OrganizationPage() {
  const loaderData = useRouteLoaderData<LoaderFunction>('routes/dashboard.organization');
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
