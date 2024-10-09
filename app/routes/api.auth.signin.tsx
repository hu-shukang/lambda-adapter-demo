import { ActionFunction, json } from '@remix-run/node';
import { RequestWrapper } from '~/.server/utils/request.util';
import { signinInputSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(signinInputSchema);
  console.log(data);
  return json({ success: true });
};
