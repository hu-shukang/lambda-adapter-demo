import { CommonService } from './common.service';
import { IdTokenPayload, UserInfo, UserInfoInput, UserInfoView, UserQueryInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import { CONST } from '~/lib/const';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { dateUtil } from '~/lib/date.util';
import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';
import { TagInfo } from '~/models/tag.model';
import { v7 } from 'uuid';
import { Mail } from '../utils/mail.util';

class UserService extends CommonService {
  private tableName = process.env.USER_TBL!;
  private tagTableName = process.env.TAG_TBL!;

  public async get(payload: IdTokenPayload): Promise<UserInfoView> {
    const output = await this.getOne(this.tableName, { pk: payload.email, sk: CONST.DB.USER_INFO });
    const { pk, sk: _sk, cognitoUserStatus, ...attr } = output.Item as UserInfo;
    let provider = 'password';
    if (cognitoUserStatus.startsWith('EXTERNAL_PROVIDER')) {
      provider = cognitoUserStatus.split(':').pop() as string;
    }
    const userInfoView: UserInfoView = {
      ...attr,
      email: pk,
      picture: payload.picture,
      provider: provider,
    };
    return userInfoView;
  }

  public async create(userInput: UserInfoInput, payload: CognitoIdTokenPayload) {
    const { user, initPassword } = await Cognito.Admin.createUser(userInput.employeeNo, userInput.email, {
      name: userInput.name,
    });
    const userAttributes = user?.Attributes;
    const sub = userAttributes?.find((a) => a.Name === 'sub')?.Value;

    const tagQueryCommand = new QueryCommand({
      TableName: this.tagTableName,
      IndexName: CONST.DB.INDEXS.SK_TIME,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': CONST.TAG.POSITION,
      },
    });
    const tagQueryResult = await DB.client.send(tagQueryCommand);
    const tagList = (tagQueryResult.Items || []) as TagInfo[];
    const newPositions = userInput.organizations.filter((o) => !tagList.some((t) => t.name === o.position));

    const command = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: this.tableName,
            Item: {
              pk: userInput.email,
              sk: CONST.DB.USER_INFO,
              email: userInput.email,
              employeeNo: userInput.employeeNo,
              name: userInput.name,
              status: userInput.status,
              cognitoUserStatus: CONST.USER.COGNITO_STATUS.CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED,
              sub: sub,
              updateTime: dateUtil.utc(),
              updateUser: payload['cognito:username'],
            },
          },
        },
        ...userInput.organizations.map((o) => ({
          Put: {
            TableName: this.tableName,
            Item: {
              pk: userInput.email,
              sk: `${CONST.DB.USER_ORG}#${o.organization}`,
              position: o.position,
              updateTime: dateUtil.utc(),
              updateUser: payload['cognito:username'],
            },
          },
        })),
        ...userInput.organizations.map((o) => ({
          Put: {
            TableName: this.tableName,
            Item: {
              pk: o.organization,
              sk: `${CONST.DB.ORG_USER}#${userInput.email}`,
              email: userInput.email,
              position: o.position,
              employeeNo: userInput.employeeNo,
              name: userInput.name,
              status: userInput.status,
              cognitoUserStatus: CONST.USER.COGNITO_STATUS.CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED,
              sub: sub,
              updateTime: dateUtil.utc(),
              updateUser: payload['cognito:username'],
            },
          },
        })),
        ...newPositions.map((o) => ({
          Put: {
            TableName: this.tagTableName,
            Item: {
              pk: v7(),
              sk: CONST.TAG.POSITION,
              name: o.position,
              updateTime: dateUtil.utc(),
            },
          },
        })),
      ],
    });
    const dbResult = await DB.client.send(command);
    await Mail.sendText([userInput.email], `初期パスワード：${initPassword}`);
    return dbResult;
  }

  public async query(query: UserQueryInput) {
    const keyConditionExpression = ['sk = :sk'];
    const filterExpression = [];
    const expressionAttributeValues: Record<string, any> = {
      ':sk': CONST.DB.USER_INFO,
    };
    if (query.status) {
      filterExpression.push('status = :status');
      expressionAttributeValues[':status'] = query.status;
    }
    if (query.name) {
      filterExpression.push('begins_with(name, :name)');
      expressionAttributeValues[':name'] = query.name;
    }
    if (query.organization) {
      if (query.sort === CONST.DB.INDEXS.ORGANIZATION_USER) {
        keyConditionExpression.push('organization = :organization');
      } else {
        filterExpression.push('organization = :organization');
      }
      expressionAttributeValues[':organization'] = query.organization;
    }

    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: query.sort,
      KeyConditionExpression: keyConditionExpression.join(' AND '),
      FilterExpression: filterExpression.length > 0 ? filterExpression.join(' AND ') : undefined,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }
}

export const userService = new UserService();
