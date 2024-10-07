import { z } from 'zod';

export const userInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
});

export const idSchema = z.object({
  id: z.string(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

export type ID = z.infer<typeof idSchema>;
