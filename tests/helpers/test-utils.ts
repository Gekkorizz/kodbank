/**
 * Test utility functions and helpers
 * Provides common functionality for all test suites
 */

import { randomBytes } from 'crypto';

/**
 * Generate a random email for testing
 */
export function generateTestEmail(): string {
  const randomString = randomBytes(8).toString('hex');
  return `test-${randomString}@example.com`;
}

/**
 * Generate a random password for testing
 */
export function generateTestPassword(): string {
  return `TestPass${randomBytes(4).toString('hex')}!`;
}

/**
 * Generate a random full name for testing
 */
export function generateTestFullName(): string {
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
}

/**
 * Wait for a specified number of milliseconds
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a mock token (96-character hex string)
 */
export function generateMockToken(): string {
  return randomBytes(48).toString('hex');
}

/**
 * Create a date in the future
 */
export function futureDate(hoursFromNow: number): Date {
  return new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
}

/**
 * Create a date in the past
 */
export function pastDate(hoursAgo: number): Date {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
}
