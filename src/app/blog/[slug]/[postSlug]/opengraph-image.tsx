import { ImageResponse } from 'next/og';
import { getBrandBySlug, getBlogPost } from '@/lib/db';
import type { Brand } from '@/lib/types';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Server-generated OpenGraph image for individual blog posts.
 */
export default async function BlogPostOGImage({
  params,
}: {
  params: Promise<{ slug: string; postSlug: string }>;
}) {
  const { slug, postSlug } = await params;

  let brand: Brand | null = null;
  let postTitle: string | null = null;

  try {
    brand = getBrandBySlug(slug) as Brand | null;
  } catch { /* ignore */ }

  try {
    if (brand) {
      const post = getBlogPost(brand.id, postSlug) as { title: string; excerpt?: string } | null;
      if (post) postTitle = post.title;
    }
  } catch { /* ignore */ }

  const brandName = brand?.name || slug;
  const primaryColor = brand?.primary_color || '#7C3AED';
  const secondaryColor = brand?.secondary_color || '#FFFFFF';
  const accentColor = brand?.accent_color || primaryColor;
  const title = postTitle || postSlug.replace(/-/g, ' ');

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
            background: `${primaryColor}08`,
          }}
        />

        {/* Brand header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: secondaryColor,
              fontSize: '16px',
              fontWeight: 800,
            }}
          >
            {brandName[0]?.toUpperCase()}
          </div>
          <span style={{ fontSize: '16px', fontWeight: 600, color: `${primaryColor}80` }}>
            {brandName} · Blog
          </span>
        </div>

        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: `${primaryColor}10`,
              color: primaryColor,
              fontSize: '13px',
              fontWeight: 600,
              padding: '5px 14px',
              borderRadius: '100px',
              width: 'fit-content',
            }}
          >
            📝 Article
          </div>

          <h1
            style={{
              fontSize: title.length > 60 ? '40px' : title.length > 40 ? '48px' : '56px',
              fontWeight: 800,
              color: primaryColor,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
              maxWidth: '900px',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: `${primaryColor}35`, fontSize: '13px' }}>
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
