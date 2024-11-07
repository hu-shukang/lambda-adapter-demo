import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { CONST } from '~/lib/const';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfo, UserInfoInput, userInfoInputSchema } from '~/models/user.model';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type Props = {
  onSubmit: SubmitHandler<UserInfoInput>;
  organizations: OrganizationInfo[];
  defaultValues?: UserInfo | undefined;
  submitButtonText?: string | undefined;
};

export default function UserForm({ onSubmit, defaultValues, submitButtonText }: Props) {
  const form = useForm<UserInfoInput>({
    defaultValues: {
      email: '',
      name: defaultValues?.name || '',
      employeeNo: defaultValues?.employeeNo || '',
      organizations: defaultValues?.organizations || [{ organization: '', position: '' }],
      status: defaultValues?.status || CONST.USER.STATUS.ACTIVE,
    },
    resolver: zodResolver(userInfoInputSchema),
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'organizations' });
  const { errors } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="メールアドレス" {...field} />
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
          name="employeeNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>社員番号</FormLabel>
              <FormControl>
                <Input placeholder="社員番号" {...field} />
              </FormControl>
              {defaultValues && <FormDescription>元の値：{defaultValues?.employeeNo}</FormDescription>}
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
        <FormField
          control={form.control}
          name="organizations"
          render={() => (
            <FormItem className="space-y-2">
              <FormLabel>所属</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name={`organizations.${index}.organization`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="組織" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`organizations.${index}.position`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="役職" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1} // 确保至少有一个组织信息
                  >
                    删除
                  </Button>
                  {fields.length - 1 === index && (
                    <Button type="button" onClick={() => append({ organization: '', position: '' })}>
                      追加
                    </Button>
                  )}
                </div>
              ))}
              {errors.organizations && typeof errors.organizations.message === 'string' && (
                <FormMessage>{errors.organizations.message}</FormMessage>
              )}
            </FormItem>
          )}
        />

        <Button type="submit">{submitButtonText || '新規作成'}</Button>
      </form>
    </Form>
  );
}
