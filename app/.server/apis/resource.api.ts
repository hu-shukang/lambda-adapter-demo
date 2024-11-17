import { ResourceMetadataListInput, resourceMetadataListInputSchema } from '~/models/resource.model';
import { resourceMetadataService } from '../services/resource-metadata.service';
import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import { TagIdInput, tagIdInputSchema } from '~/models/tag.model';

const createAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as ResourceMetadataListInput;
  await resourceMetadataService.create(form);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(resourceMetadataListInputSchema)
  .action();

const updateAction = RequestWrapper.init(async ({ context, request }) => {
  const form = context.bodyData as ResourceMetadataListInput;
  await resourceMetadataService.update(form);
  return Resp.json(request, { success: true });
})
  .withLogin()
  .withBodyValid(resourceMetadataListInputSchema)
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

export const ResourceAPI = {
  action: {
    create: createAction,
    update: updateAction,
    delete: deleteAction,
  },
  loader: {
    get: getLoader,
  },
};
