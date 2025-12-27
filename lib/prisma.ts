import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Prisma Accelerate URL if available (for production), otherwise use DATABASE_URL
const databaseUrl = process.env.PRISMA_ACCELERATE_URL || process.env.DATABASE_URL

// Create Prisma Client with proper error handling
const createPrismaClient = () => {
  try {
    if (databaseUrl) {
      return new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    }
    // Fallback to default PrismaClient which will use DATABASE_URL from env
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to create Prisma Client:', error)
    throw error
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Ensure singleton in production
if (process.env.NODE_ENV === 'production') {
  globalForPrisma.prisma = prisma
} else {
  globalForPrisma.prisma = prisma
}

