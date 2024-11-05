import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { LambdaConfigType } from '../bin/type';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, envs: Record<string, string>, props?: cdk.StackProps) {
    super(scope, id, props);
    const imageTag = this.node.tryGetContext('imageTag') as string;
    const timestamp = this.node.tryGetContext('timestamp') as string;
    const lambdaRole = iam.Role.fromRoleArn(this, `${envs.APP_NAME}-lambda-role-${envs.ENV}`, envs.LAMBDA_ROLE_ARN, {
      mutable: false,
    });

    /* web bucket */
    const webBucketArn = cdk.Fn.importValue(`${envs.WEB_BUCKET}-arn`);
    const webBucket = s3.Bucket.fromBucketArn(this, envs.WEB_BUCKET, webBucketArn);

    /* web bucket */
    const assetBucketArn = cdk.Fn.importValue(`${envs.ASSET_BUCKET}-arn`);
    const assetBucket = s3.Bucket.fromBucketArn(this, envs.ASSET_BUCKET, assetBucketArn);

    /** user pool id */
    const userPoolId = cdk.Fn.importValue(`${envs.APP_NAME}-user-pool-${envs.ENV}-id`);
    const userPool = cognito.UserPool.fromUserPoolId(this, `${envs.APP_NAME}-user-pool-${envs.ENV}`, userPoolId);
    /** user pool client id */
    const userPoolClientId = cdk.Fn.importValue(`${envs.APP_NAME}-client-${envs.ENV}-id`);

    const repository = ecr.Repository.fromRepositoryName(this, `${envs.APP_NAME}-ecr`, envs.APP_NAME);

    // DynamoDB -- userTable
    const userTable = new dynamodb.Table(this, envs.USER_TBL, {
      tableName: envs.USER_TBL,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // 按需计费模式
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 销毁堆栈时销毁表
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'ORGANIZATION_PRIORITY_ORDER',
      partitionKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'priority', type: dynamodb.AttributeType.NUMBER },
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'ORGANIZATION_PARENT',
      partitionKey: { name: 'parent', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'updateTime', type: dynamodb.AttributeType.STRING },
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'SK_TIME',
      partitionKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'updateTime', type: dynamodb.AttributeType.STRING },
    });

    userTable.addGlobalSecondaryIndex({
      indexName: 'ORGANIZATION_USER',
      partitionKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'organization', type: dynamodb.AttributeType.STRING },
    });

    // DynamoDB -- logTable
    const _logTable = new dynamodb.Table(this, envs.LOG_TBL, {
      tableName: envs.LOG_TBL,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createTime', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // 按需计费模式
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 销毁堆栈时销毁表
    });

    // DynamoDB -- permissionTable
    const permissionTable = new dynamodb.Table(this, envs.PERMISSION_TBL, {
      tableName: envs.PERMISSION_TBL,
      partitionKey: { name: 'pk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // 按需计费模式
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 销毁堆栈时销毁表
    });

    permissionTable.addGlobalSecondaryIndex({
      indexName: 'SK_TIME',
      partitionKey: { name: 'sk', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'updateTime', type: dynamodb.AttributeType.STRING },
    });

    // 创建SQS队列
    const logQueue = new sqs.Queue(this, envs.LOG_QUEUE, {
      queueName: envs.LOG_QUEUE,
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    const commonLayer = new lambda.LayerVersion(this, `${envs.APP_NAME}-common-layer-${envs.ENV}`, {
      layerVersionName: `${envs.APP_NAME}-common-layer-${envs.ENV}`,
      code: lambda.Code.fromBucket(assetBucket, `common-layer-${timestamp}.zip`),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
    });

    const lambdaProps = {
      role: lambdaRole,
      timeout: cdk.Duration.minutes(15),
      memorySize: 2048,
      environment: {
        ...envs,
        USER_POOL_ID: userPoolId,
        USER_POOL_CLIENT_ID: userPoolClientId,
        USER_POOL_DOMAIN_PREFIX: `${envs.APP_NAME}-${envs.ENV}`,
      },
    };

    const logWriteLambda = new lambda.Function(this, `${envs.APP_NAME}-log-write-${envs.ENV}`, {
      functionName: `${envs.APP_NAME}-log-write-${envs.ENV}`,
      description: `${envs.APP_NAME}-log-write-${envs.ENV}`,
      code: lambda.Code.fromBucket(assetBucket, `log-write-${timestamp}.zip`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [commonLayer],
      ...lambdaProps,
    });

    logWriteLambda.addEventSource(
      new SqsEventSource(logQueue, {
        batchSize: 10, // 每次最多处理的消息数量
      }),
    );

    const updateCognitoTriggerLambda = new lambda.Function(
      this,
      `${envs.APP_NAME}-update-cognito-trigger-${envs.ENV}`,
      {
        functionName: `${envs.APP_NAME}-update-cognito-trigger-${envs.ENV}`,
        description: `${envs.APP_NAME}-update-cognito-trigger-${envs.ENV}`,
        code: lambda.Code.fromBucket(assetBucket, `update-cognito-trigger-${timestamp}.zip`),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_20_X,
        layers: [commonLayer],
        ...lambdaProps,
      },
    );

    const preSignupTriggerLambda = new lambda.Function(this, `${envs.APP_NAME}-pre-signup-trigger-${envs.ENV}`, {
      functionName: `${envs.APP_NAME}-pre-signup-trigger-${envs.ENV}`,
      description: `${envs.APP_NAME}-pre-signup-trigger-${envs.ENV}`,
      code: lambda.Code.fromBucket(assetBucket, `pre-signup-${timestamp}.zip`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [commonLayer],
      ...lambdaProps,
    });
    preSignupTriggerLambda.addPermission('AllowCognitoInvoke', {
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: userPool.userPoolArn,
    });

    const postConfirmationTriggerLambda = new lambda.Function(
      this,
      `${envs.APP_NAME}-post-confirmation-trigger-${envs.ENV}`,
      {
        functionName: `${envs.APP_NAME}-post-confirmation-trigger-${envs.ENV}`,
        description: `${envs.APP_NAME}-post-confirmation-trigger-${envs.ENV}`,
        code: lambda.Code.fromBucket(assetBucket, `post-confirmation-${timestamp}.zip`),
        handler: 'index.handler',
        runtime: lambda.Runtime.NODEJS_20_X,
        layers: [commonLayer],
        ...lambdaProps,
      },
    );
    postConfirmationTriggerLambda.addPermission('AllowCognitoInvoke', {
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: userPool.userPoolArn,
    });

    const preTokenTriggerLambda = new lambda.Function(this, `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`, {
      functionName: `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`,
      description: `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`,
      code: lambda.Code.fromBucket(assetBucket, `pre-token-${timestamp}.zip`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [commonLayer],
      ...lambdaProps,
    });
    preTokenTriggerLambda.addPermission('AllowCognitoInvoke', {
      principal: new iam.ServicePrincipal('cognito-idp.amazonaws.com'),
      sourceArn: userPool.userPoolArn,
    });

    this.addTrigerToUserPool(envs, updateCognitoTriggerLambda, {
      PreSignUp: preSignupTriggerLambda.functionArn,
      PostConfirmation: postConfirmationTriggerLambda.functionArn,
      PreTokenGeneration: preTokenTriggerLambda.functionArn,
    });

    const serverLambda = new lambda.Function(this, `${envs.APP_NAME}-server-${envs.ENV}`, {
      functionName: `${envs.APP_NAME}-server-${envs.ENV}`,
      description: `${envs.APP_NAME}-server-${envs.ENV}`,
      code: lambda.Code.fromEcrImage(repository, {
        tagOrDigest: imageTag,
      }),
      handler: lambda.Handler.FROM_IMAGE,
      runtime: lambda.Runtime.FROM_IMAGE,
      ...lambdaProps,
    });

    // 创建 API Gateway
    const api = new apigateway.LambdaRestApi(this, `${envs.APP_NAME}-api-${envs.ENV}`, {
      restApiName: `${envs.APP_NAME}-api-${envs.ENV}`,
      handler: serverLambda,
      proxy: true,
      deployOptions: { stageName: envs.ENV },
    });

    const apiGatewayDomainName = `${api.restApiId}.execute-api.${this.region}.amazonaws.com`;
    const oai = new cloudfront.OriginAccessIdentity(this, `${envs.APP_NAME}-oai-${envs.ENV}`);

    const staticBehavior: cloudfront.BehaviorOptions = {
      origin: origins.S3BucketOrigin.withOriginAccessIdentity(webBucket, {
        originAccessIdentity: oai,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    };

    // 允许 OAI 访问 S3 存储桶
    webBucket.grantRead(oai);

    // 创建 CloudFront 分配
    new cloudfront.Distribution(this, `${envs.APP_NAME}-cloudfront-${envs.ENV}`, {
      // 默认行为，用于所有非静态文件的请求，指向 Lambda
      defaultBehavior: {
        origin: new origins.HttpOrigin(apiGatewayDomainName, {
          originPath: `/${envs.ENV}`,
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
        }),
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS, // 强制 HTTPS
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        responseHeadersPolicy: cloudfront.ResponseHeadersPolicy.SECURITY_HEADERS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      },
      // 添加针对静态文件的行为，指向 S3
      additionalBehaviors: {
        '/assets/*': staticBehavior,
        'favicon.ico': staticBehavior,
        '*.png': staticBehavior,
      },
    });
  }

  private addTrigerToUserPool(
    envs: Record<string, string>,
    eventHandler: lambda.IFunction,
    lambdaConfig: LambdaConfigType,
  ) {
    new cdk.CustomResource(this, `${envs.APP_NAME}-cognito-custom-resource-${envs.ENV}`, {
      serviceToken: eventHandler.functionArn,
      properties: { lambdaConfig: lambdaConfig },
    });
  }
}
