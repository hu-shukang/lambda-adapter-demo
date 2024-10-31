import {
  CognitoIdentityProviderClient,
  LambdaConfigType,
  UpdateUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { CloudFormationCustomResourceEvent, Context } from 'aws-lambda';
import * as https from 'https';

const cognitoClient = new CognitoIdentityProviderClient({});

const sendResponse = async (
  event: CloudFormationCustomResourceEvent,
  context: Context,
  status: 'SUCCESS' | 'FAILED',
  reason: string,
) => {
  const responseBody = JSON.stringify({
    Status: status,
    Reason: reason,
    PhysicalResourceId: context.logGroupName,
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
  });

  const parsedUrl = new URL(event.ResponseURL);
  const options = {
    hostname: parsedUrl.hostname,
    port: 443,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'PUT',
    headers: {
      'Content-Type': '',
      'Content-Length': responseBody.length,
    },
  };

  return new Promise<boolean>((resolve, reject) => {
    const request = https.request(options, (response) => {
      console.log(`Status Code: ${response.statusCode}`);
      response.statusCode === 200
        ? resolve(true)
        : reject(new Error(`Failed to send response: ${response.statusCode}`));
    });

    request.on('error', (error) => {
      console.error('sendResponse Error:', error);
      reject(error);
    });

    request.write(responseBody);
    request.end();
  });
};

export const handler = async (event: CloudFormationCustomResourceEvent, context: Context) => {
  console.log('Event: ', JSON.stringify(event, null, 2));
  const lambdaConfig = event.ResourceProperties.lambdaConfig as LambdaConfigType;
  const command = new UpdateUserPoolCommand({
    UserPoolId: process.env.USER_POOL_ID,
    LambdaConfig: event.RequestType === 'Delete' ? undefined : lambdaConfig,
  });

  try {
    await cognitoClient.send(command);
    await sendResponse(event, context, 'SUCCESS', 'Update successful');
  } catch (e: any) {
    console.log(e);
    await sendResponse(event, context, 'FAILED', e.message || 'Custom resource failed');
  }
};
