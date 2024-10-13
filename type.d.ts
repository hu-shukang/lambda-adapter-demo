// types.d.ts
export {}; // 确保文件是模块，避免污染全局

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
