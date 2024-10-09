import { z } from 'zod';
import { DBKey } from './common.model';

const email = z.string({ required_error: '必須項目です' }).email({ message: 'メール形式不正' });
const password = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
const rePassword = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
export const userInfoSchema = z.object({
  email: z.string().email().min(1, 'Name is required'),
  password: z.string().min(1, 'Address is required'),
});

export const idSchema = z.object({
  id: z.string(),
});

export const signinInputSchema = z.object({
  email: email,
  password: password,
});

export const signupInputSchema = z
  .object({
    email: email,
    password: password,
    rePassword: rePassword,
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'パスワード不一致',
    path: ['rePassword'],
  });

export type UserInfo = z.infer<typeof userInfoSchema>;
export type UserEntity = DBKey & UserInfo;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;

export type ID = z.infer<typeof idSchema>;
