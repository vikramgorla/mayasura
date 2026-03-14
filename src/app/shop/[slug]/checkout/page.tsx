'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useShop } from '../layout';

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm'] as const;

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export default function CheckoutPage() {
  const shop = useShop();
  const router = useRouter();
  const [step, setStep] = useState(1); // 0=Cart (done), 1=Shipping, 2=Payment, 3=Confirm
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

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
  const inputStyle = (hasError: boolean): React.CSSProperties => {
    const errorBorder = hasError ? '#EF4444' : undefined;
    if (templateId === 'bold') return {
      borderColor: errorBorder || `${textColor}15`, color: textColor, backgroundColor: `${textColor}04`,
      borderWidth: '2px', borderRadius: '0', padding: '0.875rem 1rem',
    };
    if (templateId === 'playful') return {
      borderColor: errorBorder || `${textColor}10`, color: textColor, backgroundColor: '#FFFFFF',
      borderRadius: '12px', borderWidth: '2px', padding: '0.875rem 1rem',
    };
    if (templateId === 'classic') return {
      borderColor: errorBorder || `${textColor}10`, color: textColor, backgroundColor: bgColor,
      borderRadius: '8px', borderWidth: '1px', padding: '0.875rem 1rem',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)',
    };
    return {
      borderColor: errorBorder || `${textColor}10`, color: textColor, backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0', borderRadius: '0', padding: '0.875rem 0',
    };
  };

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateForm()) setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNext();
      return;
    }
    setSubmitting(true);
    setServerError('');

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
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setSubmitting(false);
  };

  const estimatedShipping = cartTotal > 50 ? 0 : 5.99;
  const estimatedTotal = cartTotal + estimatedShipping;

  return (
    <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
      <h1 className="text-2xl sm:text-3xl mb-6" style={headingStyle}>
        {templateId === 'bold' ? 'CHECKOUT' : templateId === 'playful' ? 'Checkout 🛍️' : 'Checkout'}
      </h1>

      {/* Progress indicator */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-md">
          {STEPS.map((label, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className="h-8 w-8 flex items-center justify-center text-xs font-bold transition-all"
                    style={{
                      backgroundColor: isCompleted ? accentColor : isActive ? accentColor : `${textColor}08`,
                      color: isCompleted || isActive ? '#FFFFFF' : `${textColor}40`,
                      borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '12px' : '9999px',
                      border: isActive ? `2px solid ${accentColor}` : undefined,
                    }}
                  >
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <span
                    className="text-[10px] mt-1.5 font-medium"
                    style={{
                      color: isActive || isCompleted ? textColor : `${textColor}35`,
                      textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                      letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                    }}
                  >
                    {label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-12 sm:w-20 h-0.5 mx-2 mt-[-12px]"
                    style={{
                      backgroundColor: isCompleted ? accentColor : `${textColor}10`,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <AnimatedStep isVisible={step === 1}>
              <h2 className="text-sm font-semibold mb-6" style={{
                ...labelStyle, fontSize: '0.8125rem', color: textColor,
              }}>
                {templateId === 'bold' ? 'CONTACT INFORMATION' : 'Contact Information'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block mb-2" style={labelStyle}>
                    {templateId === 'bold' ? 'FULL NAME' : 'Full Name'}
                  </label>
                  <input
                    type="text" value={form.name} placeholder="John Doe"
                    onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((e2) => ({ ...e2, name: undefined })); }}
                    className="w-full text-sm outline-none border transition-colors focus:border-current"
                    style={inputStyle(!!errors.name)}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="block mb-2" style={labelStyle}>
                    {templateId === 'bold' ? 'EMAIL' : 'Email'}
                  </label>
                  <input
                    type="email" value={form.email} placeholder="john@example.com"
                    onChange={(e) => { setForm((f) => ({ ...f, email: e.target.value })); setErrors((e2) => ({ ...e2, email: undefined })); }}
                    className="w-full text-sm outline-none border transition-colors focus:border-current"
                    style={inputStyle(!!errors.email)}
                  />
                  {errors.email && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.email}</p>}
                </div>
              </div>

              <h2 className="text-sm font-semibold mb-6" style={{
                ...labelStyle, fontSize: '0.8125rem', color: textColor,
              }}>
                {templateId === 'bold' ? 'SHIPPING ADDRESS' : 'Shipping Address'}
              </h2>
              <div className="mb-4">
                <label className="block mb-2" style={labelStyle}>
                  {templateId === 'bold' ? 'STREET ADDRESS' : 'Street Address'}
                </label>
                <input
                  type="text" value={form.address} placeholder="123 Main St"
                  onChange={(e) => { setForm((f) => ({ ...f, address: e.target.value })); setErrors((e2) => ({ ...e2, address: undefined })); }}
                  className="w-full text-sm outline-none border transition-colors focus:border-current"
                  style={inputStyle(!!errors.address)}
                />
                {errors.address && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.address}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block mb-2" style={labelStyle}>City</label>
                  <input
                    type="text" value={form.city} placeholder="City"
                    onChange={(e) => { setForm((f) => ({ ...f, city: e.target.value })); setErrors((e2) => ({ ...e2, city: undefined })); }}
                    className="w-full text-sm outline-none border transition-colors focus:border-current"
                    style={inputStyle(!!errors.city)}
                  />
                  {errors.city && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.city}</p>}
                </div>
                <div>
                  <label className="block mb-2" style={labelStyle}>
                    {templateId === 'bold' ? 'ZIP' : 'ZIP / Postal'}
                  </label>
                  <input
                    type="text" value={form.zip} placeholder="12345"
                    onChange={(e) => { setForm((f) => ({ ...f, zip: e.target.value })); setErrors((e2) => ({ ...e2, zip: undefined })); }}
                    className="w-full text-sm outline-none border transition-colors focus:border-current"
                    style={inputStyle(!!errors.zip)}
                  />
                  {errors.zip && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.zip}</p>}
                </div>
                <div>
                  <label className="block mb-2" style={labelStyle}>Country</label>
                  <input
                    type="text" value={form.country} placeholder="Country"
                    onChange={(e) => { setForm((f) => ({ ...f, country: e.target.value })); setErrors((e2) => ({ ...e2, country: undefined })); }}
                    className="w-full text-sm outline-none border transition-colors focus:border-current"
                    style={inputStyle(!!errors.country)}
                  />
                  {errors.country && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.country}</p>}
                </div>
              </div>
            </AnimatedStep>

            <AnimatedStep isVisible={step === 2}>
              <h2 className="text-sm font-semibold mb-6" style={{
                ...labelStyle, fontSize: '0.8125rem', color: textColor,
              }}>
                {templateId === 'bold' ? 'PAYMENT METHOD' : 'Payment'}
              </h2>
              <div
                className="p-8 text-center mb-6"
                style={{
                  borderRadius,
                  border: `1px solid ${textColor}10`,
                  backgroundColor: isDark ? '#111111' : `${textColor}02`,
                }}
              >
                <div className="text-3xl mb-4">💳</div>
                <p className="text-sm font-medium mb-2">Demo Checkout</p>
                <p className="text-xs" style={{ color: `${textColor}40` }}>
                  No real payment will be processed. This is a demo store.
                </p>
              </div>
            </AnimatedStep>

            <AnimatedStep isVisible={step === 3}>
              <h2 className="text-sm font-semibold mb-6" style={{
                ...labelStyle, fontSize: '0.8125rem', color: textColor,
              }}>
                {templateId === 'bold' ? 'CONFIRM YOUR ORDER' : 'Confirm Your Order'}
              </h2>
              <div
                className="p-6 mb-6"
                style={{
                  borderRadius,
                  border: `1px solid ${textColor}08`,
                  backgroundColor: isDark ? '#111111' : `${textColor}02`,
                }}
              >
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs mb-1" style={{ color: `${textColor}40` }}>Name</p>
                    <p className="font-medium">{form.name}</p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: `${textColor}40` }}>Email</p>
                    <p className="font-medium">{form.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs mb-1" style={{ color: `${textColor}40` }}>Shipping to</p>
                    <p className="font-medium">{form.address}, {form.city}, {form.zip}, {form.country}</p>
                  </div>
                </div>
              </div>
            </AnimatedStep>

            {serverError && <p className="text-sm mb-4" style={{ color: '#EF4444' }}>{serverError}</p>}

            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
                  style={{
                    borderColor: `${textColor}15`,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                    borderWidth: templateId === 'bold' ? '2px' : '1px',
                  }}
                >
                  {templateId === 'bold' ? '← BACK' : '← Back'}
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                }}
              >
                {submitting
                  ? 'Placing Order...'
                  : step === 3
                  ? `Place Order — ${cart[0]?.currency || 'USD'} ${estimatedTotal.toFixed(2)}`
                  : step === 2
                  ? (templateId === 'bold' ? 'REVIEW ORDER' : 'Review Order')
                  : (templateId === 'bold' ? 'CONTINUE TO PAYMENT' : 'Continue to Payment')
                }
              </button>
            </div>

            <p className="text-xs text-center mt-3" style={{ color: `${textColor}25` }}>
              This is a demo checkout. No real payment will be processed.
            </p>
          </form>
        </div>

        {/* Order Summary Sidebar */}
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
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-sm">
                  {item.image_url && (
                    <div
                      className="h-10 w-10 flex-shrink-0 overflow-hidden"
                      style={{
                        borderRadius: templateId === 'playful' ? '8px' : templateId === 'classic' ? '6px' : '0',
                        backgroundColor: isDark ? '#222' : `${textColor}04`,
                      }}
                    >
                      <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="truncate block text-xs">{item.name}</span>
                    <span className="text-[10px]" style={{ color: `${textColor}35` }}>×{item.quantity}</span>
                  </div>
                  <span className="font-medium text-xs ml-2">
                    {item.currency} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${textColor}08` }}>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>Subtotal</span>
                <span>{cart[0]?.currency || 'USD'} {cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: `${textColor}50` }}>Shipping</span>
                <span style={{ color: estimatedShipping === 0 ? '#22c55e' : undefined }}>
                  {estimatedShipping === 0 ? 'Free' : `${cart[0]?.currency || 'USD'} ${estimatedShipping.toFixed(2)}`}
                </span>
              </div>
            </div>
            <div
              className="pt-4 mt-4 border-t flex items-center justify-between"
              style={{ borderColor: `${textColor}08` }}
            >
              <span className="font-semibold" style={{ fontFamily: brand.font_heading }}>
                {templateId === 'bold' ? 'TOTAL' : 'Total'}
              </span>
              <span className="font-bold text-lg" style={{ color: accentColor }}>
                {cart[0]?.currency || 'USD'} {estimatedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedStep({ isVisible, children }: { isVisible: boolean; children: React.ReactNode }) {
  if (!isVisible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
