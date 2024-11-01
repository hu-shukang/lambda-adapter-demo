import { PreAuthenticationTriggerEvent } from 'aws-lambda';
import {
  AdminGetUserCommand,
  AdminGetUserCommandOutput,
  AdminLinkProviderForUserCommand,
  AttributeType,
  CognitoIdentityProviderClient,
} from '@aws-sdk/client-cognito-identity-provider';

const cognitoClient = new CognitoIdentityProviderClient({});

const getUserFromCognito = async (event: PreAuthenticationTriggerEvent) => {
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
    providerName = JSON.parse(existingUserIdentities.Value)[0].providerName;
  }
  return providerName;
};

const linkUser = async (event: PreAuthenticationTriggerEvent, existingUser: AdminGetUserCommandOutput) => {
  const sourceUserProviderName = getProviderName(existingUser.UserAttributes);
  const linkProviderCommand = new AdminLinkProviderForUserCommand({
    UserPoolId: process.env.USER_POOL_ID,
    DestinationUser: {
      ProviderName: 'Cognito',
      ProviderAttributeName: existingUser.Username,
      ProviderAttributeValue: existingUser.Username,
    },
    SourceUser: {
      ProviderName: sourceUserProviderName,
      ProviderAttributeName: 'Cognito_Subject',
      ProviderAttributeValue: event.userName,
    },
  });
  await cognitoClient.send(linkProviderCommand);
};

export const handler = async (event: PreAuthenticationTriggerEvent): Promise<any> => {
  console.log('Event: ', JSON.stringify(event, null, 2));

  const existingUser = await getUserFromCognito(event);
  console.log('existingUser', existingUser);
  if (existingUser) {
    await linkUser(event, existingUser);
    console.log('link user successfully');
  }

  return event;
};
