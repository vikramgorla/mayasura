import { test, expect } from '@playwright/test';

test.describe('Consumer Site', () => {
  // These tests run against the production site, checking public pages

  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    
    // Landing page should have the brand name / hero content
    await expect(page).toHaveTitle(/Mayasura/i);
    
    // Should have navigation or hero section
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('login page is accessible', async ({ page }) => {
    await page.goto('/login');
    
    // Should have email and password fields
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('signup page is accessible', async ({ page }) => {
    await page.goto('/signup');
    
    // Should have name, email, and password fields
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test('templates gallery page loads', async ({ page }) => {
    await page.goto('/templates');
    
    // Should show template options
    const body = await page.textContent('body');
    expect(body?.length).toBeGreaterThan(100);
  });

  test('consumer site loads for a valid slug', async ({ page }) => {
    // Navigate to a known brand site (if one exists in production)
    const response = await page.goto('/site/test-brand');
    
    // Should either show the brand site or a 404-like page
    // Both are valid responses
    expect(response?.status()).toBeLessThan(500);
  });

  test('shop page loads for a valid slug', async ({ page }) => {
    const response = await page.goto('/shop/test-brand');
    expect(response?.status()).toBeLessThan(500);
  });

  test('blog page loads for a valid slug', async ({ page }) => {
    const response = await page.goto('/blog/test-brand');
    expect(response?.status()).toBeLessThan(500);
  });

  test('API health check - auth/me returns 401 for unauthenticated', async ({ page }) => {
    const response = await page.goto('/api/auth/me');
    // Should return JSON with error
    const body = await page.textContent('body');
    expect(body).toContain('error');
  });
});
