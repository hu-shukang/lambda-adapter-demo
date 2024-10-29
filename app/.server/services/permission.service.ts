import { CommonService } from './common.service';
import { CONST } from '~/lib/const';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '../utils/dynamodb.util';

class PermissionService extends CommonService {
  private tableName = process.env.PERMISSION_TBL!;

  public async queryPermission() {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.SK_TIME,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': CONST.DB.PERMISSION_INFO,
      },
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }
}

export const permissionService = new PermissionService();
