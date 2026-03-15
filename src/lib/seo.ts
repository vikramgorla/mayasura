/**
 * SEO utilities for Mayasura consumer sites.
 * Provides helpers for generating metadata, JSON-LD structured data, and canonical URLs.
 */

import type { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://mayasura.com';

export function getBaseUrl(): string {
  return BASE_URL;
}

// ─── Metadata helpers ──────────────────────────────────────────

interface BrandMeta {
  name: string;
  slug: string | null;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  industry: string | null;
}

export function buildSiteMetadata(
  brand: BrandMeta,
  page: { title: string; description?: string; path: string }
): Metadata {
  const brandName = brand.name;
  const title = page.title === 'Home'
    ? `${brandName} — ${brand.tagline || brand.description || 'Welcome'}`
    : `${page.title} | ${brandName}`;
  const description = page.description || brand.description || brand.tagline || `Welcome to ${brandName}`;
  const url = `${BASE_URL}${page.path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: brandName,
      type: 'website',
      ...(brand.logo_url ? { images: [{ url: brand.logo_url, alt: brandName }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(brand.logo_url ? { images: [brand.logo_url] } : {}),
    },
    alternates: {
      canonical: url,
    },
  };
}

// ─── JSON-LD helpers ───────────────────────────────────────────

export function organizationJsonLd(brand: BrandMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: brand.name,
    url: `${BASE_URL}/site/${brand.slug}`,
    ...(brand.logo_url ? { logo: brand.logo_url } : {}),
    ...(brand.description ? { description: brand.description } : {}),
    ...(brand.industry ? { industry: brand.industry } : {}),
  };
}

export function productJsonLd(product: {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  currency?: string | null;
  image_url?: string | null;
  category?: string | null;
}, brand: BrandMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description ? { description: product.description } : {}),
    ...(product.image_url ? { image: product.image_url } : {}),
    ...(product.category ? { category: product.category } : {}),
    brand: {
      '@type': 'Organization',
      name: brand.name,
    },
    ...(product.price != null && product.price > 0
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price.toFixed(2),
            priceCurrency: product.currency || 'USD',
            availability: 'https://schema.org/InStock',
            url: `${BASE_URL}/shop/${brand.slug}/product/${product.id}`,
          },
        }
      : {}),
  };
}

export function blogPostingJsonLd(post: {
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  published_at?: string | null;
  created_at?: string;
  category?: string | null;
}, brand: BrandMeta): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    ...(post.excerpt ? { description: post.excerpt } : {}),
    url: `${BASE_URL}/blog/${brand.slug}/${post.slug}`,
    datePublished: post.published_at || post.created_at,
    ...(post.category ? { articleSection: post.category } : {}),
    author: {
      '@type': 'Organization',
      name: brand.name,
    },
    publisher: {
      '@type': 'Organization',
      name: brand.name,
      ...(brand.logo_url
        ? {
            logo: {
              '@type': 'ImageObject',
              url: brand.logo_url,
            },
          }
        : {}),
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── OG Image URL helper ──────────────────────────────────────

/**
 * Generate the OG image URL for a brand page.
 * Uses the /api/og/[slug] endpoint for template-based generation.
 */
export function getOgImageUrl(slug: string, options?: {
  title?: string;
  type?: 'site' | 'product' | 'blog';
}): string {
  const params = new URLSearchParams();
  if (options?.title) params.set('title', options.title);
  if (options?.type) params.set('type', options.type);
  const query = params.toString();
  return `${BASE_URL}/api/og/${slug}${query ? `?${query}` : ''}`;
}
