import { PreSignUpTriggerEvent } from 'aws-lambda';
import {
  AdminLinkProviderForUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
  UserType,
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

const linkUser = async (event: PreSignUpTriggerEvent, existingUser: UserType) => {
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

export const handler = async (event: PreSignUpTriggerEvent): Promise<any> => {
  if (event.triggerSource == 'PreSignUp_ExternalProvider') {
    const users = await getUsersByEmail(event);
    if (users && users.length > 0) {
      await linkUser(event, users[0]);
    }
  }

  return event;
};
