import { z } from 'zod';
import {
  status,
  statusFilter,
  name,
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
  UpdateUserAndTime,
  username,
  Expand,
} from './common.model';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';

export const userInfoInputSchema = z.object({
  email: email,
  username: username,
  name: name,
  status: status,
  organization: organization,
});

export const userQueryInputSchema = z.object({
  sort: sort,
  organization: organizationFilter,
  status: statusFilter,
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

export type UserInfoInput = z.infer<typeof userInfoInputSchema>;
export type UserInfo = Expand<
  Omit<UserInfoInput, 'email' | 'username'> &
    DBKey &
    UpdateUserAndTime & { sub: string; emplooyNo: string; cognitoUserStatus: string }
>;
export type UserInfoView = Expand<Omit<UserInfo, 'pk' | 'sk'> & { email: string; picture?: string }>;
export type UserQueryInput = z.infer<typeof userQueryInputSchema>;
export type UserEntity = Expand<DBKey & UserInfoInput>;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type SignupConfirmInput = z.infer<typeof signupConfirmInputSchema>;
export type TokenInput = z.infer<typeof tokenInputSchema>;

export type ID = z.infer<typeof idSchema>;

export type IdTokenPayload = Expand<
  CognitoIdTokenPayload & {
    email: string; // 添加 email 字段
    picture?: string;
  }
>;
