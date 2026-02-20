/**
 * Setup verification test
 * Ensures the testing infrastructure is properly configured
 */

import { describe, it, expect } from 'vitest';
import { generateTestEmail, generateTestPassword, generateMockToken } from './helpers/test-utils';

describe('Testing Infrastructure Setup', () => {
  it('should have vitest configured correctly', () => {
    expect(true).toBe(true);
  });

  it('should generate unique test emails', () => {
    const email1 = generateTestEmail();
    const email2 = generateTestEmail();
    
    expect(email1).toMatch(/^test-[a-f0-9]+@example\.com$/);
    expect(email2).toMatch(/^test-[a-f0-9]+@example\.com$/);
    expect(email1).not.toBe(email2);
  });

  it('should generate valid test passwords', () => {
    const password = generateTestPassword();
    
    expect(password).toMatch(/^TestPass[a-f0-9]+!$/);
    expect(password.length).toBeGreaterThanOrEqual(13);
  });

  it('should generate mock tokens with correct format', () => {
    const token = generateMockToken();
    
    expect(token).toMatch(/^[a-f0-9]{96}$/);
    expect(token.length).toBe(96);
  });

  it('should have fast-check available for property-based testing', async () => {
    const fc = await import('fast-check');
    expect(fc).toBeDefined();
    expect(fc.string).toBeDefined();
  });

  it('should have bcrypt available for password testing', async () => {
    const bcrypt = await import('bcrypt');
    expect(bcrypt).toBeDefined();
    expect(bcrypt.hash).toBeDefined();
    expect(bcrypt.compare).toBeDefined();
  });
});
