import { z } from 'zod';

export const UserIdSchema = z.object({
  id: z.string(),
});

export const UserInfoSchema = z.object({
  name: z.string(),
  address: z.string(),
});

export type UserIdModel = z.infer<typeof UserIdSchema>;
export type UserInfoModel = z.infer<typeof UserInfoSchema>;
