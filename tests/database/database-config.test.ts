/**
 * Database Configuration Tests
 * Validates that the test database is properly configured and accessible
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.8
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getTestPrismaClient,
  resetTestDatabase,
  verifyDatabaseConnection,
  getDatabaseInfo,
} from '../helpers/database';

describe('Database Configuration', () => {
  const prisma = getTestPrismaClient();

  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe('Database Connection', () => {
    it('should connect to test database successfully', async () => {
      const isConnected = await verifyDatabaseConnection();
      expect(isConnected).toBe(true);
    });

    it('should use test database (not production)', () => {
      const dbInfo = getDatabaseInfo();
      expect(dbInfo.database).toContain('test');
      expect(dbInfo.isTest).toBe(true);
    });

    it('should have correct environment variables', () => {
      expect(process.env.NODE_ENV).toBe('test');
      expect(process.env.DATABASE_URL).toBeDefined();
      expect(process.env.DATABASE_URL).toContain('test');
    });
  });

  describe('Database Operations', () => {
    it('should create a user with UUID', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
          fullName: 'Test User',
        },
      });

      expect(user.id).toBeDefined();
      expect(user.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should auto-generate createdAt timestamp', async () => {
      const beforeCreate = new Date();
      
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const afterCreate = new Date();

      expect(user.createdAt).toBeDefined();
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('should auto-update updatedAt timestamp', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { fullName: 'Updated Name' },
      });

      expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should enforce unique email constraint', async () => {
      await prisma.user.create({
        data: {
          email: 'duplicate@example.com',
          passwordHash: 'hashed_password',
        },
      });

      await expect(
        prisma.user.create({
          data: {
            email: 'duplicate@example.com',
            passwordHash: 'another_hash',
          },
        })
      ).rejects.toThrow();
    });

    it('should handle database errors gracefully', async () => {
      // Try to create user with invalid data (missing required field)
      await expect(
        prisma.user.create({
          data: {
            email: 'test@example.com',
            // Missing passwordHash - should fail
          } as any,
        })
      ).rejects.toThrow();
    });
  });

  describe('Database Reset', () => {
    it('should clear all users from database', async () => {
      // Create test data
      await prisma.user.create({
        data: {
          email: 'user1@example.com',
          passwordHash: 'hash1',
        },
      });
      await prisma.user.create({
        data: {
          email: 'user2@example.com',
          passwordHash: 'hash2',
        },
      });

      // Verify data exists
      const beforeReset = await prisma.user.count();
      expect(beforeReset).toBe(2);

      // Reset database
      await resetTestDatabase();

      // Verify data is cleared
      const afterReset = await prisma.user.count();
      expect(afterReset).toBe(0);
    });

    it('should clear all tokens from database', async () => {
      // Create user and tokens
      const user = await prisma.user.create({
        data: {
          email: 'user@example.com',
          passwordHash: 'hash',
        },
      });

      await prisma.userToken.create({
        data: {
          userId: user.id,
          token: 'token1',
          type: 'AUTH',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // Verify data exists
      const beforeReset = await prisma.userToken.count();
      expect(beforeReset).toBe(1);

      // Reset database
      await resetTestDatabase();

      // Verify data is cleared
      const afterReset = await prisma.userToken.count();
      expect(afterReset).toBe(0);
    });
  });

  describe('Prisma Field Mapping', () => {
    it('should map camelCase to snake_case correctly', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
          fullName: 'Test User',
        },
      });

      // Verify camelCase fields work
      expect(user.passwordHash).toBe('hashed_password');
      expect(user.fullName).toBe('Test User');
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();

      // Verify we can query using camelCase
      const foundUser = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      });

      expect(foundUser?.passwordHash).toBe('hashed_password');
      expect(foundUser?.fullName).toBe('Test User');
    });

    it('should map token fields correctly', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashed_password',
        },
      });

      const token = await prisma.userToken.create({
        data: {
          userId: user.id,
          token: 'test_token_123',
          type: 'AUTH',
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      // Verify camelCase fields work
      expect(token.userId).toBe(user.id);
      expect(token.expiresAt).toBeDefined();
      expect(token.createdAt).toBeDefined();
    });
  });
});
