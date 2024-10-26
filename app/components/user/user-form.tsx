import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CONST } from '~/lib/const';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfo, UserInfoInput, userInfoInputSchema } from '~/models/user.model';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import OrganizationSelect from '../common/organization-select';

type Props = {
  onSubmit: SubmitHandler<UserInfoInput>;
  organizations: OrganizationInfo[];
  defaultValues?: UserInfo | undefined;
  submitButtonText?: string | undefined;
};

export default function UserForm({ onSubmit, organizations, defaultValues }: Props) {
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
              <OrganizationSelect organizations={organizations} form={form} field={field} fieldName="organization" />
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
