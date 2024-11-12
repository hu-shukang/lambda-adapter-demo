import { PostAuthenticationTriggerEvent } from 'aws-lambda';

export const handler = async (event: PostAuthenticationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  // const {
  //   request: { userAttributes },
  // } = event;
  // const getCommand = new GetCommand({
  //   TableName: process.env.USER_TBL!,
  //   Key: {
  //     pk: userAttributes.email,
  //     sk: 'USER_INFO',
  //   },
  // });
  // const getResp = await ddbDocClient.send(getCommand);
  // const userInfo = getResp.Item;

  // const queryCommand = new QueryCommand({
  //   TableName: process.env.USER_TBL!,
  //   IndexName: 'SK_TIME',
  //   KeyConditionExpression: 'sk = :sk',
  //   ExpressionAttributeValues: {
  //     ':sk': `ORG_USER#${userAttributes.email}`,
  //   },
  // });
  // const queryResp = await ddbDocClient.send(queryCommand);
  // const orgUsers = queryResp.Items;

  // const transactItems: any[] = [];

  // if (userInfo) {
  //   transactItems.push({
  //     Put: {
  //       TableName: process.env.USER_TBL!,
  //       Item: {
  //         ...userInfo,
  //         name: userAttributes.name,
  //         cognitoUserStatus: userAttributes['cognito:user_status'],
  //       },
  //     },
  //   });
  // }

  // if (orgUsers) {
  //   transactItems.push(
  //     ...orgUsers.map((ou) => ({
  //       Put: {
  //         TableName: process.env.USER_TBL!,
  //         Item: {
  //           ...ou,
  //           name: userAttributes.name,
  //           cognitoUserStatus: userAttributes['cognito:user_status'],
  //         },
  //       },
  //     })),
  //   );
  // }

  // if (transactItems.length > 0) {
  //   const transactCommand = new TransactWriteCommand({
  //     TransactItems: [],
  //   });
  //   await ddbDocClient.send(transactCommand);
  // }

  // console.log('User data saved successfully');

  return event;
};
