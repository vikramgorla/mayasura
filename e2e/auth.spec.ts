import { test, expect, uniqueEmail, TEST_USER } from './fixtures';

test.describe('Authentication', () => {
  test('signup with new account', async ({ page }) => {
    const email = uniqueEmail();
    await page.goto('/signup');

    await page.getByPlaceholder(/name/i).first().fill('E2E Test User');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('TestPass123');
    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Should redirect to dashboard or create page
    await page.waitForURL(/\/(dashboard|create)/);
    await expect(page).toHaveURL(/\/(dashboard|create)/);
  });

  test('login with valid credentials', async ({ page }) => {
    // First signup
    const email = uniqueEmail();
    await page.goto('/signup');
    await page.getByPlaceholder(/name/i).first().fill('Login Test User');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('TestPass123');
    await page.getByRole('button', { name: /sign up|create account/i }).click();
    await page.waitForURL(/\/(dashboard|create)/);

    // Logout
    await page.goto('/login');

    // Login
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('TestPass123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();
    await page.waitForURL(/\/(dashboard|create)/);
    await expect(page).toHaveURL(/\/(dashboard|create)/);
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder(/email/i).fill('nonexistent@test.com');
    await page.getByPlaceholder(/password/i).fill('WrongPass123');
    await page.getByRole('button', { name: /log in|sign in/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid|incorrect|wrong/i)).toBeVisible({ timeout: 5000 });
  });

  test('signup validation - weak password', async ({ page }) => {
    await page.goto('/signup');

    await page.getByPlaceholder(/name/i).first().fill('Test');
    await page.getByPlaceholder(/email/i).fill(uniqueEmail());
    await page.getByPlaceholder(/password/i).fill('weak');
    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Should show password validation error
    await expect(page.getByText(/password|8 characters|uppercase|number/i)).toBeVisible({ timeout: 5000 });
  });

  test('signup validation - duplicate email', async ({ page }) => {
    const email = uniqueEmail();

    // First signup
    await page.goto('/signup');
    await page.getByPlaceholder(/name/i).first().fill('First User');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('TestPass123');
    await page.getByRole('button', { name: /sign up|create account/i }).click();
    await page.waitForURL(/\/(dashboard|create)/);

    // Try to signup again with same email
    await page.goto('/signup');
    await page.getByPlaceholder(/name/i).first().fill('Second User');
    await page.getByPlaceholder(/email/i).fill(email);
    await page.getByPlaceholder(/password/i).fill('TestPass123');
    await page.getByRole('button', { name: /sign up|create account/i }).click();

    // Should show duplicate error
    await expect(page.getByText(/already exists|taken|duplicate/i)).toBeVisible({ timeout: 5000 });
  });

  test('redirect unauthenticated users from dashboard', async ({ page }) => {
    // Clear cookies to ensure not logged in
    await page.context().clearCookies();
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
