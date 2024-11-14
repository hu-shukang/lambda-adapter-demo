import { PrismaClient, Post, User } from '@prisma/client';

export const prisma = new PrismaClient();
export { Post, User };
