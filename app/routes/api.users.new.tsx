import { json, redirect } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { ActionWrapper } from '~/.server/utils/request.util';
import { UserInfo, userInfoSchema } from '~/models/user.model';

export const action = ActionWrapper.init<{ bodyData: UserInfo }>(async ({ bodyData }) => {
  try {
    await userService.create(bodyData);
    return redirect('/users');
  } catch (e) {
    return json({ error: '创建用户失败' }, { status: 500 });
  }
})
  .withBodyValid(userInfoSchema)
  .action();
