// types.d.ts
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

declare global {
  interface Window {
    ENV: {
      USER_POOL_CLIENT_ID: string;
      USER_POOL_ID: string;
      NODE_ENV: 'development' | 'production' | 'test';
      [key: string]: any; // 如果 `ENV` 中有其他动态键值对
    };
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    payload?: CognitoIdTokenPayload;
  }
}
