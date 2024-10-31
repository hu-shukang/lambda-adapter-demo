import {
  CognitoIdentityProviderClient,
  LambdaConfigType,
  UpdateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CdkCustomResourceEvent, Context } from 'aws-lambda';

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event: CdkCustomResourceEvent, context: Context) => {
  const lambdaConfig = event.ResourceProperties.lambdaConfig as LambdaConfigType;
  const command = new UpdateUserPoolCommand({
    UserPoolId: process.env.USER_POOL_ID,
    LambdaConfig: event.RequestType === 'Delete' ? undefined : lambdaConfig,
  });
  await cognitoClient.send(command);

  return {
    PhysicalResourceId: context.logGroupName,
  };
};
