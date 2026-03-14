'use client';

import Link from 'next/link';
import { useShop } from '../layout';

export default function CartPage() {
  const shop = useShop();

  if (!shop) return null;
  const { brand, cart, removeFromCart, updateQuantity, cartTotal, cartCount } = shop;
  const slug = brand.slug || brand.id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: brand.font_heading }}
      >
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-6">🛒</p>
          <p className="text-xl opacity-40 mb-4">Your cart is empty</p>
          <Link
            href={`/shop/${slug}`}
            className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: brand.accent_color, color: '#fff' }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex items-center gap-4 p-4 rounded-xl border"
                style={{ borderColor: `${brand.primary_color}10` }}
              >
                {/* Thumbnail */}
                <div
                  className="h-20 w-20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden"
                  style={{ backgroundColor: `${brand.accent_color}08` }}
                >
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{item.name}</h3>
                  <p className="text-sm font-medium mt-1" style={{ color: brand.accent_color }}>
                    {item.currency} {item.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: `${brand.primary_color}20` }}
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold border transition-colors hover:opacity-80"
                    style={{ borderColor: `${brand.primary_color}20` }}
                  >
                    +
                  </button>
                </div>

                {/* Item total */}
                <p className="text-sm font-bold w-24 text-right">
                  {item.currency} {(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-sm opacity-40 hover:opacity-80 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            className="rounded-2xl p-6 border"
            style={{ borderColor: `${brand.primary_color}10`, backgroundColor: `${brand.primary_color}03` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="opacity-60">Items</span>
              <span className="font-medium">{cartCount}</span>
            </div>
            <div className="flex items-center justify-between mb-6 pb-6 border-b" style={{ borderColor: `${brand.primary_color}10` }}>
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold" style={{ color: brand.accent_color }}>
                {cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/shop/${slug}/checkout`}
                className="flex-1 py-3.5 rounded-xl text-center text-base font-semibold transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: brand.accent_color, color: '#fff' }}
              >
                Proceed to Checkout
              </Link>
              <Link
                href={`/shop/${slug}`}
                className="py-3.5 px-6 rounded-xl text-center text-sm font-semibold border transition-colors hover:opacity-80"
                style={{ borderColor: `${brand.primary_color}20` }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
