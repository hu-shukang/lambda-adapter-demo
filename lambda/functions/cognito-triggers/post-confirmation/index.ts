import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    userName,
    request: { userAttributes },
  } = event;

  const updateExpressionList = ['email = :email', 'sub = :sub'];
  const expressionAttributeNames: Record<string, string> = {
    '#email': 'email',
    '#sub': 'sub',
  };
  const expressionAttributeValues: Record<string, string> = {
    ':email': userAttributes.email,
    ':sub': userAttributes.sub,
  };
  if (userAttributes['cognito:user_status']) {
    updateExpressionList.push('#status = :status');
    expressionAttributeNames['#status'] = 'status';
    expressionAttributeValues[':status'] = userAttributes['cognito:user_status'];
  }
  if (userAttributes.name) {
    updateExpressionList.push('#name = :name');
    expressionAttributeNames['#name'] = 'name';
    expressionAttributeValues[':name'] = userAttributes.name;
  }

  const command = new UpdateCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: userName,
      sk: 'USER_INFO',
    },
    UpdateExpression: `SET ${updateExpressionList.join(', ')}`,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  });

  await ddbDocClient.send(command);
  console.log('User data saved successfully');

  return event;
};
