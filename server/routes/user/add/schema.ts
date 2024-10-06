import type { FastifySchema } from 'fastify';
import { UserInfoSchema } from 'server/models/user.model';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const schema: FastifySchema = {
  body: zodToJsonSchema(UserInfoSchema),
};
