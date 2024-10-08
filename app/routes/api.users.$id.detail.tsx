import { json, LoaderFunction } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { idSchema } from '~/models/user.model';

export const loader: LoaderFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const { id } = requestWrapper.params(idSchema);
  const user = await userService.getDetail(id);
  if (user) {
    return json(user);
  }
  return json({ error: '获取用户详情失败' }, { status: 500 });
};
