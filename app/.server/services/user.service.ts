import { CommonService } from './common.service';
import { UserInfo, UserQueryInput } from '~/models/user.model';
import { Cognito } from '../utils/cognito.util';
import { CONST } from '~/lib/const';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { dateUtil } from '~/lib/date.util';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';

class UserService extends CommonService {
  private tableName = process.env.USER_TBL!;

  public async create(user: UserInfo, payload: CognitoIdTokenPayload) {
    const { username, email, ...attr } = user;
    await Cognito.Admin.createUser(username, email);
    await this.createOne(
      this.tableName,
      { pk: username, sk: CONST.DB.USER_INFO },
      { ...attr, updateTime: dateUtil.utc(), updateUser: payload['cognito:username'] },
    );
  }

  public async query(query: UserQueryInput) {
    const keyConditionExpression = ['sk = :sk'];
    const filterExpression = [];
    const expressionAttributeValues: Record<string, any> = {
      ':sk': CONST.DB.ORGANIZATION_INFO,
    };
    if (query.block) {
      filterExpression.push('block = :block');
      expressionAttributeValues[':block'] = query.block;
    }
    if (query.name) {
      filterExpression.push('begins_with(cognitoUsername, :cognitoUsername)');
      expressionAttributeValues[':cognitoUsername'] = query.name;
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
      FilterExpression: filterExpression.join(' AND '),
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }
}

export const userService = new UserService();
