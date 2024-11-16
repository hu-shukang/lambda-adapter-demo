import { z } from 'zod';
import { Expand, name, tagCategory, UpdateUserAndTime } from './common.model';

export const tagInfoInputSchema = z.object({
  name: name,
  category: tagCategory,
});

export type TagInfoInput = z.infer<typeof tagInfoInputSchema>;
export type TagInfo = Expand<{ id: string } & TagInfoInput & UpdateUserAndTime>;
