'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useBrandSite, BrandPlaceholder } from '../layout';
import { BORDER_RADIUS_MAP } from '@/lib/design-settings';

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

/* ─── SVG Icons ───────────────────────────────────────────────── */
const SvgIcon = ({ paths, color, size = 16 }: { paths: React.ReactNode; color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);
const GridIcon = ({ color }: { color: string }) => <SvgIcon color={color} paths={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />;
const ListIcon = ({ color }: { color: string }) => <SvgIcon color={color} paths={<><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill={color}/><circle cx="4" cy="12" r="1" fill={color}/><circle cx="4" cy="18" r="1" fill={color}/></>} />;
const ChevronIcon = ({ color }: { color: string }) => <SvgIcon color={color} size={14} paths={<polyline points="6 9 12 15 18 9" strokeWidth={2}/>} />;
const BoxIcon = ({ color }: { color: string }) => (
  <svg className="w-10 h-10" style={{ color: `${color}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

/* ─── Helpers ─────────────────────────────────────────────────── */
function tLabel(tid: string, normal: string, bold: string, playful: string) {
  return tid === 'bold' ? bold : tid === 'playful' ? playful : normal;
}

export default function ProductsPage() {
  const data = useBrandSite();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('default');
  const [view, setView] = useState<ViewMode>('grid');
  const [sortOpen, setSortOpen] = useState(false);

  if (!data) return null;

  const { brand, products, websiteTemplate: template, designSettings } = data;
  const slug = brand.slug || brand.id;
  const tid = template?.id || 'minimal';
  const tp = template?.preview;
  const isDark = tid === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color;
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

  return (
    <>
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
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <motion.button key={cat} onClick={() => setFilter(cat)} whileTap={{ scale: 0.96 }} layout
                    className="px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all capitalize" style={filterBtn(filter === cat)}>
                    {cat}
                  </motion.button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="relative">
                <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-2 transition-colors hover:opacity-70" style={sortBtnStyle}>
                  <span>{SORTS.find(o => o.value === sort)?.label || 'Sort'}</span>
                  <ChevronIcon color={`${tc}40`} />
                </button>
                <AnimatePresence>
                  {sortOpen && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1 z-30 min-w-[180px] py-1 shadow-lg"
                      style={{ backgroundColor: isDark ? '#111' : '#FFF', border: `1px solid ${isDark ? '#FFFFFF12' : `${tc}08`}`, borderRadius: isBold ? '0' : '8px' }}>
                      {SORTS.map(opt => (
                        <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-xs transition-colors hover:opacity-60"
                          style={{ color: sort === opt.value ? ac : `${tc}60`, fontWeight: sort === opt.value ? 600 : 400,
                            backgroundColor: sort === opt.value ? (isDark ? '#FFFFFF06' : `${tc}03`) : 'transparent' }}>
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {sortOpen && <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />}
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-0.5 p-0.5" style={{ backgroundColor: isDark ? '#FFFFFF06' : `${tc}04`, borderRadius: isBold ? '0' : '8px' }}>
                <button onClick={() => setView('grid')} style={viewBtn(view === 'grid')} aria-label="Grid view"><GridIcon color={view === 'grid' ? tc : `${tc}30`} /></button>
                <button onClick={() => setView('list')} style={viewBtn(view === 'list')} aria-label="List view"><ListIcon color={view === 'list' ? tc : `${tc}30`} /></button>
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
                    {filtered.map(p => (
                      <motion.div key={p.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.25 }}>
                        <Link href={`/shop/${slug}/product/${p.id}`} className="group flex items-center gap-5 p-4 transition-colors"
                          style={{ backgroundColor: isDark ? '#FFFFFF04' : `${tc}02`, borderRadius: cardRadius, border: `1px solid ${isBold ? `${tc}08` : `${tc}04`}` }}>
                          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden flex items-center justify-center"
                            style={{ backgroundColor: isDark ? '#111' : `${tc}04`, borderRadius: tid === 'playful' ? '12px' : tid === 'classic' ? '6px' : isBold ? '0' : dsRadius }}>
                            {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <BoxIcon color={tc} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Category cat={p.category} />
                            <h3 className="text-sm font-medium group-hover:opacity-60 transition-opacity truncate"
                              style={{ fontFamily: brand.font_heading, textTransform: isBold ? 'uppercase' : undefined }}>{p.name}</h3>
                            {p.description && <p className="text-xs line-clamp-1 mt-0.5" style={{ color: `${tc}40` }}>{p.description}</p>}
                          </div>
                          <div className="flex-shrink-0 text-right"><Price price={p.price} currency={p.currency} /></div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div layout className={`grid grid-cols-1 sm:grid-cols-2 ${isBold ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-${tid === 'playful' ? '8' : '6'}`}>
                  <AnimatePresence mode="popLayout">
                    {filtered.map(p => (
                      <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}>
                        <Link href={`/shop/${slug}/product/${p.id}`}
                          className={`group block transition-all hover:translate-y-[-${tid === 'playful' ? '4' : '2'}px]`}
                          style={tid === 'playful' ? { backgroundColor: '#FFF', borderRadius: cardRadius, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }
                            : isBold ? { borderColor: `${tc}12` } : {}}>
                          {/* Image */}
                          <div className="t-product-image mb-4 overflow-hidden relative"
                            style={{ backgroundColor: isDark ? '#111' : `${tc}04`, borderRadius: imgRadius }}>
                            {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                              : <div className="w-full h-full flex items-center justify-center"><BoxIcon color={tc} /></div>}
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              style={{ backgroundColor: `${isDark ? '#000' : tc}40` }}>
                              <span className="px-4 py-2 text-xs font-medium"
                                style={{ backgroundColor: isDark ? ac : '#FFF', color: isDark ? '#FFF' : tc,
                                  borderRadius: tid === 'playful' ? '9999px' : isBold ? '0' : '6px' }}>
                                {tLabel(tid, 'View Details', 'VIEW', 'View Details ✨')}
                              </span>
                            </div>
                          </div>
                          {/* Info */}
                          <div className={tid === 'playful' ? 'px-4 pb-4' : isBold ? 'p-4' : ''}>
                            <Category cat={p.category} />
                            <h3 className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity"
                              style={{ fontFamily: brand.font_heading, textTransform: isBold ? 'uppercase' : undefined, letterSpacing: isBold ? '0.02em' : undefined }}>
                              {p.name}
                            </h3>
                            {p.description && <p className="text-xs line-clamp-2 mb-2" style={{ color: `${tc}40` }}>{p.description}</p>}
                            <Price price={p.price} currency={p.currency} />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
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
