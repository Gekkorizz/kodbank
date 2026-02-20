import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Helper to register and login
async function registerAndLogin(page) {
  const email = `user-${Date.now()}@example.com`;

  // Register
  await page.goto(`${BASE_URL}/register`);
  await page.fill('input[name="fullName"]', 'Dashboard Test User');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'TestPass123!');
  await page.fill('input[name="confirmPassword"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/login', { timeout: 5000 });

  // Login
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 5000 });

  return email;
}

test.describe('Dashboard E2E', () => {
  test('should display dashboard after login', async ({ page }) => {
    await registerAndLogin(page);

    // Check that main dashboard elements are visible
    await expect(page.locator('text=Dashboard')).toBeVisible();
    await expect(page.locator('text=Quick Actions')).toBeVisible();
    await expect(page.locator('text=Total Balance')).toBeVisible();
  });

  test('should display account card with balance', async ({ page }) => {
    await registerAndLogin(page);

    // Check hero account card
    await expect(page.locator('text=Checking Account')).toBeVisible();
    await expect(page.locator('text=₹100,000')).toBeVisible();
  });

  test('should display quick action buttons', async ({ page }) => {
    await registerAndLogin(page);

    // Check all quick action buttons
    await expect(page.locator('button', { hasText: /Send Money/i })).toBeVisible();
    await expect(page.locator('button', { hasText: /Request Money/i })).toBeVisible();
    await expect(page.locator('button', { hasText: /Pay Bills/i })).toBeVisible();
  });

  test('should display summary cards', async ({ page }) => {
    await registerAndLogin(page);

    // Check summary cards
    await expect(page.locator('text=Total Balance')).toBeVisible();
    await expect(page.locator('text=Pending Transactions')).toBeVisible();
    await expect(page.locator('text=Monthly Limit')).toBeVisible();
  });

  test('should display recent transactions', async ({ page }) => {
    await registerAndLogin(page);

    // Check recent transactions list
    await expect(page.locator('text=Recent Transactions')).toBeVisible();
    // Should have at least one transaction
    await expect(page.locator('td')).toHaveCount({ gte: 4 });
  });

  test('should handle logout', async ({ page }) => {
    await registerAndLogin(page);

    // Find and click logout button
    const logoutButton = page.locator('button', { hasText: /Logout/i }).first();
    await logoutButton.click();

    // Should redirect to home/login
    await page.waitForURL('**/', { timeout: 5000 });
    expect(page.url()).not.toContain('/dashboard');
  });

  test('should redirect to login if not authenticated', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto(`${BASE_URL}/dashboard`);

    // Should redirect to login or home
    expect(page.url()).not.toContain('/dashboard');
  });
});
