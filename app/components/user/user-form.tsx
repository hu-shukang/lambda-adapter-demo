import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { CONST } from '~/lib/const';
import { OrganizationInfo } from '~/models/organization.model';
import { UserInfoInput, userInfoInputSchema, UserView } from '~/models/user.model';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { PlusIcon, MinusIcon, CalendarIcon } from '@radix-ui/react-icons';
import OrganizationSelect from '../common/organization-select';
import { TagInfo } from '~/models/tag.model';
import TagSelector from '../ui/tag-selector';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '~/lib/utils';
import { Calendar } from '../ui/calendar';
import { dateUtil } from '~/lib/date.util';

type Props = {
  onSubmit: SubmitHandler<UserInfoInput>;
  organizations: OrganizationInfo[];
  tags: TagInfo[];
  submitButtonText?: string | undefined;
  progressing: boolean;
  defaultValues?: UserView;
  disabledFileds?: Array<keyof UserInfoInput>;
};

const initValues = {
  id: '',
  email: '',
  name: '',
  enterDay: dateUtil.utc(),
  organizations: [{ organization: '', position: '' }],
  status: CONST.USER.STATUS.ACTIVE,
};

const getInitValues = (defaultValues?: UserView | undefined) => {
  if (!defaultValues) {
    return initValues;
  }
  return {
    id: defaultValues.id,
    email: defaultValues.email,
    name: defaultValues.name,
    enterDay: defaultValues.enterDay,
    status: defaultValues.status,
    organizations: defaultValues.organizations.map((o) => ({
      organization: o.organization.id,
      position: o.tag.name,
    })),
  };
};

export default function UserForm({
  onSubmit,
  organizations,
  tags,
  submitButtonText,
  progressing,
  defaultValues,
  disabledFileds,
}: Props) {
  const [tagList, setTagList] = useState(tags);
  const form = useForm<UserInfoInput>({
    defaultValues: getInitValues(defaultValues),
    resolver: zodResolver(userInfoInputSchema),
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'organizations' });
  const { errors } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>社員番号</FormLabel>
              <FormControl>
                <Input placeholder="社員番号" {...field} disabled={disabledFileds?.includes('id')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input placeholder="メールアドレス" {...field} disabled={disabledFileds?.includes('email')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>ユーザ名</FormLabel>
              <FormControl>
                <Input placeholder="ユーザ名" {...field} disabled={disabledFileds?.includes('name')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="enterDay"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>入社日</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn('w-[300px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      disabled={disabledFileds?.includes('enterDay')}
                    >
                      {field.value ? dateUtil.formatJP(field.value) : <span>入社日</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? dateUtil.parseDate(field.value) : undefined}
                    onSelect={(val) => field.onChange(val ? dateUtil.utc(val) : undefined)}
                    disabled={(date) => date > dateUtil.now().add(1, 'year').toDate() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-[300px]">
              <FormLabel>ステータス</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-1"
                  disabled={disabledFileds?.includes('status')}
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
                <div key={field.id} className="flex gap-[10px]">
                  <FormField
                    control={form.control}
                    name={`organizations.${index}.organization`}
                    render={({ field }) => (
                      <FormItem className="w-[145px]">
                        <FormControl>
                          <OrganizationSelect
                            organizations={organizations}
                            selected={organizations.find((o) => o.id === field.value)}
                            onSelectChanged={(val) => {
                              form.setValue(`organizations.${index}.organization`, val?.id || '');
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`organizations.${index}.position`}
                    render={({ field }) => (
                      <FormItem className="min-w-[145px]">
                        <FormControl>
                          <TagSelector
                            placeholder="役職"
                            tags={tagList}
                            value={tagList.find((t) => t.name === field.value)}
                            onChange={(tag) => form.setValue(`organizations.${index}.position`, tag?.name || '')}
                            onCreate={(tag) => {
                              setTagList((prev) => [tag, ...prev]);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button variant="outline" size="icon" onClick={() => remove(index)} disabled={fields.length === 1}>
                    <MinusIcon />
                  </Button>
                  {fields.length - 1 === index && (
                    <Button variant="outline" size="icon" onClick={() => append({ organization: '', position: '' })}>
                      <PlusIcon />
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

        <Button type="submit" loading={progressing}>
          {submitButtonText || '新規作成'}
        </Button>
      </form>
    </Form>
  );
}
