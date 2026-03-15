import { ImageResponse } from 'next/og';
import { getBrandBySlug } from '@/lib/db';
import type { Brand } from '@/lib/types';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Server-generated OpenGraph image for brand site pages.
 * Next.js will serve this at /site/[slug]/opengraph-image
 */
export default async function SiteOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let brand: Brand | null = null;
  try {
    brand = getBrandBySlug(slug) as Brand | null;
  } catch { /* ignore */ }

  const brandName = brand?.name || slug;
  const tagline = brand?.tagline || brand?.description || 'Powered by Mayasura';
  const primaryColor = brand?.primary_color || '#7C3AED';
  const secondaryColor = brand?.secondary_color || '#FFFFFF';
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

        {/* Brand name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: secondaryColor,
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            {brandName[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: '20px', fontWeight: 600, color: primaryColor }}>
            {brandName}
          </span>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          <h1
            style={{
              fontSize: brandName.length > 30 ? '56px' : '72px',
              fontWeight: 800,
              color: primaryColor,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {brandName}
          </h1>
          {tagline && (
            <p
              style={{
                fontSize: '24px',
                color: `${primaryColor}65`,
                margin: 0,
                maxWidth: '700px',
                lineHeight: 1.4,
              }}
            >
              {tagline.length > 90 ? `${tagline.slice(0, 87)}...` : tagline}
            </p>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: `${primaryColor}35`, fontSize: '14px' }}>
          <span>mayasura.app</span>
        </div>

        {/* Accent bar */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            background: `linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
