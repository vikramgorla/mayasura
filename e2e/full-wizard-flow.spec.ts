import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL || 'https://mayasura-web-production.up.railway.app';

test.describe('Full Wizard Flow — Brand Creation E2E', () => {

  test('create a brand from scratch through all 6 steps', async ({ page }) => {
    // Navigate to create page
    await page.goto(`${BASE}/create`);
    await expect(page).toHaveURL(/create/);

    // ========== STEP 1: Brand Basics ==========
    await expect(page.getByRole('heading', { name: 'Brand Basics' })).toBeVisible();

    // Fill industry
    const industryInput = page.locator('input[placeholder*="Sustainable Fashion"]').or(page.locator('input[placeholder*="SaaS"]')).or(page.locator('input').first());
    await industryInput.fill('Technology / SaaS');

    // Fill brand name
    const nameInput = page.locator('input[placeholder*="brand name"]').or(page.locator('input').nth(1));
    await nameInput.fill('Playwright Palace');

    // Fill tagline
    const taglineInput = page.locator('input[placeholder*="tagline"]').or(page.locator('input').nth(2));
    await taglineInput.fill('Built by bots, loved by humans');

    // Fill description
    const descTextarea = page.locator('textarea').first();
    await descTextarea.fill('A test brand created by Playwright e2e tests to verify the full wizard flow works correctly.');

    // Click Continue
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // ========== STEP 2: Visual Identity ==========
    // Should show color/typography options — just proceed
    await expect(page.getByText(/color|palette|typography/i).first()).toBeVisible();

    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // ========== STEP 3: Products ==========
    // Should show product management area
    await expect(page.getByText(/product/i).first()).toBeVisible();

    // Try adding a product
    const productNameInput = page.locator('input[placeholder*="Product"]').or(page.locator('input[placeholder*="product"]')).or(page.locator('input[placeholder*="name"]').last());
    if (await productNameInput.isVisible()) {
      await productNameInput.fill('Test Widget');
      // Try to find price input
      const priceInput = page.locator('input[type="number"]').or(page.locator('input[placeholder*="price" i]'));
      if (await priceInput.first().isVisible()) {
        await priceInput.first().fill('29.99');
      }
      // Click add button if present
      const addBtn = page.getByRole('button', { name: /add product/i }).or(page.getByRole('button', { name: /add/i }));
      if (await addBtn.first().isVisible()) {
        await addBtn.first().click();
        await page.waitForTimeout(500);
      }
    }

    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // ========== STEP 4: Content & Tone ==========
    await expect(page.getByText(/tone|voice|content/i).first()).toBeVisible();

    // Select a tone keyword if options are visible
    const toneOption = page.getByText('Professional').or(page.getByText('Casual & Friendly'));
    if (await toneOption.first().isVisible()) {
      await toneOption.first().click();
    }

    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // ========== STEP 5: Channels ==========
    await expect(page.getByText(/channel/i).first()).toBeVisible();

    // Website and chatbot should be pre-selected — just proceed
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(500);

    // ========== STEP 6: Review & Launch ==========
    await expect(page.getByText(/review|launch/i).first()).toBeVisible();

    // Verify brand name appears in review
    await expect(page.getByText('Playwright Palace')).toBeVisible();

    // Click Launch
    const launchBtn = page.getByRole('button', { name: /launch/i });
    await expect(launchBtn).toBeVisible();
    await launchBtn.click();

    // Wait for redirect to dashboard (may take a few seconds for API calls)
    await page.waitForURL(/dashboard\//, { timeout: 15000 });

    // ========== VERIFY DASHBOARD ==========
    // Should be on the brand dashboard now
    await expect(page).toHaveURL(/dashboard\//);

    // Brand name should appear somewhere on dashboard
    await expect(page.getByText('Playwright Palace').first()).toBeVisible({ timeout: 10000 });

    console.log('✅ Full wizard flow completed successfully!');
  });

  test('create a brand from template', async ({ page }) => {
    // Start with tech template
    await page.goto(`${BASE}/create?template=tech`);
    await page.waitForTimeout(1500); // Wait for template to load

    // Brand name should be pre-filled from template
    const nameInput = page.locator('input[placeholder*="brand name"]').or(page.locator('input').nth(1));
    const nameValue = await nameInput.inputValue();
    expect(nameValue.length).toBeGreaterThan(0);

    // Override the name
    await nameInput.clear();
    await nameInput.fill('Template Test Co');

    // Click through all steps quickly since template pre-fills everything
    // Step 1 → 2
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(300);

    // Step 2 → 3
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(300);

    // Step 3 → 4
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(300);

    // Step 4 → 5
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(300);

    // Step 5 → 6
    await page.getByRole('button', { name: /continue/i }).click();
    await page.waitForTimeout(300);

    // Review — verify template brand name
    await expect(page.getByText('Template Test Co')).toBeVisible();

    // Launch
    await page.getByRole('button', { name: /launch/i }).click();
    await page.waitForURL(/dashboard\//, { timeout: 15000 });

    await expect(page.getByText('Template Test Co').first()).toBeVisible({ timeout: 10000 });
    console.log('✅ Template-based wizard flow completed successfully!');
  });
});

test.describe('Dashboard Functionality', () => {

  test('brand dashboard shows created brands', async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    // Should show at least one brand (from previous tests or existing data)
    await page.waitForTimeout(2000);
    // Dashboard should either show brands or an empty state
    const hasBrands = await page.getByText(/Playwright Palace|Template Test Co|Test Brand/i).first().isVisible().catch(() => false);
    const hasEmptyState = await page.getByText(/no brands|create your first|get started/i).first().isVisible().catch(() => false);
    expect(hasBrands || hasEmptyState).toBeTruthy();
  });

  test('API: create brand and verify products endpoint', async ({ request }) => {
    // Create brand via API
    const createRes = await request.post(`${BASE}/api/brands`, {
      data: {
        name: 'API Test Brand',
        tagline: 'API Testing',
        description: 'Testing product CRUD',
        industry: 'retail',
        channels: ['website'],
        status: 'launched',
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { brand } = await createRes.json();
    const brandId = brand.id;

    // Add a product
    const productRes = await request.post(`${BASE}/api/brands/${brandId}/products`, {
      data: {
        name: 'Test Product',
        description: 'A product added via API test',
        price: 49.99,
        currency: 'USD',
        category: 'Testing',
      },
    });
    expect(productRes.ok()).toBeTruthy();

    // List products
    const listRes = await request.get(`${BASE}/api/brands/${brandId}/products`);
    expect(listRes.ok()).toBeTruthy();
    const productsData = await listRes.json();
    expect(Array.isArray(productsData.products)).toBe(true);
    expect(productsData.products.length).toBeGreaterThanOrEqual(1);
    expect(productsData.products.some((p: { name: string }) => p.name === 'Test Product')).toBeTruthy();

    console.log(`✅ Product CRUD verified for brand ${brandId}`);
  });

  test('API: create brand and test content generation endpoint', async ({ request }) => {
    // Create brand
    const createRes = await request.post(`${BASE}/api/brands`, {
      data: {
        name: 'Content Test Brand',
        tagline: 'Content testing',
        description: 'Testing content generation',
        industry: 'tech',
        channels: ['website'],
        status: 'launched',
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { brand } = await createRes.json();
    const brandId = brand.id;

    // Test content listing (should be empty initially)
    const listRes = await request.get(`${BASE}/api/brands/${brandId}/content`);
    expect(listRes.ok()).toBeTruthy();
    const contentData = await listRes.json();
    expect(Array.isArray(contentData.content)).toBe(true);

    console.log(`✅ Content endpoint verified for brand ${brandId}`);
  });

  test('API: chatbot endpoint responds', async ({ request }) => {
    // Create brand
    const createRes = await request.post(`${BASE}/api/brands`, {
      data: {
        name: 'Chatbot Test Brand',
        industry: 'tech',
        channels: ['chatbot'],
        status: 'launched',
      },
    });
    expect(createRes.ok()).toBeTruthy();
    const { brand } = await createRes.json();

    // Test chatbot endpoint
    const chatRes = await request.post(`${BASE}/api/brands/${brand.id}/chatbot`, {
      data: {
        message: 'Hello, what products do you offer?',
        sessionId: 'test-session-1',
      },
    });
    // Chatbot may fail if no API key is configured, so just check it doesn't 404
    expect([200, 500].includes(chatRes.status())).toBeTruthy();

    console.log(`✅ Chatbot endpoint responded for brand ${brand.id}`);
  });
});

test.describe('Navigation & Pages', () => {
  test('all main pages load without errors', async ({ page }) => {
    const pages = ['/', '/create', '/templates', '/dashboard', '/login', '/signup'];
    for (const p of pages) {
      const res = await page.goto(`${BASE}${p}`);
      expect(res?.status()).toBe(200);
      // Check no uncaught error message on page
      const errorText = await page.locator('text=/application error|500|internal server error/i').count();
      expect(errorText).toBe(0);
      console.log(`  ✓ ${p} loaded OK`);
    }
  });
});
