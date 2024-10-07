import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { json } from '@remix-run/node';
import type { ActionFunction } from '@remix-run/node';
import { idSchema } from '~/.server/model/user.model';
import { DB } from '~/.server/utils/dynamodb.util';
import { RequestWrapper } from '~/.server/utils/request.util';

export const action: ActionFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const { id } = requestWrapper.params(idSchema);
  const command = new DeleteCommand({
    TableName: process.env.USER_TBL,
    Key: {
      pk: id,
      sk: 'USER_INFO',
    },
  });

  await DB.client.send(command);
  return json({ success: true });
};
