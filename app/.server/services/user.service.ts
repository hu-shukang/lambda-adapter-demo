import { CommonService } from './common.service';
import { UserInfoInput, UserQueryInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import { CONST } from '~/lib/const';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { dateUtil } from '~/lib/date.util';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';

class UserService extends CommonService {
  private tableName = process.env.USER_TBL!;

  public async create(user: UserInfoInput, payload: CognitoIdTokenPayload) {
    const { username, email, ...attr } = user;
    const cognitoResult = await Cognito.Admin.createUser(username, email, { name: attr.name });
    const userAttributes = cognitoResult.User?.Attributes;
    const sub = userAttributes?.find((a) => a.Name === 'sub')?.Value;
    await this.createOne(
      this.tableName,
      { pk: username, sk: CONST.DB.USER_INFO },
      { ...attr, email: email, sub: sub, updateTime: dateUtil.utc(), updateUser: payload['cognito:username'] },
    );
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
