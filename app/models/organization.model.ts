import { z } from 'zod';
import { UpdateUserAndTime, DBKey, organizationName, organizationPriority, pkNullable, pk } from './common.model';

export const organizationInputSchema = z.object({
  name: organizationName,
  priority: organizationPriority,
  parent: pkNullable,
});

export const organizationUpdateInputSchema = z.object({
  pk: pk,
  name: organizationName,
  priority: organizationPriority,
  parent: pkNullable,
});

export const organizationOneSchema = z.object({
  pk: pk,
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
export type OrganizationUpdateInput = z.infer<typeof organizationUpdateInputSchema>;
export type organizationOne = z.infer<typeof organizationOneSchema>;

export type OrganizationInfo = DBKey & OrganizationInput & UpdateUserAndTime;
