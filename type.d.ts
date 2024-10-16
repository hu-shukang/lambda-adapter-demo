import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

declare global {
  interface Window {
    ENV: {
      USER_POOL_CLIENT_ID: string;
      USER_POOL_ID: string;
      NODE_ENV: 'development' | 'production' | 'test';
      SIGN_IN_CALLBACK: string;
      SIGN_OUT_CALLBACK: string;
      USER_POOL_DOMAIN_PREFIX: string;
      REGION: string;
      [key: string]: any; // 如果 `ENV` 中有其他动态键值对
    };
  }
}

declare module '@remix-run/node' {
  interface AppLoadContext {
    payload?: CognitoIdTokenPayload;
    bodyData?: any;
    paramsData?: any;
    queryData?: any;
  }
}
