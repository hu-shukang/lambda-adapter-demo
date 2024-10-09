import { ActionFunction, json } from '@remix-run/node';
import { authService } from '~/.server/services/auth.service';
import { RequestWrapper } from '~/.server/utils/request.util';
import { signupInputSchema } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const data = await requestWrapper.data(signupInputSchema);
  const result = await authService.signup(data);
  console.log(result);
  return json({ success: true });
};
