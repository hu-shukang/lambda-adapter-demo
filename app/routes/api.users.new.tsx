import { ActionFunction, json, redirect } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { userInfoSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const wrapper = new RequestWrapper(args);
  const user = await wrapper.data(userInfoSchema);
  try {
    await userService.create(user);
    return redirect('/users');
  } catch (e) {
    return json({ error: '创建用户失败' }, { status: 500 });
  }
};
