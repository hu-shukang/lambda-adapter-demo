import {
  CognitoIdentityProviderClient,
  LambdaConfigType,
  UpdateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CdkCustomResourceEvent, Context } from 'aws-lambda';

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event: CdkCustomResourceEvent, context: Context) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const lambdaConfig = event.ResourceProperties.lambdaConfig as LambdaConfigType;
  const command = new UpdateUserPoolCommand({
    UserPoolId: process.env.USER_POOL_ID,
    LambdaConfig: event.RequestType === 'Delete' ? undefined : lambdaConfig,
  });
  try {
    const output = await cognitoClient.send(command);
    console.log(output);

    return {
      Status: 'SUCCESS',
      PhysicalResourceId: context.logGroupName,
    };
  } catch (e) {
    console.log(e);
    return {
      Status: 'FAILED',
      PhysicalResourceId: context.logGroupName,
    };
  }
};
