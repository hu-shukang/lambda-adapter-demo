import fp from 'fastify-plugin';

export default fp(async function (fastify) {
  fastify.addHook('preHandler', (request, reply) => {
    if (!request.payload) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });
});
