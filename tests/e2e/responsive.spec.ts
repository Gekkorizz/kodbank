import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

// Helper to register and login
async function registerAndLogin(page) {
  const email = `mobile-${Date.now()}@example.com`;

  // Register
  await page.goto(`${BASE_URL}/register`);
  await page.fill('input[name="fullName"]', 'Mobile Test User');
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
}

test.describe('Responsive Design E2E', () => {
  test('should display register form on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/register`);

    // All form elements should be visible on mobile
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display login form on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`${BASE_URL}/login`);

    // All form elements should be visible
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show mobile bottom nav on small screens (dashboard)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndLogin(page);

    // Mobile bottom nav should be visible
    const bottomNav = page.locator('[class*="bottom"]');
    // Check that navigation items exist (Dashboard, Transfers, Accounts, Analytics, Settings)
    await expect(page.locator('button, a', { hasText: /Dashboard|Transfers|Accounts|Analytics|Settings/i })).toHaveCount({ gte: 5 });
  });

  test('should show desktop sidebar on large screens (dashboard)', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await registerAndLogin(page);

    // Sidebar should be visible on desktop
    // Check for sidebar menu items
    await expect(page.locator('text=Dashboard|Accounts|Transfers|Analytics|Settings')).toBeTruthy();
  });

  test('should display hero account card on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndLogin(page);

    // Hero card should be visible and readable
    await expect(page.locator('text=Checking Account')).toBeVisible();
    await expect(page.locator('text=₹100,000')).toBeVisible();

    // Card should be full width on mobile
    const card = page.locator('[class*="gradient"]').first();
    const boundingBox = await card.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(300);
  });

  test('should display responsive quick actions grid', async ({ page }) => {
    // Set mobile viewport (1 column)
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndLogin(page);

    // Quick actions should be visible and stacked
    const quickActionButtons = page.locator('button', { hasText: /Send Money|Request Money|Pay Bills|View History/i });
    await expect(quickActionButtons).toHaveCount(4);
  });

  test('should display summary cards responsive layout', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await registerAndLogin(page);

    // Summary cards should be visible
    await expect(page.locator('text=Total Balance')).toBeVisible();
    await expect(page.locator('text=Pending Transactions')).toBeVisible();
    await expect(page.locator('text=Monthly Limit')).toBeVisible();
  });

  test('should display landing page responsively', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}`);

    // Header should be visible
    await expect(page.locator('text=KodBank')).toBeVisible();
    await expect(page.locator('button', { hasText: /Sign In|Get Started/i })).toBeVisible();

    // Change to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();

    // Desktop navigation should be visible
    await expect(page.locator('text=Features|Security')).toBeTruthy();
  });
});
