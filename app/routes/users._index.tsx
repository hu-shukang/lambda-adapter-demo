import { useLoaderData, Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/lib/dynamodb.util';

type User = { pk: string; sk: string; name: string; address: string };

export const loader: LoaderFunction = async ({ request }) => {
  const command = new ScanCommand({
    TableName: process.env.USER_TBL,
  });
  const result = await DB.client.send(command);
  return json(result.Items);
};

export default function Users() {
  const users = useLoaderData<User[]>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户列表</h1>
      <Link to="/users/new">
        <Button>添加用户</Button>
      </Link>
      <div>user count: {users.length}</div>
      <ul className="mt-4">
        {users.map((user) => (
          <li key={user.pk} className="border-b p-2">
            <Link to={`/users/${user.pk}`} className="text-blue-500 hover:underline">
              {user.name} ({user.address})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
