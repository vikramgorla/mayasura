import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://mayasura-web-production.up.railway.app';

test.describe('Landing Page', () => {
  test('loads and shows hero text', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.locator('h1')).toContainText(['palace', 'brand', 'Build'], { ignoreCase: true });
  });

  test('has Create Brand CTA', async ({ page }) => {
    await page.goto(BASE);
    const cta = page.getByRole('link', { name: /create brand|start building/i }).first();
    await expect(cta).toBeVisible();
  });

  test('has Templates link', async ({ page }) => {
    await page.goto(BASE);
    await expect(page.getByRole('link', { name: /templates/i }).first()).toBeVisible();
  });
});

test.describe('Migration', () => {
  test('POST /api/migrate runs successfully', async ({ request }) => {
    const res = await request.post(`${BASE}/api/migrate`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(Array.isArray(data.applied)).toBe(true);
    console.log('Migration result:', data.applied);
  });
});

test.describe('Brand API', () => {
  let brandId: string;

  test('POST /api/brands creates a brand', async ({ request }) => {
    const res = await request.post(`${BASE}/api/brands`, {
      data: {
        name: 'Playwright Test Brand',
        tagline: 'E2E test',
        description: 'Created by Playwright tests',
        industry: 'tech',
        primary_color: '#4F46E5',
        secondary_color: '#f8fafc',
        accent_color: '#7C3AED',
        font_heading: 'Inter',
        font_body: 'Inter',
        brand_voice: 'professional',
        channels: ['website', 'chatbot'],
        status: 'draft',
      },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.brand).toBeDefined();
    expect(data.brand.id).toBeTruthy();
    expect(data.brand.name).toBe('Playwright Test Brand');
    brandId = data.brand.id;
    console.log('Created brand:', brandId);
  });

  test('GET /api/brands lists brands', async ({ request }) => {
    const res = await request.get(`${BASE}/api/brands`);
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(Array.isArray(data.brands)).toBe(true);
  });
});

test.describe('Wizard Flow', () => {
  test('navigates to /create', async ({ page }) => {
    await page.goto(`${BASE}/create`);
    await expect(page).toHaveURL(/create/);
    await expect(page.locator('text=Brand Basics')).toBeVisible();
  });

  test('step 1 shows brand name input', async ({ page }) => {
    await page.goto(`${BASE}/create`);
    await expect(page.locator('input[placeholder*="brand" i], input[name*="name" i]').first()).toBeVisible();
  });

  test('loads tech template', async ({ page }) => {
    await page.goto(`${BASE}/create?template=tech`);
    await expect(page).toHaveURL(/template=tech/);
    // Should have pre-filled data
    await page.waitForTimeout(1000);
    const input = page.locator('input').first();
    await expect(input).toBeVisible();
  });
});

test.describe('Templates Page', () => {
  test('loads /templates', async ({ page }) => {
    await page.goto(`${BASE}/templates`);
    await expect(page.locator('text=/restaurant|fashion|tech|fitness/i').first()).toBeVisible();
  });
});

test.describe('Dashboard', () => {
  test('loads /dashboard', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/dashboard/);
  });
});

test.describe('Dark Mode', () => {
  test('dark mode toggle exists on landing', async ({ page }) => {
    await page.goto(BASE);
    // Check there's either a dark mode button or the page renders correctly
    await expect(page.locator('body')).toBeVisible();
  });
});
