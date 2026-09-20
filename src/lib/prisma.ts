import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function ensureDatabaseInitialized() {
  if (
    process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes('sqlite') &&
    !process.env.DATABASE_URL.startsWith('file:')
  ) {
    return
  }
  try {
    const dbPath = path.resolve(process.cwd(), 'prisma/dev.db')
    if (!fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0) {
      console.log('[AI Studio] Initializing SQLite database...')
      execSync('npx prisma db push --skip-generate && node scripts/seed.mjs', {
        stdio: 'inherit',
        env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || 'file:./prisma/dev.db' },
      })
      console.log('[AI Studio] SQLite database initialized successfully.')
    }
  } catch (err) {
    console.warn('[AI Studio] Auto-initialization warning:', err)
  }
}

function createPrismaClient(): PrismaClient {
  ensureDatabaseInitialized()
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    })
  } catch (err) {
    console.warn('[AI Studio] Database not connected — using mock fallback', err)
    const noOp = {
      findMany: async () => [],
      findFirst: async () => null,
      findUnique: async () => null,
      count: async () => 0,
      aggregate: async () => ({ _sum: { amountInPaise: 0 } }),
      create: async (d: any) => d?.data ?? {},
      update: async (d: any) => d?.data ?? {},
      upsert: async (d: any) => d?.create ?? {},
      delete: async () => ({}),
    }
    return new Proxy({}, { get: () => noOp }) as unknown as PrismaClient
  }
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

