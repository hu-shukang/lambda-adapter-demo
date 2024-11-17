import { z } from 'zod';

export const optionsSchema = z.object({
  value: z.string().min(1).max(20),
  label: z.string().min(1).max(20),
});

export const resourceMetadataInputSchema = z.object({
  tagId: z.string().uuid(),
  fieldName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z][a-zA-Z]*$/, 'Field name must be in camelCase format (e.g. firstName, lastName)'),
  label: z.string().min(1).max(20),
  description: z.string().min(1).max(255),
  type: z.enum(['text', 'number', 'date', 'boolean', 'select', 'textarea']),
  validation: z.string().min(1).max(255),
  options: z.array(optionsSchema).optional(),
  order: z.number().int().min(0),
});

export const resourceMetadataListInputSchema = z.array(resourceMetadataInputSchema).min(1);

export type ResourceMetadataListInput = z.infer<typeof resourceMetadataListInputSchema>;
export type ResourceMetadataView = z.infer<typeof resourceMetadataInputSchema>;
