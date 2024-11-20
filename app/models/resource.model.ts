import { z } from 'zod';
import { color, name } from './common.model';

const checkRegex = (pattern: string | undefined) => {
  if (!pattern) return true; // Allow empty for optional
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
};

export const typeValues = ['text', 'number', 'date', 'boolean', 'select', 'textarea'] as const;
export const typeSchema = z.enum(typeValues);

export const optionsSchema = z.object({
  value: z.string().min(1).max(20),
  label: z.string().min(1).max(20),
});

export const validationInputSchema = z
  .object({
    required: z.boolean(),
    min: z.number().int().optional(),
    max: z.number().int().optional(),
    email: z.boolean().optional(),
    url: z.boolean().optional(),
    pattern: z.string().optional().refine(checkRegex, {
      message: 'Invalid regular expression pattern',
    }),
    integer: z.boolean().optional(),
    options: z.array(optionsSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.min !== undefined && data.max !== undefined && data.min > data.max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Min value must be less than max value',
        path: ['min'],
      });
    }
  });

export const resourceMetadataItemSchema = z.object({
  fieldName: z
    .string()
    .min(1, '項目の物理名: 1文字〜50文字でご入力ください')
    .max(50, '項目の物理名: 1文字〜50文字でご入力ください')
    .regex(
      /^[a-z][a-zA-Z]*$/,
      '項目の物理名: キャメルケース形式でアルファベットをご入力ください。(例. firstName, lastName)',
    ),
  label: z
    .string()
    .min(1, '項目ラベル: 1文字〜20文字でご入力ください')
    .max(20, '項目ラベル: 1文字〜20文字でご入力ください'),
  description: z
    .string()
    .min(1, '項目に対する説明: 1文字〜500文字でご入力ください')
    .max(500, '項目に対する説明: 1文字〜500文字でご入力ください'),
  type: typeSchema,
  validation: validationInputSchema,
  order: z.number().int().min(0),
});

export const resourceMetadataInputSchema = z.object({
  name: name,
  color: color,
  items: z.array(resourceMetadataItemSchema).min(1),
});

export type TypeEnum = z.infer<typeof typeSchema>;
export type ResourceMetadataInput = z.infer<typeof resourceMetadataInputSchema>;
export type ResourceMetadataItemView = z.infer<typeof resourceMetadataItemSchema>;
export type ResourceMetadataView = ResourceMetadataInput;
export type ValidationInput = z.infer<typeof validationInputSchema>;
