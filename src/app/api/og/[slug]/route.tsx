import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import { getBrandBySlug } from '@/lib/db';
import type { Brand } from '@/lib/types';

export const runtime = 'nodejs';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://mayasura.app';

/**
 * OG Image generator for brand pages.
 * /api/og/[slug] — generates a 1200×630 OpenGraph image for any brand.
 * Supports ?page=product&title=... for product/blog post OG images.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(request.url);
  const pageTitle = searchParams.get('title');
  const pageType = searchParams.get('type') || 'site'; // site | product | blog

  let brand: Brand | null = null;
  try {
    brand = getBrandBySlug(slug) as Brand | null;
  } catch {
    // db not available at edge
  }

  const brandName = brand?.name || slug;
  const brandTagline = brand?.tagline || brand?.description || 'Powered by Mayasura';
  const primaryColor = brand?.primary_color || '#7C3AED';
  const secondaryColor = brand?.secondary_color || '#FFFFFF';
  const logoUrl = brand?.logo_url;

  const title = pageTitle || brandName;
  const subtitle = pageTitle ? brandName : brandTagline;

  // Accent gradient — derive from primary color
  const accentColor = brand?.accent_color || primaryColor;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: secondaryColor,
          padding: '60px 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative element */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `${primaryColor}10`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '40%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: `${accentColor}08`,
          }}
        />

        {/* Top: brand logo or name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={brandName}
              width={40}
              height={40}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: secondaryColor,
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              {brandName[0]?.toUpperCase()}
            </div>
          )}
          <span
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: primaryColor,
              letterSpacing: '-0.02em',
            }}
          >
            {brandName}
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
          {/* Page type badge */}
          {pageType !== 'site' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: `${primaryColor}12`,
                color: primaryColor,
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: '100px',
                width: 'fit-content',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
              }}
            >
              {pageType === 'product' ? '🛍️ Product' : pageType === 'blog' ? '📝 Blog Post' : pageType}
            </div>
          )}

          <h1
            style={{
              fontSize: title.length > 40 ? '42px' : '56px',
              fontWeight: 800,
              color: primaryColor,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: 0,
              maxWidth: '820px',
            }}
          >
            {title}
          </h1>

          {subtitle && subtitle !== title && (
            <p
              style={{
                fontSize: '22px',
                color: `${primaryColor}70`,
                margin: 0,
                fontWeight: 400,
                maxWidth: '720px',
                lineHeight: 1.4,
              }}
            >
              {subtitle.length > 100 ? `${subtitle.slice(0, 97)}...` : subtitle}
            </p>
          )}
        </div>

        {/* Bottom: Mayasura branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: `${primaryColor}40`,
            fontSize: '14px',
          }}
        >
          <span>Built with</span>
          <span style={{ color: primaryColor, fontWeight: 600 }}>Mayasura</span>
          <span>·</span>
          <span>{BASE_URL.replace('https://', '')}</span>
        </div>

        {/* Right decorative accent bar */}
        <div
          style={{
            position: 'absolute',
            right: '0',
            top: '0',
            bottom: '0',
            width: '6px',
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
