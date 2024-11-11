import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const {
    request: { userAttributes },
  } = event;
  const getCommand = new GetCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: userAttributes.email,
      sk: 'USER_INFO',
    },
  });
  const getResp = await ddbDocClient.send(getCommand);
  const userInfo = getResp.Item;

  const queryCommand = new QueryCommand({
    TableName: process.env.USER_TBL!,
    IndexName: 'SK_TIME',
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: {
      ':sk': `ORG_USER#${userAttributes.email}`,
    },
  });
  const queryResp = await ddbDocClient.send(queryCommand);
  const orgUsers = queryResp.Items;

  const transactItems: any[] = [];

  if (userInfo) {
    transactItems.push({
      Put: {
        TableName: process.env.USER_TBL!,
        Item: {
          ...userInfo,
          name: userAttributes.name,
          cognitoUserStatus: userAttributes['cognito:user_status'],
        },
      },
    });
  }

  if (orgUsers) {
    transactItems.push(
      ...orgUsers.map((ou) => ({
        Put: {
          TableName: process.env.USER_TBL!,
          Item: {
            ...ou,
            name: userAttributes.name,
            cognitoUserStatus: userAttributes['cognito:user_status'],
          },
        },
      })),
    );
  }

  if (transactItems.length > 0) {
    const transactCommand = new TransactWriteCommand({
      TransactItems: [],
    });
    await ddbDocClient.send(transactCommand);
  }

  console.log('User data saved successfully');

  return event;
};
