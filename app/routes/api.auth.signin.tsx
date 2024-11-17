import { userService } from '~/.server/services/user.service';
import { Cognito } from '~/.server/utils/cognito.util';
import { Cookie } from '~/.server/utils/cookie.util';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { IdTokenPayload, TokenInput, tokenInputSchema } from '~/models/user.model';

export const action = RequestWrapper.init(async ({ context }) => {
  const { idToken, refreshToken } = context.bodyData as TokenInput;
  const payload = (await Cognito.verifier.verify(idToken)) as IdTokenPayload;
  const userInfoView = await userService.get(payload.employeeNo);
  console.log(userInfoView);
  const headers = new Headers();
  headers.append('Set-Cookie', await Cookie.idToken.serialize(idToken));
  headers.append('Set-Cookie', await Cookie.refreshToken.serialize(refreshToken));
  // if (!userInfoView.picture || !userInfoView.employeeNo || !userInfoView.name) {
  //   return Resp.simpleRedirect('/account/update', {
  //     headers: headers,
  //   });
  // }
  return Resp.simpleRedirect('/', {
    headers: headers,
  });
})
  .withBodyValid(tokenInputSchema)
  .action();
