import { LoaderFunction } from '@remix-run/node';
import { UIMatch, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { SubmitHandler } from 'react-hook-form';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import { OrganizationInput, organizationInputSchema } from '~/models/organization.model';

export const handle = {
  breadcrumb: (_match: UIMatch) => ({
    text: '新規作成',
    href: '/dashboard/organization/add',
  }),
};

export const action = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as OrganizationInput;
  const payload = context.payload as CognitoIdTokenPayload;
  await organizationService.create(form, payload);
  return Resp.redirect(request, '/dashboard/organization');
})
  .withLogin()
  .withBodyValid(organizationInputSchema)
  .action();

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
