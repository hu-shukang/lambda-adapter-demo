import { OrganizationInput, OrganizationOne } from '~/models/organization.model';
import { CommonService } from './common.service';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { v7 } from 'uuid';
import { CONST } from '~/lib/const';
import { dateUtil } from '~/lib/date.util';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';
import {
  OrganizationDeadLockError,
  OrganizationHasChildError,
  OrganizationNotFoundError,
  OrganizationSelfParentError,
} from '~/models/error.model';

class OrganizationService extends CommonService {
  private tableName = process.env.USER_TBL!;

  /**
   * 組織を新規作成
   * @param input 組織情報
   * @param payload idToken payload
   * @returns 作成結果
   */
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

  /**
   * 組織を全部取得する
   * @returns 組織リスト
   */
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

  public async update(pk: string, input: OrganizationInput, payload: CognitoIdTokenPayload) {
    if (input.parent) {
      if (pk === input.parent) {
        throw new OrganizationSelfParentError();
      }
      const item = await this.get({ pk: input.parent });
      if (!item) {
        throw new OrganizationNotFoundError();
      }
      if (item.parent === pk) {
        throw new OrganizationDeadLockError();
      }
    }

    const key = { pk: pk, sk: CONST.DB.ORGANIZATION_INFO };
    const updateTarget = { ...input, updateUser: payload['cognito:username'], updateTime: dateUtil.utc() };
    return this.updateOne(this.tableName, key, updateTarget);
  }

  public async get(input: OrganizationOne) {
    const { pk } = input;
    const result = await this.getOne(this.tableName, { pk: pk, sk: CONST.DB.ORGANIZATION_INFO });
    return result.Item;
  }
}

export const organizationService = new OrganizationService();
