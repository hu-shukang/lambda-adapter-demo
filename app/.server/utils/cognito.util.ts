import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
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

export const Cognito = {
  client,
  verifier,
  refreshIdTokenByRefreshToken,
};
