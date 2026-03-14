'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useShop } from '../../layout';

export default function ProductDetailPage() {
  const shop = useShop();
  const params = useParams();
  const productId = params.productId as string;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

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

  // Simulate gallery images (primary + placeholders)
  const images = product.image_url ? [product.image_url] : [];

  // Related products (same category, exclude current, max 4)
  const related = products
    .filter((p) => p.id !== product.id && (product.category ? p.category === product.category : true))
    .slice(0, 4);

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
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const qtyBtnStyle: React.CSSProperties = {
    borderColor: `${textColor}15`,
    borderRadius: templateId === 'playful' ? '10px' : templateId === 'classic' ? '8px' : '0',
    borderWidth: templateId === 'bold' ? '2px' : '1px',
  };

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      {/* Breadcrumb navigation */}
      <motion.nav
        className="mb-8 flex items-center gap-2 text-sm"
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
        <span style={{ color: `${textColor}25` }}>
          {templateId === 'bold' ? '/' : '›'}
        </span>
        {product.category && (
          <>
            <span
              style={{
                color: `${textColor}50`,
                fontWeight: templateId === 'bold' ? 700 : 400,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
              }}
            >
              {product.category}
            </span>
            <span style={{ color: `${textColor}25` }}>
              {templateId === 'bold' ? '/' : '›'}
            </span>
          </>
        )}
        <span
          className="truncate"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Image gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="overflow-hidden aspect-square flex items-center justify-center relative"
            style={{
              backgroundColor: isDark ? '#111111' : `${textColor}04`,
              borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0',
              border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
            }}
          >
            {images.length > 0 ? (
              <img src={images[activeImage]} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-16 h-16" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
          </div>
          {/* Thumbnail gallery row */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className="h-20 w-20 overflow-hidden transition-all"
                  style={{
                    borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
                    border: `${i === activeImage ? '2' : '1'}px solid ${i === activeImage ? accentColor : `${textColor}10`}`,
                    opacity: i === activeImage ? 1 : 0.6,
                  }}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
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

          {/* Quantity selector */}
          <div className="flex items-center gap-4 mb-8">
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{
                color: `${textColor}50`,
                fontWeight: templateId === 'bold' ? 700 : 500,
              }}
            >
              {templateId === 'bold' ? 'QTY' : 'Quantity'}
            </span>
            <div className="flex items-center gap-0">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 flex items-center justify-center text-sm font-medium border transition-colors hover:opacity-80"
                style={qtyBtnStyle}
              >
                −
              </button>
              <div
                className="h-10 w-12 flex items-center justify-center text-sm font-semibold border-y"
                style={{ borderColor: `${textColor}15`, borderWidth: templateId === 'bold' ? '2px 0' : '1px 0' }}
              >
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="h-10 w-10 flex items-center justify-center text-sm font-medium border transition-colors hover:opacity-80"
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              onClick={handleAddToCart}
              className="transition-all hover:opacity-90 active:scale-[0.98]"
              style={addBtnStyle}
              whileTap={{ scale: 0.95 }}
            >
              {addedToCart
                ? (templateId === 'playful' ? 'Added! ✅' : '✓ Added')
                : (templateId === 'bold' ? 'ADD TO CART' : templateId === 'playful' ? 'Add to Cart 🛒' : 'Add to Cart')
              }
            </motion.button>

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

          {/* Trust indicators */}
          <div className="flex items-center gap-6 mt-8 pt-8 border-t" style={{ borderColor: `${textColor}08` }}>
            {[
              { icon: '🚚', label: 'Free Shipping' },
              { icon: '↩️', label: '30-Day Returns' },
              { icon: '🔒', label: 'Secure Checkout' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="text-xs">{item.icon}</span>
                <span className="text-[11px]" style={{ color: `${textColor}40` }}>{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <motion.section
          className="mt-20 pt-16 border-t"
          style={{ borderColor: `${textColor}08` }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2
            className="text-xl mb-8"
            style={{
              ...headingStyle,
              fontWeight: templateId === 'minimal' ? 400 : 600,
              fontSize: templateId === 'bold' ? '1.25rem' : '1.125rem',
            }}
          >
            {templateId === 'bold' ? 'YOU MAY ALSO LIKE' : templateId === 'playful' ? 'You might also love ✨' : 'You may also like'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${slug}/product/${p.id}`}
                className="group"
              >
                <div
                  className="aspect-square overflow-hidden mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: isDark ? '#111111' : `${textColor}04`,
                    borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : '0',
                    border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
                  }}
                >
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                  }}
                >
                  {p.name}
                </h3>
                {p.price != null && p.price > 0 && (
                  <p className="text-sm mt-1" style={{ color: accentColor }}>
                    {p.currency || 'USD'} {p.price.toFixed(2)}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}
