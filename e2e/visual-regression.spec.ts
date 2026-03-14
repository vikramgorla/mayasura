import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('landing page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations
    
    await expect(page).toHaveScreenshot('landing-page.png', {
      fullPage: false,
      maxDiffPixels: 500,
    });
  });

  test('login page screenshot', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixels: 300,
    });
  });

  test('signup page screenshot', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('signup-page.png', {
      maxDiffPixels: 300,
    });
  });

  test('templates gallery screenshot', async ({ page }) => {
    await page.goto('/templates');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    await expect(page).toHaveScreenshot('templates-gallery.png', {
      fullPage: false,
      maxDiffPixels: 500,
    });
  });
});
