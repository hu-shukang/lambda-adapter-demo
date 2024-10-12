import { parse } from 'cookie';

export class Cookies {
  private cookies: Record<string, string | undefined>;
  private constructor(request: Request) {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      this.cookies = {};
    } else {
      this.cookies = parse(cookieHeader);
    }
  }
  public static init(request: Request) {
    return new Cookies(request);
  }

  public getUserName() {
    const cookieName = `CognitoIdentityServiceProvider.${process.env.USER_POOL_CLIENT_ID}.LastAuthUser`;
    return this.cookies[cookieName];
  }

  public getIdToken() {
    const userName = this.getUserName();
    const cookieName = `CognitoIdentityServiceProvider.${process.env.USER_POOL_CLIENT_ID}.${userName}.idToken`;
    return this.cookies[cookieName];
  }
}
