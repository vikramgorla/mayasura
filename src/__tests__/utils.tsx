import React, { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Brand, BrandData, Product, User, BlogPost, Order, Ticket } from '@/lib/types';

// ─── Test Providers ──────────────────────────────────────────────
// Wrap components in any required providers for testing.
// Currently minimal; add providers as needed (e.g., ToastProvider).

function AllProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/**
 * Custom render that wraps component in all necessary providers.
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { renderWithProviders as render };

// ─── Mock Data Factories ─────────────────────────────────────────

let idCounter = 0;

function nextId(prefix = 'test'): string {
  return `${prefix}-${++idCounter}`;
}

/** Reset ID counter between tests */
export function resetIdCounter() {
  idCounter = 0;
}

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: nextId('user'),
    email: 'test@example.com',
    name: 'Test User',
    password_hash: '$2a$12$hashedpassword',
    avatar_url: null,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockBrand(overrides: Partial<Brand> = {}): Brand {
  const name = overrides.name || 'Test Brand';
  return {
    id: nextId('brand'),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    tagline: 'A test brand tagline',
    description: 'A test brand description',
    industry: 'tech',
    logo_url: null,
    primary_color: '#0f172a',
    secondary_color: '#f8fafc',
    accent_color: '#3b82f6',
    font_heading: 'Inter',
    font_body: 'Inter',
    brand_voice: 'Professional and concise',
    channels: '["website","chatbot"]',
    status: 'launched',
    user_id: 'user-1',
    website_template: 'minimal',
    custom_css: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockBrandData(overrides: Partial<BrandData> = {}): BrandData {
  return {
    name: 'Test Brand',
    tagline: 'A test brand tagline',
    industry: 'Technology',
    description: 'A test brand description',
    primaryColor: '#0f172a',
    secondaryColor: '#f8fafc',
    accentColor: '#3b82f6',
    fontHeading: 'Inter',
    fontBody: 'Inter',
    products: [],
    brandVoice: 'Professional and concise',
    toneKeywords: ['Professional', 'Technical & Expert'],
    channels: ['website', 'chatbot'],
    status: 'draft',
    ...overrides,
  };
}

export function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: nextId('product'),
    name: 'Test Product',
    description: 'A test product description',
    price: 29.99,
    currency: 'USD',
    category: 'General',
    sort_order: 0,
    ...overrides,
  };
}

export function createMockBlogPost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    id: nextId('post'),
    brand_id: 'brand-1',
    title: 'Test Blog Post',
    slug: 'test-blog-post',
    content: 'This is a test blog post content.',
    excerpt: 'Test excerpt',
    category: 'General',
    tags: '["test"]',
    status: 'published',
    published_at: '2026-01-01T00:00:00.000Z',
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: nextId('order'),
    brand_id: 'brand-1',
    customer_email: 'customer@example.com',
    customer_name: 'Test Customer',
    shipping_address: '123 Test St, Test City',
    items: '[{"name":"Product 1","quantity":1,"price":29.99}]',
    total: 29.99,
    currency: 'USD',
    status: 'pending',
    stripe_session_id: null,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export function createMockTicket(overrides: Partial<Ticket> = {}): Ticket {
  return {
    id: nextId('ticket'),
    brand_id: 'brand-1',
    customer_name: 'Test Customer',
    customer_email: 'customer@example.com',
    subject: 'Test support ticket',
    category: 'general',
    priority: 'medium',
    status: 'open',
    satisfaction_rating: null,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
