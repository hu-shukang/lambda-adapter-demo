import type { FastifyInstance } from 'fastify';
import { DB } from 'server/utils/dynamodb.util';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

export default async function (fastify: FastifyInstance) {
  fastify.get('/user', async (request, reply) => {
    const command = new ScanCommand({
      TableName: process.env.USER_TBL,
    });
    const result = await DB.client.send(command);
    reply.send(result.Items);
  });
}
