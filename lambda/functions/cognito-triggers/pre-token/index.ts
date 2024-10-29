import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { PreTokenGenerationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PreTokenGenerationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const { userName } = event;
  const command = new GetCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: userName,
      sk: 'USER_INFO',
    },
  });
  const dbResult = await ddbDocClient.send(command);
  const user = dbResult.Item;
  if (user) {
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: {
        organization: user.organization,
        status: user.status,
        name: user.name,
      },
    };
  }

  return event;
};
