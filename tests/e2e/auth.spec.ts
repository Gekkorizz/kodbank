import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('Authentication E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Reset any cookies/auth before each test
    await page.context().clearCookies();
  });

  test('should complete full registration flow', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    // Fill registration form
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');

    // Check that password strength meter appears
    await expect(page.locator('.strength-meter')).toBeVisible();

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for success modal
    await expect(page.locator('text=Account Created Successfully')).toBeVisible({
      timeout: 5000,
    });

    // Success modal should auto-redirect to login after 2.5s
    await page.waitForURL('**/login', { timeout: 5000 });
    expect(page.url()).toContain('/login');
  });

  test('should show validation errors for weak password', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    await page.fill('input[name="confirmPassword"]', 'weak');

    // Blur the field to trigger validation
    await page.locator('input[name="password"]').blur();

    // Should show error message
    await expect(page.locator('text=/uppercase|lowercase|number|special|characters/i')).toBeVisible();
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'Different123!');

    await page.locator('input[name="confirmPassword"]').blur();

    // Should show password mismatch error
    await expect(page.locator('text=/must match/i')).toBeVisible();
  });

  test('should complete full login flow', async ({ page }) => {
    // First register a user
    const email = `user-${Date.now()}@example.com`;
    await page.goto(`${BASE_URL}/register`);

    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');

    await page.click('button[type="submit"]');
    await page.waitForURL('**/login', { timeout: 5000 });

    // Now test login
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard', { timeout: 5000 });
    expect(page.url()).toContain('/dashboard');
  });

  test('should show error for incorrect password', async ({ page }) => {
    const email = `existing-${Date.now()}@example.com`;
    
    // Register first
    await page.goto(`${BASE_URL}/register`);
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'TestPass123!');
    await page.fill('input[name="confirmPassword"]', 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/login', { timeout: 5000 });

    // Try login with wrong password
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'WrongPass123!');
    await page.click('button[type="submit"]');

    // Should show error toast
    await expect(page.locator('text=/invalid|incorrect|wrong/i')).toBeVisible();
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    const passwordInput = page.locator('input[name="password"]');

    // Initially type is password
    expect(await passwordInput.getAttribute('type')).toBe('password');

    // Click toggle button
    await page.click('button[aria-label*="password" i]');

    // Type should change to text
    expect(await passwordInput.getAttribute('type')).toBe('text');

    // Click again to hide
    await page.click('button[aria-label*="password" i]');
    expect(await passwordInput.getAttribute('type')).toBe('password');
  });
});
