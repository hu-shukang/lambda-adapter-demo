import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { PostConfirmationTriggerEvent } from 'aws-lambda';
import {
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminLinkProviderForUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

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

const getUserFromCognito = async (event: PostConfirmationTriggerEvent) => {
  const {
    request: { userAttributes },
  } = event;
  const { email } = userAttributes;
  const command = new AdminGetUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    Username: email,
  });
  return await cognitoClient.send(command);
};

const getProviderName = (userAttribute: AttributeType[] | undefined) => {
  let providerName = 'Cognito';
  const existingUserIdentities = userAttribute?.find((a) => a.Name === 'identities');
  if (existingUserIdentities && existingUserIdentities.Value) {
    providerName = existingUserIdentities.Value;
  }
  return providerName;
};

const linkUser = async (event: PostConfirmationTriggerEvent, existingUser: AdminGetUserCommandOutput) => {
  const sourceUserProviderName = getProviderName(existingUser.UserAttributes);
  const linkProviderCommand = new AdminLinkProviderForUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    DestinationUser: {
      ProviderAttributeValue: existingUser.Username,
      ProviderName: 'Cognito',
    },
    SourceUser: {
      ProviderName: sourceUserProviderName,
    },
  });
  await cognitoClient.send(linkProviderCommand);
};

export const handler = async (event: PostConfirmationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  const existingUser = await getUserFromCognito(event);
  if (existingUser) {
    await linkUser(event, existingUser);
  } else {
    await insertUserToDB(event);
  }

  console.log('User data saved successfully');

  return event;
};
