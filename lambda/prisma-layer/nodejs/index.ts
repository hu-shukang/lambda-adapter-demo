import { PrismaClient, Organization, User, UserOrganization } from '@prisma/client';

export const prisma = new PrismaClient();
export { Organization, User, UserOrganization };
