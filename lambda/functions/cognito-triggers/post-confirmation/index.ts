import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const insertUserToDB = async (event: PostConfirmationTriggerEvent) => {
  const {
    userName,
    request: { userAttributes },
  } = event;
  const updateExpressionList = ['#userName = :userName', '#sub = :sub', '#cognitoUserStatus = :cognitoUserStatus'];
  const expressionAttributeNames: Record<string, string> = {
    '#userName': 'userName',
    '#sub': 'sub',
    '#cognitoUserStatus': 'cognitoUserStatus',
  };
  const expressionAttributeValues: Record<string, string> = {
    ':userName': userName,
    ':sub': userAttributes.sub,
    ':cognitoUserStatus': userAttributes['cognito:user_status'],
  };
  if (userAttributes.name) {
    updateExpressionList.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = userAttributes.name;
  }

  const command = new UpdateCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: userAttributes.email,
      sk: 'USER_INFO',
    },
    UpdateExpression: `SET ${updateExpressionList.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await ddbDocClient.send(command);
};

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  await insertUserToDB(event);
  console.log('User data saved successfully');

  return event;
};
