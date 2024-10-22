import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Outlet } from '@remix-run/react';
import { DB } from '~/.server/utils/dynamodb.util';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { CONST } from '~/lib/const';

export const handle = {
  breadcrumb: {
    text: '組織管理',
    href: '/dashboard/organization',
  },
};

export const loader = RequestWrapper.init(async ({ request }) => {
  const command = new QueryCommand({
    TableName: process.env.USER_TBL,
    IndexName: CONST.DB.INDEXS.ORGANIZATION_PRIORITY_ORDER,
    KeyConditionExpression: 'sk = :sk',
    ExpressionAttributeValues: {
      ':sk': CONST.DB.ORGANIZATION_INFO,
    },
    ScanIndexForward: true,
  });
  const result = await DB.client.send(command);
  const items = result.Items || [];
  return Resp.json(request, items);
}).loader();

export default function OrganizationLayout() {
  return <Outlet />;
}
