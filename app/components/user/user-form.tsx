import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CONST } from '~/lib/const';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfo, UserInfoInput, userInfoInputSchema } from '~/models/user.model';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import OrganizationSelect from '../common/organization-select';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type Props = {
  onSubmit: SubmitHandler<UserInfoInput>;
  organizations: OrganizationInfo[];
  defaultValues?: UserInfo | undefined;
  submitButtonText?: string | undefined;
};

export default function UserForm({ onSubmit, organizations, defaultValues, submitButtonText }: Props) {
  const form = useForm<UserInfoInput>({
    defaultValues: {
      username: defaultValues?.pk || '',
      name: defaultValues?.name || '',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ユーザ名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザ名" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{defaultValues?.name}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="メールアドレス" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{'xx'}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>組織</FormLabel>
              <OrganizationSelect
                organizations={organizations}
                selected={organizations.find((o) => o.pk === field.value)}
                onSelectChanged={(val) => form.setValue('organization', val?.pk || '')}
              />
              {defaultValues && (
                <FormDescription>
                  元の値：{organizations.find((o) => o.pk === defaultValues?.organization)?.name || 'なし'}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>ステータス</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={CONST.USER.STATUS.ACTIVE} />
                    </FormControl>
                    <FormLabel className="font-normal">{CONST.USER.STATUS.ACTIVE}</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={CONST.USER.STATUS.BLOCK} />
                    </FormControl>
                    <FormLabel className="font-normal">{CONST.USER.STATUS.BLOCK}</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{submitButtonText || '新規作成'}</Button>
      </form>
    </Form>
  );
}
