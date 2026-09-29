import { PrismaClient } from '@prisma/client';

// Cache the client on the global object so hot reload in dev does not create a
// new instance (and exhaust DB connections) on every change.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
