'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Brand } from '@/lib/types';
import { getWebsiteTemplate, type WebsiteTemplate } from '@/lib/website-templates';
import { buildGoogleFontsUrl } from '@/lib/font-loader';
import {
  resolveDesignSettings,
  designSettingsToCSSVars,
  type ResolvedDesignSettings,
} from '@/lib/design-settings';

interface BlogSiteData {
  brand: Brand;
  websiteTemplate?: WebsiteTemplate;
  settings?: Record<string, string>;
  designSettings: ResolvedDesignSettings;
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
      .then((d) => {
        const templateId = d.settings?.website_template || 'minimal';
        const websiteTemplate = getWebsiteTemplate(templateId);
        const ds = resolveDesignSettings(d.settings, d.brand.primary_color || '#0f172a');
        setData({ brand: d.brand, websiteTemplate, settings: d.settings, designSettings: ds });
      })
      .catch(() => setError(true));
  }, [slug]);

  // Load Google Fonts
  useEffect(() => {
    if (!data) return;
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-3">Blog not found</h1>
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
          <div className="h-8 w-8 rounded bg-zinc-100" />
          <div className="h-3 w-24 rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const { brand, websiteTemplate: template, designSettings } = data;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? (templateId === 'tech' ? '#0A0F1A' : templateId === 'neon' ? '#050510' : '#000000') : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const cssVars = designSettingsToCSSVars(
    designSettings,
    brand.primary_color || '#0f172a',
    brand.secondary_color || '#fafafa',
    brand.accent_color || '#3b82f6',
  );

  // Nav link style per template
  const linkClass = (() => {
    if (templateId === 'bold') return 'text-[11px] font-bold uppercase tracking-[0.12em]';
    if (templateId === 'editorial') return 'text-[13px] font-medium';
    if (templateId === 'playful') return 'text-[13px] font-semibold';
    return 'text-[13px] font-medium';
  })();

  return (
    <BlogSiteContext.Provider value={data}>
      <div
        className="min-h-screen flex flex-col"
        data-template={templateId}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: brand.font_body || 'Inter',
          '--accent': accentColor,
          ...cssVars as React.CSSProperties,
        } as React.CSSProperties}
      >
        {/* Blog nav */}
        <nav
          className="sticky top-0 z-50 border-b transition-all duration-300"
          style={{
            backgroundColor: `${bgColor}f0`,
            borderColor: `${textColor}08`,
            backdropFilter: 'blur(16px) saturate(180%)',
          }}
        >
          <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-5 sm:px-8`}>
            <div className={`flex items-center justify-between ${templateId === 'bold' ? 'h-14' : 'h-16'}`}>
              <Link
                href={`/site/${slug}`}
                className="transition-opacity hover:opacity-70"
                style={{
                  color: textColor,
                  fontFamily: brand.font_heading,
                  fontWeight: templateId === 'bold' ? 700 : templateId === 'editorial' ? 700 : 500,
                  fontSize: templateId === 'bold' ? '0.8125rem' : '1.125rem',
                  letterSpacing: templateId === 'bold' ? '0.1em' : '-0.01em',
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                }}
              >
                {brand.name}
              </Link>
              <div className="flex items-center gap-6">
                <Link
                  href={`/blog/${slug}`}
                  className={`${linkClass} transition-colors`}
                  style={{ color: textColor }}
                >
                  {templateId === 'editorial' ? 'Journal' : templateId === 'bold' ? 'BLOG' : 'Blog'}
                </Link>
                <Link
                  href={`/site/${slug}`}
                  className={`${linkClass} transition-colors`}
                  style={{ color: `${textColor}55` }}
                >
                  {templateId === 'bold' ? 'WEBSITE' : 'Website'}
                </Link>
                <Link
                  href={`/shop/${slug}`}
                  className={`${linkClass} transition-colors hidden sm:inline`}
                  style={{ color: `${textColor}55` }}
                >
                  {templateId === 'bold' ? 'SHOP' : 'Shop'}
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="border-t py-8"
          style={{
            borderColor: `${textColor}06`,
            borderTopWidth: templateId === 'bold' ? '2px' : '1px',
          }}
        >
          <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-4xl'} mx-auto px-5 sm:px-8 text-center`}>
            <p className="text-xs" style={{ color: `${textColor}30` }}>
              © {new Date().getFullYear()} {brand.name} · Powered by{' '}
              <Link href="/" className="hover:opacity-80 transition-opacity" style={{ color: accentColor }}>
                Mayasura
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </BlogSiteContext.Provider>
  );
}
