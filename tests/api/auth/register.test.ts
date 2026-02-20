import { resetDatabase } from '../../helpers/database';
import { POST as handler } from '../../../src/app/api/auth/register/route'; // Next-style route handler (Web Request -> Response)
import { describe, it, beforeEach, expect } from 'vitest';

beforeEach(async () => {
  await resetDatabase();
});

async function postToRegister(body: Record<string, any>) {
  const req = new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  // `handler` should be an async function that accepts a Request and returns a Response
  const res = await (handler as unknown as (req: Request) => Promise<Response>)(req);
  const json = await res.json().catch(() => null);
  return { status: res.status, body: json };
}

describe('User Registration API', () => {
  it('should return 201 with user details for valid registration', async () => {
    const response = await postToRegister({
      email: 'test@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      fullName: 'Test User',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('should return 400 for missing fields', async () => {
    const response = await postToRegister({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('should return 400 for weak password', async () => {
    const response = await postToRegister({
      email: 'test@example.com',
      password: 'weak',
      confirmPassword: 'weak',
      fullName: 'Test User',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/password|uppercase|lowercase|number|special/i);
  });

  it('should return 400 for mismatched passwords', async () => {
    const response = await postToRegister({
      email: 'test@example.com',
      password: 'TestPass123!',
      confirmPassword: 'Different123!',
      fullName: 'Test User',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/match/i);
  });

  it('should return 409 for duplicate email', async () => {
    await postToRegister({
      email: 'test@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      fullName: 'Test User',
    });

    const response = await postToRegister({
      email: 'test@example.com',
      password: 'TestPass123!',
      confirmPassword: 'TestPass123!',
      fullName: 'Test User',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error');
  });
});