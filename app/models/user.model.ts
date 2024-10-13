import { z } from 'zod';
import { DBKey } from './common.model';

const username = z.string({ required_error: '必須項目です' });
const email = z.string({ required_error: '必須項目です' }).email({ message: 'メール形式不正' });
const password = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
const rePassword = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
const confirmationCode = z.string().regex(/^\d{6}$/, {
  message: '6桁数字は必須',
});
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
