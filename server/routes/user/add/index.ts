import type { FastifyInstance } from 'fastify';
import { schema } from './schema';
import { DB } from '@/utils/dynamodb.util';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 } from 'uuid';
import type { UserInfoModel } from '@/models/user.model';

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: UserInfoModel }>('/user', { schema }, async (request, reply) => {
    const id = v4();
    const command = new PutCommand({
      TableName: process.env.USER_TBL,
      Item: {
        pk: id,
        sk: 'USER_INFO',
        ...request.body,
      },
    });
    await DB.client.send(command);
    reply.send({ id: id });
  });
}
