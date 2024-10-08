import { Link, useFetcher, useRouteLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Button } from '~/components/ui/button';
import { userService } from '~/.server/services/user.service';
import { UserEntity } from '~/models/user.model';

export const loader: LoaderFunction = async () => {
  const result = await userService.getAll();
  return json(result);
};

export default function Users() {
  const users = useRouteLoaderData<UserEntity[]>('routes/api.users.$id.detail');
  const fetcher = useFetcher();

  const handleDelete = (pk: string) => {
    fetcher.submit(null, {
      method: 'post',
      action: `/api/users/${pk}/delete`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">用户列表</h1>
      <Link to="/users/new">
        <Button>添加用户</Button>
      </Link>
      <div>user count: {users?.length ?? 0}</div>
      {users && (
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>PK</TableHead>
              <TableHead>SK</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.pk}>
                <TableCell className="font-medium">
                  <Link to={`/users/${user.pk}`} className="text-blue-500 hover:underline">
                    {user.pk}
                  </Link>
                </TableCell>
                <TableCell>{user.sk}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(user.pk)}>删除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
