import { SubmitHandler, useFieldArray, useForm, UseFormReturn } from 'react-hook-form';
import { ValidationInput, TypeEnum, validationInputSchema } from '~/models/resource.model';
import { Form, FormControl, FormDescription, FormField, FormItem } from '../ui/form';
import { Switch } from '../ui/switch';
import { Input } from '../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '~/lib/utils';
import { dateUtil } from '~/lib/date.util';
import { CalendarIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { zodResolver } from '@hookform/resolvers/zod';

type Props = {
  type: TypeEnum;
};

type SettingsProps = {
  type: TypeEnum;
  form: UseFormReturn<ValidationInput, any, undefined>;
};

const SelectOptionsSettings = ({ type, form }: SettingsProps) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'options' });
  if (type !== 'select') return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium text-base h-[36px] flex items-center justify-between">
        <span>選択肢設定</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            append({ value: '', label: '' });
          }}
        >
          <PlusIcon className="w-[36px]" />
        </Button>
      </div>
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2">
          <div className="text-[0.8rem] text-muted-foreground flex-grow">選択肢 {index + 1}</div>
          <FormField
            control={form.control}
            name={`options.${index}.label`}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0 w-[145px]">
                <FormControl>
                  <Input {...field} placeholder="ラベル" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`options.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0 w-[145px]">
                <FormControl>
                  <Input {...field} placeholder="値" />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            variant="outline"
            size="icon"
            disabled={fields.length === 1}
            onClick={() => {
              remove(index);
            }}
          >
            <MinusIcon className="w-[36px]" />
          </Button>
        </div>
      ))}
    </div>
  );
};

const DateLengthSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'date') return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium text-base h-[36px] flex items-center">日付範囲</div>
      <FormField
        control={form.control}
        name="min"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最小日付を選択します</FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn('w-[200px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    {field.value ? dateUtil.formatJP(field.value * 1000) : <span></span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? dateUtil.parseDate(field.value * 1000) : undefined}
                  onSelect={(val) => field.onChange(val ? dateUtil.unix(val) : undefined)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="max"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最大日付を選択します</FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn('w-[200px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                  >
                    {field.value ? dateUtil.formatJP(field.value * 1000) : <span></span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? dateUtil.parseDate(field.value * 1000) : undefined}
                  onSelect={(val) => field.onChange(val ? dateUtil.unix(val) : undefined)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
      {form.formState.errors.min && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.min.message}</div>
      )}
      {form.formState.errors.max && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.max.message}</div>
      )}
    </div>
  );
};

const NumberLengthSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'number') return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium text-base h-[36px] flex items-center">数値範囲</div>
      <FormField
        control={form.control}
        name="min"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最小値</FormDescription>
            <FormControl className="w-[200px]">
              <Input
                type="number"
                {...field}
                min={0}
                value={field.value !== undefined ? field.value : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="max"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最大値</FormDescription>
            <FormControl className="w-[200px]">
              <Input
                type="number"
                {...field}
                min={0}
                value={field.value !== undefined ? field.value : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="integer"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0 h-[36px]">
            <FormDescription>この入力値は整数のみですか</FormDescription>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      {form.formState.errors.min && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.min.message}</div>
      )}
      {form.formState.errors.max && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.max.message}</div>
      )}
    </div>
  );
};

const TextLengthSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'text' && type != 'textarea') return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium text-base h-[36px] flex items-center">文字数</div>
      <FormField
        control={form.control}
        name="min"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最小文字数</FormDescription>
            <FormControl className="w-[200px]">
              <Input
                type="number"
                {...field}
                min={0}
                value={field.value !== undefined ? field.value : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="max"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>最大文字数</FormDescription>
            <FormControl className="w-[200px]">
              <Input
                type="number"
                {...field}
                min={0}
                value={field.value !== undefined ? field.value : ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  field.onChange(value);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {form.formState.errors.min && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.min.message}</div>
      )}
      {form.formState.errors.max && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.max.message}</div>
      )}
    </div>
  );
};

const TextPatternSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'text') return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border p-4">
      <div className="font-medium text-base h-[36px] flex items-center">入力規則</div>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0 h-[36px]">
            <FormDescription>この入力値はメールアドレス形式ですか</FormDescription>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  form.setValue('url', false);
                  form.setValue('pattern', '');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0 h-[36px]">
            <FormDescription>この入力値はURL形式ですか</FormDescription>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  form.setValue('email', false);
                  form.setValue('pattern', '');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="pattern"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between space-y-0">
            <FormDescription>正規表現でカスタマイズします</FormDescription>
            <FormControl className="w-[200px]">
              <Input
                {...field}
                onChange={(event) => {
                  form.setValue('url', false);
                  form.setValue('email', false);
                  field.onChange(event);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {form.formState.errors.pattern && (
        <div className="text-[0.8rem] text-red-400">{form.formState.errors.pattern.message}</div>
      )}
    </div>
  );
};

const getDefaultValues = (type: TypeEnum): ValidationInput => {
  const defaultValues: ValidationInput = {
    type: type,
    required: false,
    min: undefined,
    max: undefined,
    email: false,
    url: false,
    pattern: '',
    integer: false,
  };
  if (type === 'select') {
    defaultValues.options = [{ label: '', value: '' }];
  }
  return defaultValues;
};

export default function ValidationFields({ type }: Props) {
  const defaultValue = getDefaultValues(type);
  const form = useForm<ValidationInput>({
    defaultValues: defaultValue,
    resolver: zodResolver(validationInputSchema),
  });

  const onSubmit: SubmitHandler<ValidationInput> = (data) => {
    console.log(data);
  };

  return (
    <div className="w-[600px] mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2 rounded-lg border p-4">
            <div className="font-medium text-base h-[36px] flex items-center">必須設定</div>
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between space-y-0 h-[36px]">
                  <FormDescription>この項目を必須入力にしますか</FormDescription>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <TextLengthSettings type={type} form={form} />
          <NumberLengthSettings type={type} form={form} />
          <DateLengthSettings type={type} form={form} />
          <TextPatternSettings type={type} form={form} />
          <SelectOptionsSettings type={type} form={form} />
          <Button type="submit">設定</Button>
        </form>
      </Form>
    </div>
  );
}
