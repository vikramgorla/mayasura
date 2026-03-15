'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useBrandSite, BrandPlaceholder } from '../layout';
import { BORDER_RADIUS_MAP } from '@/lib/design-settings';
import { ProductsPageMeta } from '@/components/site/site-meta';

/* ─── Sort options ────────────────────────────────────────────── */
type SortKey = 'default' | 'price-low' | 'price-high' | 'newest' | 'name-az';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name-az', label: 'Name: A → Z' },
  { value: 'newest', label: 'Newest' },
];

/* ─── View mode ───────────────────────────────────────────────── */
type ViewMode = 'grid' | 'list';

/* ─── Icons ───────────────────────────────────────────────────── */
function GridIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ListIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1" fill={color} />
      <circle cx="4" cy="12" r="1" fill={color} />
      <circle cx="4" cy="18" r="1" fill={color} />
    </svg>
  );
}

function ChevronDownIcon({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Product image fallback ─────────────────────────────────── */
function ProductImageFallback({ color }: { color: string }) {
  return (
    <svg className="w-10 h-10" style={{ color: `${color}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}

export default function ProductsPage() {
  const data = useBrandSite();
  const [filter, setFilter] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [view, setView] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);

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

  /* ─── Filter + Sort logic ───────────────────────────────────── */
  const filteredAndSorted = useMemo(() => {
    let result = filter === 'all' ? [...products] : products.filter((p) => p.category === filter);

    switch (sort) {
      case 'price-low':
        result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        result.reverse();
        break;
    }
    return result;
  }, [products, filter, sort]);

  /* ─── Filter button style ──────────────────────────────────── */
  const filterBtnStyle = (active: boolean): React.CSSProperties => {
    if (templateId === 'bold') return {
      backgroundColor: active ? accentColor : 'transparent',
      color: active ? '#FFFFFF' : `${textColor}50`,
      border: active ? `2px solid ${accentColor}` : `2px solid ${textColor}15`,
      borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
    };
    if (templateId === 'playful') return {
      backgroundColor: active ? accentColor : `${textColor}05`,
      color: active ? '#FFFFFF' : `${textColor}60`,
      border: 'none', borderRadius: '9999px', fontWeight: 600,
    };
    if (templateId === 'classic') return {
      backgroundColor: active ? accentColor : 'transparent',
      color: active ? '#FFFFFF' : `${textColor}50`,
      border: `1px solid ${active ? accentColor : `${textColor}12`}`,
      borderRadius: '8px', fontWeight: 500,
    };
    return {
      backgroundColor: active ? textColor : 'transparent',
      color: active ? bgColor : `${textColor}50`,
      border: active ? 'none' : `1px solid ${textColor}12`,
      borderRadius: '0',
    };
  };

  /* ─── Sort dropdown style ──────────────────────────────────── */
  const sortBtnStyle: React.CSSProperties = {
    border: `1px solid ${isDark ? `${textColor}15` : `${textColor}10`}`,
    borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : dsRadius,
    color: `${textColor}60`,
    backgroundColor: isDark ? '#FFFFFF06' : 'transparent',
    padding: '0.5rem 0.875rem',
    fontSize: '0.75rem',
    fontWeight: templateId === 'bold' ? 700 : 500,
  };

  /* ─── View toggle style ─────────────────────────────────────── */
  const viewBtnStyle = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? (isDark ? '#FFFFFF10' : `${textColor}08`) : 'transparent',
    borderRadius: templateId === 'bold' ? '0' : '6px',
    padding: '0.375rem',
    transition: 'background-color 0.15s',
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';

  return (
    <>
      <ProductsPageMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={`${baseUrl}/site/${slug}/products`}
        products={products.map(p => ({ name: p.name, description: p.description, price: p.price, currency: p.currency, imageUrl: p.image_url }))}
      />
      {/* ═══════ HEADER ═══════ */}
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

      {/* ═══════ TOOLBAR: Filter + Sort + View ═══════ */}
      <section className="t-section" style={templateId === 'bold' ? { paddingTop: '2rem' } : {}}>
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            {/* Category filter */}
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize"
                    style={filterBtnStyle(filter === cat)}
                    whileTap={{ scale: 0.96 }}
                    layout
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Sort + View controls */}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 transition-colors hover:opacity-70"
                  style={sortBtnStyle}
                >
                  <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Sort'}</span>
                  <ChevronDownIcon color={`${textColor}40`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-30 min-w-[180px] py-1 shadow-lg"
                      style={{
                        backgroundColor: isDark ? '#111111' : '#FFFFFF',
                        border: `1px solid ${isDark ? '#FFFFFF12' : `${textColor}08`}`,
                        borderRadius: templateId === 'bold' ? '0' : '8px',
                      }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-xs transition-colors hover:opacity-60"
                          style={{
                            color: sort === opt.value ? accentColor : `${textColor}60`,
                            fontWeight: sort === opt.value ? 600 : 400,
                            backgroundColor: sort === opt.value ? (isDark ? '#FFFFFF06' : `${textColor}03`) : 'transparent',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Click-away */}
                {sortOpen && <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />}
              </div>

              {/* View toggle */}
              <div
                className="flex items-center gap-0.5 p-0.5"
                style={{
                  backgroundColor: isDark ? '#FFFFFF06' : `${textColor}04`,
                  borderRadius: templateId === 'bold' ? '0' : '8px',
                }}
              >
                <button
                  onClick={() => setView('grid')}
                  style={viewBtnStyle(view === 'grid')}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <GridIcon color={view === 'grid' ? textColor : `${textColor}30`} />
                </button>
                <button
                  onClick={() => setView('list')}
                  style={viewBtnStyle(view === 'list')}
                  aria-label="List view"
                  title="List view"
                >
                  <ListIcon color={view === 'list' ? textColor : `${textColor}30`} />
                </button>
              </div>
            </div>
          </div>

          {/* ═══════ PRODUCT GRID / LIST ═══════ */}
          {filteredAndSorted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-sm" style={{ color: `${textColor}35` }}>
                {templateId === 'playful' ? 'No products found. Try another filter! 🔍' : 'No products found.'}
              </p>
            </motion.div>
          ) : view === 'list' ? (
            /* ─── LIST VIEW ─── */
            <LayoutGroup>
              <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredAndSorted.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Link
                        href={`/shop/${slug}/product/${product.id}`}
                        className="group flex items-center gap-5 p-4 transition-colors"
                        style={{
                          backgroundColor: isDark ? '#FFFFFF04' : `${textColor}02`,
                          borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '16px' : '8px',
                          border: templateId === 'bold' ? `1px solid ${textColor}08` : `1px solid ${textColor}04`,
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden flex items-center justify-center"
                          style={{
                            backgroundColor: isDark ? '#111111' : `${textColor}04`,
                            borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '6px' : templateId === 'bold' ? '0' : dsRadius,
                          }}
                        >
                          {product.image_url ? (
                            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <ProductImageFallback color={textColor} />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {product.category && (
                            <span
                              className={`text-[10px] font-${templateId === 'bold' ? 'bold' : 'medium'} uppercase tracking-widest mb-0.5 block`}
                              style={{ color: templateId === 'bold' ? accentColor : `${textColor}30` }}
                            >
                              {product.category}
                            </span>
                          )}
                          <h3
                            className="text-sm font-medium group-hover:opacity-60 transition-opacity truncate"
                            style={{
                              fontFamily: brand.font_heading,
                              textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                            }}
                          >
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-xs line-clamp-1 mt-0.5" style={{ color: `${textColor}40` }}>
                              {product.description}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex-shrink-0 text-right">
                          {product.price != null && product.price > 0 ? (
                            <span className="text-sm font-medium">
                              {product.currency || 'USD'} {product.price.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs" style={{ color: `${textColor}35` }}>Contact for price</span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          ) : (
            /* ─── GRID VIEW ─── */
            <LayoutGroup>
              <motion.div
                layout
                className={`grid grid-cols-1 sm:grid-cols-2 ${templateId === 'bold' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-${templateId === 'playful' ? '8' : '6'}`}
              >
                <AnimatePresence mode="popLayout">
                  {filteredAndSorted.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <Link
                        href={`/shop/${slug}/product/${product.id}`}
                        className={`group block transition-all ${
                          templateId === 'playful' ? 'hover:translate-y-[-4px]' : 'hover:translate-y-[-2px]'
                        }`}
                        style={
                          templateId === 'bold'
                            ? { borderColor: `${textColor}12` }
                            : templateId === 'playful'
                            ? { backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
                            : {}
                        }
                      >
                        {/* Product image */}
                        <div
                          className="t-product-image mb-4 overflow-hidden relative"
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
                              <ProductImageFallback color={textColor} />
                            </div>
                          )}

                          {/* Quick hover overlay */}
                          <div
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ backgroundColor: `${isDark ? '#000000' : textColor}40` }}
                          >
                            <span
                              className="px-4 py-2 text-xs font-medium"
                              style={{
                                backgroundColor: isDark ? accentColor : '#FFFFFF',
                                color: isDark ? '#FFFFFF' : textColor,
                                borderRadius: templateId === 'playful' ? '9999px' : templateId === 'bold' ? '0' : '6px',
                              }}
                            >
                              {templateId === 'bold' ? 'VIEW' : templateId === 'playful' ? 'View Details ✨' : 'View Details'}
                            </span>
                          </div>
                        </div>

                        {/* Product info */}
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
          )}

          {/* Product count */}
          <div className="mt-12 text-center">
            <p className="text-xs" style={{ color: `${textColor}25` }}>
              Showing {filteredAndSorted.length} of {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
