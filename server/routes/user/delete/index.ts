import type { FastifyInstance } from 'fastify';
import { schema } from './schema';
import { DB } from '@/utils/dynamodb.util';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import type { UserIdModel } from '@/models/user.model';

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: UserIdModel }>('/user/:id', { schema }, async (request, reply) => {
    const { id } = request.params;
    const command = new DeleteCommand({
      TableName: process.env.USER_TBL,
      Key: {
        pk: id,
        sk: 'USER_INFO',
      },
    });
    await DB.client.send(command);
    reply.status(200);
  });
}
