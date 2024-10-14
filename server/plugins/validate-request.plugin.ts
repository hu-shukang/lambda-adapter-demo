// plugins/validate-request.js
import fp from 'fastify-plugin';
import { z } from 'zod';

const bodySchema = z.object({
  name: z.string(),
  age: z.number(),
});

export default fp(async function (fastify) {
  fastify.addHook('preValidation', async (request, reply) => {
    try {
      // 验证请求体
      request.body = bodySchema.parse(request.body);

      // 你还可以类似地验证 query 和 params
      // request.query = querySchema.parse(request.query);
      // request.params = paramsSchema.parse(request.params);
    } catch (err: any) {
      reply.code(400).send({ error: err.errors });
    }
  });
});
