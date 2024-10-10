import { json } from '@remix-run/node';
import { ActionWrapper } from '~/.server/utils/request.util';
import { SigninInput, signinInputSchema } from '~/models/user.model';

export const action = ActionWrapper.init<{ bodyData: SigninInput }>(({ bodyData }) => {
  console.log(bodyData);
  return json({ success: true });
})
  .withBodyValid(signinInputSchema)
  .action();
