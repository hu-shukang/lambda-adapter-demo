import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { useLoaderData } from '@remix-run/react';
import { DB } from '~/.server/utils/dynamodb.util';
import { RequestWrapper } from '~/.server/utils/request.util';
import { Resp } from '~/.server/utils/response.util';
import { CONST } from '~/lib/const';

export const handle = {
  breadcrumb: {
    text: 'Organization',
    href: '/dashboard/organization',
  },
};

export const loader = RequestWrapper.init(async ({ request }) => {
  const command = new QueryCommand({
    TableName: process.env.USER_TBL,
    IndexName: CONST.DB.INDEXS.ORGANIZATION_PRIORITY_ORDER,
    KeyConditionExpression: 'begins_with(pk, :prefix)',
    FilterExpression: 'sk = :sk',
    ExpressionAttributeValues: {
      ':prefix': CONST.DB.ORGANIZATION,
      ':sk': CONST.DB.INFO,
    },
    ScanIndexForward: true,
  });
  const result = await DB.client.send(command);
  const items = result.Items || [];
  return Resp.json(request, items);
}).loader();

export default function OrganizationPage() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="container px-4">
      <h1>organiation index page</h1>
      <p>{JSON.stringify(loaderData)}</p>
    </div>
  );
}
