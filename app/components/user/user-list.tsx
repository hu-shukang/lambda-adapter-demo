import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { dateUtil } from '~/lib/date.util';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfo } from '~/models/user.model';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

type Props = {
  data: UserInfo[];
  organizations: OrganizationInfo[];
  updateHandler: (pk: string) => void;
  removeHandler: (info: UserInfo) => void;
};

const getColumns = ({ organizations, updateHandler, removeHandler }: Props): ColumnDef<UserInfo>[] => {
  const organizationMap = new Map<string, OrganizationInfo>();
  organizations.forEach((v) => {
    organizationMap.set(v.pk, v);
  });

  const statusType: Record<string, string> = {
    ACTIVE: 'success',
    BLOCK: 'error',
  };
  return [
    {
      id: 'idx',
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: 'pk',
      meta: { displayName: 'ユーザID' },
      header: 'ユーザID',
      cell: ({ row }) => <div>{row.getValue('pk')}</div>,
    },
    {
      accessorKey: 'name',
      meta: { displayName: 'ユーザ名' },
      header: 'ユーザ名',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'organization',
      meta: { displayName: '組織' },
      header: '組織',
      cell: ({ row }) => <div>{organizationMap.get(row.getValue('organization'))?.name}</div>,
    },
    {
      accessorKey: 'status',
      meta: { displayName: 'ステータス' },
      header: () => <div className="text-center">ステータス</div>,
      cell: ({ row }) => {
        const status = row.getValue<string>('status');
        const variant = statusType[status] as any;
        return (
          <div className="text-center">
            <Badge variant={variant}>{status}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: 'updateUser',
      meta: { displayName: '更新者' },
      header: () => <div className="text-left">更新者</div>,
      cell: ({ row }) => {
        return <div className="text-left font-medium">{row.getValue('updateUser')}</div>;
      },
    },
    {
      accessorKey: 'updateTime',
      meta: { displayName: '更新日時' },
      header: () => <div className="text-right">更新日時</div>,
      cell: ({ row }) => {
        const updateTime = dateUtil.format(row.getValue('updateTime'));
        return <div className="text-right font-medium">{updateTime}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-center">操作</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>アクション</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateHandler(row.original.pk)}>更新</DropdownMenuItem>
                <DropdownMenuItem onClick={() => removeHandler(row.original)}>削除</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

export default function UserList(props: Props) {
  const columns = useMemo(() => getColumns(props), [props]);
  const table = useReactTable({
    data: props.data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
