import { z } from 'zod';
import { Expand, name, tagCategory, UpdateUserAndTime, uuid } from './common.model';

export const tagInfoInputSchema = z.object({
  name: name,
  category: tagCategory,
});

export const tagIdInputSchema = z.object({
  tagId: uuid,
});

export type TagInfoInput = z.infer<typeof tagInfoInputSchema>;
export type TagInfo = Expand<{ id: string } & TagInfoInput & UpdateUserAndTime>;
export type TagIdInput = z.infer<typeof tagIdInputSchema>;
