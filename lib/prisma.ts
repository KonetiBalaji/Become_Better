import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Prisma Accelerate URL if available (for production), otherwise use DATABASE_URL
const databaseUrl = process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL

export const prisma = globalForPrisma.prisma ?? new PrismaClient(
  databaseUrl
    ? {
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      }
    : undefined
)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

