import { UIMatch, useLoaderData, useRouteLoaderData, useSubmit } from '@remix-run/react';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { SubmitHandler } from 'react-hook-form';
import { organizationService } from '~/.server/services/organization.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import Title from '~/components/common/title';
import OrganizationForm from '~/components/organization/organization-form';
import { getFormDataFromObject } from '~/lib/form.util.client';
import {
  OrganizationInfo,
  OrganizationInput,
  organizationInputSchema,
  OrganizationOne,
  organizationOneSchema,
} from '~/models/organization.model';

export const handle = {
  breadcrumb: (match: UIMatch) => ({
    text: '更新',
    href: `/dashboard/organization/${match.params.pk}/update`,
  }),
};

export const loader = RequestWrapper.init(async ({ context, request }) => {
  const result = await organizationService.get(context.paramsData);
  return Resp.json(request, { data: result });
})
  .withLogin()
  .withParamsValid(organizationOneSchema)
  .loader();

export const action = RequestWrapper.init(async ({ context, request }) => {
  const { pk } = context.paramsData as OrganizationOne;
  const form = context.bodyData as OrganizationInput;
  const payload = context.payload as CognitoIdTokenPayload;
  await organizationService.update(pk, form, payload);
  return Resp.redirect(request, '/dashboard/organization');
})
  .withLogin()
  .withParamsValid(organizationOneSchema)
  .withBodyValid(organizationInputSchema)
  .action();

export default function OrganizationUpdatePage() {
  const infos = useRouteLoaderData<OrganizationInfo[]>('routes/dashboard.organization');
  const loaderData = useLoaderData<typeof loader>();
  const submit = useSubmit();

  const onSubmit: SubmitHandler<OrganizationInput> = async (data) => {
    const formData = getFormDataFromObject(data);
    submit(formData, { method: 'POST' });
  };

  return (
    <div className="container px-4 mx-auto">
      <div className="mb-2">
        <Title text="組織を更新" />
      </div>
      <div className="w-[300px]">
        <OrganizationForm
          onSubmit={onSubmit}
          organizations={infos || []}
          defaultValues={loaderData.data}
          submitButtonText="更新"
        />
      </div>
    </div>
  );
}
