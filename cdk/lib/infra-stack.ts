import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ssm from 'aws-cdk-lib/aws-ssm';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, envs: Record<string, string>, props?: cdk.StackProps) {
    super(scope, id, props);

    const codepipelineRole = iam.Role.fromRoleArn(
      this,
      `${envs.APP_NAME}-codepipeline-role-${envs.ENV}`,
      envs.CODE_PIPELINE_ROLE_ARN,
      { mutable: false },
    );

    /** asset bucket */
    const assetBucket = new s3.Bucket(this, envs.ASSET_BUCKET, {
      bucketName: envs.ASSET_BUCKET,
    });

    /** web bucket */
    const webBucket = new s3.Bucket(this, envs.WEB_BUCKET, {
      bucketName: envs.WEB_BUCKET,
    });

    const buildProject = new codebuild.PipelineProject(this, `${envs.APP_NAME}-build-${envs.ENV}`, {
      projectName: `${envs.APP_NAME}-build-${envs.ENV}`,
      role: codepipelineRole,
      queuedTimeout: cdk.Duration.hours(0.5),
      timeout: cdk.Duration.hours(0.5),
      buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
      environment: {
        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_5,
        computeType: codebuild.ComputeType.SMALL,
        environmentVariables: {
          APP_NAME: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: envs.APP_NAME,
          },
          ENV: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: envs.ENV,
          },
          SYNTH_TEMPLETE: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: `${envs.APP_NAME}-synth-template-${envs.ENV}.yaml`,
          },
          WEB_BUCKET: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: webBucket.bucketName,
          },
          ASSET_BUCKET: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: assetBucket.bucketName,
          },
          ECR_REPOSITORY_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: envs.ECR_REPOSITORY_URI,
          },
        },
      },
    });

    const pipeline = new codepipeline.Pipeline(this, `${envs.APP_NAME}-pipeline-${envs.ENV}`, {
      pipelineName: `${envs.APP_NAME}-pipeline-${envs.ENV}`,
      artifactBucket: assetBucket,
      role: codepipelineRole,
      pipelineType: codepipeline.PipelineType.V1,
    });

    const sourceOutput = new codepipeline.Artifact();
    const buildOutput = new codepipeline.Artifact();

    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'hu-shukang',
      repo: 'lambda-adapter-demo',
      branch: envs.BRANCH,
      oauthToken: cdk.SecretValue.secretsManager('github-token', {
        jsonField: 'oauthToken',
      }),
      output: sourceOutput,
      trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
      runOrder: 1,
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'Build',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
      role: codepipelineRole,
      runOrder: 2,
    });

    const deployAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: 'CloudFormation-CreateUpdateStack',
      stackName: `${envs.APP_NAME}-${envs.ENV}`,
      adminPermissions: true,
      templatePath: buildOutput.atPath(`${envs.APP_NAME}-synth-template-${envs.ENV}.yaml`),
      deploymentRole: codepipelineRole,
      replaceOnFailure: true,
      role: codepipelineRole,
      runOrder: 3,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    // 创建一个 Cognito 用户池
    const userPool = new cognito.UserPool(this, `${envs.APP_NAME}-user-pool-${envs.ENV}`, {
      userPoolName: `${envs.APP_NAME}-user-pool-${envs.ENV}`,
      selfSignUpEnabled: true, // 启用用户自助注册
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      signInAliases: {
        email: true, // 允许使用电子邮件进行登录
        phone: false,
        username: true, // 允许使用用户名进行登录
      },
      autoVerify: {
        email: true, // 自动验证用户的电子邮件
      },
      customAttributes: {
        permissions: new cognito.StringAttribute({ mutable: true }),
      },
      passwordPolicy: {
        minLength: 8, // 最小密码长度
        requireLowercase: true, // 需要小写字母
        requireUppercase: true, // 需要大写字母
        requireDigits: true, // 需要数字
        requireSymbols: false, // 需要特殊字符
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY, // 只通过电子邮件找回密码
      email: cognito.UserPoolEmail.withSES({
        fromEmail: envs.COGNITO_FROM_EMAIL,
      }),
    });

    const domainPrefix = `${envs.APP_NAME}-${envs.ENV}`;
    userPool.addDomain(`${envs.APP_NAME}-user-pool-domain-${envs.ENV}`, {
      cognitoDomain: { domainPrefix: domainPrefix },
    });

    const googleOAuthClientId = ssm.StringParameter.valueForStringParameter(
      this,
      `/${envs.APP_NAME}/${envs.ENV}/google/oauth/client-id`,
    );
    const googleOAuthClientSecret = ssm.StringParameter.valueForStringParameter(
      this,
      `/${envs.APP_NAME}/${envs.ENV}/google/oauth/client-secrets`,
    );

    // 添加用户池客户端
    const userPoolClient = userPool.addClient(`${envs.APP_NAME}-client-${envs.ENV}`, {
      userPoolClientName: `${envs.APP_NAME}-client-${envs.ENV}`,
      authFlows: {
        userPassword: true, // 支持通过用户名和密码进行认证
        userSrp: true, // 支持 SRP 流程
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
        cognito.UserPoolClientIdentityProvider.GOOGLE,
      ],
      oAuth: {
        callbackUrls: ['http://localhost:5173/auth/signin/callback', envs.SIGN_IN_CALLBACK],
        logoutUrls: ['http://localhost:5173/auth/signin', envs.SIGN_OUT_CALLBACK],
        defaultRedirectUri: envs.SIGN_IN_CALLBACK,
      },
    });

    const googleProvider = new cognito.UserPoolIdentityProviderGoogle(
      this,
      `${envs.APP_NAME}-google-oauth-${envs.ENV}`,
      {
        userPool: userPool,
        clientId: googleOAuthClientId,
        clientSecretValue: new cdk.SecretValue(googleOAuthClientSecret),
        scopes: ['profile', 'email', 'openid'],
        attributeMapping: {
          email: cognito.ProviderAttribute.GOOGLE_EMAIL,
          fullname: cognito.ProviderAttribute.GOOGLE_NAME,
          profilePicture: cognito.ProviderAttribute.GOOGLE_PICTURE,
          custom: {
            email_verified: cognito.ProviderAttribute.other('email_verified'),
          },
        },
      },
    );

    userPoolClient.node.addDependency(googleProvider);

    new cdk.CfnOutput(this, `${envs.ASSET_BUCKET}-arn`, {
      value: assetBucket.bucketArn,
      exportName: `${envs.ASSET_BUCKET}-arn`,
    });

    new cdk.CfnOutput(this, `${envs.WEB_BUCKET}-arn`, {
      value: webBucket.bucketArn,
      exportName: `${envs.WEB_BUCKET}-arn`,
    });

    new cdk.CfnOutput(this, `${envs.APP_NAME}-user-pool-${envs.ENV}-id`, {
      value: userPool.userPoolId,
      exportName: `${envs.APP_NAME}-user-pool-${envs.ENV}-id`,
    });

    new cdk.CfnOutput(this, `${envs.APP_NAME}-client-${envs.ENV}-id`, {
      value: userPoolClient.userPoolClientId,
      exportName: `${envs.APP_NAME}-client-${envs.ENV}-id`,
    });
  }
}
