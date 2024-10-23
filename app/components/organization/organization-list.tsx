import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { OrganizationInfo } from '~/models/organization.model';
import { dateUtil } from '~/lib/date.util';

type Props = {
  data: OrganizationInfo[];
  updateHandler: (pk: string) => void;
  removeHandler: (info: OrganizationInfo) => void;
};

export const getColumns = ({ data, updateHandler, removeHandler }: Props): ColumnDef<OrganizationInfo>[] => {
  return [
    {
      id: 'select',
      header: () => <div className="text-center">No.</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    },
    {
      accessorKey: 'name',
      meta: { displayName: '組織名' },
      header: '組織名',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'parent',
      meta: { displayName: '親組織' },
      header: '親組織',
      cell: ({ row }) => <div>{data.find((item) => item.pk === row.getValue('parent'))?.name || 'なし'}</div>,
    },
    {
      accessorKey: 'priority',
      meta: { displayName: '優先度' },
      header: '優先度',
      cell: ({ row }) => <div>{row.getValue('priority')}</div>,
    },
    {
      accessorKey: 'updateUser',
      meta: { displayName: '更新者' },
      header: () => <div className="text-right">更新者</div>,
      cell: ({ row }) => {
        return <div className="text-right font-medium">{row.getValue('updateUser')}</div>;
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

export default function OrganizationList(props: Props) {
  const { data } = props;
  const columns = React.useMemo(() => getColumns(props), [props]);

  const table = useReactTable({
    data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
