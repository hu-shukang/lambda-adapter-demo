import { PrismaClient } from '@prisma/client';

export abstract class CommonService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({ log: ['query', 'error', 'info', 'warn'] });
  }
}
