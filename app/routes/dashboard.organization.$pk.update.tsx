import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useActionData, useLoaderData, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { SubmitHandler } from 'react-hook-form';
import { OrganizationAPI } from '~/.server/apis/organization.api';
import Error from '~/components/common/error';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { OrganizationInput } from '~/models/organization.model';

export const handle = {
  breadcrumb: (match: UIMatch) => ({
    text: '更新',
    href: `/dashboard/organization/${match.params.pk}/update`,
  }),
};

export const loader = OrganizationAPI.loaders.get;

export const action = OrganizationAPI.actions.update;

export default function OrganizationUpdatePage() {
  const infos = useRouteLoaderData<LoaderFunction>('routes/dashboard.organization');
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<OrganizationInput> = async (data) => {
    const formData = getFormDataFromObject(data);
    submit(formData, { method: 'POST' });
  };

  return (
    <div className="page-container">
      <div className="mb-2">
        <Title text="組織を更新" />
      </div>
      {actionData?.error && <Error error={actionData.error} />}
      <div className="w-[300px]">
        <OrganizationForm
          onSubmit={onSubmit}
          organizations={infos?.data || []}
          defaultValues={loaderData.data}
          submitButtonText="更新"
        />
      </div>
    </div>
  );
}
