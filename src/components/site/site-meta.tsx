'use client';

/**
 * SiteMetaTags — Injects SEO meta tags and JSON-LD structured data
 * into the document head for consumer site pages.
 *
 * Since the site layout is a client component (needs brand data),
 * we inject metadata dynamically once the brand data is available.
 */

import { useEffect } from 'react';

interface OrgData {
  brandName: string;
  description: string | null;
  url: string;
  logoUrl: string | null;
}

interface ProductData {
  name: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  imageUrl: string | null;
}

interface ArticleData {
  title: string;
  description: string | null;
  publishedAt: string;
  imageUrl: string | null;
  authorName?: string;
}

/* ─── Helpers ────────────────────────────────────────────────── */
function setOrUpdate(id: string, tagFn: () => HTMLElement) {
  let el = document.getElementById(id);
  if (!el) {
    el = tagFn();
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
}

function setMeta(name: string, content: string, useProperty = false) {
  const attr = useProperty ? 'property' : 'name';
  const id = `meta-${attr}-${name.replace(/[^a-z0-9]/gi, '-')}`;
  const el = setOrUpdate(id, () => {
    const m = document.createElement('meta');
    m.setAttribute(attr, name);
    return m;
  }) as HTMLMetaElement;
  el.content = content;
}

function setJsonLd(id: string, data: object) {
  const el = setOrUpdate(`jsonld-${id}`, () => {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    return s;
  }) as HTMLScriptElement;
  el.textContent = JSON.stringify(data);
}

function setLink(rel: string, href: string) {
  const id = `link-${rel}`;
  const el = setOrUpdate(id, () => {
    const l = document.createElement('link');
    l.rel = rel;
    return l;
  }) as HTMLLinkElement;
  el.href = href;
}

/* ─── Base site meta component ──────────────────────────────── */
export function SiteMeta({
  title,
  description,
  canonicalUrl,
  ogImage,
  org,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  org: OrgData;
}) {
  useEffect(() => {
    // Title
    document.title = `${title} | ${org.brandName}`;

    // Basic meta
    setMeta('description', description);
    setMeta('robots', 'index, follow');

    // Open Graph
    setMeta('og:type', 'website', true);
    setMeta('og:title', `${title} | ${org.brandName}`, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:site_name', org.brandName, true);
    if (ogImage) setMeta('og:image', ogImage, true);

    // Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', `${title} | ${org.brandName}`);
    setMeta('twitter:description', description);
    if (ogImage) setMeta('twitter:image', ogImage);

    // Canonical
    setLink('canonical', canonicalUrl);

    // Organization JSON-LD
    setJsonLd('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.brandName,
      description: org.description || undefined,
      url: org.url,
      logo: org.logoUrl
        ? { '@type': 'ImageObject', url: org.logoUrl }
        : undefined,
    });
  }, [title, description, canonicalUrl, ogImage, org]);

  return null;
}

/* ─── Products page meta ─────────────────────────────────────── */
export function ProductsPageMeta({
  org,
  canonicalUrl,
  products,
}: {
  org: OrgData;
  canonicalUrl: string;
  products: ProductData[];
}) {
  useEffect(() => {
    const title = `Products | ${org.brandName}`;
    const description = `Browse ${org.brandName}'s collection of ${products.length} product${products.length !== 1 ? 's' : ''}. ${org.description || ''}`.trim();

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'website', true);
    setLink('canonical', canonicalUrl);

    // ItemList JSON-LD for product listing
    if (products.length > 0) {
      setJsonLd('product-list', {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${org.brandName} Products`,
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            description: p.description || undefined,
            image: p.imageUrl || undefined,
            offers: p.price != null
              ? {
                  '@type': 'Offer',
                  price: p.price,
                  priceCurrency: p.currency || 'USD',
                  availability: 'https://schema.org/InStock',
                }
              : undefined,
          },
        })),
      });
    }
  }, [org, canonicalUrl, products]);

  return null;
}

/* ─── Single product meta ────────────────────────────────────── */
export function ProductMeta({
  org,
  canonicalUrl,
  product,
}: {
  org: OrgData;
  canonicalUrl: string;
  product: ProductData;
}) {
  useEffect(() => {
    const title = `${product.name} | ${org.brandName}`;
    const description = product.description || `${product.name} by ${org.brandName}`;

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'product', true);
    if (product.imageUrl) setMeta('og:image', product.imageUrl, true);
    setLink('canonical', canonicalUrl);

    // Product JSON-LD
    setJsonLd('product', {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description || undefined,
      image: product.imageUrl || undefined,
      brand: {
        '@type': 'Brand',
        name: org.brandName,
      },
      offers: product.price != null
        ? {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: product.currency || 'USD',
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
          }
        : undefined,
    });
  }, [org, canonicalUrl, product]);

  return null;
}

/* ─── Blog post meta ─────────────────────────────────────────── */
export function BlogPostMeta({
  org,
  canonicalUrl,
  article,
}: {
  org: OrgData;
  canonicalUrl: string;
  article: ArticleData;
}) {
  useEffect(() => {
    const title = `${article.title} | ${org.brandName}`;
    const description = article.description || `Read "${article.title}" on ${org.brandName}'s blog.`;

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'article', true);
    if (article.imageUrl) setMeta('og:image', article.imageUrl, true);
    setMeta('article:published_time', article.publishedAt, true);
    setLink('canonical', canonicalUrl);

    // Article JSON-LD
    setJsonLd('article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description || undefined,
      image: article.imageUrl || undefined,
      datePublished: article.publishedAt,
      author: {
        '@type': 'Organization',
        name: article.authorName || org.brandName,
      },
      publisher: {
        '@type': 'Organization',
        name: org.brandName,
        logo: org.logoUrl
          ? { '@type': 'ImageObject', url: org.logoUrl }
          : undefined,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonicalUrl,
      },
    });
  }, [org, canonicalUrl, article]);

  return null;
}

/* ─── About page meta ────────────────────────────────────────── */
export function AboutPageMeta({
  org,
  canonicalUrl,
}: {
  org: OrgData;
  canonicalUrl: string;
}) {
  useEffect(() => {
    const title = `About | ${org.brandName}`;
    const description = `Learn about ${org.brandName}. ${org.description || `Our story, values, and the team behind the brand.`}`.slice(0, 160);

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'website', true);
    if (org.logoUrl) setMeta('og:image', org.logoUrl, true);
    setLink('canonical', canonicalUrl);
  }, [org, canonicalUrl]);

  return null;
}

/* ─── Contact page meta ──────────────────────────────────────── */
export function ContactPageMeta({
  org,
  canonicalUrl,
}: {
  org: OrgData;
  canonicalUrl: string;
}) {
  useEffect(() => {
    const title = `Contact | ${org.brandName}`;
    const description = `Get in touch with ${org.brandName}. We'd love to hear from you.`;

    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('robots', 'noindex, follow'); // Contact pages shouldn't be indexed
    setLink('canonical', canonicalUrl);
  }, [org, canonicalUrl]);

  return null;
}

/* ─── Sitemap hint component ─────────────────────────────────── */
export function SitemapHint({ sitemapUrl }: { sitemapUrl: string }) {
  useEffect(() => {
    setLink('sitemap', sitemapUrl);
  }, [sitemapUrl]);
  return null;
}
