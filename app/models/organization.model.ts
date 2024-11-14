import { z } from 'zod';
import { UpdateUserAndTime, DBKey, organizationName, pkNullable, pk, Expand } from './common.model';

export const organizationInputSchema = z.object({
  name: organizationName,
  parent: pkNullable,
});

export const organizationOneSchema = z.object({
  pk: pk,
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
export type OrganizationOne = z.infer<typeof organizationOneSchema>;

export type OrganizationInfo = Expand<DBKey & OrganizationInput & UpdateUserAndTime>;
