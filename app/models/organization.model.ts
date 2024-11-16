import { z } from 'zod';
import { UpdateUserAndTime, description, organizationName, pkNullable, pk, Expand } from './common.model';

export const organizationInputSchema = z.object({
  name: organizationName,
  parentId: pkNullable,
  description: description,
});

export const organizationOneSchema = z.object({
  pk: pk,
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;
export type OrganizationOne = z.infer<typeof organizationOneSchema>;

export type OrganizationInfo = Expand<{ id: string } & OrganizationInput & UpdateUserAndTime>;
