import { RequestWrapper } from '../utils/request.util';
import { Resp } from '../utils/response.util';
import { permissionService } from '../services/permission.service';

const queryPermissionLoader = RequestWrapper.init(async ({ request }) => {
  const items = await permissionService.queryPermission();
  return Resp.json(request, { success: true, data: items });
}).loader();

export const PermissionAPI = {
  actions: {},
  loaders: {
    queryPermission: queryPermissionLoader,
  },
};
