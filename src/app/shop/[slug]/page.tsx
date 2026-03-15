'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from './layout';
import { ShopMeta, BreadcrumbMeta } from '@/components/site/site-meta';
import { getBaseUrl } from '@/lib/seo';

function getProductBadge(product: { name: string; price?: number | null; created_at?: string }, index: number): { label: string; type: 'new' | 'sale' | 'best' } | null {
  // Simple heuristic: first 2 products = "Best Seller", next 2 = "New", products with low price = "Sale"
  if (index < 2) return { label: 'Best Seller', type: 'best' };
  if (index < 4) return { label: 'New', type: 'new' };
  if (product.price && product.price < 20) return { label: 'Sale', type: 'sale' };
  return null;
}

export default function ShopPage() {
  const shop = useShop();
  const [filter, setFilter] = useState<string>('all');

  if (!shop) return null;
  const { brand, products, addToCart, websiteTemplate: template } = shop;
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

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];
  const filtered = filter === 'all' ? products : products.filter((p) => p.category === filter);

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';

  // Badge style per type
  const badgeStyle = (type: 'new' | 'sale' | 'best'): React.CSSProperties => {
    const colors = {
      new: { bg: '#3B82F6', text: '#FFFFFF' },
      sale: { bg: '#EF4444', text: '#FFFFFF' },
      best: { bg: accentColor, text: '#FFFFFF' },
    };
    const c = colors[type];
    return {
      backgroundColor: c.bg,
      color: c.text,
      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
      fontSize: '0.625rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      textTransform: 'uppercase' as const,
      padding: '2px 8px',
    };
  };

  // Filter button style per template
  const filterBtnStyle = (active: boolean): React.CSSProperties => {
    if (templateId === 'bold') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: `2px solid ${active ? accentColor : `${textColor}15`}`,
        borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      };
    }
    if (templateId === 'playful') {
      return {
        backgroundColor: active ? accentColor : `${textColor}05`,
        color: active ? '#FFFFFF' : `${textColor}60`,
        border: 'none', borderRadius: '9999px', fontWeight: 600,
      };
    }
    if (templateId === 'classic') {
      return {
        backgroundColor: active ? accentColor : 'transparent',
        color: active ? '#FFFFFF' : `${textColor}50`,
        border: `1px solid ${active ? accentColor : `${textColor}12`}`,
        borderRadius: '8px', fontWeight: 500,
      };
    }
    return {
      backgroundColor: active ? textColor : 'transparent',
      color: active ? bgColor : `${textColor}50`,
      border: active ? 'none' : `1px solid ${textColor}10`,
      borderRadius: '0',
    };
  };

  // Add to cart button style
  const addBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '0',
      fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      fontSize: '0.6875rem',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.75rem',
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '8px',
      fontWeight: 500, fontSize: '0.75rem',
    };
    return {
      backgroundColor: textColor, color: bgColor, borderRadius: '0',
      fontWeight: 500, fontSize: '0.75rem',
    };
  })();

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/shop/${slug}`;

  return (
    <>
      <ShopMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={canonicalUrl}
      />
      <BreadcrumbMeta items={[
        { name: brand.name, url: `${baseUrl}/site/${slug}` },
        { name: 'Shop', url: canonicalUrl },
      ]} />
      {/* Header */}
      <section className="py-16 sm:py-20">
        <div className={`${containerWidth} mx-auto px-5 sm:px-8`}>
          {templateId === 'playful' ? (
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full mb-6" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                🛍️ Shop
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>
                All Products ✨
              </h1>
              <p className="text-sm" style={{ color: `${textColor}45` }}>
                {products.length} {products.length === 1 ? 'item' : 'items'} to explore
              </p>
            </div>
          ) : templateId === 'bold' ? (
            <>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>
                — SHOP
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-tight mb-3" style={headingStyle}>
                ALL PRODUCTS
              </h1>
              <div className="h-0.5 w-16 mt-4" style={{ backgroundColor: accentColor }} />
              <p className="text-sm mt-4" style={{ color: `${textColor}40` }}>
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </>
          ) : templateId === 'editorial' ? (
            <>
              <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
                Shop
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={headingStyle}>
                All Products
              </h1>
              <p className="text-sm" style={{ color: `${textColor}45` }}>
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </>
          ) : templateId === 'classic' ? (
            <div className="text-center">
              <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
                Shop
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold mb-3" style={headingStyle}>
                All Products
              </h1>
              <p className="text-sm" style={{ color: `${textColor}45` }}>
                Browse our complete collection
              </p>
            </div>
          ) : (
            // Minimal
            <>
              <span className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block" style={{ color: `${textColor}25` }}>
                Shop
              </span>
              <h1 className="text-2xl font-light tracking-tight mb-3" style={{ ...headingStyle, fontWeight: 300 }}>
                All Products
              </h1>
              <p className="text-sm" style={{ color: `${textColor}30` }}>
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </p>
            </>
          )}
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className={`${containerWidth} mx-auto px-5 sm:px-8`}>
          {/* Filter */}
          {categories.length > 2 && (
            <div className={`flex flex-wrap gap-2 mb-10 ${templateId === 'classic' || templateId === 'playful' ? 'justify-center' : ''}`}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="px-4 py-2 text-xs font-medium tracking-wider transition-all capitalize"
                  style={filterBtnStyle(filter === cat)}
                >
                  {templateId === 'bold' ? cat.toUpperCase() : cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <motion.div
              className="text-center py-24"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
                style={{ backgroundColor: `${textColor}06` }}
              >
                {templateId === 'playful' ? '🛍️' : templateId === 'bold' ? '∅' : '○'}
              </div>
              <h3
                className="text-lg mb-2"
                style={{
                  fontFamily: brand.font_heading,
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                  color: textColor,
                }}
              >
                {filter !== 'all'
                  ? (templateId === 'bold' ? `NO ${filter.toUpperCase()} PRODUCTS` : `No ${filter} products`)
                  : (templateId === 'playful' ? 'Nothing here yet! 🌱' : templateId === 'bold' ? 'NO PRODUCTS YET' : 'No products yet')}
              </h3>
              <p className="text-sm mb-8" style={{ color: `${textColor}40` }}>
                {filter !== 'all'
                  ? 'Try a different category or browse all products.'
                  : 'Check back soon — products are on their way.'}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: isDark ? accentColor : textColor,
                    color: isDark ? '#FFFFFF' : bgColor,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                    fontWeight: templateId === 'bold' ? 700 : 500,
                    letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  }}
                >
                  {templateId === 'bold' ? 'BROWSE ALL' : templateId === 'playful' ? 'Browse All ✨' : 'Browse All'}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className={`grid grid-cols-1 sm:grid-cols-2 ${templateId === 'bold' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} xl:grid-cols-4 gap-6`}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06 } },
              }}
            >
              <AnimatePresence>
                {filtered.map((product, index) => {
                  const badge = getProductBadge(product, index);
                  return (
                    <motion.div
                      key={product.id}
                      className="group relative"
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
                      }}
                      layout
                      style={
                        templateId === 'bold'
                          ? { border: `2px solid ${textColor}10` }
                          : templateId === 'playful'
                          ? { backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }
                          : templateId === 'classic'
                          ? { borderRadius: '10px', overflow: 'hidden', boxShadow: '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' }
                          : {}
                      }
                    >
                      <Link href={`/shop/${slug}/product/${product.id}`}>
                        <div
                          className="aspect-square overflow-hidden flex items-center justify-center relative"
                          style={{
                            backgroundColor: isDark ? '#111111' : `${textColor}04`,
                          }}
                        >
                          {/* Product badge */}
                          {badge && (
                            <div className="absolute top-3 left-3 z-10">
                              <span style={badgeStyle(badge.type)}>{badge.label}</span>
                            </div>
                          )}

                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-10 h-10" style={{ color: `${textColor}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                          )}

                          {/* Hover overlay with quick-add button */}
                          <div
                            className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ background: `linear-gradient(to top, ${isDark ? '#000000' : '#000000'}60 0%, transparent 50%)` }}
                          >
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart({
                                  productId: product.id,
                                  name: product.name,
                                  price: product.price || 0,
                                  currency: product.currency || 'USD',
                                  image_url: product.image_url || undefined,
                                });
                              }}
                              className="px-6 py-2.5 text-sm font-medium transition-all hover:scale-105 active:scale-95"
                              style={{
                                backgroundColor: '#FFFFFF',
                                color: '#000000',
                                borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '2px',
                                fontWeight: 600,
                                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                              }}
                            >
                              {templateId === 'bold' ? 'QUICK ADD' : templateId === 'playful' ? 'Quick Add 🛒' : 'Quick Add'}
                            </button>
                          </div>
                        </div>
                        <div className={templateId === 'playful' || templateId === 'classic' ? 'p-4' : templateId === 'bold' ? 'p-4' : 'mt-4'}>
                          {product.category && (
                            <span
                              className="text-[10px] font-medium uppercase tracking-widest mb-1 block"
                              style={{
                                color: templateId === 'bold' ? accentColor : `${textColor}30`,
                                fontWeight: templateId === 'bold' ? 700 : 500,
                              }}
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
                            <p className="text-xs line-clamp-1 mb-2" style={{ color: `${textColor}40` }}>
                              {product.description}
                            </p>
                          )}
                        </div>
                      </Link>
                      <div className={`flex items-center justify-between ${templateId === 'playful' || templateId === 'classic' || templateId === 'bold' ? 'px-4 pb-4' : 'mt-2'}`}>
                        {product.price != null && product.price > 0 ? (
                          <span className="text-sm font-medium">
                            {product.currency || 'USD'} {product.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xs" style={{ color: `${textColor}35` }}>Free</span>
                        )}
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
                          className="text-xs px-4 py-2 transition-all hover:opacity-80 active:scale-95"
                          style={addBtnStyle}
                        >
                          {templateId === 'bold' ? 'ADD' : templateId === 'playful' ? 'Add to Cart 🛒' : 'Add to Cart'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
