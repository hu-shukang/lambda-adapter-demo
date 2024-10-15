import { Cookie } from '~/.server/utils/cookie.util';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { TokenInput, tokenInputSchema } from '~/models/user.model';

export const action = RequestWrapper.init(async ({ context }) => {
  const { idToken, refreshToken } = context.bodyData as TokenInput;
  const headers = new Headers();
  headers.append('Set-Cookie', await Cookie.idToken.serialize(idToken));
  headers.append('Set-Cookie', await Cookie.refreshToken.serialize(refreshToken));
  return Resp.simpleRedirect('/', {
    headers: headers,
  });
})
  .withBodyValid(tokenInputSchema)
  .action();
