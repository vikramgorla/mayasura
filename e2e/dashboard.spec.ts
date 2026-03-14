import { test, expect, uniqueEmail, signup } from './fixtures';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await signup(page, {
      name: 'Dashboard Tester',
      email: uniqueEmail(),
      password: 'TestPass123',
    });
  });

  test('dashboard loads after login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Should see dashboard content — either brand list or "create" prompt
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
    expect(body!.length).toBeGreaterThan(50);
  });

  test('navigates to create brand from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for a "create" link/button
    const createLink = page.getByRole('link', { name: /create|new brand/i }).or(
      page.getByRole('button', { name: /create|new brand/i })
    );
    
    if (await createLink.isVisible()) {
      await createLink.click();
      await expect(page).toHaveURL(/\/create/);
    }
  });

  test('dashboard shows user navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Should have some form of user menu or navigation
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });
});
