'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';

interface BlogSiteData {
  brand: Brand;
}

const BlogSiteContext = createContext<BlogSiteData | null>(null);
export function useBlogSite() {
  return useContext(BlogSiteContext);
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<BlogSiteData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/public/brand/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((d) => setData({ brand: d.brand }))
      .catch(() => setError(true));
  }, [slug]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog not found</h1>
          <Link href="/" className="text-blue-400 hover:underline">← Back to Mayasura</Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse h-8 w-32 rounded bg-slate-200" />
      </div>
    );
  }

  const { brand } = data;

  return (
    <BlogSiteContext.Provider value={data}>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: brand.secondary_color || '#f8fafc',
          color: brand.primary_color || '#0f172a',
          fontFamily: brand.font_body || 'Inter',
        }}
      >
        {/* Blog nav */}
        <nav
          className="sticky top-0 z-50 backdrop-blur-xl border-b"
          style={{
            backgroundColor: `${brand.primary_color}f0`,
            borderColor: `${brand.accent_color}30`,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link
                href={`/site/${slug}`}
                className="text-lg font-bold"
                style={{ color: brand.secondary_color, fontFamily: brand.font_heading }}
              >
                {brand.name}
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href={`/blog/${slug}`}
                  className="text-sm font-medium"
                  style={{ color: `${brand.secondary_color}cc` }}
                >
                  Blog
                </Link>
                <Link
                  href={`/site/${slug}`}
                  className="text-sm font-medium"
                  style={{ color: `${brand.secondary_color}80` }}
                >
                  Website
                </Link>
                <Link
                  href={`/shop/${slug}`}
                  className="text-sm font-medium"
                  style={{ color: `${brand.secondary_color}80` }}
                >
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* Simple footer */}
        <footer
          className="border-t py-8"
          style={{ borderColor: `${brand.primary_color}10` }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm opacity-40">
              © {new Date().getFullYear()} {brand.name} · Powered by{' '}
              <Link href="/" className="hover:opacity-80" style={{ color: brand.accent_color }}>
                Mayasura
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </BlogSiteContext.Provider>
  );
}
