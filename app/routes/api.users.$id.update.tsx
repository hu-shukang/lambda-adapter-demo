import { redirect } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { ActionWrapper } from '~/.server/utils/request.util';
import { ID, idSchema, UserInfo, userInfoSchema } from '~/models/user.model';

export const action = ActionWrapper.init<{ paramsData: ID; bodyData: UserInfo }>(async ({ paramsData, bodyData }) => {
  const { id } = paramsData;
  await userService.update(id, bodyData);
  return redirect('/users');
})
  .withParamsValid(idSchema)
  .withBodyValid(userInfoSchema)
  .action();
