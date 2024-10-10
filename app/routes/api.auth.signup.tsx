import { redirect } from '@remix-run/node';
import { authService } from '~/.server/services/auth.service';
import { ActionWrapper } from '~/.server/utils/request.util';
import { SignupInput, signupInputSchema } from '~/models/user.model';

export const action = ActionWrapper.init<{ bodyData: SignupInput }>(async ({ bodyData }) => {
  const result = await authService.signup(bodyData);
  if (result.UserConfirmed) {
    return redirect('/auth/signin');
  }
  return redirect('/auth/confirm');
})
  .withBodyValid(signupInputSchema)
  .action();
