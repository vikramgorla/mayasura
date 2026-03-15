import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mayasura.app';

/**
 * robots.ts — Next.js App Router robots.txt generator.
 * Allow all public consumer-facing pages; disallow internal/dashboard routes.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/site/', '/shop/', '/blog/', '/chat/', '/'],
        disallow: [
          '/dashboard/',
          '/api/',
          '/create',
          '/login',
          '/signup',
          '/migrate',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
