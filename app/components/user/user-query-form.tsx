import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UserQueryInput, userQueryInputSchema } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link } from '@remix-run/react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '~/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { CONST } from '~/lib/const';
import { useState } from 'react';
import OrganizationSelect from '../common/organization-select';
import { OrganizationInfo } from '~/models/organization.model';

type Props = {
  organizations: OrganizationInfo[];
  onSubmit: SubmitHandler<UserQueryInput>;
  defaultValues?: UserQueryInput | undefined;
};

const initValue = {
  status: undefined,
  name: '',
  organization: undefined,
};

export default function UserQueryForm({ onSubmit, organizations, defaultValues }: Props) {
  const form = useForm<UserQueryInput>({
    defaultValues: defaultValues || initValue,
    resolver: zodResolver(userQueryInputSchema),
  });
  const [statusOpen, setStatusOpen] = useState(false);

  const clearForm = () => {
    form.reset();
  };

  return (
    <div className="border rounded-md mb-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-x-4 flex items-end">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[150px]">
                <FormLabel className="whitespace-nowrap">ユーザ名</FormLabel>
                <FormControl>
                  <Input placeholder="ユーザ名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[150px]">
                <FormLabel>ステータス</FormLabel>
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn('w-[150px] justify-between', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? CONST.USER.STATUS.LIST.find((s) => s === field.value) : 'ステータス'}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[150px] p-0">
                    <Command>
                      <CommandInput placeholder="ステータス" />
                      <CommandList>
                        <CommandEmpty>No language found.</CommandEmpty>
                        <CommandGroup>
                          {CONST.USER.STATUS.LIST.map((s) => (
                            <CommandItem
                              value={s}
                              key={s}
                              onSelect={() => {
                                if (s === field.value) {
                                  form.setValue('status', undefined);
                                } else {
                                  form.setValue('status', s);
                                }
                                setStatusOpen(false);
                              }}
                            >
                              {s}
                              <Check className={cn('ml-auto', s === field.value ? 'opacity-100' : 'opacity-0')} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem className="flex flex-col w-[150px]">
                <FormLabel className="whitespace-nowrap">組織</FormLabel>
                <FormControl>
                  <OrganizationSelect
                    organizations={organizations}
                    selected={organizations.find((o) => o.id === field.value)}
                    onSelectChanged={(val) => {
                      form.setValue(`organization`, val?.id);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="outline" onClick={clearForm}>
            クリア
          </Button>
          <Button type="submit">検索</Button>
          <Link to="/dashboard/user/add">
            <Button type="button">ユーザ作成</Button>
          </Link>
        </form>
      </Form>
    </div>
  );
}
