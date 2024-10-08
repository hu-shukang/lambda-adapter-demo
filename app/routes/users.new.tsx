import { Form, useActionData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { ActionFunction } from '@remix-run/node';

export default function NewUser() {
  const actionData = useActionData<ActionFunction>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">添加用户</h1>
      <Form method="post" className="space-y-4" action={'/api/users/new'}>
        <Input name="name" placeholder="Name" />
        <Input name="address" placeholder="Address" />
        {actionData?.error && <p className="text-red-500">{actionData.error}</p>}
        <Button type="submit">添加用户</Button>
      </Form>
    </div>
  );
}
