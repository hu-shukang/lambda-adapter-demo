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
    TableName: process.env.USER_TABLE_NAME!,
    Item: {
      userId: userName,
      email: userAttributes.email,
      name: userAttributes.name,
    },
  };

  try {
    await ddbDocClient.send(new PutCommand(params));
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data', error);
  }

  return event;
};
