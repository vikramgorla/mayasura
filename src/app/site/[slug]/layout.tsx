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
}

const BrandSiteContext = createContext<BrandSiteData | null>(null);
export function useBrandSite() {
  return useContext(BrandSiteContext);
}

function BrandNav({ brand }: { brand: Brand }) {
  const slug = brand.slug || brand.id;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: `${brand.primary_color}f0`,
        borderColor: `${brand.accent_color}30`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href={`/site/${slug}`}
            className="text-xl font-bold tracking-tight"
            style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
          >
            {brand.logo_url ? (
              <img src={brand.logo_url} alt={brand.name} className="h-8" />
            ) : (
              brand.name
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { href: `/site/${slug}`, label: 'Home' },
              { href: `/site/${slug}/about`, label: 'About' },
              { href: `/site/${slug}/products`, label: 'Products' },
              { href: `/blog/${slug}`, label: 'Blog' },
              { href: `/site/${slug}/contact`, label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-opacity hover:opacity-80"
                style={{ color: `${brand.secondary_color}cc` }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`/shop/${slug}`}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-transform hover:scale-105"
              style={{
                backgroundColor: brand.accent_color,
                color: '#fff',
              }}
            >
              Shop
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2"
            style={{ color: brand.secondary_color }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t px-4 py-4 space-y-3"
          style={{ borderColor: `${brand.accent_color}30`, backgroundColor: brand.primary_color }}
        >
          {[
            { href: `/site/${slug}`, label: 'Home' },
            { href: `/site/${slug}/about`, label: 'About' },
            { href: `/site/${slug}/products`, label: 'Products' },
            { href: `/blog/${slug}`, label: 'Blog' },
            { href: `/site/${slug}/contact`, label: 'Contact' },
            { href: `/shop/${slug}`, label: 'Shop' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium py-1"
              style={{ color: `${brand.secondary_color}cc` }}
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
        backgroundColor: brand.primary_color,
        borderColor: `${brand.accent_color}20`,
        color: `${brand.secondary_color}99`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand info */}
          <div className="md:col-span-2">
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
            >
              {brand.name}
            </h3>
            <p className="text-sm leading-relaxed max-w-md mb-6">
              {brand.description || brand.tagline || ''}
            </p>

            {/* Newsletter */}
            {subscribed ? (
              <p className="text-sm" style={{ color: brand.accent_color }}>
                ✓ Thanks for subscribing!
              </p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg text-sm border-0 outline-none"
                  style={{
                    backgroundColor: `${brand.secondary_color}15`,
                    color: brand.secondary_color,
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: brand.accent_color, color: '#fff' }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: brand.secondary_color }}>
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

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: brand.secondary_color }}>
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
          className="mt-12 pt-8 border-t text-center text-xs"
          style={{ borderColor: `${brand.accent_color}15` }}
        >
          © {new Date().getFullYear()} {brand.name}. All rights reserved. Powered by{' '}
          <Link href="/" className="hover:opacity-80" style={{ color: brand.accent_color }}>
            Mayasura
          </Link>
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
    // Track page view
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
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Brand not found</h1>
          <p className="text-slate-400 mb-6">This brand doesn&apos;t exist or hasn&apos;t been launched yet.</p>
          <Link href="/" className="text-blue-400 hover:underline">
            ← Back to Mayasura
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-700" />
          <div className="h-4 w-32 rounded bg-slate-700" />
        </div>
      </div>
    );
  }

  return (
    <BrandSiteContext.Provider value={data}>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: data.brand.secondary_color || '#f8fafc',
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
