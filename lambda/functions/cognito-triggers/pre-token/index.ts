import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { PreTokenGenerationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PreTokenGenerationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const { email } = event.request.userAttributes;
  const command = new QueryCommand({
    TableName: process.env.USER_TBL!,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': email,
    },
  });
  const dbResult = await ddbDocClient.send(command);
  const user = dbResult.Items;
  if (!user) {
    throw new Error('get token failed');
  }
  const userInfo = user.find((u) => u.sk === 'USER_INFO')!;
  const userOrgs = user.filter((u) => u.sk.startsWith('USER_ORG'));

  if (userInfo.status === 'BLOCKED') {
    throw new Error('USER_BLOCKED');
  }

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      organizations: userOrgs.map<string>((uo) => uo.sk.split('#').pop()).join(','),
      employeeNo: userInfo.employeeNo,
      status: userInfo.status,
    },
  };

  return event;
};
