import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserFactory {
  static async build(overrides = {}) {
    // Password must meet policy: 8+ chars, uppercase, lowercase, number, special char
    const password = await bcrypt.hash('TestPass123!', 10);
    return {
      email: 'test@example.com',
      fullName: 'Test User',
      passwordHash: password,
      ...overrides,
    };
  }

  static async create(overrides = {}) {
    const user = await this.build(overrides);
    return prisma.user.create({ data: user });
  }
}

export class TokenFactory {
  static async build(overrides = {}) {
    return {
      token: 'sample_token',
      type: 'AUTH',
      revoked: false,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      ...overrides,
    };
  }

  static async create(overrides = {}) {
    const token = await this.build(overrides);
    return prisma.token.create({ data: token });
  }
}