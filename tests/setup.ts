/**
 * Global test setup file
 * Runs before all tests to configure the test environment
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import dotenv from 'dotenv';
import path from 'path';
import {
  getTestPrismaClient,
  resetTestDatabase,
  disconnectTestDatabase,
  verifyDatabaseConnection,
  getDatabaseInfo,
} from './helpers/database';

// Load test environment variables from .env.test
dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

// Set test environment variables
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'test',
  writable: true,
  configurable: true,
});

// Global setup - runs once before all tests
beforeAll(async () => {
  console.log('🧪 Initializing test environment...');
  
  // Verify we're using the test database
  const dbInfo = getDatabaseInfo();
  console.log(`📊 Database: ${dbInfo.database} on ${dbInfo.host}`);
  
  if (!dbInfo.database.includes('test')) {
    throw new Error(
      '⚠️  SAFETY CHECK FAILED: Not using a test database! ' +
      'DATABASE_URL must contain "test" in the database name. ' +
      `Current database: ${dbInfo.database}`
    );
  }
  
  // Verify database connection
  const isConnected = await verifyDatabaseConnection();
  if (!isConnected) {
    throw new Error('❌ Failed to connect to test database');
  }
  
  console.log('✅ Database connection verified');
  
  // Reset database to clean state before running tests
  await resetTestDatabase();
  console.log('✅ Test database reset complete');
  
  console.log('🧪 Test environment initialized');
});

// Global teardown - runs once after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Disconnect from database
  await disconnectTestDatabase();
  
  console.log('✅ Test environment cleaned up');
});

// Setup before each test
beforeEach(async () => {
  // Test isolation setup will be added per test suite
  // Individual test suites can add their own beforeEach hooks
  const prisma = getTestPrismaClient();
  await prisma.$executeRawUnsafe('START TRANSACTION');
});

// Cleanup after each test
afterEach(async () => {
  // Test isolation cleanup will be added per test suite
  // Individual test suites can add their own afterEach hooks
  const prisma = getTestPrismaClient();
  await prisma.$executeRawUnsafe('ROLLBACK');
});
