import {
  CognitoIdentityProviderClient,
  LambdaConfigType,
  UpdateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import {
  CloudFormationCustomResourceEvent,
  CloudFormationCustomResourceFailedResponse,
  CloudFormationCustomResourceSuccessResponse,
  Context,
} from 'aws-lambda';

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const lambdaConfig = event.ResourceProperties.lambdaConfig as LambdaConfigType;
  const command = new UpdateUserPoolCommand({
    UserPoolId: process.env.USER_POOL_ID,
    LambdaConfig: event.RequestType === 'Delete' ? undefined : lambdaConfig,
  });

  try {
    await cognitoClient.send(command);
    const response: CloudFormationCustomResourceSuccessResponse = {
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      PhysicalResourceId: context.logGroupName,
      Status: 'SUCCESS',
    };
    return response;
  } catch (e: any) {
    console.log(e);
    const response: CloudFormationCustomResourceFailedResponse = {
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      PhysicalResourceId: context.logGroupName,
      Status: 'FAILED',
      Reason: e.message || 'custom resource fail',
    };
    return response;
  }
};
