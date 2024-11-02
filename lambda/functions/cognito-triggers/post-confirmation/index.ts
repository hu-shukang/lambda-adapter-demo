import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const cognitoClient = new CognitoIdentityProviderClient({});

const insertUserToDB = async (event: PostConfirmationTriggerEvent) => {
  const {
    userName,
    request: { userAttributes },
  } = event;
  const updateExpressionList = ['#email = :email', '#sub = :sub'];
  const expressionAttributeNames: Record<string, string> = {
    '#email': 'email',
    '#sub': 'sub',
  };
  const expressionAttributeValues: Record<string, string> = {
    ':email': userAttributes.email,
    ':sub': userAttributes.sub,
  };
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
};

const getUsersByEmail = async (event: PostConfirmationTriggerEvent) => {
  const {
    request: { userAttributes },
  } = event;
  const { email } = userAttributes;
  const listUsersParams = {
    UserPoolId: process.env.USER_POOL_ID,
    Filter: `email = "${email}"`,
  };
  const listUsersCommand = new ListUsersCommand(listUsersParams);
  const output = await cognitoClient.send(listUsersCommand);
  return output.Users;
};

// const getProviderName = (userAttribute: AttributeType[] | undefined) => {
//   let providerName = 'Cognito';
//   const existingUserIdentities = userAttribute?.find((a) => a.Name === 'identities');
//   if (existingUserIdentities && existingUserIdentities.Value) {
//     providerName = JSON.parse(existingUserIdentities.Value)[0].providerName;
//   }
//   return providerName;
// };

const linkUser = async (event: PostConfirmationTriggerEvent, existingUser: UserType) => {
  const externalProvider = event.userName.split('_')[0]; // 提取身份提供商名称
  const externalUserId = event.userName.split('_')[1]; // 提取外部用户ID
  const linkProviderCommand = new AdminLinkProviderForUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    DestinationUser: {
      ProviderName: 'Cognito',
      ProviderAttributeName: 'Username',
      ProviderAttributeValue: existingUser.Username,
    },
    SourceUser: {
      ProviderName: externalProvider,
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: externalUserId,
    },
  });
  await cognitoClient.send(linkProviderCommand);
};

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  const users = await getUsersByEmail(event);
  console.log(users);
  if (users && users.length > 0) {
    await linkUser(event, users[0]);
  }
  await insertUserToDB(event);
  console.log('User data saved successfully');

  return event;
};
