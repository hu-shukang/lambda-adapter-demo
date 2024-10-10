import { json } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { ActionWrapper } from '~/.server/utils/request.util';
import { ID, idSchema } from '~/models/user.model';

export const action = ActionWrapper.init<{ paramsData: ID }>(async ({ paramsData }) => {
  await userService.delete(paramsData.id);
  return json({ success: true });
})
  .withParamsValid(idSchema)
  .action();
