import { ResourceMetadataInput, ResourceMetadataItemView, TypeEnum, ValidationInput } from '~/models/resource.model';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { useCallback, useState } from 'react';
import { UseFieldArrayAppend, UseFieldArrayRemove, UseFieldArrayReplace, UseFieldArrayUpdate } from 'react-hook-form';
import ItemFormDialog from './item-form-dialog';
import { cn } from '~/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { DotsHorizontalIcon, TrashIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';

type Props = {
  items: ResourceMetadataItemView[];
  remove: UseFieldArrayRemove;
  append: UseFieldArrayAppend<ResourceMetadataInput, 'items'>;
  update: UseFieldArrayUpdate<ResourceMetadataInput, 'items'>;
  replace: UseFieldArrayReplace<ResourceMetadataInput, 'items'>;
};

function ValidationView({ validation }: { validation: ValidationInput }) {
  return (
    <Popover>
      <PopoverTrigger>
        <DotsHorizontalIcon />
      </PopoverTrigger>
      <PopoverContent>
        <div>必須: {validation.required ? 'はい' : 'いいえ'}</div>
        {validation.max && <div>最大値: {validation.max}</div>}
        {validation.min && <div>最小値: {validation.min}</div>}
        {validation.email && <div>形式: メールアドレス</div>}
        {validation.url && <div>形式: URL</div>}
        {validation.pattern && <div>形式: {validation.pattern}</div>}
        {validation.integer && <div>形式: 整数のみ</div>}
      </PopoverContent>
    </Popover>
  );
}

const initFormValue: ResourceMetadataItemView = {
  order: 1,
  fieldName: '',
  label: '',
  type: 'text' as TypeEnum,
  description: '',
  validation: { required: false, options: [], pattern: '' },
};

export default function ItemTable({ items, remove, append, replace, update }: Props) {
  const [openItemForm, setOpenItemForm] = useState(false);
  const [defaultFormValue, setDefaultFormValue] = useState<ResourceMetadataItemView>(initFormValue);

  const editHandler = useCallback((item: ResourceMetadataItemView) => {
    setDefaultFormValue(item);
    setOpenItemForm(true);
  }, []);

  const appendHandler = useCallback(() => {
    setDefaultFormValue({ ...initFormValue, order: items.length + 1 });
    setOpenItemForm(true);
  }, [items.length]);

  const submitHandler = useCallback(
    (data: ResourceMetadataItemView) => {
      if (data.order < items.length) {
        update(data.order, data);
      } else {
        append(data);
      }
      setOpenItemForm(false);
    },
    [append, items, update],
  );

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragOver = useCallback(
    (index: number) => {
      if (draggedIndex === null || draggedIndex === index) return;

      const updatedRows = [...items];
      const [movedRow] = updatedRows.splice(draggedIndex, 1); // 移除被拖动的行
      updatedRows.splice(index, 0, movedRow); // 在目标位置插入

      replace(updatedRows);
      setDraggedIndex(index); // 更新拖动索引
    },
    [draggedIndex, items, replace],
  );

  const handleDragEnd = () => {
    setDraggedIndex(null); // 清除拖动索引
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium leading-none">項目</div>
      <div className="border rounded-md">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">表示順</TableHead>
              <TableHead className="w-[100px]">項目名</TableHead>
              <TableHead className="w-[100px]">ラベル</TableHead>
              <TableHead className="w-[100px]">タイプ</TableHead>
              <TableHead>説明</TableHead>
              <TableHead className="w-[150px]">入力規則</TableHead>
              <TableHead className="w-[120px]">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 &&
              items.map((item, index) => (
                <TableRow
                  key={item.fieldName}
                  draggable={true}
                  onDragStart={() => setDraggedIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleDragOver(index);
                  }}
                  onDragEnd={handleDragEnd}
                  className={cn('cursor-move', {
                    'text-gray-300': draggedIndex === index,
                    'shadow-lg': draggedIndex === index,
                  })}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell>{item.fieldName}</TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis">{item.description}</div>
                  </TableCell>
                  <TableCell>
                    <ValidationView validation={item.validation} />
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button onClick={() => remove(index)} size="icon" variant="outline">
                      <TrashIcon />
                    </Button>
                    <Button onClick={() => editHandler({ ...item, order: index })} size="icon" variant="outline">
                      <Pencil1Icon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <Button onClick={appendHandler} variant="outline">
                  <PlusIcon />
                  <span className="ml-2">項目追加</span>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <ItemFormDialog
        open={openItemForm}
        setOpen={setOpenItemForm}
        onSubmit={submitHandler}
        defaultValues={defaultFormValue}
      />
    </div>
  );
}
