import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const Cognito = {
  client: client,
};
