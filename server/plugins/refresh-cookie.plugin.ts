import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  fastify.addHook('onSend', async (request) => {
    if (request.payload) {
      // 假设你用的是 HttpOnly cookies 存储 token
      // const token = request.headers['authorization']?.split(' ')[1];
      // reply.setCookie('idToken', token, {
      //   httpOnly: true,
      //   path: '/',
      //   secure: true,
      //   maxAge: 3600, // 刷新 cookie 的过期时间
      // });
    }
  });
});
