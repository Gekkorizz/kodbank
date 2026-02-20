import { resetDatabase } from '../../helpers/database';
import { UserFactory } from '../../helpers/factories';
import { POST as loginHandler } from '../../../src/app/api/auth/login/route';
import { describe, it, beforeEach, expect } from 'vitest';

beforeEach(async () => {
  await resetDatabase();
});

async function postToLogin(body: Record<string, any>) {
  const req = new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const res = await (loginHandler as unknown as (req: Request) => Promise<Response>)(req);
  const json = await res.json().catch(() => null);
  return { status: res.status, body: json, headers: res.headers };
}

describe('User Login API', () => {
  it('should return 200 with user details for valid login', async () => {
    // First create a user
    const user = await UserFactory.create({
      email: 'user@example.com',
    });

    const response = await postToLogin({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', user.id);
    expect(response.body).toHaveProperty('email', 'user@example.com');
    // Token should NOT be in the response body (using httpOnly cookie instead)
    expect(response.body).not.toHaveProperty('token');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('should return 400 for invalid email', async () => {
    const response = await postToLogin({
      email: 'nonexistent@example.com',
      password: 'TestPass123!',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 401 for incorrect password', async () => {
    await UserFactory.create({
      email: 'user@example.com',
    });

    const response = await postToLogin({
      email: 'user@example.com',
      password: 'WrongPassword123!',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for missing fields', async () => {
    const response = await postToLogin({
      email: 'user@example.com',
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should set httpOnly cookie on successful login', async () => {
    await UserFactory.create({
      email: 'user@example.com',
    });

    const response = await postToLogin({
      email: 'user@example.com',
      password: 'TestPass123!',
    });

    expect(response.status).toBe(200);
    // Check that Set-Cookie header exists
    const setCookieHeader = response.headers.get('set-cookie');
    expect(setCookieHeader).toBeTruthy();
    expect(setCookieHeader).toMatch(/httpOnly/i);
  });
});
