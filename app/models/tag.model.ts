import { z } from 'zod';
import { DBKey, Expand, name, tagCategory } from './common.model';

export const tagInfoInputSchema = z.object({
  name: name,
  category: tagCategory,
});

export type TagInfoInput = z.infer<typeof tagInfoInputSchema>;
export type TagInfo = Expand<DBKey & Omit<TagInfoInput, 'category'> & { updateTime: string }>;
