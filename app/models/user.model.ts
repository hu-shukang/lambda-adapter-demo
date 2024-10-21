import { z } from 'zod';
import { confirmationCode, DBKey, email, password, rePassword, username } from './common.model';

const idToken = z.string();
const refreshToken = z.string();
export const userInfoSchema = z.object({
  email: z.string().email().min(1, 'Name is required'),
  password: z.string().min(1, 'Address is required'),
});

export const idSchema = z.object({
  id: z.string(),
});

export const signinInputSchema = z.object({
  username: username,
  password: password,
});

export const signupInputSchema = z
  .object({
    username: username,
    email: email,
    password: password,
    rePassword: rePassword,
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'パスワード不一致',
    path: ['rePassword'],
  });

export const signupConfirmInputSchema = z.object({
  username: username,
  confirmationCode: confirmationCode,
});

export const tokenInputSchema = z.object({
  idToken: idToken,
  refreshToken: refreshToken,
});

export type UserInfo = z.infer<typeof userInfoSchema>;
export type UserEntity = DBKey & UserInfo;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type SignupConfirmInput = z.infer<typeof signupConfirmInputSchema>;
export type TokenInput = z.infer<typeof tokenInputSchema>;

export type ID = z.infer<typeof idSchema>;
