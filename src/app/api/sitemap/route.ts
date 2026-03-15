import { NextResponse } from 'next/server';
import { getAllPublishedBrands, getProductsByBrand, getBlogPosts } from '@/lib/db';
import { Brand, BlogPost } from '@/lib/types';

/**
 * Dynamic XML sitemap for all published brand sites.
 * Generates entries for: landing page, site pages, shop pages, blog posts, products.
 *
 * Sprint 9: Enhanced with image tags, news namespace, and comprehensive coverage.
 */

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: string;
  imageUrl?: string;
  imageTitle?: string;
}

function buildUrlSet(urls: SitemapUrl[]): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${urls
  .map((u) =>
    `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${u.imageUrl ? `\n    <image:image>\n      <image:loc>${escapeXml(u.imageUrl)}</image:loc>${u.imageTitle ? `\n      <image:title>${escapeXml(u.imageTitle)}</image:title>` : ''}\n    </image:image>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandSlug = searchParams.get('brand');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mayasura.app';
    const brands = getAllPublishedBrands() as Brand[];

    // If requesting a specific brand's sitemap
    if (brandSlug) {
      const brand = brands.find(b => b.slug === brandSlug || b.id === brandSlug);
      if (!brand) {
        return new NextResponse('Brand not found', { status: 404 });
      }

      const slug = brand.slug || brand.id;
      const lastmod = brand.updated_at?.split('T')[0] || brand.created_at?.split('T')[0];
      const urls: SitemapUrl[] = [];

      // Consumer site pages
      urls.push({ loc: `${baseUrl}/site/${slug}`, lastmod, changefreq: 'weekly', priority: '0.9', imageUrl: brand.logo_url || undefined, imageTitle: brand.name });
      urls.push({ loc: `${baseUrl}/site/${slug}/about`, lastmod, changefreq: 'monthly', priority: '0.7' });
      urls.push({ loc: `${baseUrl}/site/${slug}/products`, lastmod, changefreq: 'weekly', priority: '0.8' });
      urls.push({ loc: `${baseUrl}/site/${slug}/contact`, lastmod, changefreq: 'monthly', priority: '0.5' });

      // Shop pages
      urls.push({ loc: `${baseUrl}/shop/${slug}`, lastmod, changefreq: 'weekly', priority: '0.8' });

      // Individual products
      const products = getProductsByBrand(brand.id) as Array<{
        id: string; name: string; created_at: string; image_url: string | null; slug?: string;
      }>;
      for (const product of products) {
        const productMod = product.created_at?.split('T')[0];
        urls.push({
          loc: `${baseUrl}/shop/${slug}/product/${product.id}`,
          lastmod: productMod,
          changefreq: 'weekly',
          priority: '0.7',
          imageUrl: product.image_url || undefined,
          imageTitle: product.name,
        });
      }

      // Blog index
      urls.push({ loc: `${baseUrl}/blog/${slug}`, lastmod, changefreq: 'daily', priority: '0.8' });

      // Blog posts
      const posts = getBlogPosts(brand.id, true) as BlogPost[];
      for (const post of posts) {
        const postMod = (post.published_at || post.created_at)?.split('T')[0];
        urls.push({
          loc: `${baseUrl}/blog/${slug}/${post.slug}`,
          lastmod: postMod,
          changefreq: 'monthly',
          priority: '0.6',
        });
      }

      return new NextResponse(buildUrlSet(urls), {
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
          'X-Robots-Tag': 'noindex', // Sitemap itself shouldn't be indexed
        },
      });
    }

    // Main sitemap — includes all URLs
    const urls: SitemapUrl[] = [];

    // Mayasura landing page
    urls.push({ loc: baseUrl, changefreq: 'weekly', priority: '1.0' });
    urls.push({ loc: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.6' });

    for (const brand of brands) {
      const slug = brand.slug || brand.id;
      const lastmod = brand.updated_at?.split('T')[0] || brand.created_at?.split('T')[0];

      // Consumer site pages
      urls.push({ loc: `${baseUrl}/site/${slug}`, lastmod, changefreq: 'weekly', priority: '0.9', imageUrl: brand.logo_url || undefined, imageTitle: brand.name });
      urls.push({ loc: `${baseUrl}/site/${slug}/about`, lastmod, changefreq: 'monthly', priority: '0.7' });
      urls.push({ loc: `${baseUrl}/site/${slug}/products`, lastmod, changefreq: 'weekly', priority: '0.8' });
      urls.push({ loc: `${baseUrl}/site/${slug}/contact`, lastmod, changefreq: 'monthly', priority: '0.5' });

      // Shop
      urls.push({ loc: `${baseUrl}/shop/${slug}`, lastmod, changefreq: 'weekly', priority: '0.8' });

      // Products
      const products = getProductsByBrand(brand.id) as Array<{
        id: string; name: string; created_at: string; image_url: string | null;
      }>;
      for (const product of products) {
        const productMod = product.created_at?.split('T')[0];
        urls.push({
          loc: `${baseUrl}/shop/${slug}/product/${product.id}`,
          lastmod: productMod,
          changefreq: 'weekly',
          priority: '0.7',
          imageUrl: product.image_url || undefined,
          imageTitle: product.name,
        });
      }

      // Blog index
      urls.push({ loc: `${baseUrl}/blog/${slug}`, lastmod, changefreq: 'daily', priority: '0.8' });

      // Blog posts
      const posts = getBlogPosts(brand.id, true) as BlogPost[];
      for (const post of posts) {
        const postMod = (post.published_at || post.created_at)?.split('T')[0];
        urls.push({
          loc: `${baseUrl}/blog/${slug}/${post.slug}`,
          lastmod: postMod,
          changefreq: 'monthly',
          priority: '0.6',
        });
      }
    }

    return new NextResponse(buildUrlSet(urls), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}
