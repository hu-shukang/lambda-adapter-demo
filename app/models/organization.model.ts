import { z } from 'zod';
import { UpdateUserAndTime, DBKey, organizationName, organizationPriority, pkNullable } from './common.model';

export const organizationInputSchema = z.object({
  name: organizationName,
  priority: organizationPriority,
  parent: pkNullable,
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;

export type OrganizationInfo = DBKey & OrganizationInput & UpdateUserAndTime;
