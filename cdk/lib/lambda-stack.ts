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
import { CfnUserPool } from 'aws-cdk-lib/aws-cognito';

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

    /* user pool */
    const userPoolId = cdk.Fn.importValue(`${envs.APP_NAME}-user-pool-${envs.ENV}-id`);
    const userPool = cognito.UserPool.fromUserPoolId(this, `${envs.APP_NAME}-user-pool-${envs.ENV}`, userPoolId);

    /* user pool client */
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

    const preTokenTriggerLambda = new lambda.Function(this, `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`, {
      functionName: `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`,
      description: `${envs.APP_NAME}-pre-token-trigger-${envs.ENV}`,
      code: lambda.Code.fromBucket(assetBucket, `pre-token-${timestamp}.zip`),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      layers: [commonLayer],
      ...lambdaProps,
    });
    const cfnUserPool = userPool.node.defaultChild as CfnUserPool;
    cfnUserPool.lambdaConfig = {
      preTokenGeneration: preTokenTriggerLambda.functionArn,
      postConfirmation: postConfirmationTriggerLambda.functionArn,
    };
    // userPool.addTrigger(cognito.UserPoolOperation.POST_CONFIRMATION, postConfirmationTriggerLambda);
    // userPool.addTrigger(cognito.UserPoolOperation.PRE_TOKEN_GENERATION, preTokenTriggerLambda);

    // new cognito.CfnUserPoolGroup(this, `${envs.APP_NAME}-user-pool-admin-group-${envs.ENV}`, {
    //   userPoolId: userPool.userPoolId,
    //   groupName: 'Admin',
    //   description: 'Admin group with full permissions',
    //   precedence: 1,
    // });

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
}
