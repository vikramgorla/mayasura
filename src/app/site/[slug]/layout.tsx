'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';

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
}

const BrandSiteContext = createContext<BrandSiteData | null>(null);
export function useBrandSite() {
  return useContext(BrandSiteContext);
}

function BrandNav({ brand }: { brand: Brand }) {
  const slug = brand.slug || brand.id;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: `/site/${slug}`, label: 'Home' },
    { href: `/site/${slug}/about`, label: 'About' },
    { href: `/site/${slug}/products`, label: 'Products' },
    { href: `/blog/${slug}`, label: 'Blog' },
    { href: `/site/${slug}/contact`, label: 'Contact' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b shadow-sm' : ''
      }`}
      style={{
        backgroundColor: scrolled ? `${brand.secondary_color}f5` : brand.secondary_color,
        borderColor: `${brand.primary_color}08`,
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={`/site/${slug}`}
            className="text-lg font-semibold tracking-tight transition-opacity hover:opacity-70"
            style={{ color: brand.primary_color, fontFamily: brand.font_heading }}
          >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-7" />
            ) : (
              brand.name
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium tracking-wide uppercase transition-colors hover:opacity-100"
                style={{ color: `${brand.primary_color}88` }}
                onMouseEnter={(e) => (e.currentTarget.style.color = brand.primary_color)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `${brand.primary_color}88`)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/shop/${slug}`}
              className="px-5 py-2 text-[13px] font-medium tracking-wide transition-all hover:opacity-90"
              style={{
                backgroundColor: brand.primary_color,
                color: brand.secondary_color,
              }}
            >
              Shop
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -mr-2"
            style={{ color: brand.primary_color }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
            borderColor: `${brand.primary_color}08`,
            backgroundColor: brand.secondary_color,
          }}
        >
          {[...navLinks, { href: `/shop/${slug}`, label: 'Shop' }].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium tracking-wide"
              style={{ color: `${brand.primary_color}99` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function BrandFooter({ brand }: { brand: Brand }) {
  const slug = brand.slug || brand.id;
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

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: brand.secondary_color,
        borderColor: `${brand.primary_color}08`,
        color: `${brand.primary_color}66`,
      }}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info */}
          <div className="md:col-span-5">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: brand.primary_color, fontFamily: brand.font_heading }}
            >
              {brand.name}
            </h3>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              {brand.description || brand.tagline || ''}
            </p>

            {/* Newsletter */}
            {subscribed ? (
              <p className="text-sm font-medium" style={{ color: brand.accent_color }}>
                ✓ Subscribed. Thank you.
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm border outline-none transition-colors"
                  style={{
                    borderColor: `${brand.primary_color}15`,
                    color: brand.primary_color,
                    backgroundColor: 'transparent',
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{ backgroundColor: brand.primary_color, color: brand.secondary_color }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: brand.primary_color }}>
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
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: brand.primary_color }}>
              More
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: `/shop/${slug}`, label: 'Shop' },
                { href: `/blog/${slug}`, label: 'Blog' },
                { href: `/chat/${slug}`, label: 'Chat with us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:opacity-80 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderColor: `${brand.primary_color}08` }}
        >
          <span>© {new Date().getFullYear()} {brand.name}</span>
          <span>
            Powered by{' '}
            <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: brand.primary_color }}>
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
      .then((d) => setData(d))
      .catch(() => setError(true));
  }, [slug]);

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
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Brand not found</h1>
          <p className="text-slate-400 mb-6 text-sm">This brand doesn&apos;t exist or hasn&apos;t been launched yet.</p>
          <Link href="/" className="text-sm font-medium underline underline-offset-4 hover:opacity-70">
            ← Back to Mayasura
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded bg-slate-100" />
          <div className="h-3 w-24 rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <BrandSiteContext.Provider value={data}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: data.brand.secondary_color || '#fafafa',
          color: data.brand.primary_color || '#0f172a',
          fontFamily: data.brand.font_body || 'Inter',
        }}
      >
        <BrandNav brand={data.brand} />
        <main className="flex-1">{children}</main>
        <BrandFooter brand={data.brand} />
      </div>
    </BrandSiteContext.Provider>
  );
}
