import { PrismaClient } from '@prisma/client';

export function hasDatabaseEnv() {
  return Boolean(process.env.DATABASE_URL);
}

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.hostname.endsWith('.pooler.supabase.com')) {
      url.port = '6543';
      url.searchParams.set('pgbouncer', 'true');
      url.searchParams.set('connection_limit', '1');
      url.searchParams.set('pool_timeout', '20');
    }
    return url.toString();
  } catch {
    return value;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const log: Array<'error' | 'warn'> = process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'];
  const databaseUrl = getDatabaseUrl();

  if (databaseUrl) {
    return new PrismaClient({
      datasources: { db: { url: databaseUrl } },
      log,
    });
  }

  return new PrismaClient({ log });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
