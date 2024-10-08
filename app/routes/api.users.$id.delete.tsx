import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { idSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const { id } = requestWrapper.params(idSchema);
  await userService.delete(id);
  return json({ success: true });
};
