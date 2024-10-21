import { z } from 'zod';
import { UpdateUserAndTime, DBKey, organizationName, organizationPriority } from './common.model';

export const organizationInputSchema = z.object({
  name: organizationName,
  priority: organizationPriority,
});

export type OrganizationInput = z.infer<typeof organizationInputSchema>;

export type OrganizationInfo = DBKey & OrganizationInput & UpdateUserAndTime;
