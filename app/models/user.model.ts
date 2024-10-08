import { z } from 'zod';
import { DBKey } from './common.model';

export const userInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
});

export const idSchema = z.object({
  id: z.string(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;
export type UserEntity = DBKey & UserInfo;

export type ID = z.infer<typeof idSchema>;
