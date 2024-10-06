import { redirect, json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import type { ActionFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get('name');
  const address = formData.get('address');
  const url = new URL(`/api/user`, request.url);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, address }),
    });

    if (!response.ok) {
      throw new Error('Failed to create user');
    }

    return redirect('/users');
  } catch (error) {
    console.error(error);
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
