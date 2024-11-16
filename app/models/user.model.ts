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
  organizationFilter,
  password,
  refreshToken,
  rePassword,
  username,
  Expand,
  picture,
  employeeNo,
  organization,
  position,
} from './common.model';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { User } from '@prisma/client';

export const userOrganizationInputSchema = z.object({ organization, position });

export const userInfoInputSchema = z.object({
  email: email,
  employeeNo: employeeNo,
  name: name,
  status: status,
  enterDay: z.string().datetime(),
  organizations: z.array(userOrganizationInputSchema).min(1),
});

export const userInfoUpdateInputSchema = z.object({
  id: employeeNo,
  email: email,
  employeeNo: employeeNo,
  name: name,
  status: status,
  enterDay: z.string().datetime(),
  organizations: z.array(userOrganizationInputSchema).min(1),
});

export const userQueryInputSchema = z.object({
  organization: organizationFilter,
  status: statusFilter,
  name: nameFilter,
});

export const idSchema = z.object({
  id: z.string(),
});

export const employeeNoInputSchema = z.object({
  id: employeeNo,
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

export const usernameInputSchema = z.object({
  username: username,
});

export const passwordInputSchema = z
  .object({
    password: password,
    rePassword: rePassword,
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'パスワード不一致',
    path: ['rePassword'],
  });

export const confirmationCodeInputSchema = z.object({
  confirmationCode: confirmationCode,
});

export const tokenInputSchema = z.object({
  idToken: idToken,
  refreshToken: refreshToken,
});

export const accountUpdateInputSchema = z.object({
  name: name,
  picture: picture,
});

export type UserOrganizationInput = z.infer<typeof userOrganizationInputSchema>;
export type UserInfoInput = z.infer<typeof userInfoInputSchema>;
export type UserInfoUpdateInput = z.infer<typeof userInfoUpdateInputSchema>;
export type UserView = Expand<User & { picture?: string }>;

export type UserQueryInput = z.infer<typeof userQueryInputSchema>;
export type UserEntity = Expand<DBKey & UserInfoInput>;
export type SigninInput = z.infer<typeof signinInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type SignupConfirmInput = z.infer<typeof signupConfirmInputSchema>;
export type UsernameInput = z.infer<typeof usernameInputSchema>;
export type PasswordInput = z.infer<typeof passwordInputSchema>;
export type ConfirmationCodeInput = z.infer<typeof confirmationCodeInputSchema>;
export type TokenInput = z.infer<typeof tokenInputSchema>;
export type AccountUpdateInput = z.infer<typeof accountUpdateInputSchema>;
export type EmployeeNoInput = z.infer<typeof employeeNoInputSchema>;

export type ID = z.infer<typeof idSchema>;

export type IdTokenPayload = Expand<
  CognitoIdTokenPayload & {
    employeeNo: string;
    email: string;
    picture?: string;
  }
>;
