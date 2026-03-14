'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '../../layout';

export default function ProductDetailPage() {
  const shop = useShop();
  const params = useParams();
  const productId = params.productId as string;

  if (!shop) return null;
  const { brand, products, addToCart, cartCount, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4" style={headingStyle}>Product not found</h1>
        <Link href={`/shop/${slug}`} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: accentColor }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  // Button styles per template
  const addBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '0',
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
      fontSize: '0.75rem', padding: '1rem 2.5rem',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.9375rem', padding: '0.875rem 2.5rem',
      boxShadow: `0 8px 32px ${accentColor}30`,
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '8px',
      fontWeight: 500, fontSize: '0.9375rem', padding: '0.875rem 2.5rem',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.06), -3px -3px 6px rgba(255,255,255,0.6)',
    };
    return {
      backgroundColor: textColor, color: bgColor, borderRadius: '0',
      fontWeight: 500, fontSize: '0.875rem', padding: '0.875rem 2.5rem',
    };
  })();

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href={`/shop/${slug}`}
          className="text-sm transition-opacity hover:opacity-60"
          style={{
            color: accentColor,
            fontWeight: templateId === 'bold' ? 700 : 400,
            letterSpacing: templateId === 'bold' ? '0.1em' : undefined,
            textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
            fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
          }}
        >
          {templateId === 'bold' ? '← ALL PRODUCTS' : '← Back to shop'}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image */}
        <div
          className="overflow-hidden aspect-square flex items-center justify-center"
          style={{
            backgroundColor: isDark ? '#111111' : `${textColor}04`,
            borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0',
            border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
          }}
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-16 h-16" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {product.category && (
            <span
              className="text-xs font-medium uppercase tracking-wider mb-4 block"
              style={{
                color: accentColor,
                fontWeight: templateId === 'bold' ? 700 : 500,
                letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
              }}
            >
              {product.category}
            </span>
          )}

          <h1
            className="mb-4"
            style={{
              ...headingStyle,
              fontSize: templateId === 'bold' ? 'clamp(1.5rem, 3vw, 2.5rem)' : 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: templateId === 'minimal' ? 400 : headingStyle.fontWeight,
              lineHeight: 1.15,
            }}
          >
            {product.name}
          </h1>

          {product.price != null && product.price > 0 ? (
            <p
              className="text-2xl font-semibold mb-6"
              style={{ color: accentColor, fontWeight: templateId === 'bold' ? 700 : 600 }}
            >
              {product.currency || 'USD'} {product.price.toFixed(2)}
            </p>
          ) : (
            <p className="text-lg mb-6" style={{ color: `${textColor}40` }}>Free</p>
          )}

          {product.description && (
            <p className="text-sm leading-relaxed mb-8" style={{ color: `${textColor}55` }}>
              {product.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() =>
                addToCart({
                  productId: product.id,
                  name: product.name,
                  price: product.price || 0,
                  currency: product.currency || 'USD',
                  image_url: product.image_url || undefined,
                })
              }
              className="transition-all hover:opacity-90"
              style={addBtnStyle}
            >
              {templateId === 'bold' ? 'ADD TO CART' : templateId === 'playful' ? 'Add to Cart 🛒' : 'Add to Cart'}
            </button>

            {cartCount > 0 && (
              <Link
                href={`/shop/${slug}/cart`}
                className="px-8 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
                style={{
                  borderColor: `${textColor}15`,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  borderWidth: templateId === 'bold' ? '2px' : '1px',
                }}
              >
                {templateId === 'bold' ? `VIEW CART (${cartCount})` : `View Cart (${cartCount})`}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
