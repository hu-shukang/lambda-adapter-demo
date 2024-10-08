import { json, LoaderFunction } from '@remix-run/node';
import { userService } from '~/.server/services/user.service';

export const loader: LoaderFunction = async () => {
  const result = await userService.getAll();
  return json(result);
};
