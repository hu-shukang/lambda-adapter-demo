import { resourceMetadataInputSchema, ResourceMetadataInput } from '~/models/resource.model';
import { resourceMetadataService } from '../services/resource-metadata.service';
import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import { TagIdInput, tagIdInputSchema } from '~/models/tag.model';
import { IdTokenPayload } from '~/models/user.model';
import { tagService } from '../services/tag.service';
import { CONST } from '~/lib/const';

const createAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as ResourceMetadataInput;
  const payload = context.idTokenPayload as IdTokenPayload;
  await resourceMetadataService.create(form, payload);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(resourceMetadataInputSchema)
  .action();

const updateAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as ResourceMetadataInput;
  const { tagId } = context.paramsData as TagIdInput;
  const payload = context.idTokenPayload as IdTokenPayload;
  await resourceMetadataService.update(tagId, form, payload);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(resourceMetadataInputSchema)
  .withParamsValid(tagIdInputSchema)
  .action();

const deleteAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as TagIdInput;
  await resourceMetadataService.delete(form.tagId);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(tagIdInputSchema)
  .action();

const getLoader = RequestWrapper.init(async ({ context, request }) => {
  const { tagId } = context.paramsData as TagIdInput;
  const data = await resourceMetadataService.get(tagId);
  return Resp.json(request, { data: data, success: true });
})
  .withLogin()
  .withParamsValid(tagIdInputSchema)
  .loader();

const queryResourceTagLoader = RequestWrapper.init(async () => {
  const data = await tagService.query(CONST.TAG.RESOURCE);
  return Response.json({ data: data, success: true });
}).loader();

export const ResourceAPI = {
  action: {
    create: createAction,
    update: updateAction,
    delete: deleteAction,
  },
  loader: {
    get: getLoader,
    query: queryResourceTagLoader,
  },
};
