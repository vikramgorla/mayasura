'use client';

import { useEffect } from 'react';

/**
 * Client-side meta tag injection for SEO.
 * Injects <title>, meta description, og tags, canonical URL, etc.
 * Use in 'use client' pages that can't export generateMetadata.
 */
interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string | null;
  ogType?: string;
  siteName?: string;
}

export function SeoHead({ title, description, canonicalUrl, ogImage, ogType = 'website', siteName }: SeoHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:type', ogType);
    if (siteName) setMeta('property', 'og:site_name', siteName);
    if (ogImage) setMeta('property', 'og:image', ogImage);

    // Twitter Card
    setMeta('name', 'twitter:card', ogImage ? 'summary_large_image' : 'summary');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (ogImage) setMeta('name', 'twitter:image', ogImage);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Cleanup: remove dynamically added tags on unmount
    return () => {
      // We don't remove them since they'll be overwritten by next page
    };
  }, [title, description, canonicalUrl, ogImage, ogType, siteName]);

  return null;
}
