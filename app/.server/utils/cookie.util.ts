import { createCookie } from '@remix-run/node';

export const Cookie = {
  idToken: createCookie('idToken', {
    maxAge: 60 * 30, // 设置 cookie 的过期时间为 30 分
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    path: '/', // 设置 cookie 的路径
    sameSite: 'lax',
  }),
  refreshToken: createCookie('refreshToken', {
    maxAge: 60 * 60 * 24 * 365, // 设置 cookie 的过期时间为 365 天
    httpOnly: process.env.NODE_ENV === 'production',
    secure: process.env.NODE_ENV === 'production',
    path: '/', // 设置 cookie 的路径
    sameSite: 'lax',
  }),
};
