import { NextResponse } from 'next/server';
import { getAllPublishedBrands, getProductsByBrand, getBlogPosts } from '@/lib/db';
import { Brand, BlogPost } from '@/lib/types';

/**
 * Dynamic XML sitemap for all published brand sites.
 * Generates entries for: site pages, shop pages, blog posts.
 */
export async function GET() {
  try {
    const brands = getAllPublishedBrands() as Brand[];
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mayasura.app';

    const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [];

    // Landing page
    urls.push({ loc: baseUrl, changefreq: 'weekly', priority: '1.0' });

    for (const brand of brands) {
      const slug = brand.slug || brand.id;
      const lastmod = brand.updated_at?.split('T')[0] || brand.created_at?.split('T')[0];

      // Site pages
      urls.push({ loc: `${baseUrl}/site/${slug}`, lastmod, changefreq: 'weekly', priority: '0.9' });
      urls.push({ loc: `${baseUrl}/site/${slug}/about`, lastmod, changefreq: 'monthly', priority: '0.7' });
      urls.push({ loc: `${baseUrl}/site/${slug}/products`, lastmod, changefreq: 'weekly', priority: '0.8' });
      urls.push({ loc: `${baseUrl}/site/${slug}/contact`, lastmod, changefreq: 'monthly', priority: '0.5' });

      // Shop
      urls.push({ loc: `${baseUrl}/shop/${slug}`, lastmod, changefreq: 'weekly', priority: '0.8' });

      // Products
      const products = getProductsByBrand(brand.id) as Array<{ id: string; created_at: string }>;
      for (const product of products) {
        const productMod = product.created_at?.split('T')[0];
        urls.push({ loc: `${baseUrl}/shop/${slug}/product/${product.id}`, lastmod: productMod, changefreq: 'weekly', priority: '0.7' });
      }

      // Blog index
      urls.push({ loc: `${baseUrl}/blog/${slug}`, lastmod, changefreq: 'daily', priority: '0.8' });

      // Blog posts
      const posts = getBlogPosts(brand.id, true) as BlogPost[];
      for (const post of posts) {
        const postMod = (post.published_at || post.created_at)?.split('T')[0];
        urls.push({ loc: `${baseUrl}/blog/${slug}/${post.slug}`, lastmod: postMod, changefreq: 'monthly', priority: '0.6' });
      }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
