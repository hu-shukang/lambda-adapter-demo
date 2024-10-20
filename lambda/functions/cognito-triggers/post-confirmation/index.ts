import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    userName,
    request: { userAttributes },
  } = event;

  const params = {
    TableName: process.env.USER_TBL!,
    Item: {
      pk: userName,
      email: userAttributes.email,
      sub: userAttributes.sub,
      userStatus: userAttributes['cognito:user_status'],
      name: userAttributes.name,
    },
  };

  await ddbDocClient.send(new PutCommand(params));
  console.log('User data saved successfully');

  return event;
};
