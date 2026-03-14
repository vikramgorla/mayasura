'use client';

import Link from 'next/link';
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

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-4xl';
  const borderRadius = templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0';

  if (cart.length === 0) {
    return (
      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-20 text-center`}>
        <p className="text-5xl mb-6">{templateId === 'playful' ? '🛒' : '—'}</p>
        <h2 className="text-xl mb-4" style={headingStyle}>
          {templateId === 'playful' ? 'Your cart is empty 🛍️' : templateId === 'bold' ? 'CART IS EMPTY' : 'Your cart is empty'}
        </h2>
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
      </div>
    );
  }

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      <h1 className="text-2xl sm:text-3xl mb-8" style={headingStyle}>
        {templateId === 'bold' ? 'SHOPPING CART' : templateId === 'playful' ? 'Shopping Cart 🛒' : 'Shopping Cart'}
      </h1>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 p-4"
            style={{
              borderRadius,
              border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
              boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
            }}
          >
            {/* Thumbnail */}
            <div
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
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <h3
                className="font-medium truncate text-sm"
                style={{
                  fontFamily: brand.font_heading,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                  letterSpacing: templateId === 'bold' ? '0.02em' : undefined,
                }}
              >
                {item.name}
              </h3>
              <p className="text-sm font-medium mt-1" style={{ color: accentColor }}>
                {item.currency} {item.price.toFixed(2)}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="h-8 w-8 flex items-center justify-center text-sm font-medium border transition-colors hover:opacity-80"
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
                className="h-8 w-8 flex items-center justify-center text-sm font-medium border transition-colors hover:opacity-80"
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
            <p className="text-sm font-medium w-24 text-right">
              {item.currency} {(item.price * item.quantity).toFixed(2)}
            </p>

            {/* Remove */}
            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-sm transition-opacity hover:opacity-60"
              style={{ color: `${textColor}35` }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="p-6"
        style={{
          borderRadius,
          border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
          backgroundColor: isDark ? '#111111' : `${textColor}02`,
          boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm" style={{ color: `${textColor}50` }}>Items</span>
          <span className="text-sm font-medium">{cartCount}</span>
        </div>
        <div
          className="flex items-center justify-between mb-6 pb-6 border-b"
          style={{ borderColor: `${textColor}08` }}
        >
          <span className="text-lg font-semibold" style={headingStyle}>
            {templateId === 'bold' ? 'TOTAL' : 'Total'}
          </span>
          <span className="text-lg font-semibold" style={{ color: accentColor }}>
            {cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/shop/${slug}/checkout`}
            className="flex-1 py-3.5 text-center text-sm font-medium transition-all hover:opacity-90"
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
            className="py-3.5 px-6 text-center text-sm font-medium border transition-all hover:opacity-80"
            style={{
              borderColor: `${textColor}15`,
              borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
              borderWidth: templateId === 'bold' ? '2px' : '1px',
            }}
          >
            {templateId === 'bold' ? 'CONTINUE SHOPPING' : 'Continue Shopping'}
          </Link>
        </div>
      </div>
    </div>
  );
}
