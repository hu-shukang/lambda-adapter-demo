import { z } from 'zod';
import {
  block,
  blockFilter,
  cognitoUsername,
  confirmationCode,
  DBKey,
  email,
  idToken,
  nameFilter,
  organization,
  organizationFilter,
  password,
  refreshToken,
  rePassword,
  sort,
  username,
} from './common.model';

export const userInfoSchema = z.object({
  email: email,
  username: email,
  cognitoUsername: cognitoUsername,
  block: block,
  organization: organization,
});

export const userQueryInputSchema = z.object({
  sort: sort,
  organization: organizationFilter,
  block: blockFilter,
  name: nameFilter,
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
export type UserQueryInput = z.infer<typeof userQueryInputSchema>;
export type UserEntity = DBKey & UserInfo;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type SignupConfirmInput = z.infer<typeof signupConfirmInputSchema>;
export type TokenInput = z.infer<typeof tokenInputSchema>;

export type ID = z.infer<typeof idSchema>;
