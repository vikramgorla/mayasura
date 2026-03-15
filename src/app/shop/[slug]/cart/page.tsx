'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useShop } from '../layout';

// Animated number that smoothly counts to its value
function AnimatedPrice({ value, currency }: { value: number; currency: string }) {
  const motionVal = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.4,
      ease: 'easeOut',
    });
    const unsub = motionVal.on('change', (v) => setDisplay(v));
    prevRef.current = value;
    return () => { controls.stop(); unsub(); };
  }, [value, motionVal]);

  return <span>{currency} {display.toFixed(2)}</span>;
}

// Free shipping progress bar
function ShippingProgressBar({
  cartTotal,
  currency,
  threshold = 50,
  textColor,
  accentColor,
}: {
  cartTotal: number;
  currency: string;
  threshold?: number;
  textColor: string;
  accentColor: string;
}) {
  const progress = Math.min(cartTotal / threshold, 1);
  const remaining = Math.max(threshold - cartTotal, 0);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px]" style={{ color: `${textColor}50` }}>
          {remaining > 0
            ? <>Add <strong style={{ color: textColor }}>{currency} {remaining.toFixed(2)}</strong> for free shipping</>
            : <span style={{ color: '#22c55e' }}>🎉 You've unlocked free shipping!</span>
          }
        </span>
        <span className="text-[11px]" style={{ color: `${textColor}35` }}>
          {currency} {threshold.toFixed(0)} min
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: `${textColor}10` }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: progress === 1 ? '#22c55e' : accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function CartPage() {
  const shop = useShop();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  if (!shop) return null;
  const { brand, cart, products, removeFromCart, updateQuantity, cartTotal, cartCount, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const currency = cart[0]?.currency || 'USD';

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: templateId === 'bold' ? 700 : templateId === 'minimal' ? 400 : 600,
    letterSpacing: templateId === 'bold' ? '-0.04em' : '-0.02em',
    textTransform: (templateId === 'bold' ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-5xl';
  const borderRadius = templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : '0';

  // "You might also like" — products not in cart, max 4
  const cartProductIds = new Set(cart.map((c) => c.productId));
  const suggestions = products.filter((p) => !cartProductIds.has(p.id) && p.price > 0).slice(0, 4);

  const handleRemove = (productId: string) => {
    setRemovingIds((prev) => new Set(prev).add(productId));
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingIds((prev) => { const s = new Set(prev); s.delete(productId); return s; });
    }, 250);
  };

  const estimatedShipping = cartTotal > 50 ? 0 : 5.99;
  const estimatedTotal = cartTotal + estimatedShipping;

  // Empty cart state
  if (cart.length === 0) {
    return (
      <motion.div
        className={`${containerWidth} mx-auto px-5 sm:px-8 py-20 text-center`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
          className="text-7xl mb-6 inline-block"
        >
          {templateId === 'playful' ? '🛒' : templateId === 'bold' ? '□' : '🛍️'}
        </motion.div>
        <motion.h2
          className="text-2xl mb-3"
          style={headingStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {templateId === 'bold' ? 'YOUR CART IS EMPTY' : templateId === 'playful' ? 'Nothing here yet! 🌟' : 'Your cart is empty'}
        </motion.h2>
        <motion.p
          className="text-sm mb-10 max-w-xs mx-auto"
          style={{ color: `${textColor}45` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {templateId === 'playful'
            ? "Looks like your cart needs some love. Explore our collection!"
            : "Looks like you haven't added anything yet. Discover our collection below."}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Link
            href={`/shop/${slug}`}
            className="inline-block px-8 py-3 text-sm font-medium transition-all hover:opacity-85 active:scale-95"
            style={{
              backgroundColor: isDark ? accentColor : textColor,
              color: isDark ? '#000' : bgColor,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
              fontWeight: templateId === 'bold' ? 700 : 500,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
            }}
          >
            {templateId === 'bold' ? 'BROWSE PRODUCTS' : templateId === 'playful' ? 'Shop Now ✨' : 'Browse Products'}
          </Link>
        </motion.div>

        {/* Show some products even on empty */}
        {suggestions.length > 0 && (
          <motion.div
            className="mt-16 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-base font-semibold mb-6 text-center" style={{ ...headingStyle, fontSize: '1rem' }}>
              {templateId === 'bold' ? 'FEATURED PRODUCTS' : templateId === 'playful' ? 'Check these out ✨' : 'You might like'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {suggestions.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.06 }}
                >
                  <Link href={`/shop/${slug}/product/${p.id}`} className="group block">
                    <div
                      className="aspect-square overflow-hidden flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? '#111' : `${textColor}04`,
                        borderRadius,
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
                    <p className="text-xs font-medium truncate group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>{p.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: accentColor }}>{p.currency} {p.price.toFixed(2)}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl sm:text-3xl" style={headingStyle}>
          {templateId === 'bold' ? `SHOPPING CART (${cartCount})` : templateId === 'playful' ? `Shopping Cart 🛒` : `Shopping Cart`}
          {templateId !== 'bold' && <span className="text-base font-normal ml-2" style={{ color: `${textColor}35` }}>({cartCount} {cartCount === 1 ? 'item' : 'items'})</span>}
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
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="popLayout">
            {cart.map((item, idx) => (
              <motion.div
                key={item.productId}
                className="flex items-center gap-4 p-4 mb-4"
                style={{
                  borderRadius,
                  border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
                  boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
                  opacity: removingIds.has(item.productId) ? 0.4 : 1,
                  transition: 'opacity 0.25s ease',
                }}
                layout
                initial={{ opacity: 0, x: -30, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
              >
                {/* Thumbnail */}
                <Link
                  href={`/shop/${slug}/product/${item.productId}`}
                  className="h-20 w-20 flex-shrink-0 overflow-hidden group"
                  style={{
                    backgroundColor: isDark ? '#111' : `${textColor}04`,
                    borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
                  }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg className="w-6 h-6" style={{ color: `${textColor}10` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
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

                {/* Quantity stepper */}
                <div className="flex items-center gap-0.5">
                  <motion.button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-8 w-8 flex items-center justify-center text-sm font-bold border transition-all"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '8px 0 0 8px' : templateId === 'classic' ? '6px 0 0 6px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                    whileHover={{ backgroundColor: `${textColor}08` }}
                    whileTap={{ scale: 0.88 }}
                  >
                    −
                  </motion.button>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={item.quantity}
                      className="w-8 text-center text-sm font-semibold border-y"
                      style={{
                        borderColor: `${textColor}15`,
                        height: '2rem',
                        lineHeight: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: templateId === 'bold' ? '2px 0' : '1px 0',
                      }}
                      initial={{ opacity: 0, y: -6, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.quantity}
                    </motion.span>
                  </AnimatePresence>
                  <motion.button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-8 w-8 flex items-center justify-center text-sm font-bold border transition-all"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '0 8px 8px 0' : templateId === 'classic' ? '0 6px 6px 0' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                    whileHover={{ backgroundColor: `${textColor}08` }}
                    whileTap={{ scale: 0.88 }}
                  >
                    +
                  </motion.button>
                </div>

                {/* Item total */}
                <motion.p
                  key={item.price * item.quantity}
                  className="text-sm font-semibold w-24 text-right hidden sm:block"
                  initial={{ scale: 1.15, color: accentColor }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.currency} {(item.price * item.quantity).toFixed(2)}
                </motion.p>

                {/* Remove */}
                <motion.button
                  onClick={() => handleRemove(item.productId)}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: `${textColor}25` }}
                  whileHover={{ color: '#EF4444', scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  title="Remove item"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* You might also like */}
          {suggestions.length > 0 && (
            <motion.section
              className="mt-12 pt-10 border-t"
              style={{ borderColor: `${textColor}08` }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h2
                className="text-sm font-semibold mb-5"
                style={{
                  fontFamily: brand.font_heading,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  color: `${textColor}60`,
                }}
              >
                {templateId === 'bold' ? 'YOU MIGHT ALSO LIKE' : templateId === 'playful' ? 'You might also love ✨' : 'You might also like'}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {suggestions.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link href={`/shop/${slug}/product/${p.id}`} className="group block">
                      <div
                        className="aspect-square overflow-hidden flex items-center justify-center mb-2.5"
                        style={{
                          backgroundColor: isDark ? '#111' : `${textColor}04`,
                          borderRadius: templateId === 'playful' ? '14px' : templateId === 'classic' ? '8px' : '0',
                          border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
                        }}
                      >
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <svg className="w-6 h-6" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        )}
                      </div>
                      <p
                        className="text-xs font-medium truncate group-hover:opacity-60 transition-opacity"
                        style={{
                          fontFamily: brand.font_heading,
                          textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                          fontSize: templateId === 'bold' ? '0.625rem' : '0.75rem',
                          letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                        }}
                      >
                        {p.name}
                      </p>
                      <p className="text-xs mt-0.5 font-medium" style={{ color: accentColor }}>
                        {p.currency} {p.price.toFixed(2)}
                      </p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Order Summary — sticky on desktop */}
        <div className="lg:col-span-1">
          <motion.div
            className="p-6 sticky top-24"
            style={{
              borderRadius,
              border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
              backgroundColor: isDark ? '#111111' : `${textColor}02`,
              boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <h2
              className="text-sm font-semibold mb-4"
              style={{
                fontFamily: brand.font_heading,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              }}
            >
              {templateId === 'bold' ? 'ORDER SUMMARY' : 'Order Summary'}
            </h2>

            {/* Free shipping progress */}
            <ShippingProgressBar
              cartTotal={cartTotal}
              currency={currency}
              threshold={50}
              textColor={textColor}
              accentColor={accentColor}
            />

            <div className="space-y-3 mb-5 mt-4">
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>
                  {templateId === 'bold' ? 'SUBTOTAL' : 'Subtotal'} ({cartCount} {cartCount === 1 ? 'item' : 'items'})
                </span>
                <span className="font-medium">
                  <AnimatedPrice value={cartTotal} currency={currency} />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>
                  {templateId === 'bold' ? 'SHIPPING' : 'Estimated Shipping'}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={estimatedShipping}
                    className="font-medium"
                    style={{ color: estimatedShipping === 0 ? '#22c55e' : undefined }}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {estimatedShipping === 0 ? '🚚 Free' : `${currency} ${estimatedShipping.toFixed(2)}`}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div
              className="flex items-center justify-between py-4 border-t mb-5"
              style={{ borderColor: `${textColor}08` }}
            >
              <span className="text-base font-semibold" style={headingStyle}>
                {templateId === 'bold' ? 'TOTAL' : 'Estimated Total'}
              </span>
              <span className="text-lg font-bold" style={{ color: accentColor }}>
                <AnimatedPrice value={estimatedTotal} currency={currency} />
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href={`/shop/${slug}/checkout`}
                className="py-3.5 text-center text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] block"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#000' : bgColor,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                }}
              >
                {templateId === 'bold' ? 'PROCEED TO CHECKOUT →' : templateId === 'playful' ? 'Proceed to Checkout 🚀' : 'Proceed to Checkout'}
              </Link>
              <Link
                href={`/shop/${slug}`}
                className="py-3 text-center text-sm font-medium border transition-all hover:opacity-80 active:scale-[0.98] block"
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
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t" style={{ borderColor: `${textColor}06` }}>
              {[
                { icon: '🔒', label: 'Secure' },
                { icon: '🚚', label: 'Free 50+' },
                { icon: '↩️', label: 'Returns' },
              ].map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-1">
                  <span className="text-base">{badge.icon}</span>
                  <span className="text-[9px] font-medium" style={{ color: `${textColor}30` }}>{badge.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
