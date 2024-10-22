import { z } from 'zod';

export type DBKey = { pk: string; sk: string };

export type UpdateUserAndTime = { updateUser: string; updateTime: string };

/* zod schema define */
export const username = z.string({ required_error: '必須項目です' });
export const email = z.string({ required_error: '必須項目です' }).email({ message: 'メール形式不正' });
export const password = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
export const rePassword = z
  .string({ required_error: '必須項目です' })
  .min(8, '8文字以上は必須')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, '大文字、小文字のアルファベットと数字は必須');
export const confirmationCode = z.string().regex(/^\d{6}$/, {
  message: '6桁数字は必須',
});
export const organizationName = z.string({ required_error: '必須項目です' }).min(1, '必須項目です');
export const organizationPriority = z.preprocess(
  (val) => {
    if (typeof val === 'string') {
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? val : parsed;
    }
    return val;
  },
  z.number({ required_error: '必須項目です' }).int().min(0, '0以上の正整数にしてください'),
);
export const pk = z.string().uuid();

export const pkNullable = z
  .string()
  .refine((val) => val === '' || z.string().uuid().safeParse(val).success, {
    message: '必须是空字符串或有效的 UUID',
  })
  .nullable();
