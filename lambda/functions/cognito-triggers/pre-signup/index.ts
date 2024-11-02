import { PreSignUpTriggerEvent } from 'aws-lambda';
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

const getUsersByEmail = async (event: PreSignUpTriggerEvent) => {
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
  const existingUsers = await getUsersByEmail(event);
  if (existingUsers && existingUsers.length > 0) {
    const existingUser = existingUsers[0];
    const isExternalUser = existingUser.UserStatus === 'EXTERNAL_PROVIDER';
    const existingUsername = existingUser.Username as string;
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
