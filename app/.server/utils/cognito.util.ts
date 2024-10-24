import {
  AdminAddUserToGroupCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminRemoveUserFromGroupCommand,
  AdminUpdateUserAttributesCommand,
  AttributeType,
  CognitoIdentityProviderClient,
  CreateGroupCommand,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.USER_POOL_CLIENT_ID!,
});

const refreshIdTokenByRefreshToken = async (refreshToken: string) => {
  const command = new InitiateAuthCommand({
    ClientId: process.env.USER_POOL_CLIENT_ID,
    AuthFlow: 'REFRESH_TOKEN',
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });
  const result = await client.send(command);
  return result.AuthenticationResult?.IdToken;
};

const createUserGroup = async (groupName: string, desc: string, precedence: number) => {
  const command = new CreateGroupCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    GroupName: groupName,
    Description: desc,
    Precedence: precedence,
  });
  return client.send(command);
};

const addUserToGroup = async (groupName: string, username: string) => {
  const command = new AdminAddUserToGroupCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
    GroupName: groupName,
  });
  return client.send(command);
};

const removeUserFromGroup = async (groupName: string, username: string) => {
  const command = new AdminRemoveUserFromGroupCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
    GroupName: groupName,
  });
  return client.send(command);
};

const updateUserPermissions = async (username: string, permissions: string) => {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
    UserAttributes: [
      {
        Name: 'custom:permissions',
        Value: permissions,
      },
    ],
  });
  return client.send(command);
};

const createUserByAdmin = async (username: string, email: string, attributes?: Record<string, string>) => {
  const userAttributes = [
    {
      Name: 'email',
      Value: email,
    },
    {
      Name: 'email_verified',
      Value: 'true',
    },
  ];

  if (attributes) {
    Object.entries(attributes).forEach(([k, v]) => {
      userAttributes.push({ Name: k, Value: v });
    });
  }

  const command = new AdminCreateUserCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
    UserAttributes: userAttributes,
    MessageAction: 'SUPPRESS',
  });
  return client.send(command);
};

const updateUserByAdmin = async (username: string, attributes: AttributeType[]) => {
  const command = new AdminUpdateUserAttributesCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
    UserAttributes: attributes,
  });
  return client.send(command);
};

const deleteUserByAdmin = async (username: string) => {
  const command = new AdminDeleteUserCommand({
    UserPoolId: process.env.USER_POOL_ID!,
    Username: username,
  });
  return client.send(command);
};

export const Cognito = {
  client,
  verifier,
  refreshIdTokenByRefreshToken,
  createUserGroup,
  addUserToGroup,
  removeUserFromGroup,
  updateUserPermissions,
  Admin: {
    createUser: createUserByAdmin,
    updateUser: updateUserByAdmin,
    deleteUser: deleteUserByAdmin,
  },
};
