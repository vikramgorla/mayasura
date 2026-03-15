'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup, useInView } from 'framer-motion';
import { useRef } from 'react';
import { useBrandSite, BrandPlaceholder } from '../layout';
import { BORDER_RADIUS_MAP } from '@/lib/design-settings';
import { getTextOnColor } from '@/lib/color-utils';
import { ProductsPageMeta, BreadcrumbMeta } from '@/components/site/site-meta';
import { getBaseUrl } from '@/lib/seo';

/* ─── Types & Constants ───────────────────────────────────────── */
type SortKey = 'default' | 'price-low' | 'price-high' | 'newest' | 'name-az';
type ViewMode = 'grid' | 'list';

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low → High' },
  { value: 'price-high', label: 'Price: High → Low' },
  { value: 'name-az', label: 'Name: A → Z' },
  { value: 'newest', label: 'Newest' },
];

type Product = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: string;
  image_url: string | null;
  category: string | null;
};

/* ─── SVG Icons ───────────────────────────────────────────────── */
const SvgIcon = ({ paths, color, size = 16 }: { paths: React.ReactNode; color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>
);
const GridIcon = ({ color }: { color: string }) => <SvgIcon color={color} paths={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />;
const ListIcon = ({ color }: { color: string }) => <SvgIcon color={color} paths={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></>} />;
const ChevronIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={14} paths={<polyline points="6 9 12 15 18 9" strokeWidth={2}/>} />;
const BoxIcon = ({ color }: { color: string }) => (
  <svg className="w-10 h-10" style={{ color: `${color}25` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);
const XIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={20} paths={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />;
const CartIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={16} paths={<><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></>} />;
const CheckIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={16} paths={<><polyline points="20 6 9 17 4 12"/></>} />;
const EyeIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={14} paths={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />;

/* ─── Helpers ─────────────────────────────────────────────────── */
function tLabel(tid: string, normal: string, bold: string, playful: string) {
  return tid === 'bold' ? bold : tid === 'playful' ? playful : normal;
}

/* ─── Scroll-reveal wrapper ────────────────────────────────────── */
function ScrollRevealCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Add to Cart Button ───────────────────────────────────────── */
function AddToCartButton({ product, ac, tc, bgColor, tid, isBold }: {
  product: Product; ac: string; tc: string; bgColor: string; tid: string; isBold: boolean;
}) {
  const [state, setState] = useState<'idle' | 'adding' | 'added'>('idle');

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (state !== 'idle') return;
    setState('adding');
    setTimeout(() => {
      setState('added');
      setTimeout(() => setState('idle'), 2000);
    }, 600);
  };

  const btnRadius = isBold ? '0' : tid === 'playful' ? '9999px' : tid === 'classic' ? '8px' : '6px';

  return (
    <motion.button
      onClick={handleAdd}
      aria-label={state === 'added' ? `${product.name} added to cart` : `Add ${product.name} to cart`}
      className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
      style={{
        backgroundColor: state === 'added' ? '#10B981' : ac,
        color: state === 'added' ? '#FFFFFF' : getTextOnColor(ac),
        borderRadius: btnRadius,
        minWidth: '36px',
        fontWeight: isBold ? 700 : 500,
        letterSpacing: isBold ? '0.06em' : undefined,
        textTransform: isBold ? 'uppercase' as const : undefined,
        fontSize: isBold ? '0.625rem' : '0.75rem',
      }}
      whileTap={{ scale: 0.95 }}
      animate={state === 'adding' ? { scale: [1, 0.95, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'idle' && (
          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5">
            <CartIcon color="#FFFFFF" />
            <span className="hidden sm:inline">{isBold ? 'ADD' : 'Add'}</span>
          </motion.span>
        )}
        {state === 'adding' && (
          <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2} aria-hidden="true">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
          </motion.span>
        )}
        {state === 'added' && (
          <motion.span key="added" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1">
            <CheckIcon color="#FFFFFF" />
            <span className="hidden sm:inline">{isBold ? 'ADDED' : 'Added!'}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─── Quick View Modal ─────────────────────────────────────────── */
function QuickViewModal({ product, onClose, tc, ac, bgColor, tid, isBold, brand }: {
  product: Product | null; onClose: () => void;
  tc: string; ac: string; bgColor: string; tid: string; isBold: boolean;
  brand: { name: string; font_heading: string; slug?: string; id: string; font_body?: string };
}) {
  const slug = brand.slug || brand.id;
  const [cartState, setCartState] = useState<'idle' | 'adding' | 'added'>('idle');

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAddToCart = () => {
    if (cartState !== 'idle') return;
    setCartState('adding');
    setTimeout(() => { setCartState('added'); setTimeout(() => setCartState('idle'), 2500); }, 700);
  };

  const modalBg = isBold ? '#0A0A0A' : tid === 'playful' ? '#FAFAFA' : bgColor;
  const cardRadius = isBold ? '0' : tid === 'playful' ? '24px' : tid === 'classic' ? '16px' : '12px';
  const btnRadius = isBold ? '0' : tid === 'playful' ? '9999px' : tid === 'classic' ? '8px' : '8px';

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={product ? `Quick view: ${product.name}` : 'Product details'}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[80vh] overflow-y-auto"
              style={{
                backgroundColor: modalBg,
                borderRadius: cardRadius,
                border: isBold ? `2px solid ${tc}15` : `1px solid ${tc}08`,
                boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
              }}
            >
              {/* Close button */}
              <div className="flex items-center justify-end p-4 pb-0">
                <button
                  onClick={onClose}
                  aria-label="Close quick view"
                  className="p-2 transition-opacity hover:opacity-60 rounded-lg"
                  style={{ backgroundColor: `${tc}08` }}
                >
                  <XIcon color={tc} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 pt-3">
                {/* Image */}
                <div
                  className="aspect-square overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: isBold ? '#111' : `${tc}08`,
                    borderRadius: isBold ? '0' : tid === 'playful' ? '16px' : '8px',
                  }}
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <BoxIcon color={tc} />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    {product.category && (
                      <span
                        className="text-[10px] font-medium uppercase tracking-widest mb-2 block"
                        style={{ color: isBold ? ac : `${tc}40` }}
                      >
                        {product.category}
                      </span>
                    )}
                    <h2
                      className="text-xl font-semibold mb-3 leading-tight"
                      style={{
                        fontFamily: brand.font_heading,
                        color: tc,
                        textTransform: isBold ? 'uppercase' : undefined,
                        letterSpacing: isBold ? '0.02em' : undefined,
                      }}
                    >
                      {product.name}
                    </h2>

                    {product.price != null && product.price > 0 && (
                      <p className="text-2xl font-bold mb-4" style={{ color: isBold ? ac : tc }}>
                        {product.currency || 'USD'} {product.price.toFixed(2)}
                      </p>
                    )}

                    {product.description && (
                      <p className="text-sm leading-relaxed mb-6" style={{ color: `${tc}60` }}>
                        {product.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Add to Cart */}
                    <motion.button
                      onClick={handleAddToCart}
                      disabled={cartState === 'adding'}
                      aria-label={cartState === 'added' ? `${product.name} added to cart` : `Add ${product.name} to cart`}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all"
                      style={{
                        backgroundColor: cartState === 'added' ? '#10B981' : ac,
                        color: cartState === 'added' ? '#FFFFFF' : getTextOnColor(ac),
                        borderRadius: btnRadius,
                        fontWeight: isBold ? 700 : 500,
                        letterSpacing: isBold ? '0.08em' : undefined,
                        textTransform: isBold ? 'uppercase' as const : undefined,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {cartState === 'idle' && (
                          <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <CartIcon color="#FFF" />
                            {tLabel(tid, 'Add to Cart', 'ADD TO CART', 'Add to Cart 🛍️')}
                          </motion.span>
                        )}
                        {cartState === 'adding' && (
                          <motion.span key="adding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2} aria-hidden="true">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                              <path d="M12 2a10 10 0 0 1 10 10" />
                            </svg>
                            Adding...
                          </motion.span>
                        )}
                        {cartState === 'added' && (
                          <motion.span key="added" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                            <CheckIcon color="#FFF" />
                            {tLabel(tid, 'Added to Cart!', 'ADDED TO CART!', '✓ Added to Cart!')}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {/* View full details */}
                    <Link
                      href={`/shop/${slug}/product/${product.id}`}
                      className="flex items-center justify-center gap-1.5 py-3 text-sm font-medium border transition-opacity hover:opacity-70"
                      style={{
                        borderColor: `${tc}15`,
                        color: tc,
                        borderRadius: btnRadius,
                      }}
                    >
                      View Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function ProductsPage() {
  const data = useBrandSite();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [view, setView] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (!data) return null;

  const { brand, products, websiteTemplate: template, designSettings } = data;
  const slug = brand.slug || brand.id;
  const tid = template?.id || 'minimal';
  const tp = template?.preview;
  const isDark = tid === 'bold' || tid === 'tech' || tid === 'neon';
  const bgColor = isDark ? (tid === 'tech' ? '#0A0F1A' : tid === 'neon' ? '#050510' : '#000000') : brand.secondary_color;
  const tc = isDark ? '#FFFFFF' : brand.primary_color;
  const ac = brand.accent_color || tc;
  const dsRadius = BORDER_RADIUS_MAP[designSettings.borderRadius];
  const maxW = tid === 'bold' ? 'max-w-7xl' : 'max-w-6xl';
  const isBold = tid === 'bold';

  const hs: React.CSSProperties = {
    fontFamily: brand.font_heading, fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'], color: tc,
  };

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))] as string[];

  const filtered = useMemo(() => {
    let r = filter === 'all' ? [...products] : products.filter(p => p.category === filter);
    if (sort === 'price-low') r.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === 'price-high') r.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sort === 'name-az') r.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'newest') r.reverse();
    return r;
  }, [products, filter, sort]);

  /* ─── Style helpers ─────────────────────────────────────────── */
  const filterBtn = (active: boolean): React.CSSProperties => {
    if (isBold) return { backgroundColor: active ? ac : 'transparent', color: active ? '#FFF' : `${tc}50`, border: `2px solid ${active ? ac : `${tc}15`}`, borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' };
    if (tid === 'playful') return { backgroundColor: active ? ac : `${tc}05`, color: active ? '#FFF' : `${tc}60`, border: 'none', borderRadius: '9999px', fontWeight: 600 };
    if (tid === 'classic') return { backgroundColor: active ? ac : 'transparent', color: active ? '#FFF' : `${tc}50`, border: `1px solid ${active ? ac : `${tc}12`}`, borderRadius: '8px', fontWeight: 500 };
    return { backgroundColor: active ? tc : 'transparent', color: active ? bgColor : `${tc}50`, border: active ? 'none' : `1px solid ${tc}12`, borderRadius: '0' };
  };

  const sortBtnStyle: React.CSSProperties = {
    border: `1px solid ${isDark ? `${tc}15` : `${tc}10`}`, borderRadius: isBold ? '0' : tid === 'playful' ? '12px' : tid === 'classic' ? '8px' : dsRadius,
    color: `${tc}60`, backgroundColor: isDark ? '#FFFFFF06' : 'transparent', padding: '0.5rem 0.875rem', fontSize: '0.75rem', fontWeight: isBold ? 700 : 500,
  };

  const viewBtn = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? (isDark ? '#FFFFFF10' : `${tc}08`) : 'transparent', borderRadius: isBold ? '0' : '6px', padding: '0.375rem', transition: 'background-color 0.15s',
  });

  const imgRadius = tid === 'playful' ? '16px' : tid === 'classic' ? '8px' : isBold ? '0' : dsRadius;
  const cardRadius = tid === 'playful' ? '20px' : tid === 'classic' ? '8px' : isBold ? '0' : dsRadius;

  /* ─── Price display ─────────────────────────────────────────── */
  const Price = ({ price, currency }: { price: number | null; currency: string }) =>
    price != null && price > 0
      ? <span className="text-sm font-medium">{currency || 'USD'} {price.toFixed(2)}</span>
      : <span className="text-xs" style={{ color: `${tc}35` }}>Contact for price</span>;

  /* ─── Category label ────────────────────────────────────────── */
  const Category = ({ cat }: { cat: string | null }) => cat ? (
    <span className={`text-[10px] font-${isBold ? 'bold' : 'medium'} uppercase tracking-widest mb-${view === 'list' ? '0.5' : '1'} block`}
      style={{ color: isBold ? ac : `${tc}30` }}>{cat}</span>
  ) : null;

  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/site/${slug}/products`;

  return (
    <>
      <ProductsPageMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={canonicalUrl}
        products={products.map(p => ({ name: p.name, description: p.description, price: p.price, currency: p.currency, imageUrl: p.image_url }))}
      />
      <BreadcrumbMeta items={[
        { name: brand.name, url: `${baseUrl}/site/${slug}` },
        { name: 'Products', url: canonicalUrl },
      ]} />
      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            tc={tc}
            ac={ac}
            bgColor={bgColor}
            tid={tid}
            isBold={isBold}
            brand={{ name: brand.name, font_heading: brand.font_heading, slug: brand.slug ?? undefined, id: brand.id }}
          />
        )}
      </AnimatePresence>

      {/* ═══════ HEADER ═══════ */}
      <section className="t-hero" style={isBold ? { minHeight: 'auto', padding: '5rem 0 3rem' } : {}}>
        <div className={`${maxW} mx-auto px-5 sm:px-8 ${tid === 'playful' ? 'text-center' : ''}`}>
          {tid === 'playful' ? (
            <>
              <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${ac}15`, color: ac }}>🛍️ Products</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Our Collection ✨</h1>
            </>
          ) : (
            <>
              <span className={`text-xs font-${isBold ? 'bold' : 'medium'} uppercase tracking-[0.2em] mb-6 block`}
                style={{ color: tid === 'editorial' || isBold ? ac : `${tc}30` }}>{isBold ? '— PRODUCTS' : 'Products'}</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {isBold ? 'OUR COLLECTION' : 'Our Collection'}
              </h1>
              {isBold && <div className="h-0.5 w-16 mt-4" style={{ backgroundColor: ac }} />}
            </>
          )}
          <p className="text-sm mt-3" style={{ color: `${tc}45` }}>
            {products.length} {products.length === 1 ? 'product' : 'products'} {tid === 'playful' ? 'to explore' : 'available'}
          </p>
        </div>
      </section>

      {/* ═══════ TOOLBAR ═══════ */}
      <section className="t-section" style={isBold ? { paddingTop: '2rem' } : {}}>
        <div className={`${maxW} mx-auto px-5 sm:px-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            {categories.length > 2 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
                {categories.map(cat => (
                  <motion.button key={cat} onClick={() => setFilter(cat)} whileTap={{ scale: 0.96 }} layout
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize"
                    style={filterBtn(filter === cat)}
                    aria-pressed={filter === cat}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 transition-colors hover:opacity-70"
                  style={sortBtnStyle}
                  aria-expanded={sortOpen}
                  aria-haspopup="listbox"
                  aria-label={`Sort by: ${SORTS.find(o => o.value === sort)?.label || 'Sort'}`}
                >
                  <span>{SORTS.find(o => o.value === sort)?.label || 'Sort'}</span>
                  <ChevronIcon color={`${tc}40`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-30 min-w-[180px] py-1 shadow-lg"
                      role="listbox"
                      aria-label="Sort options"
                      style={{ backgroundColor: isDark ? '#111' : '#FFF', border: `1px solid ${isDark ? '#FFFFFF12' : `${tc}08`}`, borderRadius: isBold ? '0' : '8px' }}
                    >
                      {SORTS.map(opt => (
                        <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          role="option"
                          aria-selected={sort === opt.value}
                          className="block w-full text-left px-4 py-2 text-xs transition-colors hover:opacity-60"
                          style={{ color: sort === opt.value ? ac : `${tc}60`, fontWeight: sort === opt.value ? 600 : 400,
                            backgroundColor: sort === opt.value ? (isDark ? '#FFFFFF06' : `${tc}03`) : 'transparent' }}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {sortOpen && <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} aria-hidden="true" />}
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-0.5 p-0.5" role="group" aria-label="View mode" style={{ backgroundColor: isDark ? '#FFFFFF06' : `${tc}04`, borderRadius: isBold ? '0' : '8px' }}>
                <button onClick={() => setView('grid')} style={viewBtn(view === 'grid')} aria-label="Grid view" aria-pressed={view === 'grid'}><GridIcon color={view === 'grid' ? tc : `${tc}30`} /></button>
                <button onClick={() => setView('list')} style={viewBtn(view === 'list')} aria-label="List view" aria-pressed={view === 'list'}><ListIcon color={view === 'list' ? tc : `${tc}30`} /></button>
              </div>
            </div>
          </div>

          {/* ═══════ PRODUCTS ═══════ */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <p className="text-sm" style={{ color: `${tc}35` }}>{tid === 'playful' ? 'No products found. Try another filter! 🔍' : 'No products found.'}</p>
            </motion.div>
          ) : (
            <LayoutGroup>
              {view === 'list' ? (
                <motion.div layout className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((p, idx) => (
                      <ScrollRevealCard key={p.id} delay={idx * 0.04}>
                        <motion.div layout exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                          <div className="group flex items-center gap-5 p-4 transition-colors"
                            style={{ backgroundColor: isDark ? '#FFFFFF06' : `${tc}03`, borderRadius: cardRadius, border: `1px solid ${isBold ? `${tc}12` : `${tc}10`}` }}>
                            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden flex items-center justify-center"
                              style={{ backgroundColor: isDark ? '#111' : `${tc}08`, borderRadius: tid === 'playful' ? '12px' : tid === 'classic' ? '6px' : isBold ? '0' : dsRadius }}>
                              {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <BoxIcon color={tc} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Category cat={p.category} />
                              <h3 className="text-sm font-medium group-hover:opacity-60 transition-opacity truncate"
                                style={{ fontFamily: brand.font_heading, textTransform: isBold ? 'uppercase' : undefined }}>{p.name}</h3>
                              {p.description && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: `${tc}40` }}>{p.description}</p>}
                            </div>
                            <div className="flex flex-shrink-0 items-center gap-3">
                              <Price price={p.price} currency={p.currency} />
                              <button
                                onClick={() => setQuickViewProduct(p)}
                                aria-label={`Quick view ${p.name}`}
                                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-medium border transition-opacity hover:opacity-60"
                                style={{ borderColor: `${tc}12`, color: `${tc}60`, borderRadius: isBold ? '0' : '6px' }}
                              >
                                <EyeIcon color={`${tc}60`} />
                                Quick View
                              </button>
                              <AddToCartButton product={p} ac={ac} tc={tc} bgColor={bgColor} tid={tid} isBold={isBold} />
                            </div>
                          </div>
                        </motion.div>
                      </ScrollRevealCard>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                /* Grid view */
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isBold ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-${tid === 'playful' ? '8' : '6'}`}>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((p, idx) => (
                      <ScrollRevealCard key={p.id} delay={Math.min(idx * 0.06, 0.4)}>
                        <motion.div layout exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.25 }}>
                          <div
                            className={`group relative transition-all cursor-pointer`}
                            style={
                              tid === 'playful'
                                ? { backgroundColor: '#FFF', borderRadius: cardRadius, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
                                : isBold
                                ? { border: `2px solid ${tc}12`, borderRadius: cardRadius }
                                : { backgroundColor: isDark ? '#FFFFFF08' : '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${isDark ? `${tc}18` : `${tc}18`}`, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)' }
                            }
                          >
                            {/* Image wrapper */}
                            <div
                              className="t-product-image mb-0 overflow-hidden relative"
                              style={{ backgroundColor: isDark ? '#111' : `${tc}08`, borderRadius: `${imgRadius} ${imgRadius} 0 0` }}
                            >
                              {p.image_url
                                ? <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                : <div className="w-full h-full flex items-center justify-center"><BoxIcon color={tc} /></div>
                              }

                              {/* Hover overlay: Quick View + Add to Cart */}
                              <div
                                className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ backgroundColor: `${isDark ? '#000' : tc}40` }}
                              >
                                <button
                                  onClick={() => setQuickViewProduct(p)}
                                  aria-label={`Quick view ${p.name}`}
                                  className="px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-transform hover:scale-105"
                                  style={{
                                    backgroundColor: isDark ? ac : '#FFF',
                                    color: isDark ? '#FFF' : tc,
                                    borderRadius: tid === 'playful' ? '9999px' : isBold ? '0' : '6px',
                                  }}
                                >
                                  <EyeIcon color={isDark ? '#FFF' : tc} />
                                  {tLabel(tid, 'Quick View', 'QUICK VIEW', 'Quick View')}
                                </button>
                              </div>
                            </div>

                            {/* Info area */}
                            <div className={tid === 'playful' ? 'px-4 pb-4' : isBold ? 'p-4' : 'p-4'}>
                              <Category cat={p.category} />
                              <h3 className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity"
                                style={{ fontFamily: brand.font_heading, textTransform: isBold ? 'uppercase' : undefined, letterSpacing: isBold ? '0.02em' : undefined }}>
                                {p.name}
                              </h3>
                              {p.description && <p className="text-xs line-clamp-2 mb-2" style={{ color: `${tc}40` }}>{p.description}</p>}

                              <div className="flex items-center justify-between gap-2 mt-2">
                                <Price price={p.price} currency={p.currency} />
                                <AddToCartButton product={p} ac={ac} tc={tc} bgColor={bgColor} tid={tid} isBold={isBold} />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </ScrollRevealCard>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </LayoutGroup>
          )}

          <div className="mt-12 text-center">
            <p className="text-xs" style={{ color: `${tc}25` }}>Showing {filtered.length} of {products.length} {products.length === 1 ? 'product' : 'products'}</p>
          </div>
        </div>
      </section>
    </>
  );
}
