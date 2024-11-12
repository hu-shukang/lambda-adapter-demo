import {
  CognitoIdentityProviderClient,
  DescribeUserPoolCommand,
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
      if (response.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Failed to send response: ${response.statusCode}`));
      }
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

  // 获取当前用户池配置
  const describeCommand = new DescribeUserPoolCommand({
    UserPoolId: process.env.USER_POOL_ID,
  });
  const response = await cognitoClient.send(describeCommand);
  const currentConfig = response.UserPool;

  const lambdaConfig = event.ResourceProperties.lambdaConfig as LambdaConfigType;

  const updatedConfig = {
    ...currentConfig,
    LambdaConfig: event.RequestType === 'Delete' ? undefined : lambdaConfig,
    UserPoolId: process.env.USER_POOL_ID,
  };

  // 移除只读属性
  const { Id: _id, Arn: _Arn, Name: _Name, ...modifiableConfig } = updatedConfig;

  const updateCommand = new UpdateUserPoolCommand(modifiableConfig);

  try {
    await cognitoClient.send(updateCommand);
    await sendResponse(event, context, 'SUCCESS', 'Update successful');
  } catch (e: any) {
    console.log(e);
    await sendResponse(event, context, 'FAILED', e.message || 'Custom resource failed');
  }
};
