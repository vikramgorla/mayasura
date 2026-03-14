import { test as base, expect, type Page } from '@playwright/test';

// ─── Test Data ───────────────────────────────────────────────────

export const TEST_USER = {
  name: 'Test User',
  email: `test-${Date.now()}@mayasura.dev`,
  password: 'TestPass123',
};

export const TEST_BRAND = {
  name: 'Test Brand E2E',
  tagline: 'Testing makes it better',
  industry: 'Technology / SaaS',
  description: 'An E2E test brand for automated testing.',
};

// ─── Helper Functions ────────────────────────────────────────────

/**
 * Sign up a new user. Returns the test email used.
 */
export async function signup(page: Page, user = TEST_USER): Promise<string> {
  await page.goto('/signup');
  await page.getByPlaceholder(/name/i).first().fill(user.name);
  await page.getByPlaceholder(/email/i).fill(user.email);
  await page.getByPlaceholder(/password/i).fill(user.password);
  await page.getByRole('button', { name: /sign up|create account/i }).click();
  await page.waitForURL(/\/(dashboard|create)/);
  return user.email;
}

/**
 * Log in with existing credentials.
 */
export async function login(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/login');
  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole('button', { name: /log in|sign in/i }).click();
  await page.waitForURL(/\/(dashboard|create)/);
}

/**
 * Navigate to the brand creation wizard and complete basics step.
 */
export async function startBrandCreation(page: Page, brand = TEST_BRAND): Promise<void> {
  await page.goto('/create');
  
  // Step 1: Basics
  const industryInput = page.getByPlaceholder(/Sustainable Fashion/i);
  await industryInput.fill(brand.industry);
  
  const nameInput = page.getByPlaceholder(/brand name/i);
  await nameInput.fill(brand.name);
  
  const taglineInput = page.getByPlaceholder(/tagline/i);
  await taglineInput.fill(brand.tagline);
  
  const descInput = page.getByPlaceholder(/Tell us about/i);
  await descInput.fill(brand.description);
}

/**
 * Generate a unique test email.
 */
export function uniqueEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@mayasura.dev`;
}

// ─── Extended Test Fixture ───────────────────────────────────────

type TestFixtures = {
  authenticatedPage: Page;
};

/**
 * Extended test that provides an authenticated page.
 */
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const email = uniqueEmail();
    await signup(page, {
      ...TEST_USER,
      email,
    });
    await use(page);
  },
});

export { expect };
