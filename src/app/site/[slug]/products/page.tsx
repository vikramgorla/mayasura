'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrandSite } from '../layout';
import { BORDER_RADIUS_MAP } from '@/lib/design-settings';

export default function ProductsPage() {
  const data = useBrandSite();
  const [filter, setFilter] = useState<string>('all');

  if (!data) return null;

  const { brand, products, websiteTemplate: template, designSettings } = data;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;

  const dsRadius = BORDER_RADIUS_MAP[designSettings.borderRadius];

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  // Filter button style per template
  const filterBtnStyle = (active: boolean): React.CSSProperties => {
    if (templateId === 'bold') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: active ? `2px solid ${accentColor}` : `2px solid ${textColor}15`,
        borderRadius: '0',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      };
    }
    if (templateId === 'playful') {
      return {
        backgroundColor: active ? accentColor : `${textColor}05`,
        color: active ? '#FFFFFF' : `${textColor}60`,
        border: 'none',
        borderRadius: '9999px',
        fontWeight: 600,
      };
    }
    if (templateId === 'classic') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: `1px solid ${active ? accentColor : `${textColor}12`}`,
        borderRadius: '8px',
        fontWeight: 500,
      };
    }
    // minimal, editorial
    return {
      backgroundColor: active ? textColor : 'transparent',
      color: active ? bgColor : `${textColor}50`,
      border: active ? 'none' : `1px solid ${textColor}12`,
      borderRadius: '0',
    };
  };

  return (
    <>
      {/* Header */}
      <section className="t-hero" style={templateId === 'bold' ? { minHeight: 'auto', padding: '5rem 0 3rem' } : {}}>
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          {templateId === 'playful' ? (
            <div className="text-center">
              <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                🛍️ Products
              </span>
              <h1 className="t-hero-heading mb-3" style={{ ...headingStyle, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
                Our Collection ✨
              </h1>
              <p className="text-sm" style={{ color: `${textColor}45` }}>
                {products.length} {products.length === 1 ? 'product' : 'products'} to explore
              </p>
            </div>
          ) : (
            <>
              <span
                className={`text-xs font-${templateId === 'bold' ? 'bold' : 'medium'} uppercase tracking-[0.2em] mb-6 block`}
                style={{ color: templateId === 'editorial' ? accentColor : templateId === 'bold' ? accentColor : `${textColor}30` }}
              >
                {templateId === 'bold' ? '— PRODUCTS' : 'Products'}
              </span>
              <h1 className="t-hero-heading mb-3" style={{ ...headingStyle, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {templateId === 'bold' ? 'OUR COLLECTION' : 'Our Collection'}
              </h1>
              {templateId === 'bold' && <div className="h-0.5 w-16 mt-4" style={{ backgroundColor: accentColor }} />}
              <p className="text-sm mt-3" style={{ color: `${textColor}45` }}>
                {products.length} {products.length === 1 ? 'product' : 'products'} available
              </p>
            </>
          )}
        </div>
      </section>

      {/* Products grid */}
      <section className="t-section" style={templateId === 'bold' ? { paddingTop: '2rem' } : {}}>
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          {/* Category filter */}
          {categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize"
                  style={filterBtnStyle(filter === cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: `${textColor}35` }}>
                {templateId === 'playful' ? 'No products yet. Check back soon! 🛍️' : 'No products yet. Check back soon.'}
              </p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${templateId === 'bold' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-${templateId === 'playful' ? '8' : '6'}`}>
              {filtered.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${slug}/product/${product.id}`}
                  className={`group block ${templateId === 'bold' ? 't-product-card' : templateId === 'playful' ? 't-product-card' : ''}`}
                  style={
                    templateId === 'bold'
                      ? { borderColor: `${textColor}12` }
                      : templateId === 'playful'
                      ? { backgroundColor: '#FFFFFF' }
                      : {}
                  }
                >
                  <div
                    className="t-product-image mb-4 overflow-hidden"
                    style={{
                      backgroundColor: isDark ? '#111111' : `${textColor}04`,
                      borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : dsRadius,
                    }}
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10" style={{ color: `${textColor}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className={templateId === 'playful' ? 'px-4 pb-4' : templateId === 'bold' ? 'p-4' : ''}>
                    {product.category && (
                      <span
                        className={`text-[10px] font-${templateId === 'bold' ? 'bold' : 'medium'} uppercase tracking-widest mb-1 block`}
                        style={{ color: templateId === 'bold' ? accentColor : `${textColor}30` }}
                      >
                        {product.category}
                      </span>
                    )}
                    <h3
                      className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity"
                      style={{
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                        letterSpacing: templateId === 'bold' ? '0.02em' : undefined,
                      }}
                    >
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs line-clamp-2 mb-2" style={{ color: `${textColor}40` }}>
                        {product.description}
                      </p>
                    )}
                    {product.price != null && product.price > 0 ? (
                      <span className="text-sm font-medium">
                        {product.currency || 'USD'} {product.price.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: `${textColor}35` }}>Contact for price</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
