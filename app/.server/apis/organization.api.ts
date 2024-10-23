import {
  OrganizationInput,
  organizationInputSchema,
  OrganizationOne,
  organizationOneSchema,
} from '~/models/organization.model';
import { RequestWrapper } from '../utils/request.util';
import { organizationService } from '../services/organization.service';
import { Resp } from '../utils/response.util';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

const deleteAction = RequestWrapper.init(async ({ request, context }) => {
  const { pk } = context.bodyData as OrganizationOne;
  await organizationService.delete(pk);
  return Resp.json(request, { success: true });
})
  .withBodyValid(organizationOneSchema)
  .action();

const updateAction = RequestWrapper.init(async ({ context, request }) => {
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

const createAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as OrganizationInput;
  const payload = context.payload as CognitoIdTokenPayload;
  await organizationService.create(form, payload);
  return Resp.redirect(request, '/dashboard/organization');
})
  .withLogin()
  .withBodyValid(organizationInputSchema)
  .action();

const getLoader = RequestWrapper.init(async ({ context, request }) => {
  const result = await organizationService.get(context.paramsData);
  return Resp.json(request, { success: true, data: result });
})
  .withLogin()
  .withParamsValid(organizationOneSchema)
  .loader();

const queryLoader = RequestWrapper.init(async ({ request }) => {
  const items = await organizationService.query();
  return Resp.json(request, { success: true, data: items });
}).loader();

export const OrganizationAPI = {
  actions: {
    delete: deleteAction,
    update: updateAction,
    create: createAction,
  },
  loaders: {
    get: getLoader,
    query: queryLoader,
  },
};
