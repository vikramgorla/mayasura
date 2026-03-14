'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '../layout';

export default function CheckoutPage() {
  const shop = useShop();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!shop) return null;
  const { brand, cart, cartTotal, clearCart, websiteTemplate: template } = shop;
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
  const borderRadius = templateId === 'playful' ? '16px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : '0';

  // Input style per template
  const inputStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      borderColor: `${textColor}15`, color: textColor, backgroundColor: `${textColor}04`,
      borderWidth: '2px', borderRadius: '0', padding: '0.875rem 1rem',
    };
    if (templateId === 'playful') return {
      borderColor: `${textColor}10`, color: textColor, backgroundColor: '#FFFFFF',
      borderRadius: '12px', borderWidth: '2px', padding: '0.875rem 1rem',
    };
    if (templateId === 'classic') return {
      borderColor: `${textColor}10`, color: textColor, backgroundColor: bgColor,
      borderRadius: '8px', borderWidth: '1px', padding: '0.875rem 1rem',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)',
    };
    return {
      borderColor: `${textColor}10`, color: textColor, backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0', borderRadius: '0', padding: '0.875rem 0',
    };
  })();

  const labelStyle: React.CSSProperties = {
    color: `${textColor}${templateId === 'bold' ? '55' : '45'}`,
    fontSize: '0.75rem', fontWeight: templateId === 'bold' ? 700 : 500,
    letterSpacing: templateId === 'bold' ? '0.1em' : '0.04em',
    textTransform: 'uppercase' as const,
  };

  if (cart.length === 0) {
    return (
      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-20 text-center`}>
        <p className="text-5xl mb-6">{templateId === 'playful' ? '🛒' : '—'}</p>
        <p className="text-lg mb-4" style={{ color: `${textColor}50` }}>Your cart is empty</p>
        <Link
          href={`/shop/${slug}`}
          className="inline-block px-6 py-2.5 text-sm font-medium"
          style={{
            backgroundColor: isDark ? accentColor : textColor,
            color: isDark ? '#FFFFFF' : bgColor,
            borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
          }}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const shippingAddress = `${form.address}, ${form.city}, ${form.zip}, ${form.country}`;
      const res = await fetch(`/api/public/brand/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          shipping_address: shippingAddress,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: cartTotal,
          currency: cart[0]?.currency || 'USD',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');

      clearCart();
      router.push(`/shop/${slug}/order/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setSubmitting(false);
  };

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      <h1 className="text-2xl sm:text-3xl mb-10" style={headingStyle}>
        {templateId === 'bold' ? 'CHECKOUT' : templateId === 'playful' ? 'Checkout 🛍️' : 'Checkout'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-sm font-semibold mb-4" style={{
              ...labelStyle, fontSize: '0.8125rem',
              color: textColor,
            }}>
              {templateId === 'bold' ? 'CONTACT INFORMATION' : 'Contact Information'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2" style={labelStyle}>
                  {templateId === 'bold' ? 'FULL NAME' : 'Full Name'}
                </label>
                <input
                  type="text" value={form.name} required placeholder="John Doe"
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block mb-2" style={labelStyle}>
                  {templateId === 'bold' ? 'EMAIL' : 'Email'}
                </label>
                <input
                  type="email" value={form.email} required placeholder="john@example.com"
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle}
                />
              </div>
            </div>

            <h2 className="text-sm font-semibold mb-4 mt-8" style={{
              ...labelStyle, fontSize: '0.8125rem',
              color: textColor,
            }}>
              {templateId === 'bold' ? 'SHIPPING ADDRESS' : 'Shipping Address'}
            </h2>
            <div>
              <label className="block mb-2" style={labelStyle}>
                {templateId === 'bold' ? 'STREET ADDRESS' : 'Street Address'}
              </label>
              <input
                type="text" value={form.address} required placeholder="123 Main St"
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full text-sm outline-none border transition-colors focus:border-current"
                style={inputStyle}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2" style={labelStyle}>City</label>
                <input
                  type="text" value={form.city} required placeholder="City"
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block mb-2" style={labelStyle}>
                  {templateId === 'bold' ? 'ZIP' : 'ZIP / Postal'}
                </label>
                <input
                  type="text" value={form.zip} required placeholder="12345"
                  onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block mb-2" style={labelStyle}>Country</label>
                <input
                  type="text" value={form.country} required placeholder="Country"
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle}
                />
              </div>
            </div>

            {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 mt-6"
              style={{
                backgroundColor: isDark ? accentColor : textColor,
                color: isDark ? '#FFFFFF' : bgColor,
                borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                fontWeight: templateId === 'bold' ? 700 : 500,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              }}
            >
              {submitting ? 'Placing Order...' : `Place Order — ${cart[0]?.currency || 'USD'} ${cartTotal.toFixed(2)}`}
            </button>

            <p className="text-xs text-center mt-3" style={{ color: `${textColor}25` }}>
              This is a demo checkout. No real payment will be processed.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div
            className="p-6 sticky top-20"
            style={{
              borderRadius,
              border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
              backgroundColor: isDark ? '#111111' : `${textColor}02`,
              boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
            }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{
              fontFamily: brand.font_heading,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
            }}>
              {templateId === 'bold' ? 'ORDER SUMMARY' : 'Order Summary'}
            </h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{item.name}</span>
                    <span style={{ color: `${textColor}35` }}>×{item.quantity}</span>
                  </div>
                  <span className="font-medium ml-4">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="pt-4 border-t flex items-center justify-between"
              style={{ borderColor: `${textColor}08` }}
            >
              <span className="font-semibold" style={{ fontFamily: brand.font_heading }}>
                {templateId === 'bold' ? 'TOTAL' : 'Total'}
              </span>
              <span className="font-semibold text-lg" style={{ color: accentColor }}>
                {cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
