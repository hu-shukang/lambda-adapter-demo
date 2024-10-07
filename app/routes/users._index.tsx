import { useLoaderData, Link } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunction } from '@remix-run/node';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { DB } from '~/.server/utils/dynamodb.util';
import { User } from '~/models/user.model';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Button } from '~/components/ui/button';

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
        <Button>添加用户</Button>
      </Link>
      <div>user count: {users.length}</div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>PK</TableHead>
            <TableHead>SK</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
