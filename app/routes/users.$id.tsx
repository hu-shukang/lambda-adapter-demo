import { Form, useLoaderData, useParams } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Button } from '~/components/ui/button';
import { RequestWrapper } from '~/.server/utils/request.util';
import { userService } from '~/.server/services/user.service';
import { idSchema, UserEntity } from '~/models/user.model';

export const loader: LoaderFunction = async (args) => {
  const requestWrapper = new RequestWrapper(args);
  const { id } = requestWrapper.params(idSchema);
  const user = await userService.getDetail(id);
  if (user) {
    return json(user);
  }
  return json({ error: '获取用户详情失败' }, { status: 500 });
};

export default function UserDetail() {
  const user = useLoaderData<UserEntity>();
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户详情</h1>
      {user && (
        <Form method="post" className="space-y-4" action={`/api/users/${id}/update`}>
          {/* <Input name="name" defaultValue={user.name} />
          <Input name="address" defaultValue={user.address} /> */}
          <Button type="submit">更新用户</Button>
        </Form>
      )}
    </div>
  );
}
