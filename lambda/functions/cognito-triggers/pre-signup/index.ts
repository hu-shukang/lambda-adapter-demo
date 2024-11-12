import { PreSignUpTriggerEvent } from 'aws-lambda';
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';
import { getUser, queryUserByEmail } from '/opt/nodejs/utils';

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
  const {
    request: {
      userAttributes: { email },
    },
    userName,
    triggerSource,
  } = event;
  const output = await queryUserByEmail(email, 'USER_INFO');
  console.log(`query output: ${output ? JSON.stringify(output) : 'null'}`);
  if (output) {
    const existingUser = output[0];
    const cognitoUserStatus = existingUser.cognitoUserStatus;
    const existingEmployeeNo = existingUser.employeeNo as string;
    if (triggerSource === 'PreSignUp_SignUp' && cognitoUserStatus === 'EXTERNAL_PROVIDER') {
      const { provider } = getProviderAndUserId(existingEmployeeNo);
      throw new Error(`EXIST_WITH_${provider}`);
    } else if (cognitoUserStatus === 'FORCE_CHANGE_PASSWORD') {
      throw new Error(`FORCE_CHANGE_PASSWORD`);
    } else if (triggerSource === 'PreSignUp_ExternalProvider') {
      const { userId, provider } = getProviderAndUserId(userName);
      await linkUser(userId, provider, existingEmployeeNo);
    }
  }

  return event;
};
