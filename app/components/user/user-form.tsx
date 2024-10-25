import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CONST } from '~/lib/const';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfo, UserInfoInput, userInfoInputSchema } from '~/models/user.model';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { useState } from 'react';

type Props = {
  onSubmit: SubmitHandler<UserInfoInput>;
  organizations: OrganizationInfo[];
  defaultValues?: UserInfo | undefined;
  submitButtonText?: string | undefined;
};

export default function UserForm({ onSubmit, organizations, defaultValues }: Props) {
  const [open, setOpen] = useState(false);
  const form = useForm<UserInfoInput>({
    defaultValues: {
      username: defaultValues?.pk || '',
      cognitoUsername: defaultValues?.cognitoUsername || '',
      email: '',
      organization: defaultValues?.organization || '',
      status: defaultValues?.status || CONST.USER.STATUS.ACTIVE,
    },
    resolver: zodResolver(userInfoInputSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザID</FormLabel>
              <FormControl>
                <Input placeholder="ユーザID" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{defaultValues?.pk}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cognitoUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザ名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザ名" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{defaultValues?.cognitoUsername}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Input placeholder="メールアドレス" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{'xx'}</FormDescription>}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>組織</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('justify-between', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? organizations.find((o) => o.pk === field.value)?.name : '組織選択'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]">
                  <Command>
                    <CommandInput placeholder="Search Organization..." />
                    <CommandList>
                      <CommandEmpty>No Organization found.</CommandEmpty>
                      <CommandGroup>
                        {organizations.map((o) => (
                          <CommandItem
                            value={o.pk}
                            key={o.pk}
                            onSelect={(currentValue) => {
                              form.setValue(
                                'organization',
                                currentValue === form.getValues().organization ? '' : currentValue,
                              );
                              setOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', o.pk === field.value ? 'opacity-100' : 'opacity-0')} />
                            {o.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {defaultValues && (
                <FormDescription>
                  元の値：{organizations.find((o) => o.pk === defaultValues?.organization)?.name || 'なし'}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
