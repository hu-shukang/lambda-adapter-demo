import { SubmitHandler, useForm } from 'react-hook-form';
import { resourceMetadataItemSchema, ResourceMetadataItemView, typeValues } from '~/models/resource.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '../ui/drawer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: SubmitHandler<ResourceMetadataItemView>;
  defaultValues?: ResourceMetadataItemView;
  order: number;
};

export default function ItemFormDrawer({ open, setOpen, defaultValues, order, onSubmit }: Props) {
  const initValue = useMemo(() => {
    return (
      defaultValues || {
        order: order,
        fieldName: '',
        label: '',
        type: 'text',
        description: '',
        validation: '',
      }
    );
  }, [defaultValues, order]);

  const form = useForm<ResourceMetadataItemView>({
    defaultValues: initValue,
    resolver: zodResolver(resourceMetadataItemSchema),
  });

  useEffect(() => {
    form.reset(initValue);
  }, [form, initValue]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="w-[500px] mx-auto px-0">
          <DrawerTitle>項目定義</DrawerTitle>
          <DrawerDescription>下記の内容を入力して項目を定義します</DrawerDescription>
        </DrawerHeader>
        <div className="w-[500px] mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>表示順</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={true} disabled={true} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>項目名</FormLabel>
                    <FormControl>
                      <Input placeholder="項目名" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ラベル</FormLabel>
                    <FormControl>
                      <Input placeholder="ラベル" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>タイプ</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {typeValues.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>説明</FormLabel>
                    <FormControl>
                      <Input placeholder="説明" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="validation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入力規則</FormLabel>
                    <FormControl>
                      <Input placeholder="入力規則" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">保存</Button>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
