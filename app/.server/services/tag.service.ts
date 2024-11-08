import { TagInfoInput } from '~/models/tag.model';
import { CommonService } from './common.service';
import { v7 } from 'uuid';
import { dateUtil } from '~/lib/date.util';
import { DB } from '../utils/dynamodb.util';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { CONST } from '~/lib/const';

class TagService extends CommonService {
  private tableName = process.env.TAG_TBL!;

  public create(input: TagInfoInput) {
    return this.createOne(
      this.tableName,
      { pk: v7(), sk: input.category },
      { name: input.name, updateTime: dateUtil.utc() },
    );
  }

  public async query(category: string) {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: CONST.DB.INDEXS.SK_TIME,
      KeyConditionExpression: 'sk = :sk',
      ExpressionAttributeValues: {
        ':sk': category,
      },
    });
    const result = await DB.client.send(command);
    return result.Items || [];
  }
}

export const tagService = new TagService();
