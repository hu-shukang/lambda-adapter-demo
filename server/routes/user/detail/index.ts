import type { FastifyInstance } from 'fastify';
import { schema } from './schema';
import { DB } from '@/utils/dynamodb.util';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import type { UserIdModel } from '@/models/user.model';

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Params: UserIdModel }>('/user/:id', { schema }, async (request, reply) => {
    const { id } = request.params;
    const command = new GetCommand({
      TableName: process.env.USER_TBL,
      Key: {
        pk: id,
        sk: 'USER_INFO',
      },
    });
    const result = await DB.client.send(command);
    reply.send(result.Item);
  });
}
