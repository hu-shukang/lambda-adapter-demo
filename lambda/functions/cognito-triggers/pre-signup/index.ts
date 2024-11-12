import { PreSignUpTriggerEvent } from 'aws-lambda';
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { getUser } from '/opt/nodejs/utils';

const cognitoClient = new CognitoIdentityProviderClient({});

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
  const existingUser = await getUser(event.userName);
  console.log(`existingUser: ${existingUser ? JSON.stringify(existingUser) : 'null'}`);
  if (existingUser) {
    const cognitoUserStatus = existingUser.cognitoUserStatus;
    const existingEmployeeNo = existingUser.employeeNo as string;
    if (event.triggerSource === 'PreSignUp_SignUp' && cognitoUserStatus === 'EXTERNAL_PROVIDER') {
      const { provider } = getProviderAndUserId(existingEmployeeNo);
      throw new Error(`EXIST_WITH_${provider}`);
    } else if (cognitoUserStatus === 'FORCE_CHANGE_PASSWORD') {
      throw new Error(`FORCE_CHANGE_PASSWORD`);
    } else if (event.triggerSource === 'PreSignUp_ExternalProvider') {
      const { userId, provider } = getProviderAndUserId(event.userName);
      await linkUser(userId, provider, existingEmployeeNo);
    }
  }

  return event;
};
