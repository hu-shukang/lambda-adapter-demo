import { useRouteLoaderData, useSubmit } from '@remix-run/react';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { SubmitHandler } from 'react-hook-form';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { OrganizationInfo, OrganizationInput, organizationInputSchema } from '~/models/organization.model';

export const handle = {
  breadcrumb: {
    text: '新規作成',
    href: '/dashboard/organization/add',
  },
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
  const loaderData = useRouteLoaderData<OrganizationInfo[]>('routes/dashboard.organization');
  const submit = useSubmit();

  const onSubmit: SubmitHandler<OrganizationInput> = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('parent', data.parent || '');
    formData.append('priority', String(data.priority));
    submit(formData, { method: 'POST' });
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-2">
        <Title text="組織を新規作成" />
      </div>
      <div className="w-[300px]">
        <OrganizationForm onSubmit={onSubmit} organizations={loaderData || []} />
      </div>
    </div>
  );
}
