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
  const maxW = tid === 'bold' || tid === 'corporate' ? 'max-w-7xl' : tid === 'portfolio' ? 'max-w-7xl' : 'max-w-6xl';
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
    if (tid === 'startup') return { backgroundColor: active ? ac : `${tc}04`, color: active ? '#FFF' : `${tc}55`, border: 'none', borderRadius: '9999px', fontWeight: 600, boxShadow: active ? '0 2px 8px rgba(99,102,241,0.2)' : 'none' };
    if (tid === 'portfolio') return { backgroundColor: 'transparent', color: active ? tc : `${tc}35`, border: 'none', borderRadius: '0', fontWeight: 400, borderBottom: active ? `2px solid ${tc}` : '2px solid transparent', paddingBottom: '0.5rem' };
    if (tid === 'magazine') return { backgroundColor: 'transparent', color: active ? tc : `${tc}40`, border: 'none', borderRadius: '0', fontWeight: 600, fontVariant: 'small-caps' as const, fontSize: '0.8125rem', borderBottom: active ? `2px solid ${tc}` : 'none' };
    if (tid === 'boutique') return { backgroundColor: 'transparent', color: active ? tc : `${tc}40`, border: `1px solid ${active ? tc : `${tc}12`}`, borderRadius: '0', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.625rem' };
    if (tid === 'tech') return { backgroundColor: active ? '#10B98120' : 'transparent', color: active ? '#10B981' : `${tc}40`, border: `1px solid ${active ? '#10B981' : `${tc}15`}`, borderRadius: '6px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" };
    if (tid === 'wellness') return { backgroundColor: active ? `${ac}15` : 'transparent', color: active ? ac : `${tc}45`, border: 'none', borderRadius: '9999px', fontWeight: 400, letterSpacing: '0.03em' };
    if (tid === 'restaurant') return { backgroundColor: active ? ac : 'transparent', color: active ? '#FFF' : `${tc}50`, border: `1px solid ${active ? ac : `${tc}15`}`, borderRadius: '4px', fontWeight: 600 };
    if (tid === 'neon') return { backgroundColor: active ? `${ac}25` : 'transparent', color: active ? ac : `${tc}35`, border: `1px solid ${active ? ac : `${tc}12`}`, borderRadius: '0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' };
    if (tid === 'organic') return { backgroundColor: active ? `${ac}18` : `${tc}04`, color: active ? ac : `${tc}45`, border: 'none', borderRadius: '20px', fontWeight: 600 };
    if (tid === 'artisan') return { backgroundColor: active ? tc : 'transparent', color: active ? bgColor : `${tc}50`, border: `2px solid ${active ? tc : `${tc}15`}`, borderRadius: '4px', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.6875rem' };
    if (tid === 'corporate') return { backgroundColor: active ? ac : 'transparent', color: active ? '#FFF' : `${tc}50`, border: `1px solid ${active ? ac : `${tc}12`}`, borderRadius: '6px', fontWeight: 600 };
    return { backgroundColor: active ? tc : 'transparent', color: active ? bgColor : `${tc}50`, border: active ? 'none' : `1px solid ${tc}12`, borderRadius: '0' };
  };

  const sortRadius = isBold ? '0' : tid === 'playful' || tid === 'startup' || tid === 'wellness' ? '12px' : tid === 'classic' || tid === 'tech' || tid === 'corporate' ? '8px' : tid === 'boutique' || tid === 'neon' || tid === 'magazine' ? '0' : tid === 'organic' ? '16px' : tid === 'artisan' || tid === 'restaurant' ? '4px' : dsRadius;

  const sortBtnStyle: React.CSSProperties = {
    border: `1px solid ${isDark ? `${tc}15` : `${tc}10`}`, borderRadius: sortRadius,
    color: `${tc}60`, backgroundColor: isDark ? '#FFFFFF06' : 'transparent', padding: '0.5rem 0.875rem', fontSize: '0.75rem', fontWeight: isBold ? 700 : 500,
  };

  const viewBtn = (active: boolean): React.CSSProperties => ({
    backgroundColor: active ? (isDark ? '#FFFFFF10' : `${tc}08`) : 'transparent', borderRadius: isBold || tid === 'neon' ? '0' : '6px', padding: '0.375rem', transition: 'background-color 0.15s',
  });

  const imgRadius = tid === 'playful' ? '16px' : tid === 'classic' ? '8px' : isBold || tid === 'neon' || tid === 'boutique' || tid === 'magazine' ? '0' : tid === 'wellness' || tid === 'organic' ? '16px' : tid === 'startup' ? '12px' : tid === 'portfolio' ? '0' : tid === 'artisan' || tid === 'restaurant' ? '4px' : tid === 'tech' || tid === 'corporate' ? '8px' : dsRadius;
  const cardRadius = tid === 'playful' ? '20px' : tid === 'classic' ? '8px' : isBold || tid === 'neon' || tid === 'boutique' || tid === 'magazine' ? '0' : tid === 'wellness' ? '20px' : tid === 'organic' ? '24px' : tid === 'startup' ? '16px' : tid === 'portfolio' ? '0' : tid === 'artisan' || tid === 'restaurant' ? '4px' : tid === 'tech' || tid === 'corporate' ? '8px' : dsRadius;

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
      <section className="t-hero" style={isBold ? { minHeight: 'auto', padding: '5rem 0 3rem' } : tid === 'boutique' ? { minHeight: 'auto', padding: '7rem 0 4rem' } : tid === 'portfolio' ? { minHeight: 'auto', padding: '4rem 0 2rem' } : {}}>
        <div className={`${maxW} mx-auto px-5 sm:px-8 ${tid === 'playful' || tid === 'startup' || tid === 'wellness' || tid === 'organic' || tid === 'boutique' || tid === 'neon' ? 'text-center' : ''}`}>
          {tid === 'playful' ? (
            <>
              <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${ac}15`, color: ac }}>🛍️ Products</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Our Collection ✨</h1>
            </>
          ) : tid === 'startup' ? (
            <>
              <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${ac}12`, color: ac, borderRadius: '9999px' }}>Products</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Explore Our Products</h1>
              <div className="flex justify-center gap-8 mt-6">
                {[{ n: products.length.toString(), l: 'Products' }, { n: new Set(products.map(p => p.category).filter(Boolean)).size.toString(), l: 'Categories' }].map(s => (
                  <div key={s.l} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: ac }}>{s.n}</div>
                    <div className="text-xs mt-1" style={{ color: `${tc}40` }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </>
          ) : tid === 'portfolio' ? (
            <>
              <h1 className="t-hero-heading mb-2" style={{ ...hs, fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 400 }}>Work</h1>
              <p className="text-sm" style={{ color: `${tc}35`, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{products.length} pieces</p>
            </>
          ) : tid === 'magazine' ? (
            <>
              <div className="mb-4" style={{ borderBottom: `2px solid ${tc}`, paddingBottom: '0.75rem' }}>
                <h1 className="t-hero-heading" style={{ ...hs, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 700 }}>The Collection</h1>
              </div>
              <p className="text-sm mt-3" style={{ color: `${tc}50`, fontStyle: 'italic' }}>Curated selections — {products.length} items</p>
            </>
          ) : tid === 'boutique' ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.3em] mb-6 block" style={{ color: `${tc}35` }}>◆ Collection ◆</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Our Catalogue</h1>
              <div className="w-12 h-px mx-auto mt-4" style={{ backgroundColor: ac }} />
            </>
          ) : tid === 'tech' ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono" style={{ color: '#10B981' }}>{'>'}</span>
                <span className="text-xs font-mono" style={{ color: `${tc}40` }}>~/products</span>
              </div>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Products</h1>
              <p className="text-xs font-mono" style={{ color: `${tc}35` }}>{`// ${products.length} items loaded`}</p>
            </>
          ) : tid === 'wellness' ? (
            <>
              <span className="text-xs tracking-[0.15em] mb-6 block" style={{ color: `${tc}35`, fontWeight: 300 }}>Our Offerings</span>
              <h1 className="t-hero-heading mb-4" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, letterSpacing: '0.02em' }}>Curated for You</h1>
              <p className="text-sm mx-auto" style={{ color: `${tc}40`, maxWidth: '420px', lineHeight: 1.8 }}>Products designed to bring balance and well-being to your everyday life.</p>
            </>
          ) : tid === 'restaurant' ? (
            <>
              <span className="text-xs uppercase tracking-[0.15em] mb-4 block" style={{ color: ac, fontWeight: 600 }}>Our Menu</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>The Menu</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="h-px flex-1" style={{ backgroundColor: `${tc}12` }} />
                <span className="text-xs" style={{ color: `${tc}35` }}>{products.length} items</span>
                <div className="h-px flex-1" style={{ backgroundColor: `${tc}12` }} />
              </div>
            </>
          ) : tid === 'neon' ? (
            <>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 800, textShadow: `0 0 40px ${ac}40` }}>PRODUCTS</h1>
              <p className="text-sm" style={{ color: `${tc}40` }}>{products.length} items in the grid</p>
            </>
          ) : tid === 'organic' ? (
            <>
              <span className="text-xs tracking-[0.1em] mb-4 block" style={{ color: `${tc}40` }}>🌿 Our Products</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700 }}>Naturally Crafted</h1>
            </>
          ) : tid === 'artisan' ? (
            <>
              <div className="inline-block mb-4 px-3 py-1" style={{ border: `2px solid ${tc}15` }}>
                <span className="text-[10px] font-mono uppercase tracking-[0.15em]" style={{ color: `${tc}50` }}>Product Catalog</span>
              </div>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>Handmade Collection</h1>
              <p className="text-xs font-mono" style={{ color: `${tc}35` }}>Est. {new Date().getFullYear()} · {products.length} Items</p>
            </>
          ) : tid === 'corporate' ? (
            <>
              <span className="text-xs font-semibold uppercase tracking-[0.12em] mb-4 block" style={{ color: ac }}>Product Suite</span>
              <h1 className="t-hero-heading mb-3" style={{ ...hs, fontSize: 'clamp(2rem, 4.5vw, 3rem)' }}>Our Solutions</h1>
              <p className="text-sm mt-3" style={{ color: `${tc}45` }}>{products.length} products designed for enterprise performance.</p>
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
          {!['startup', 'portfolio', 'boutique', 'tech', 'wellness', 'restaurant', 'neon', 'organic', 'artisan', 'corporate', 'magazine'].includes(tid) && (
            <p className="text-sm mt-3" style={{ color: `${tc}45` }}>
              {products.length} {products.length === 1 ? 'product' : 'products'} {tid === 'playful' ? 'to explore' : 'available'}
            </p>
          )}
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
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${isBold || tid === 'corporate' ? 'lg:grid-cols-4' : tid === 'portfolio' ? 'lg:grid-cols-3 xl:grid-cols-4' : tid === 'magazine' ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} ${tid === 'playful' ? 'gap-8' : tid === 'portfolio' ? 'gap-3' : tid === 'magazine' ? 'gap-8' : tid === 'wellness' || tid === 'organic' ? 'gap-8' : 'gap-6'}`}>
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
                                : tid === 'startup'
                                ? { backgroundColor: '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${tc}10`, boxShadow: '0 4px 16px rgba(99,102,241,0.06)' }
                                : tid === 'portfolio'
                                ? { overflow: 'hidden', borderRadius: cardRadius }
                                : tid === 'magazine'
                                ? { overflow: 'hidden', borderBottom: `1px solid ${tc}10` }
                                : tid === 'boutique'
                                ? { overflow: 'hidden', border: `1px solid ${tc}08`, borderRadius: cardRadius }
                                : tid === 'tech'
                                ? { backgroundColor: '#0D1520', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid #10B98120` }
                                : tid === 'wellness'
                                ? { backgroundColor: '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }
                                : tid === 'restaurant'
                                ? { backgroundColor: '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${tc}08` }
                                : tid === 'neon'
                                ? { backgroundColor: '#0A0A1A', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${ac}20` }
                                : tid === 'organic'
                                ? { backgroundColor: '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }
                                : tid === 'artisan'
                                ? { overflow: 'hidden', border: `2px solid ${tc}12`, borderRadius: cardRadius }
                                : tid === 'corporate'
                                ? { backgroundColor: '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${tc}10` }
                                : { backgroundColor: isDark ? '#FFFFFF08' : '#FFFFFF', borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${isDark ? `${tc}18` : `${tc}18`}`, boxShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.08)' }
                            }
                          >
                            {/* Image wrapper */}
                            <div
                              className="t-product-image mb-0 overflow-hidden relative"
                              style={{
                                backgroundColor: isDark || tid === 'tech' || tid === 'neon' ? '#111' : `${tc}08`,
                                borderRadius: `${imgRadius} ${imgRadius} 0 0`,
                                aspectRatio: tid === 'portfolio' ? '4/5' : tid === 'magazine' ? '3/2' : tid === 'boutique' ? '3/4' : undefined,
                              }}
                            >
                              {p.image_url
                                ? <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                : <div className="w-full h-full flex items-center justify-center"><BoxIcon color={tc} /></div>
                              }

                              {/* Hover overlay: Quick View + Add to Cart */}
                              <div
                                className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ backgroundColor: tid === 'neon' ? `${ac}15` : `${isDark || tid === 'tech' ? '#000' : tc}40` }}
                              >
                                <button
                                  onClick={() => setQuickViewProduct(p)}
                                  aria-label={`Quick view ${p.name}`}
                                  className="px-3 py-2 text-xs font-medium flex items-center gap-1.5 transition-transform hover:scale-105"
                                  style={{
                                    backgroundColor: isDark || tid === 'tech' || tid === 'neon' ? ac : '#FFF',
                                    color: isDark || tid === 'tech' || tid === 'neon' ? '#FFF' : tc,
                                    borderRadius: tid === 'playful' || tid === 'startup' || tid === 'wellness' ? '9999px' : isBold || tid === 'neon' || tid === 'boutique' ? '0' : '6px',
                                  }}
                                >
                                  <EyeIcon color={isDark || tid === 'tech' || tid === 'neon' ? '#FFF' : tc} />
                                  {tid === 'boutique' ? 'VIEW' : tid === 'tech' ? '> view' : tid === 'neon' ? 'INSPECT' : tLabel(tid, 'Quick View', 'QUICK VIEW', 'Quick View')}
                                </button>
                              </div>

                              {/* Boutique: price badge overlay */}
                              {tid === 'boutique' && p.price != null && p.price > 0 && (
                                <div className="absolute bottom-3 right-3 px-2.5 py-1 text-xs" style={{ backgroundColor: '#FFF', color: tc, letterSpacing: '0.05em' }}>
                                  {p.currency || 'USD'} {p.price.toFixed(2)}
                                </div>
                              )}
                            </div>

                            {/* Info area */}
                            <div className={tid === 'playful' ? 'px-4 pb-4' : tid === 'portfolio' ? 'p-3' : tid === 'magazine' ? 'py-4' : tid === 'boutique' ? 'p-5 text-center' : tid === 'wellness' || tid === 'organic' ? 'p-5' : isBold ? 'p-4' : 'p-4'}>
                              {/* Category */}
                              {tid === 'tech' && p.category ? (
                                <span className="text-[10px] font-mono text-emerald-400 mb-1 block">{`// ${p.category}`}</span>
                              ) : tid === 'magazine' && p.category ? (
                                <span className="text-[10px] font-semibold uppercase tracking-widest mb-1 block" style={{ color: ac, fontVariant: 'small-caps' }}>{p.category}</span>
                              ) : tid === 'boutique' && p.category ? (
                                <span className="text-[9px] uppercase tracking-[0.2em] mb-2 block" style={{ color: `${tc}35` }}>{p.category}</span>
                              ) : tid === 'artisan' && p.category ? (
                                <span className="text-[10px] font-mono uppercase tracking-wider mb-1 block" style={{ color: `${tc}40` }}>[{p.category}]</span>
                              ) : (
                                <Category cat={p.category} />
                              )}

                              {/* Product name */}
                              <h3 className={`text-sm mb-1 group-hover:opacity-60 transition-opacity ${tid === 'boutique' ? 'tracking-wide' : ''}`}
                                style={{
                                  fontFamily: tid === 'tech' ? "'JetBrains Mono', monospace" : brand.font_heading,
                                  textTransform: isBold || tid === 'boutique' ? 'uppercase' : undefined,
                                  letterSpacing: isBold ? '0.02em' : tid === 'boutique' ? '0.06em' : undefined,
                                  fontWeight: tid === 'portfolio' || tid === 'wellness' ? 400 : tid === 'magazine' ? 600 : 500,
                                }}>
                                {p.name}
                              </h3>

                              {/* Description */}
                              {p.description && tid !== 'portfolio' && (
                                <p className={`text-xs line-clamp-2 mb-2 ${tid === 'magazine' ? 'line-clamp-3 leading-relaxed' : ''}`} style={{ color: tid === 'tech' ? '#64748B' : `${tc}40` }}>{p.description}</p>
                              )}

                              {/* Price + cart */}
                              {tid === 'boutique' ? (
                                <div className="mt-3">
                                  <AddToCartButton product={p} ac={ac} tc={tc} bgColor={bgColor} tid={tid} isBold={isBold} />
                                </div>
                              ) : tid === 'portfolio' ? (
                                <div className="mt-1">
                                  <Price price={p.price} currency={p.currency} />
                                </div>
                              ) : (
                                <div className="flex items-center justify-between gap-2 mt-2">
                                  <Price price={p.price} currency={p.currency} />
                                  <AddToCartButton product={p} ac={ac} tc={tc} bgColor={bgColor} tid={tid} isBold={isBold} />
                                </div>
                              )}
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
