import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  fastify.addHook('onRequest', async (request) => {
    console.log('onRequest hook triggered for:', request.url);
  });
});
