import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const insertUserToDB = async (event: PostConfirmationTriggerEvent) => {
  const {
    request: { userAttributes },
  } = event;
  // updateTime: dateUtil.utc(), updateUser: payload['cognito:username']
  const updateExpressionList = [
    '#sub = :sub',
    '#cognitoUserStatus = :cognitoUserStatus',
    '#organization = :organization',
    '#updateTime = :updateTime',
    '#updateUser = :updateUser',
  ];
  const expressionAttributeNames: Record<string, string> = {
    '#sub': 'sub',
    '#cognitoUserStatus': 'cognitoUserStatus',
    '#organization': 'organization',
    '#updateTime': 'updateTime',
    '#updateUser': 'updateUser',
  };
  let cognitoUserStatus = userAttributes['cognito:user_status'];
  if (userAttributes.identities) {
    const { providerName } = JSON.parse(userAttributes.identities)[0];
    cognitoUserStatus = `${cognitoUserStatus}:${providerName}`;
  }
  const expressionAttributeValues: Record<string, string> = {
    ':sub': userAttributes.sub,
    ':cognitoUserStatus': cognitoUserStatus,
    ':organization': 'DEFAULT',
    ':updateTime': dayjs().utc().toISOString(),
    ':updateUser': userAttributes.email,
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
