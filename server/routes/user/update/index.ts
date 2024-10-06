import type { FastifyInstance } from 'fastify';
import { schema } from './schema';
import { DB } from '@/utils/dynamodb.util';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import type { UserIdModel, UserInfoModel } from '@/models/user.model';

export default async function (fastify: FastifyInstance) {
  fastify.put<{ Params: UserIdModel; Body: UserInfoModel }>('/user/:id', { schema }, async (request, reply) => {
    const { id } = request.params;
    const { name, address } = request.body;
    const command = new UpdateCommand({
      TableName: process.env.USER_TBL,
      Key: {
        pk: id,
        sk: 'USER_INFO',
      },
      UpdateExpression: 'SET #name = :name, #address = :address',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#address': 'address',
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':address': address,
      },
    });
    await DB.client.send(command);
    reply.status(200);
  });
}
