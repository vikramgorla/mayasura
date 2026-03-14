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
  const { brand, cart, cartTotal, clearCart } = shop;
  const slug = brand.slug || brand.id;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-6">🛒</p>
        <p className="text-xl opacity-40 mb-4">Your cart is empty</p>
        <Link
          href={`/shop/${slug}`}
          className="inline-block px-6 py-2.5 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: brand.accent_color, color: '#fff' }}
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

  const inputStyle = {
    borderColor: `${brand.primary_color}15`,
    backgroundColor: `${brand.primary_color}03`,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <h1
        className="text-3xl font-bold mb-10"
        style={{ fontFamily: brand.font_heading }}
      >
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={inputStyle}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={inputStyle}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <h2 className="text-lg font-semibold mb-4 mt-8">Shipping Address</h2>
            <div>
              <label className="block text-sm font-medium mb-1.5">Street Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                style={inputStyle}
                placeholder="123 Main St"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={inputStyle}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">ZIP / Postal Code</label>
                <input
                  type="text"
                  value={form.zip}
                  onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={inputStyle}
                  placeholder="12345"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl border outline-none text-sm"
                  style={inputStyle}
                  placeholder="Country"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-base font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 mt-6"
              style={{ backgroundColor: brand.accent_color, color: '#fff' }}
            >
              {submitting ? 'Placing Order...' : `Place Order — ${cart[0]?.currency || 'USD'} ${cartTotal.toFixed(2)}`}
            </button>

            <p className="text-xs text-center opacity-40 mt-3">
              This is a demo checkout. No real payment will be processed.
            </p>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <div
            className="rounded-2xl p-6 border sticky top-20"
            style={{ borderColor: `${brand.primary_color}10`, backgroundColor: `${brand.primary_color}03` }}
          >
            <h2 className="font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{item.name}</span>
                    <span className="opacity-40">×{item.quantity}</span>
                  </div>
                  <span className="font-medium ml-4">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="pt-4 border-t flex items-center justify-between"
              style={{ borderColor: `${brand.primary_color}10` }}
            >
              <span className="font-bold">Total</span>
              <span className="font-bold text-lg" style={{ color: brand.accent_color }}>
                {cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
