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
import { EmailAlreadyUsedError, EmployeeNoAlreadyUsedError } from '~/models/error.model';

class UserService extends CommonService {
  private tableName = process.env.USER_TBL!;
  private tagTableName = process.env.TAG_TBL!;

  public async get(payload: IdTokenPayload): Promise<UserInfoView> {
    const output = await this.getOne(this.tableName, { pk: payload.employeeNo, sk: CONST.DB.USER_INFO });
    const { pk: _pk, sk: _sk, cognitoUserStatus, ...attr } = output.Item as UserInfo;
    let provider = 'password';
    if (cognitoUserStatus.startsWith('EXTERNAL_PROVIDER')) {
      provider = cognitoUserStatus.split(':').pop() as string;
    }
    const userInfoView: UserInfoView = {
      ...attr,
      picture: payload.picture,
      provider: provider,
    };
    return userInfoView;
  }

  public async create(userInput: UserInfoInput, payload: CognitoIdTokenPayload) {
    const userQueryResult = await this.queryByEmail(userInput.email);
    if (userQueryResult.length > 0) {
      throw new EmailAlreadyUsedError();
    }

    const userQueryResult2 = await this.getOne(this.tableName, { pk: userInput.employeeNo, sk: CONST.DB.USER_INFO });
    if (userQueryResult2.Item) {
      throw new EmployeeNoAlreadyUsedError();
    }

    const { user, initPassword } = await Cognito.Admin.createUser(userInput.employeeNo, userInput.email, {
      name: userInput.name,
    });
    const userAttributes = user?.Attributes;
    const sub = userAttributes?.find((a) => a.Name === 'sub')?.Value;
    const cognitoUserStatus = user?.UserStatus;

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
              pk: userInput.employeeNo,
              sk: CONST.DB.USER_INFO,
              email: userInput.email,
              employeeNo: userInput.employeeNo,
              name: userInput.name,
              status: userInput.status,
              cognitoUserStatus: cognitoUserStatus,
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
              pk: userInput.employeeNo,
              sk: `${CONST.DB.USER_ORG}#${o.organization}`,
              position: o.position,
              employeeNo: userInput.employeeNo,
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
              sk: `${CONST.DB.ORG_USER}#${userInput.employeeNo}`,
              email: userInput.email,
              position: o.position,
              employeeNo: userInput.employeeNo,
              name: userInput.name,
              status: userInput.status,
              cognitoUserStatus: cognitoUserStatus,
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

  public async delete(employeeNo: string) {
    // Query all organization relations
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.USER_SK,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': employeeNo,
      },
    });
    const userDataResult = await DB.client.send(queryCommand);
    const userDataList = userDataResult.Items || [];
    if (userDataList.length === 0) {
      throw new UserNotFoundError();
    }
    // Delete user from Cognito
    await Cognito.Admin.deleteUser(employeeNo);

    // Delete all related records in DynamoDB
    const command = new TransactWriteCommand({
      TransactItems: [
        // Delete user info
        {
          Delete: {
            TableName: this.tableName,
            Key: {
              pk: employeeNo,
              sk: CONST.DB.USER_INFO,
            },
          },
        },
        // Delete user-org relations
        ...userDataList.map((item) => ({
          Delete: {
            TableName: this.tableName,
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          },
        })),
      ],
    });

    await DB.client.send(command);
    return true;
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
      if (query.sort === CONST.DB.INDEXS.EMAIL_USER) {
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

  public async queryByEmail(email: string, sk?: string) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.EMAIL_USER,
      KeyConditionExpression: `email = :email${sk ? ' AND sk = :sk' : ''}`,
      ExpressionAttributeValues: {
        ':email': email,
        ':sk': sk,
      },
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }
}

export const userService = new UserService();
