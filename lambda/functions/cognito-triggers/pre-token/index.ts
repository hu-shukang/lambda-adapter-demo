import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { PreTokenGenerationTriggerEvent } from 'aws-lambda';
import { queryUserByEmail } from '/opt/nodejs/utils';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PreTokenGenerationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: {
      userAttributes: { email },
    },
  } = event;
  const items = await queryUserByEmail(email);
  if (!items) {
    throw new Error('get token failed');
  }
  const userInfo = items.find((u) => u.sk === 'USER_INFO')!;
  const userOrgs = items.filter((u) => u.sk.startsWith('USER_ORG'));

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
