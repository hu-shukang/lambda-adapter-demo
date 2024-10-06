import { useLoaderData, Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/.server/utils/dynamodb.util';
import { User } from '~/models/user.model';

export const loader: LoaderFunction = async () => {
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
        <button>添加用户</button>
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
