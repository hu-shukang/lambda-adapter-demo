import { useLoaderData, Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';

type User = { pk: string; sk: string; name: string; address: string };

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL('/api/user', request.url);
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('获取用户数据失败');
    }
    const users: User[] = await response.json();
    return json(users);
  } catch (error) {
    console.error('加载用户时出错:', error);
    return json({ error: '获取用户数据时发生错误' }, { status: 500 });
  }
};

export default function Users() {
  const users = useLoaderData<User[]>();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户列表</h1>
      <Link to="/users/new">
        <Button>添加用户</Button>
      </Link>
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
