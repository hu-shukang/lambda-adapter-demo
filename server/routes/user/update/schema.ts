import type { FastifySchema } from 'fastify';
import { UserIdSchema, UserInfoSchema } from '@/models/user.model';
import { zodToJsonSchema } from 'zod-to-json-schema';

export const schema: FastifySchema = {
  params: zodToJsonSchema(UserIdSchema),
  body: zodToJsonSchema(UserInfoSchema),
};
