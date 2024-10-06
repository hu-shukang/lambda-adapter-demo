import { useLoaderData, Form, useNavigate, useParams } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { LoaderFunction, ActionFunction } from '@remix-run/node';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { useCallback } from 'react';

type User = { pk: string; sk: string; name: string; address: string };

export const loader: LoaderFunction = async ({ params, request }) => {
  const { userId } = params;
  try {
    const url = new URL(`/api/user/${userId}`, request.url);
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('获取用户数据失败');
    }
    const user: User = await response.json();
    return json(user);
  } catch (error) {
    console.error('加载用户时出错:', error);
    return json({ error: '获取用户数据时发生错误' }, { status: 500 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const { userId } = params;
  const formData = await request.formData();
  const name = formData.get('name');
  const address = formData.get('address');
  const url = new URL(`/api/user/${userId}`, request.url);
  try {
    const response = await fetch(url, {
      method: 'PUT',
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

export default function UserDetail() {
  const user = useLoaderData<User>();
  const navigate = useNavigate();
  const params = useParams();

  const deleteHandler = useCallback(async () => {
    const { userId } = params;
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      navigate('/users');
    } catch (error) {
      console.error(error);
    }
  }, [navigate, params]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户详情</h1>
      <Form method="post" className="space-y-4">
        <input type="hidden" name="_method" value="put" />
        <Input name="name" defaultValue={user.name} />
        <Input name="address" defaultValue={user.address} />
        <Button type="submit">更新用户</Button>
      </Form>
      <Button type="submit" variant="destructive" onClick={deleteHandler}>
        删除用户
      </Button>
    </div>
  );
}
