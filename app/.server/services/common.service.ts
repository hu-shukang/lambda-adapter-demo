import { PrismaClient } from '@prisma/client';

export abstract class CommonService {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
}
