import {
  FieldArrayPath,
  FieldErrors,
  Merge,
  Path,
  SubmitHandler,
  useFieldArray,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { resourceMetadataItemSchema, ResourceMetadataItemView, TypeEnum, typeValues } from '~/models/resource.model';
import { Form, FormControl, FormDescription, FormField, FormItem } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalendarIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '~/lib/utils';
import { dateUtil } from '~/lib/date.util';
import { Calendar } from '../ui/calendar';
import { Switch } from '../ui/switch';
import { get } from 'lodash';

type Props = {
  onSubmit: SubmitHandler<ResourceMetadataItemView>;
  defaultValues?: ResourceMetadataItemView;
  order: number;
};

type SettingsProps = {
  type: TypeEnum;
  form: UseFormReturn<ResourceMetadataItemView, any, undefined>;
};

const SelectOptionsSettings = ({ type, form }: SettingsProps) => {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'validation.options' });
  if (type !== 'select') return null;
  return (
    <div className="category">
      <div className="category-label">
        <span>選択肢設定</span>
        <Button
          type="button"
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
            name={`validation.options.${index}.label`}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0 w-[150px]">
                <FormControl>
                  <Input {...field} placeholder="ラベル" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`validation.options.${index}.value`}
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0 w-[150px]">
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
            type="button"
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
    <div className="category">
      <div className="category-label">日付範囲</div>
      <FormField
        control={form.control}
        name="validation.min"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最小日付を選択します</FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn('w-[300px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
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
        name="validation.max"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最大日付を選択します</FormDescription>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={'outline'}
                    className={cn('w-[300px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
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
      {form.formState.errors.validation?.min && (
        <div className="error">{form.formState.errors.validation?.min.message}</div>
      )}
      {form.formState.errors.validation?.max && (
        <div className="error">{form.formState.errors.validation?.max.message}</div>
      )}
    </div>
  );
};

const NumberLengthSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'number') return null;
  return (
    <div className="category">
      <div className="category-label">数値範囲</div>
      <FormField
        control={form.control}
        name="validation.min"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最小値</FormDescription>
            <FormControl className="w-[300px]">
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
        name="validation.max"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最大値</FormDescription>
            <FormControl className="w-[300px]">
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
        name="validation.integer"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>この入力値は整数のみですか</FormDescription>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      {form.formState.errors.validation?.min && (
        <div className="error">{form.formState.errors.validation.min.message}</div>
      )}
      {form.formState.errors.validation?.max && (
        <div className="error">{form.formState.errors.validation.max.message}</div>
      )}
    </div>
  );
};

const TextLengthSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'text' && type != 'textarea') return null;
  return (
    <div className="category">
      <div className="category-label">文字数</div>
      <FormField
        control={form.control}
        name="validation.min"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最小文字数</FormDescription>
            <FormControl className="w-[300px]">
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
        name="validation.max"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>最大文字数</FormDescription>
            <FormControl className="w-[300px]">
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
      {form.formState.errors.validation?.min && (
        <div className="error">{form.formState.errors.validation.min.message}</div>
      )}
      {form.formState.errors.validation?.max && (
        <div className="error">{form.formState.errors.validation.max.message}</div>
      )}
    </div>
  );
};

const TextPatternSettings = ({ type, form }: SettingsProps) => {
  if (type !== 'text') return null;
  return (
    <div className="category">
      <div className="category-label">入力規則</div>
      <FormField
        control={form.control}
        name="validation.email"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>この入力値はメールアドレス形式ですか</FormDescription>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  form.setValue('validation.url', false);
                  form.setValue('validation.pattern', '');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="validation.url"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>この入力値はURL形式ですか</FormDescription>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  form.setValue('validation.email', false);
                  form.setValue('validation.pattern', '');
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="validation.pattern"
        render={({ field }) => (
          <FormItem className="form-item">
            <FormDescription>正規表現でカスタマイズします</FormDescription>
            <FormControl className="w-[300px]">
              <Input
                {...field}
                onChange={(event) => {
                  form.setValue('validation.url', false);
                  form.setValue('validation.email', false);
                  field.onChange(event);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
      {form.formState.errors.validation?.pattern && (
        <div className="error">{form.formState.errors.validation.pattern.message}</div>
      )}
    </div>
  );
};

type ErrorMessageProps = {
  form: UseFormReturn<ResourceMetadataItemView, any, undefined>;
  fieldPath: Path<ResourceMetadataItemView>;
};

function ErrorMessage({ form, fieldPath }: ErrorMessageProps) {
  const error = get(form.formState.errors, fieldPath);
  if (!error) return null;
  return <div className="error">{error.message}</div>;
}

export default function ItemForm({ defaultValues, order, onSubmit }: Props) {
  const initValue = useMemo(() => {
    return (
      defaultValues || {
        order: order,
        fieldName: '',
        label: '',
        type: 'text' as TypeEnum,
        description: '',
        validation: { required: false, options: [{ value: '', label: '' }] },
      }
    );
  }, [defaultValues, order]);

  const [type, setType] = useState<TypeEnum>(initValue.type);

  const form = useForm<ResourceMetadataItemView>({
    defaultValues: initValue,
    resolver: zodResolver(resourceMetadataItemSchema),
  });

  const typeChangeHandler = useCallback(
    (val: TypeEnum) => {
      setType(val);
      form.setValue('type', val);
    },
    [form],
  );

  useEffect(() => {
    form.reset(initValue);
  }, [form, initValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="resource-item-form">
        <div className="category">
          <div className="category-label">基本設定</div>
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>表示順</FormDescription>
                <FormControl className="w-[300px]">
                  <Input {...field} readOnly={true} disabled={true} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fieldName"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>項目の物理名(英語のみ許可)</FormDescription>
                <FormControl className="w-[300px]">
                  <Input placeholder="項目名" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>項目ラベル(日本語入力可)</FormDescription>
                <FormControl className="w-[300px]">
                  <Input placeholder="ラベル" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>タイプ</FormDescription>
                <FormControl>
                  <Select onValueChange={typeChangeHandler} defaultValue={field.value}>
                    <SelectTrigger className="w-[300px]">
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>項目に対する説明</FormDescription>
                <FormControl className="w-[300px]">
                  <Input placeholder="説明" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.formState.errors.fieldName && <div className="error">{form.formState.errors.fieldName.message}</div>}
          {form.formState.errors.label && <div className="error">{form.formState.errors.label.message}</div>}
          {form.formState.errors.description && (
            <div className="error">{form.formState.errors.description.message}</div>
          )}
        </div>

        <div className="category">
          <div className="category-label">必須設定</div>
          <FormField
            control={form.control}
            name="validation.required"
            render={({ field }) => (
              <FormItem className="form-item">
                <FormDescription>この項目は必須入力ですか</FormDescription>
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
        <div className="text-right">
          <Button type="submit">保存</Button>
        </div>
      </form>
    </Form>
  );
}
