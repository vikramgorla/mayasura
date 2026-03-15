'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { getWebsiteTemplate, type WebsiteTemplate } from '@/lib/website-templates';
import { buildGoogleFontsUrl } from '@/lib/font-loader';
import { type PageLayout, getDefaultLayout } from '@/lib/page-layout';
import { useScrollAnimation } from '@/lib/use-scroll-animation';
import { ScrollToTop } from '@/components/site/scroll-to-top';
import { CookieConsent } from '@/components/site/cookie-consent';
import { SiteMeta, SitemapHint } from '@/components/site/site-meta';
import {
  resolveDesignSettings,
  designSettingsToCSSVars,
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  SPACING_MAP,
  BORDER_RADIUS_MAP,
  type ResolvedDesignSettings,
} from '@/lib/design-settings';

interface BrandSiteData {
  brand: Brand;
  products: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    image_url: string | null;
    category: string | null;
  }>;
  blogPosts: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    published_at: string;
  }>;
  settings?: Record<string, string>;
  websiteTemplate?: WebsiteTemplate;
  pageLayout?: PageLayout;
  designSettings: ResolvedDesignSettings;
}

const BrandSiteContext = createContext<BrandSiteData | null>(null);
/**
 * SVG placeholder for images throughout the brand site.
 */
export function BrandPlaceholder({
  color = '#ccc',
  className = '',
  variant = 'default',
}: {
  color?: string;
  className?: string;
  variant?: 'default' | 'hero' | 'about';
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.15 }}
    >
      {variant === 'hero' ? (
        <>
          <rect width="400" height="300" rx="8" fill={color} fillOpacity="0.08" />
          <circle cx="200" cy="110" r="50" fill={color} fillOpacity="0.12" />
          <circle cx="140" cy="170" r="30" fill={color} fillOpacity="0.08" />
          <circle cx="260" cy="180" r="25" fill={color} fillOpacity="0.06" />
          <rect x="120" y="230" width="160" height="16" rx="8" fill={color} fillOpacity="0.1" />
        </>
      ) : variant === 'about' ? (
        <>
          <rect width="400" height="300" rx="8" fill={color} fillOpacity="0.06" />
          <rect x="60" y="60" width="120" height="120" rx="60" fill={color} fillOpacity="0.1" />
          <rect x="220" y="80" width="140" height="10" rx="5" fill={color} fillOpacity="0.12" />
          <rect x="220" y="105" width="100" height="10" rx="5" fill={color} fillOpacity="0.08" />
          <rect x="220" y="130" width="120" height="10" rx="5" fill={color} fillOpacity="0.06" />
          <rect x="60" y="220" width="280" height="8" rx="4" fill={color} fillOpacity="0.06" />
          <rect x="60" y="240" width="200" height="8" rx="4" fill={color} fillOpacity="0.04" />
        </>
      ) : (
        <>
          <rect width="400" height="300" rx="8" fill={color} fillOpacity="0.06" />
          <circle cx="200" cy="120" r="35" fill={color} fillOpacity="0.12" />
          <rect x="140" y="180" width="120" height="10" rx="5" fill={color} fillOpacity="0.1" />
          <rect x="160" y="205" width="80" height="8" rx="4" fill={color} fillOpacity="0.06" />
        </>
      )}
    </svg>
  );
}

export function useBrandSite() {
  return useContext(BrandSiteContext);
}

function BrandNav({ brand, template, designSettings }: { brand: Brand; template?: WebsiteTemplate; designSettings: ResolvedDesignSettings }) {
  const slug = brand.slug || brand.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? (templateId === 'tech' ? '#0A0F1A' : '#000000') : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/site/${slug}`, label: 'Home' },
    { href: `/site/${slug}/about`, label: 'About' },
    { href: `/site/${slug}/products`, label: 'Products' },
    { href: `/blog/${slug}`, label: templateId === 'editorial' ? 'Journal' : 'Blog' },
    { href: `/site/${slug}/contact`, label: 'Contact' },
  ];

  // Template-specific nav styles
  const navBg = (() => {
    if (!scrolled && templateId === 'minimal') return 'transparent';
    if (isDark) return scrolled ? '#000000e8' : '#000000';
    return scrolled ? `${bgColor}f0` : bgColor;
  })();

  const navBorder = scrolled ? `${textColor}08` : 'transparent';
  const navHeight = templateId === 'minimal' ? 'h-20' : templateId === 'bold' ? 'h-14' : 'h-16';
  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';

  // Link styles per template
  const linkClass = (() => {
    if (templateId === 'minimal') return 'text-[13px] font-normal tracking-wide';
    if (templateId === 'editorial') return 'text-[13px] font-medium';
    if (templateId === 'bold') return 'text-[11px] font-bold uppercase tracking-[0.12em]';
    if (templateId === 'classic') return 'text-[13px] font-medium';
    if (templateId === 'playful') return 'text-[13px] font-semibold';
    return 'text-[13px] font-medium';
  })();

  // Shop button style
  const shopBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '0',
      padding: '0.5rem 1.25rem', fontSize: '0.6875rem', fontWeight: 700,
      letterSpacing: '0.12em', textTransform: 'uppercase',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '9999px',
      padding: '0.5rem 1.5rem', fontSize: '0.8125rem', fontWeight: 600,
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '8px',
      padding: '0.5rem 1.5rem', fontSize: '0.8125rem', fontWeight: 500,
    };
    return {
      backgroundColor: textColor, color: bgColor, borderRadius: '0',
      padding: '0.5rem 1.5rem', fontSize: '0.8125rem', fontWeight: 500,
    };
  })();

  // Logo style per template
  const logoStyle: React.CSSProperties = (() => {
    if (templateId === 'minimal') return { fontWeight: 400, fontSize: '1rem', letterSpacing: '-0.01em' };
    if (templateId === 'editorial') return { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' };
    if (templateId === 'bold') return { fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase' as const };
    if (templateId === 'classic') return { fontWeight: 600, fontSize: '1.125rem', letterSpacing: '0' };
    if (templateId === 'playful') return { fontWeight: 700, fontSize: '1.125rem', letterSpacing: '-0.01em' };
    if (templateId === 'startup') return { fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.02em' };
    if (templateId === 'portfolio') return { fontWeight: 400, fontSize: '1rem', letterSpacing: '-0.01em' };
    if (templateId === 'magazine') return { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' };
    if (templateId === 'boutique') return { fontWeight: 500, fontSize: '0.875rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const };
    if (templateId === 'tech') return { fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em', fontFamily: 'JetBrains Mono, monospace' };
    if (templateId === 'wellness') return { fontWeight: 300, fontSize: '1.125rem', letterSpacing: '0.02em' };
    if (templateId === 'restaurant') return { fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.01em' };
    return {};
  })();

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b' : ''}`}
      style={{
        backgroundColor: navBg,
        borderColor: navBorder,
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : undefined,
        boxShadow: scrolled && !isDark ? '0 1px 3px rgba(0,0,0,0.04)' : undefined,
      }}
    >
      <div className={`${containerWidth} mx-auto px-5 sm:px-8`}>
        <div className={`flex items-center justify-between ${navHeight}`}>
          <Link
            href={`/site/${slug}`}
            className="transition-opacity hover:opacity-70"
            style={{ color: textColor, fontFamily: brand.font_heading, ...logoStyle }}
          >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-7" />
            ) : (
              brand.name
            )}
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center ${templateId === 'bold' ? 'gap-6' : 'gap-8'}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${linkClass} transition-colors hover:opacity-100`}
                style={{ color: `${textColor}77` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${textColor}77`)}
              >
                {templateId === 'bold' ? link.label.toUpperCase() : link.label}
              </Link>
            ))}
            <Link
              href={`/shop/${slug}`}
              className="transition-all hover:opacity-90"
              style={shopBtnStyle}
            >
              {templateId === 'bold' ? 'SHOP' : templateId === 'playful' ? 'Shop 🛍️' : 'Shop'}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2"
            style={{ color: textColor }}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={templateId === 'bold' ? 2 : 1.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-5 py-5 space-y-4"
          style={{
            borderColor: `${textColor}08`,
            backgroundColor: bgColor,
          }}
        >
          {[...navLinks, { href: `/shop/${slug}`, label: 'Shop' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block ${linkClass}`}
              style={{ color: `${textColor}88` }}
            >
              {templateId === 'bold' ? link.label.toUpperCase() : link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function BrandFooter({ brand, template, designSettings }: { brand: Brand; template?: WebsiteTemplate; designSettings: ResolvedDesignSettings }) {
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? (templateId === 'tech' ? '#0A0F1A' : '#000000') : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(`/api/public/brand/${slug}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch {
      // silent fail
    }
  };

  const dsRadius = BORDER_RADIUS_MAP[designSettings.borderRadius];
  const inputBorderRadius = templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : dsRadius;
  const btnBorderRadius = templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : dsRadius;

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: bgColor,
        borderColor: `${textColor}06`,
        borderTopWidth: templateId === 'bold' ? '2px' : '1px',
        color: `${textColor}55`,
      }}
    >
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8 py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info */}
          <div className="md:col-span-5">
            <h3
              className="text-lg mb-3"
              style={{
                color: textColor,
                fontFamily: brand.font_heading,
                fontWeight: templateId === 'bold' ? 700 : templateId === 'minimal' ? 400 : 600,
                textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                fontSize: templateId === 'bold' ? '0.875rem' : undefined,
              }}
            >
              {brand.name}
            </h3>
            <p className="text-sm leading-relaxed max-w-sm mb-6" style={{ color: `${textColor}45` }}>
              {brand.description || brand.tagline || ''}
            </p>

            {/* Newsletter */}
            {subscribed ? (
              <p className="text-sm font-medium" style={{ color: accentColor }}>
                {templateId === 'playful' ? '✨ Subscribed! Thank you.' : '✓ Subscribed. Thank you.'}
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm" aria-label="Newsletter signup">
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm border outline-none transition-colors"
                  style={{
                    borderColor: `${textColor}12`,
                    color: textColor,
                    backgroundColor: 'transparent',
                    borderRadius: inputBorderRadius,
                    borderWidth: templateId === 'bold' ? '2px' : '1px',
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: isDark ? accentColor : textColor,
                    color: isDark ? '#FFFFFF' : bgColor,
                    borderRadius: btnBorderRadius,
                    fontWeight: templateId === 'bold' ? 700 : 500,
                    letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
                  }}
                >
                  {templateId === 'bold' ? 'SUBSCRIBE' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                color: textColor,
                fontWeight: templateId === 'bold' ? 700 : 600,
                letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
              }}
            >
              Pages
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: `/site/${slug}`, label: 'Home' },
                { href: `/site/${slug}/about`, label: 'About' },
                { href: `/site/${slug}/products`, label: 'Products' },
                { href: `/site/${slug}/contact`, label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:opacity-80 transition-opacity">
                    {templateId === 'bold' ? link.label.toUpperCase() : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                color: textColor,
                fontWeight: templateId === 'bold' ? 700 : 600,
                letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
              }}
            >
              More
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: `/shop/${slug}`, label: 'Shop' },
                { href: `/blog/${slug}`, label: templateId === 'editorial' ? 'Journal' : 'Blog' },
                { href: `/chat/${slug}`, label: 'Chat with us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:opacity-80 transition-opacity">
                    {templateId === 'bold' ? link.label.toUpperCase() : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: `${textColor}06` }}
        >
          <span style={{ color: `${textColor}35` }}>© {new Date().getFullYear()} {brand.name}</span>
          <span style={{ color: `${textColor}30` }}>
            Powered by{' '}
            <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: accentColor }}>
              Mayasura
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function BrandSiteLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<BrandSiteData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d) => {
        // Resolve website template from settings
        const templateId = d.settings?.website_template || 'minimal';
        const websiteTemplate = getWebsiteTemplate(templateId);
        // Parse page layout from settings
        let pageLayout: PageLayout | undefined;
        if (d.settings?.page_layout) {
          try {
            pageLayout = JSON.parse(d.settings.page_layout);
          } catch { /* ignore */ }
        }
        const ds = resolveDesignSettings(d.settings, d.brand.primary_color || '#0f172a');
        setData({ ...d, websiteTemplate, pageLayout, designSettings: ds });
      })
      .catch(() => setError(true));
  }, [slug]);

  // Load Google Fonts for the brand's template fonts
  useEffect(() => {
    if (!data) return;
    const tId = data.websiteTemplate?.id || 'minimal';
    const fonts = [data.brand.font_heading, data.brand.font_body].filter(Boolean) as string[];
    if (fonts.length === 0) return;
    const url = buildGoogleFontsUrl(fonts);
    const existing = document.querySelector(`link[href="${url}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
  }, [data]);

  // Initialize scroll animations for consumer site
  useScrollAnimation();

  useEffect(() => {
    if (!data) return;
    fetch(`/api/public/brand/${slug}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: window.location.pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {});
  }, [data, slug]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-zinc-900 px-6">
        {/* SVG illustration */}
        <svg className="w-32 h-32 mb-8 opacity-10" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="56" stroke="#000" strokeWidth="2" />
          <path d="M40 50 Q60 35 80 50" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="58" r="4" fill="#000" />
          <circle cx="75" cy="58" r="4" fill="#000" />
          <path d="M42 78 Q60 68 78 78" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="text-center max-w-sm">
          <h1 className="text-4xl font-light tracking-tight mb-3 text-zinc-900">404</h1>
          <h2 className="text-lg font-medium mb-3 text-zinc-700">Brand not found</h2>
          <p className="text-zinc-400 mb-8 text-sm leading-relaxed">
            This brand doesn&apos;t exist or hasn&apos;t been launched yet. Check the URL or explore Mayasura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 text-sm font-medium rounded bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
            >
              ← Back to Mayasura
            </Link>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 text-sm font-medium rounded border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          {/* Skeleton nav */}
          <div className="w-full max-w-6xl px-5 sm:px-8 py-5 flex items-center justify-between fixed top-0 left-0 right-0 bg-white border-b border-zinc-100">
            <div className="h-5 w-32 rounded-full bg-zinc-100 animate-pulse" />
            <div className="hidden sm:flex items-center gap-6">
              {[1,2,3,4].map((i) => <div key={i} className="h-3 w-14 rounded-full bg-zinc-100 animate-pulse" />)}
            </div>
          </div>
          {/* Skeleton hero */}
          <div className="w-full max-w-3xl mx-auto px-5 sm:px-8 pt-32 space-y-4">
            <div className="h-3 w-24 rounded-full bg-zinc-100 animate-pulse" />
            <div className="h-10 w-3/4 rounded bg-zinc-100 animate-pulse" />
            <div className="h-10 w-1/2 rounded bg-zinc-100 animate-pulse" />
            <div className="h-4 w-full max-w-md rounded-full bg-zinc-100 animate-pulse mt-6" />
            <div className="h-4 w-3/4 max-w-sm rounded-full bg-zinc-100 animate-pulse" />
            <div className="flex gap-3 mt-8">
              <div className="h-10 w-28 rounded bg-zinc-100 animate-pulse" />
              <div className="h-10 w-24 rounded bg-zinc-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';
  const brandSlug = data.brand.slug || data.brand.id;
  const siteUrl = `${baseUrl}/site/${brandSlug}`;

  return (
    <BrandSiteContext.Provider value={data}>
      {/* Site-level SEO: Organization schema + canonical + sitemap hint */}
      <SiteMeta
        title={data.brand.tagline || data.brand.name}
        description={data.brand.description || `Welcome to ${data.brand.name}${data.brand.tagline ? ` — ${data.brand.tagline}` : ''}.`}
        canonicalUrl={siteUrl}
        ogImage={data.brand.logo_url || undefined}
        org={{
          brandName: data.brand.name,
          description: data.brand.description,
          url: siteUrl,
          logoUrl: data.brand.logo_url,
        }}
      />
      <SitemapHint sitemapUrl={`${baseUrl}/sitemap.xml`} />
      <div
        className="min-h-screen flex flex-col"
        data-template={data.websiteTemplate?.id || 'minimal'}
        data-animation={data.settings?.animation_style || 'moderate'}
        style={{
          backgroundColor: data.brand.secondary_color || '#fafafa',
          color: data.brand.primary_color || '#0f172a',
          fontFamily: data.brand.font_body || 'Inter',
          ...designSettingsToCSSVars(
            data.designSettings,
            data.brand.primary_color || '#0f172a',
            data.brand.secondary_color || '#fafafa',
            data.brand.accent_color || '#3b82f6',
          ) as React.CSSProperties,
        }}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded focus:shadow-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <BrandNav brand={data.brand} template={data.websiteTemplate} designSettings={data.designSettings} />
        <main id="main-content" className="flex-1" role="main">{children}</main>
        <BrandFooter brand={data.brand} template={data.websiteTemplate} designSettings={data.designSettings} />
        <ScrollToTop accentColor={data.brand.accent_color || '#6366F1'} />
        <CookieConsent
          accentColor={data.brand.accent_color || '#6366F1'}
          bgColor={data.brand.secondary_color || '#FFFFFF'}
          textColor={data.brand.primary_color || '#000000'}
        />
      </div>
    </BrandSiteContext.Provider>
  );
}
