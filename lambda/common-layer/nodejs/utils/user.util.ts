import { GetCommand, QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from './dynamodb.util';

export const updateUser = async (userAttributes: Record<string, string>) => {
  const getCommand = new GetCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: userAttributes.email,
      sk: 'USER_INFO',
    },
  });
  const getResp = await DB.client.send(getCommand);
  const userInfo = getResp.Item;

  const queryCommand = new QueryCommand({
    TableName: process.env.USER_TBL!,
    IndexName: 'SK_TIME',
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: {
      ':sk': `ORG_USER#${userAttributes.email}`,
    },
  });
  const queryResp = await DB.client.send(queryCommand);
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
    console.log('transactItems', JSON.stringify(transactItems));
    const transactCommand = new TransactWriteCommand({
      TransactItems: transactItems,
    });
    await DB.client.send(transactCommand);
  }
};

export const getUser = async (pk: string) => {
  const command = new GetCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: pk,
      sk: 'USER_INFO',
    },
  });
  const resp = await DB.client.send(command);
  return resp.Item;
};

export const queryUserByEmail = async (email: string) => {
  const command = new QueryCommand({
    TableName: process.env.USER_TBL!,
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
  });
  const resp = await DB.client.send(command);
  return resp.Items;
};
