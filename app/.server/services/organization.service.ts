import { OrganizationInput, OrganizationUpdateInput } from '~/models/organization.model';
import { CommonService } from './common.service';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { v7 } from 'uuid';
import { CONST } from '~/lib/const';
import { dateUtil } from '~/lib/date.util';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';
import { OrganizationHasChildError } from '~/models/error.model';

class OrganizationService extends CommonService {
  private tableName = process.env.USER_TBL!;

  public create(input: OrganizationInput, payload: CognitoIdTokenPayload) {
    return this.createOne(
      this.tableName,
      { pk: v7(), sk: CONST.DB.ORGANIZATION_INFO },
      {
        ...input,
        updateUser: payload['cognito:username'],
        updateTime: dateUtil.utc(),
      },
    );
  }

  public async query() {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.ORGANIZATION_PRIORITY_ORDER,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': CONST.DB.ORGANIZATION_INFO,
      },
      ScanIndexForward: true,
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }

  public async delete(pk: string) {
    const queryCommand = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.ORGANIZATION_PARENT,
      KeyConditionExpression: 'parent = :parent',
      ExpressionAttributeValues: {
        ':parent': pk,
      },
      Limit: 1,
    });
    const queryResult = await DB.client.send(queryCommand);
    if (queryResult.Count && queryResult.Count > 0) {
      throw new OrganizationHasChildError();
    }
    return this.deleteOne(this.tableName, { pk: pk, sk: CONST.DB.ORGANIZATION_INFO });
  }

  public async update(input: OrganizationUpdateInput, payload: CognitoIdTokenPayload) {
    const { pk, ...item } = input;
    const key = { pk: pk, sk: CONST.DB.ORGANIZATION_INFO };
    const updateTarget = { ...item, updateUser: payload['cognito:username'], updateTime: dateUtil.utc() };
    return this.updateOne(this.tableName, key, updateTarget);
  }
}

export const organizationService = new OrganizationService();