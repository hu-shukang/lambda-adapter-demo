import { ResourceMetadataInput, ResourceMetadataItemView } from '~/models/resource.model';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { useCallback, useState } from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReplace, UseFieldArrayUpdate } from 'react-hook-form';
import ItemFormDrawer from './item-form';

type Props = {
  items: ResourceMetadataItemView[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<ResourceMetadataInput, 'items'>;
  update: UseFieldArrayUpdate<ResourceMetadataInput, 'items'>;
  replace: UseFieldArrayReplace<ResourceMetadataInput, 'items'>;
};

export default function ItemTable({ items, remove, append }: Props) {
  const [openItemForm, setOpenItemForm] = useState(false);

  const edit = useCallback((item: ResourceMetadataItemView) => {
    console.log(item);
  }, []);

  const submitHandler = useCallback(
    (data: ResourceMetadataItemView) => {
      append(data);
      setOpenItemForm(false);
    },
    [append],
  );

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium leading-none">項目</div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">表示順</TableHead>
              <TableHead className="w-[100px]">項目名</TableHead>
              <TableHead className="w-[100px]">ラベル</TableHead>
              <TableHead className="w-[100px]">タイプ</TableHead>
              <TableHead className="w-[150px]">説明</TableHead>
              <TableHead>入力規則</TableHead>
              <TableHead className="w-[150px]">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 &&
              items.map((item, index) => (
                <TableRow key={item.fieldName}>
                  <TableCell>{item.order}</TableCell>
                  <TableCell>{item.fieldName}</TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.validation}</TableCell>
                  <TableCell>
                    <Button onClick={() => remove(index)}>削除</Button>
                    <Button onClick={() => edit(item)}>編集</Button>
                  </TableCell>
                </TableRow>
              ))}

            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <Button onClick={() => setOpenItemForm(true)}>項目追加</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ItemFormDrawer open={openItemForm} setOpen={setOpenItemForm} onSubmit={submitHandler} order={items.length + 1} />
    </div>
  );
}
