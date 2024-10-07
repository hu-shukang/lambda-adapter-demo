import { useLoaderData, Form } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/.server/utils/dynamodb.util';
import { User } from '~/models/user.model';
import { RequestWrapper } from '~/lib/request.util';

export const loader: LoaderFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const { id } = requestWrapper.params<{ id: string }>();
  const command = new GetCommand({
    TableName: process.env.USER_TBL,
    Key: {
      pk: id,
      sk: 'USER_INFO',
    },
  });
  const result = await DB.client.send(command);
  if (!result.Item) {
    redirect('/users');
    return;
  }
  return json(result.Item);
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;
  const formData = await request.formData();
  const name = formData.get('name');
  const address = formData.get('address');
  const command = new UpdateCommand({
    TableName: process.env.USER_TBL,
    Key: {
      pk: id,
      sk: 'USER_INFO',
    },
    UpdateExpression: 'SET #name = :name, #address = :address',
    ExpressionAttributeNames: {
      '#name': 'name',
      '#address': 'address',
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':address': address,
    },
  });
  await DB.client.send(command);
  redirect('/users');
};

export default function UserDetail() {
  const user = useLoaderData<User>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户详情</h1>
      <Form method="post" className="space-y-4">
        <Input name="name" defaultValue={user.name} />
        <Input name="address" defaultValue={user.address} />
        <Button type="submit">更新用户</Button>
      </Form>
    </div>
  );
}
