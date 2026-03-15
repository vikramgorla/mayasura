import type { MetadataRoute } from 'next';
import { getAllPublishedBrands, getProductsByBrand, getBlogPosts } from '@/lib/db';
import type { Brand } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mayasura.app';

/**
 * Dynamic sitemap for all public brand pages.
 * Next.js 13+ App Router sitemap convention.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];

  // Static pages
  urls.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/templates`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  );

  try {
    const brands = getAllPublishedBrands() as Brand[];

    for (const brand of brands) {
      const slug = brand.slug || brand.id;
      const brandLastMod = brand.updated_at ? new Date(brand.updated_at) : new Date();

      // Site pages
      urls.push(
        { url: `${BASE_URL}/site/${slug}`, lastModified: brandLastMod, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${BASE_URL}/site/${slug}/about`, lastModified: brandLastMod, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${BASE_URL}/site/${slug}/products`, lastModified: brandLastMod, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${BASE_URL}/site/${slug}/contact`, lastModified: brandLastMod, changeFrequency: 'monthly', priority: 0.5 },
        // Shop
        { url: `${BASE_URL}/shop/${slug}`, lastModified: brandLastMod, changeFrequency: 'weekly', priority: 0.8 },
        // Blog index
        { url: `${BASE_URL}/blog/${slug}`, lastModified: brandLastMod, changeFrequency: 'weekly', priority: 0.7 },
      );

      // Products
      try {
        const products = getProductsByBrand(brand.id) as Array<{ id: string; updated_at?: string; status?: string }>;
        for (const product of products) {
          if (product.status === 'active') {
            urls.push({
              url: `${BASE_URL}/shop/${slug}/product/${product.id}`,
              lastModified: product.updated_at ? new Date(product.updated_at) : brandLastMod,
              changeFrequency: 'weekly',
              priority: 0.7,
            });
          }
        }
      } catch { /* ignore if products fail */ }

      // Blog posts
      try {
        const posts = getBlogPosts(brand.id) as Array<{ slug: string; published_at?: string; status?: string }>;
        for (const post of posts) {
          if (post.status === 'published') {
            urls.push({
              url: `${BASE_URL}/blog/${slug}/${post.slug}`,
              lastModified: post.published_at ? new Date(post.published_at) : brandLastMod,
              changeFrequency: 'monthly',
              priority: 0.6,
            });
          }
        }
      } catch { /* ignore if posts fail */ }
    }
  } catch { /* ignore if brands fail */ }

  return urls;
}
