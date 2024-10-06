import type { FastifySchema } from 'fastify';
import { UserIdSchema } from 'server/models/user.model';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const schema: FastifySchema = {
  params: zodToJsonSchema(UserIdSchema),
};
