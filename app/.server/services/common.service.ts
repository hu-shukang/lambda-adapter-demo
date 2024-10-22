import { DeleteCommand, GetCommand, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/.server/utils/dynamodb.util';

export abstract class CommonService {
  public async getOne(tableName: string, key: Record<string, any>) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    return await DB.client.send(command);
  }

  public async deleteOne(tableName: string, key: Record<string, any>) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    return await DB.client.send(command);
  }

  public async createOne(tableName: string, key: Record<string, any>, items: Record<string, any>) {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...items,
        ...key,
      },
    });
    return await DB.client.send(command);
  }

  public async updateOne(tableName: string, key: Record<string, any>, items: Record<string, any>) {
    const updateExpression: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};
    Object.entries(items).forEach(([k, v]) => {
      updateExpression.push(`#${k} = :${k}`);
      expressionAttributeNames[`#${k}`] = k;
      expressionAttributeValues[`:${k}`] = v;
    });
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    return await DB.client.send(command);
  }

  public async scanAll(tableName: string) {
    const command = new ScanCommand({
      TableName: tableName,
    });
    return await DB.client.send(command);
  }
}
