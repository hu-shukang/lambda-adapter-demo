import { z } from 'zod';
import { color, name } from './common.model';

export const optionsSchema = z.object({
  value: z.string().min(1).max(20),
  label: z.string().min(1).max(20),
});

/**
 * text: required, min, max, email, url, pattern
 * number: required, min, max, integer
 * date: required, range
 * boolean: required
 * select: required, options
 * textarea: required, min, max
 */
export const typeValues = ['text', 'number', 'date', 'boolean', 'select', 'textarea'] as const;
export const typeSchema = z.enum(typeValues);
export const resourceMetadataItemSchema = z.object({
  fieldName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z][a-zA-Z]*$/, 'Field name must be in camelCase format (e.g. firstName, lastName)'),
  label: z.string().min(1).max(20),
  description: z.string().min(1).max(255),
  type: typeSchema,
  validation: z.string().min(1).max(255),
  options: z.array(optionsSchema).optional(),
  order: z.number().int().min(0),
});

export const resourceMetadataInputSchema = z.object({
  name: name,
  color: color,
  items: z.array(resourceMetadataItemSchema).min(1),
});

const checkRegex = (pattern: string | undefined) => {
  if (!pattern) return true; // Allow empty for optional
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
};
/**
 * text: required, min, max, email, url, pattern
 * number: required, min, max, integer
 * date: required, min, max
 * boolean: required
 * select: required, options
 * textarea: required, min, max
 */
export const validationInputSchema = z.object({
  type: typeSchema,
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
});

export type TypeEnum = z.infer<typeof typeSchema>;
export type ResourceMetadataInput = z.infer<typeof resourceMetadataInputSchema>;
export type ResourceMetadataItemView = z.infer<typeof resourceMetadataItemSchema>;
export type ResourceMetadataView = ResourceMetadataInput;
export type ValidationInput = z.infer<typeof validationInputSchema>;
