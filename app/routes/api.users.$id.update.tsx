import { ActionFunction, redirect } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { idSchema, userInfoSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(userInfoSchema);
  const { id } = requestWrapper.params(idSchema);
  await userService.update(id, data);
  return redirect('/users');
};
