'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../layout';
import { ProductMeta, BreadcrumbMeta } from '@/components/site/site-meta';

// ── Share buttons ─────────────────────────────────────────────────────────────
function ShareButtons({ url, name, textColor, accentColor }: { url: string; name: string; textColor: string; accentColor: string }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${name}`)}&url=${encodeURIComponent(url)}`, '_blank');
  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${name} — ${url}`)}`, '_blank');

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: `${textColor}40` }}>Share</span>
      <motion.button
        onClick={copyLink}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all"
        style={{ borderColor: `${textColor}15`, color: copied ? accentColor : `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Copy link"
      >
        {copied ? '✓' : '🔗'}
      </motion.button>
      <motion.button
        onClick={shareTwitter}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all hover:opacity-70"
        style={{ borderColor: `${textColor}15`, color: `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Share on X (Twitter)"
      >
        𝕏
      </motion.button>
      <motion.button
        onClick={shareWhatsApp}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all hover:opacity-70"
        style={{ borderColor: `${textColor}15`, color: `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Share on WhatsApp"
      >
        💬
      </motion.button>
    </div>
  );
}

// ── Stock indicator ───────────────────────────────────────────────────────────
function StockIndicator({ stockCount, textColor, accentColor }: { stockCount?: number; textColor: string; accentColor: string }) {
  if (stockCount === undefined || stockCount === null) return null;
  if (stockCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#EF4444' }}>
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Out of Stock
      </span>
    );
  }
  if (stockCount <= 5) {
    return (
      <motion.span
        className="inline-flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: '#F97316' }}
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Only {stockCount} left — order soon!
      </motion.span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#22C55E' }}>
      <span className="h-2 w-2 rounded-full bg-green-500" />
      In Stock
    </span>
  );
}

// ── Image gallery ─────────────────────────────────────────────────────────────
function ImageGallery({
  images,
  productName,
  textColor,
  accentColor,
  borderRadius,
  isDark,
  templateId,
}: {
  images: string[];
  productName: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  isDark: boolean;
  templateId: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div>
      {/* Main image */}
      <div
        ref={containerRef}
        className="aspect-square overflow-hidden flex items-center justify-center relative cursor-zoom-in"
        style={{
          backgroundColor: isDark ? '#111' : `${textColor}04`,
          borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : '0',
          border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          {images.length > 0 ? (
            <motion.img
              key={activeImage}
              src={images[activeImage]}
              alt={productName}
              loading="eager"
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{
                opacity: 1,
                scale: isZoomed ? 1.12 : 1,
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            />
          ) : (
            <motion.div
              key="placeholder"
              className="flex items-center justify-center w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-16 h-16" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom hint */}
        {images.length > 0 && !isZoomed && (
          <motion.div
            className="absolute bottom-3 right-3 px-2 py-1 rounded text-[9px] font-medium"
            style={{ backgroundColor: `${textColor}80`, color: '#fff', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Hover to zoom
          </motion.div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveImage(i)}
              className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden transition-all"
              style={{
                borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
                border: `${i === activeImage ? '2' : '1'}px solid ${i === activeImage ? accentColor : `${textColor}10`}`,
                opacity: i === activeImage ? 1 : 0.55,
              }}
              whileHover={{ opacity: 0.85, scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
            >
              <img src={img} alt={`${productName} view ${i + 1}`} className="w-full h-full object-cover" />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type TabId = 'description' | 'specifications' | 'reviews';
const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
];

function ProductTabs({
  product,
  textColor,
  accentColor,
  borderRadius,
  isDark,
  templateId,
}: {
  product: { name: string; description: string; price: number; currency: string; category: string | null };
  textColor: string;
  accentColor: string;
  borderRadius: string;
  isDark: boolean;
  templateId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>('description');

  return (
    <div className="mt-2">
      {/* Tab nav */}
      <div className="flex border-b" style={{ borderColor: `${textColor}10` }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-3 pr-5 text-sm font-medium transition-colors"
              style={{
                color: isActive ? textColor : `${textColor}40`,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
              }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-5 h-0.5"
                  style={{ backgroundColor: accentColor }}
                  layoutId="tab-underline"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {product.description ? (
                <p className="text-sm leading-relaxed" style={{ color: `${textColor}60` }}>
                  {product.description}
                </p>
              ) : (
                <p className="text-sm italic" style={{ color: `${textColor}30` }}>No description available.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'specifications' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-2.5">
                {[
                  { label: 'Category', value: product.category || 'General' },
                  { label: 'Currency', value: product.currency || 'USD' },
                  { label: 'Price', value: `${product.currency || 'USD'} ${product.price?.toFixed(2) || '0.00'}` },
                  { label: 'SKU', value: 'N/A' },
                  { label: 'Weight', value: 'N/A' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: `${textColor}07` }}
                  >
                    <span className="text-xs uppercase tracking-wider font-medium" style={{ color: `${textColor}40` }}>{row.label}</span>
                    <span className="text-sm font-medium" style={{ color: textColor }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm font-medium mb-1" style={{ color: textColor }}>No reviews yet</p>
                <p className="text-xs" style={{ color: `${textColor}40` }}>Be the first to review this product.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Sticky Add to Cart bar ────────────────────────────────────────────────────
function StickyAddToCartBar({
  product,
  quantity,
  onAddToCart,
  addedToCart,
  textColor,
  bgColor,
  accentColor,
  isDark,
  templateId,
  slug,
}: {
  product: { name: string; price: number; currency: string; image_url: string | null };
  quantity: number;
  onAddToCart: () => void;
  addedToCart: boolean;
  textColor: string;
  bgColor: string;
  accentColor: string;
  isDark: boolean;
  templateId: string;
  slug: string;
}) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <>
      <div ref={sentinelRef} />
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 border-t"
            style={{
              backgroundColor: isDark ? '#111' : bgColor,
              borderColor: `${textColor}10`,
              backdropFilter: 'blur(12px)',
            }}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
              {/* Product thumb */}
              {product.image_url && (
                <div
                  className="h-12 w-12 flex-shrink-0 overflow-hidden rounded"
                  style={{ backgroundColor: isDark ? '#222' : `${textColor}06` }}
                >
                  <img src={product.image_url} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{
                    fontFamily: undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                  }}
                >
                  {product.name}
                </p>
                {product.price > 0 && (
                  <p className="text-sm font-bold" style={{ color: accentColor }}>
                    {product.currency} {(product.price * quantity).toFixed(2)}
                  </p>
                )}
              </div>
              <motion.button
                onClick={onAddToCart}
                className="flex-shrink-0 px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#000' : bgColor,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {addedToCart ? (templateId === 'playful' ? '✅ Added!' : '✓ Added') : (templateId === 'bold' ? 'ADD TO CART' : 'Add to Cart')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const shop = useShop();
  const params = useParams();
  const productId = params.productId as string;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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
    fontWeight: tp?.typography.headingWeight || (templateId === 'bold' ? '700' : '600'),
    letterSpacing: tp?.typography.headingTracking || (templateId === 'bold' ? '-0.04em' : '-0.02em'),
    textTransform: (tp?.typography.headingCase || (templateId === 'bold' ? 'uppercase' : 'normal')) as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';
  const borderRadius = templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : '0';

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

  // Gallery images
  const images = product.image_url ? [product.image_url] : [];

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && (product.category ? p.category === product.category : true))
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price || 0,
        currency: product.currency || 'USD',
        image_url: product.image_url || undefined,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

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

  const qtyBtnStyle: React.CSSProperties = {
    borderColor: `${textColor}15`,
    borderRadius: templateId === 'playful' ? '10px' : templateId === 'classic' ? '8px' : '0',
    borderWidth: templateId === 'bold' ? '2px' : '1px',
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';
  const productUrl = `${baseUrl}/shop/${slug}/product/${product.id}`;

  return (
    <>
      <StickyAddToCartBar
        product={product}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
        textColor={textColor}
        bgColor={bgColor}
        accentColor={accentColor}
        isDark={isDark}
        templateId={templateId}
        slug={slug}
      />

      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16 pb-24`}>
        <ProductMeta
          org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/shop/${slug}`, logoUrl: brand.logo_url }}
          canonicalUrl={productUrl}
          product={{ name: product.name, description: product.description, price: product.price, currency: product.currency, imageUrl: product.image_url }}
        />
        <BreadcrumbMeta items={[
          { name: brand.name, url: `${baseUrl}/site/${slug}` },
          { name: 'Shop', url: `${baseUrl}/shop/${slug}` },
          ...(product.category ? [{ name: product.category, url: `${baseUrl}/shop/${slug}?category=${encodeURIComponent(product.category)}` }] : []),
          { name: product.name, url: productUrl },
        ]} />

        {/* Breadcrumb */}
        <motion.nav
          className="mb-8 flex items-center gap-2 text-sm flex-wrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/shop/${slug}`}
            className="transition-opacity hover:opacity-60"
            style={{
              color: `${textColor}50`,
              fontWeight: templateId === 'bold' ? 700 : 400,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
            }}
          >
            {templateId === 'bold' ? 'SHOP' : 'Shop'}
          </Link>
          <span style={{ color: `${textColor}25` }}>{templateId === 'bold' ? '/' : '›'}</span>
          {product.category && (
            <>
              <Link
                href={`/shop/${slug}?category=${encodeURIComponent(product.category)}`}
                className="transition-opacity hover:opacity-60"
                style={{
                  color: `${textColor}50`,
                  fontWeight: templateId === 'bold' ? 700 : 400,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
                }}
              >
                {product.category}
              </Link>
              <span style={{ color: `${textColor}25` }}>{templateId === 'bold' ? '/' : '›'}</span>
            </>
          )}
          <span
            className="truncate max-w-[180px] sm:max-w-xs"
            style={{
              color: textColor,
              fontWeight: templateId === 'bold' ? 700 : 500,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
            }}
          >
            {product.name}
          </span>
        </motion.nav>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery
              images={images}
              productName={product.name}
              textColor={textColor}
              accentColor={accentColor}
              borderRadius={borderRadius}
              isDark={isDark}
              templateId={templateId}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.category && (
              <motion.span
                className="text-xs font-medium uppercase tracking-wider mb-3 block"
                style={{ color: accentColor, letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product.category}
              </motion.span>
            )}

            <h1
              className="mb-4"
              style={{
                ...headingStyle,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>

            {/* Stock */}
            <div className="mb-4">
              <StockIndicator stockCount={product.stock_count} textColor={textColor} accentColor={accentColor} />
            </div>

            {/* Price */}
            {product.price != null && product.price > 0 ? (
              <p
                className="text-2xl sm:text-3xl font-bold mb-6"
                style={{ color: accentColor, fontWeight: templateId === 'bold' ? 800 : 700 }}
              >
                {product.currency || 'USD'} {product.price.toFixed(2)}
              </p>
            ) : (
              <p className="text-lg mb-6" style={{ color: `${textColor}40` }}>Free</p>
            )}

            {/* Sentinel for sticky bar */}
            <div id="add-to-cart-sentinel" />

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: `${textColor}50` }}
              >
                {templateId === 'bold' ? 'QTY' : 'Quantity'}
              </span>
              <div className="flex items-center">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center text-sm font-bold border transition-colors"
                  style={qtyBtnStyle}
                  whileHover={{ backgroundColor: `${textColor}08` }}
                  whileTap={{ scale: 0.85 }}
                >
                  −
                </motion.button>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quantity}
                    className="h-10 w-12 flex items-center justify-center text-sm font-bold border-y"
                    style={{ borderColor: `${textColor}15`, borderWidth: templateId === 'bold' ? '2px 0' : '1px 0' }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {quantity}
                  </motion.div>
                </AnimatePresence>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 flex items-center justify-center text-sm font-bold border transition-colors"
                  style={qtyBtnStyle}
                  whileHover={{ backgroundColor: `${textColor}08` }}
                  whileTap={{ scale: 0.85 }}
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Add to cart + view cart */}
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.button
                onClick={handleAddToCart}
                className="transition-all hover:opacity-90"
                style={addBtnStyle}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={addedToCart ? 'added' : 'add'}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'inline-block' }}
                  >
                    {addedToCart
                      ? (templateId === 'playful' ? '🎉 Added to Cart!' : '✓ Added')
                      : (templateId === 'bold' ? 'ADD TO CART' : templateId === 'playful' ? 'Add to Cart 🛒' : 'Add to Cart')
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {cartCount > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Link
                    href={`/shop/${slug}/cart`}
                    className="inline-block px-6 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                  >
                    {templateId === 'bold' ? `VIEW CART (${cartCount})` : `View Cart (${cartCount})`}
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Share buttons */}
            <div className="mb-6">
              <ShareButtons url={productUrl} name={product.name} textColor={textColor} accentColor={accentColor} />
            </div>

            {/* Trust indicators */}
            <div
              className="flex items-center gap-5 pt-5 border-t flex-wrap"
              style={{ borderColor: `${textColor}08` }}
            >
              {[
                { icon: '🚚', label: 'Free Shipping 50+' },
                { icon: '↩️', label: '30-Day Returns' },
                { icon: '🔒', label: 'Secure Checkout' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[11px]" style={{ color: `${textColor}40` }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs section */}
        <motion.div
          className="mt-14 pt-10 border-t"
          style={{ borderColor: `${textColor}08` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProductTabs
            product={product}
            textColor={textColor}
            accentColor={accentColor}
            borderRadius={borderRadius}
            isDark={isDark}
            templateId={templateId}
          />
        </motion.div>

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            className="mt-16 pt-12 border-t"
            style={{ borderColor: `${textColor}08` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2
              className="mb-8"
              style={{
                ...headingStyle,
                fontSize: templateId === 'bold' ? '1.125rem' : '1.25rem',
                fontWeight: templateId === 'minimal' ? 400 : headingStyle.fontWeight,
              }}
            >
              {templateId === 'bold' ? 'YOU MAY ALSO LIKE' : templateId === 'playful' ? 'You might also love ✨' : 'You may also like'}
            </h2>

            {/* Scrollable carousel on mobile, grid on desktop */}
            <div className="flex gap-5 overflow-x-auto pb-3 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="flex-shrink-0 w-44 sm:w-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/shop/${slug}/product/${p.id}`} className="group block">
                    <div
                      className="aspect-square overflow-hidden flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? '#111' : `${textColor}04`,
                        borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : '0',
                        border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
                      }}
                    >
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <svg className="w-8 h-8" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <h3
                      className="text-sm font-medium truncate group-hover:opacity-60 transition-opacity"
                      style={{
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                        letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                        fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
                      }}
                    >
                      {p.name}
                    </h3>
                    {p.price != null && p.price > 0 && (
                      <p className="text-sm mt-0.5 font-semibold" style={{ color: accentColor }}>
                        {p.currency || 'USD'} {p.price.toFixed(2)}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}
