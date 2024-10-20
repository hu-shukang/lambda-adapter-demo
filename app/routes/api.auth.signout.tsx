import { Cookie } from '~/.server/utils/cookie.util';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';

export const action = RequestWrapper.init(async () => {
  const headers = new Headers();
  headers.append('Set-Cookie', await Cookie.idToken.serialize('', { maxAge: -1 }));
  headers.append('Set-Cookie', await Cookie.refreshToken.serialize('', { maxAge: -1 }));
  return Resp.simpleRedirect('/auth/signin', {
    headers: headers,
  });
}).action();
