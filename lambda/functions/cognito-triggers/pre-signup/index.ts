import { PreSignUpTriggerEvent } from 'aws-lambda';
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);
const cognitoClient = new CognitoIdentityProviderClient({});

const getUsersByEmail = async (event: PreSignUpTriggerEvent) => {
  const {
    request: { userAttributes },
  } = event;
  const { email } = userAttributes;
  const command = new GetCommand({
    TableName: process.env.USER_TBL!,
    Key: {
      pk: email,
      sk: 'USER_INFO',
    },
  });
  const result = await ddbDocClient.send(command);
  return result.Item;
};

const linkUser = async (externalUserId: string, providerName: string, existingUsername: string) => {
  const linkProviderCommand = new AdminLinkProviderForUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    DestinationUser: {
      ProviderName: 'Cognito',
      ProviderAttributeName: 'Username',
      ProviderAttributeValue: existingUsername,
    },
    SourceUser: {
      ProviderName: providerName,
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: externalUserId,
    },
  });
  await cognitoClient.send(linkProviderCommand);
};

const getProviderAndUserId = (username: string) => {
  if (!username.includes('_')) {
    throw new Error('not a external user');
  }
  return {
    provider: username.split('_')[0],
    userId: username.split('_')[1],
  };
};

export const handler = async (event: PreSignUpTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const existingUser = await getUsersByEmail(event);
  console.log(`existingUser: ${existingUser ? JSON.stringify(existingUser) : 'null'}`);
  if (existingUser) {
    const isExternalUser = existingUser.cognitoUserStatus === 'EXTERNAL_PROVIDER';
    const existingUsername = existingUser.userName as string;
    if (event.triggerSource === 'PreSignUp_SignUp' && isExternalUser) {
      const { provider } = getProviderAndUserId(existingUsername);
      throw new Error(`EXIST_WITH_${provider}`);
    } else if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      const { userId, provider } = getProviderAndUserId(event.userName);
      await linkUser(userId, provider, existingUsername);
    }
  }

  return event;
};
