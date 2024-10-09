import { createCookie } from '@remix-run/node';

const create = (key: string, value: string) => {
  const cookie = createCookie(key, {
    maxAge: 60 * 60 * 24 * 7, // 设置 cookie 的过期时间为 7 天
    httpOnly: true, // 使 cookie 只能在服务器端访问
    secure: process.env.NODE_ENV === 'production', // 在生产环境下启用 secure
    path: '/', // 设置 cookie 的路径
  });
  return cookie.serialize(value);
};

export const Cookie = {
  create: create,
};
