/**
 * Database helper utilities for test environment
 * Provides database reset, cleanup, and connection management
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Singleton Prisma client for tests
let prismaClient: PrismaClient | null = null;

/**
 * Get or create Prisma client instance for tests
 * Configured with appropriate logging for test environment
 */
export function getTestPrismaClient(): PrismaClient {
  if (!prismaClient) {
    const logLevel: Array<'query' | 'error' | 'warn'> = process.env.PRISMA_LOG_QUERIES === 'true' 
      ? ['query', 'error', 'warn']
      : ['error'];

    prismaClient = new PrismaClient({
      log: logLevel as any,
    });
  }
  
  return prismaClient;
}

/**
 * Reset the test database to a clean state
 * Deletes all data from tables while preserving schema
 */
export async function resetTestDatabase(): Promise<void> {
  const prisma = getTestPrismaClient();
  
  try {
    // Delete in correct order to respect foreign key constraints
    // UserToken must be deleted before User due to foreign key
    await prisma.userToken.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    console.error('Error resetting test database:', error);
    throw error;
  }
}

/**
 * Clean up specific test data by user email
 * Useful for cleaning up after specific test cases
 */
export async function cleanupTestUser(email: string): Promise<void> {
  const prisma = getTestPrismaClient();
  
  try {
    // Cascade delete will handle tokens automatically
    await prisma.user.deleteMany({
      where: { email },
    });
  } catch (error) {
    console.error(`Error cleaning up test user ${email}:`, error);
    throw error;
  }
}

/**
 * Clean up specific test token
 */
export async function cleanupTestToken(token: string): Promise<void> {
  const prisma = getTestPrismaClient();
  
  try {
    await prisma.userToken.deleteMany({
      where: { token },
    });
  } catch (error) {
    console.error(`Error cleaning up test token:`, error);
    throw error;
  }
}

/**
 * Disconnect Prisma client
 * Should be called in global teardown
 */
export async function disconnectTestDatabase(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}

/**
 * Run database migrations for test database
 * Ensures test database schema is up to date
 */
export function runTestMigrations(): void {
  try {
    // Run migrations using Prisma CLI
    execSync('npx prisma migrate deploy', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error running test migrations:', error);
    throw error;
  }
}

/**
 * Verify database connection
 * Useful for debugging connection issues
 */
export async function verifyDatabaseConnection(): Promise<boolean> {
  const prisma = getTestPrismaClient();
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Get database connection info (without sensitive data)
 * Useful for debugging
 */
export function getDatabaseInfo(): { host: string; database: string; isTest: boolean } {
  const dbUrl = process.env.DATABASE_URL || '';
  const urlMatch = dbUrl.match(/mysql:\/\/[^@]+@([^:]+):\d+\/(.+)/);
  
  return {
    host: urlMatch?.[1] || 'unknown',
    database: urlMatch?.[2] || 'unknown',
    isTest: process.env.NODE_ENV === 'test',
  };
}

/**
 * Transaction helper for test isolation
 * Wraps test execution in a transaction that can be rolled back
 * Note: This is an advanced pattern - basic cleanup with deleteMany is often sufficient
 */
export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  const prisma = getTestPrismaClient();
  
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as PrismaClient);
  });
}

/**
 * Reset the test database to a clean state
 * Deletes all data from tables while preserving schema
 */
export async function resetDatabase() {
  const prisma = getTestPrismaClient();

  try {
    // Delete in correct order to respect foreign key constraints
    // UserToken must be deleted before User due to foreign key
    await prisma.userToken.deleteMany({});
    await prisma.user.deleteMany({});
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}
