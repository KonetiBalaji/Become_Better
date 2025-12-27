import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Prisma Accelerate URL if available (for production), otherwise use DATABASE_URL
const databaseUrl = process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL or PRISMA_ACCELERATE_URL environment variable is required')
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

