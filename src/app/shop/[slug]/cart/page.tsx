'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../layout';

export default function CartPage() {
  const shop = useShop();

  if (!shop) return null;
  const { brand, cart, removeFromCart, updateQuantity, cartTotal, cartCount, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: templateId === 'bold' ? 700 : templateId === 'minimal' ? 400 : 600,
    letterSpacing: templateId === 'bold' ? '-0.04em' : '-0.02em',
    textTransform: (templateId === 'bold' ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-5xl';
  const borderRadius = templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0';

  if (cart.length === 0) {
    return (
      <motion.div
        className={`${containerWidth} mx-auto px-5 sm:px-8 py-20 text-center`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-5xl mb-6">{templateId === 'playful' ? '🛒' : '—'}</p>
        <h2 className="text-xl mb-4" style={headingStyle}>
          {templateId === 'playful' ? 'Your cart is empty 🛍️' : templateId === 'bold' ? 'CART IS EMPTY' : 'Your cart is empty'}
        </h2>
        <p className="text-sm mb-8" style={{ color: `${textColor}40` }}>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Link
          href={`/shop/${slug}`}
          className="inline-block px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            backgroundColor: isDark ? accentColor : textColor,
            color: isDark ? '#FFFFFF' : bgColor,
            borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
          }}
        >
          {templateId === 'bold' ? 'CONTINUE SHOPPING' : templateId === 'playful' ? 'Continue Shopping ✨' : 'Continue Shopping'}
        </Link>
      </motion.div>
    );
  }

  const estimatedShipping = cartTotal > 50 ? 0 : 5.99;
  const estimatedTotal = cartTotal + estimatedShipping;

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      {/* Header with back link */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl" style={headingStyle}>
          {templateId === 'bold' ? 'SHOPPING CART' : templateId === 'playful' ? 'Shopping Cart 🛒' : 'Shopping Cart'}
        </h1>
        <Link
          href={`/shop/${slug}`}
          className="text-sm transition-opacity hover:opacity-60"
          style={{
            color: accentColor,
            fontWeight: templateId === 'bold' ? 700 : 400,
            letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
            textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
            fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
          }}
        >
          {templateId === 'bold' ? '← CONTINUE SHOPPING' : '← Continue Shopping'}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <motion.div
                key={item.productId}
                className="flex items-center gap-4 p-4 mb-4"
                style={{
                  borderRadius,
                  border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
                  boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
                }}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0, padding: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/shop/${slug}/product/${item.productId}`}
                  className="h-20 w-20 flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#111111' : `${textColor}04`,
                    borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
                  }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <svg className="w-6 h-6" style={{ color: `${textColor}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/shop/${slug}/product/${item.productId}`}>
                    <h3
                      className="font-medium truncate text-sm hover:opacity-60 transition-opacity"
                      style={{
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                        letterSpacing: templateId === 'bold' ? '0.02em' : undefined,
                      }}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>
                    {item.currency} {item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center text-sm font-medium border transition-all hover:opacity-80 active:scale-95"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '8px' : templateId === 'classic' ? '6px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center text-sm font-medium border transition-all hover:opacity-80 active:scale-95"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '8px' : templateId === 'classic' ? '6px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <p className="text-sm font-medium w-24 text-right hidden sm:block">
                  {item.currency} {(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <motion.button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-sm transition-opacity hover:opacity-60 p-1"
                  style={{ color: `${textColor}35` }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary — sticky on desktop */}
        <div className="lg:col-span-1">
          <div
            className="p-6 sticky top-24"
            style={{
              borderRadius,
              border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
              backgroundColor: isDark ? '#111111' : `${textColor}02`,
              boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
            }}
          >
            <h2
              className="text-sm font-semibold mb-6"
              style={{
                fontFamily: brand.font_heading,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              }}
            >
              {templateId === 'bold' ? 'ORDER SUMMARY' : 'Order Summary'}
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>
                  {templateId === 'bold' ? 'SUBTOTAL' : 'Subtotal'} ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </span>
                <span className="font-medium">{cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>
                  {templateId === 'bold' ? 'SHIPPING' : 'Estimated Shipping'}
                </span>
                <span className="font-medium" style={{ color: estimatedShipping === 0 ? '#22c55e' : undefined }}>
                  {estimatedShipping === 0 ? 'Free' : `${cart[0]?.currency || 'USD'} ${estimatedShipping.toFixed(2)}`}
                </span>
              </div>
              {estimatedShipping > 0 && (
                <p className="text-xs" style={{ color: `${textColor}30` }}>
                  Free shipping on orders over {cart[0]?.currency || 'USD'} 50.00
                </p>
              )}
            </div>

            <div
              className="flex items-center justify-between py-4 border-t mb-6"
              style={{ borderColor: `${textColor}08` }}
            >
              <span className="text-base font-semibold" style={headingStyle}>
                {templateId === 'bold' ? 'TOTAL' : 'Estimated Total'}
              </span>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                {cart[0]?.currency || 'USD'} {estimatedTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/shop/${slug}/checkout`}
                className="py-3.5 text-center text-sm font-medium transition-all hover:opacity-90 block"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                }}
              >
                {templateId === 'bold' ? 'PROCEED TO CHECKOUT' : templateId === 'playful' ? 'Proceed to Checkout 🚀' : 'Proceed to Checkout'}
              </Link>
              <Link
                href={`/shop/${slug}`}
                className="py-3 text-center text-sm font-medium border transition-all hover:opacity-80 block"
                style={{
                  borderColor: `${textColor}15`,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  borderWidth: templateId === 'bold' ? '2px' : '1px',
                }}
              >
                {templateId === 'bold' ? 'CONTINUE SHOPPING' : 'Continue Shopping'}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t" style={{ borderColor: `${textColor}06` }}>
              {['🔒 Secure', '🚚 Free Ship 50+', '↩️ Returns'].map((badge) => (
                <span key={badge} className="text-[10px]" style={{ color: `${textColor}30` }}>{badge}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
