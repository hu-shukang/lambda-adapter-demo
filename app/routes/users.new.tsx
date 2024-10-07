import { redirect, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/.server/utils/dynamodb.util';
import { v7 } from 'uuid';
import { RequestWrapper } from '~/lib/request.util';
import { User } from '~/models/user.model';

export const action: ActionFunction = async (args) => {
  const wrapper = new RequestWrapper(args);
  const user = await wrapper.data<User>();
  const command = new PutCommand({
    TableName: process.env.USER_TBL,
    Item: {
      ...user,
      pk: v7(),
      sk: 'USER_INFO',
    },
  });
  try {
    await DB.client.send(command);
    return redirect('/users');
  } catch (e) {
    return json({ error: '创建用户失败' }, { status: 500 });
  }
};

export default function NewUser() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">添加用户</h1>
      <Form method="post" className="space-y-4">
        <Input name="name" placeholder="Name" />
        <Input name="address" placeholder="Address" />
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        <Button type="submit">添加用户</Button>
      </Form>
    </div>
  );
}
