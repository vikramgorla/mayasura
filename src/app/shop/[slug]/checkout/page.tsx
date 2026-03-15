'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../layout';

const STEPS = [
  { id: 1, label: 'Shipping', icon: '📦' },
  { id: 2, label: 'Payment', icon: '💳' },
  { id: 3, label: 'Review', icon: '✅' },
] as const;

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
  country?: string;
}

// Animated field error
function FieldError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.p
          className="text-xs mt-1.5 flex items-center gap-1"
          style={{ color: '#EF4444' }}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>⚠</span> {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

// Step indicator component
function StepIndicator({
  currentStep,
  accentColor,
  textColor,
  templateId,
}: {
  currentStep: number;
  accentColor: string;
  textColor: string;
  templateId: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center">
        {STEPS.map((step, i) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative">
                <motion.div
                  className="h-9 w-9 flex items-center justify-center text-sm font-bold relative z-10"
                  style={{
                    borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '12px' : '9999px',
                    backgroundColor: isCompleted
                      ? accentColor
                      : isActive
                      ? accentColor
                      : `${textColor}08`,
                    color: isCompleted || isActive ? '#fff' : `${textColor}40`,
                    border: isActive ? `2px solid ${accentColor}` : isCompleted ? 'none' : `2px solid ${textColor}12`,
                    boxShadow: isActive ? `0 0 0 4px ${accentColor}20` : undefined,
                  }}
                  animate={{
                    backgroundColor: isCompleted ? accentColor : isActive ? accentColor : `${textColor}08`,
                    scale: isActive ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        ✓
                      </motion.span>
                    ) : (
                      <motion.span
                        key="num"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {step.id}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span
                  className="text-[10px] mt-1.5 font-medium whitespace-nowrap"
                  style={{
                    color: isActive || isCompleted ? textColor : `${textColor}35`,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 mx-3 mt-[-14px] h-0.5 relative overflow-hidden" style={{ backgroundColor: `${textColor}10` }}>
                  <motion.div
                    className="h-full absolute left-0 top-0"
                    style={{ backgroundColor: accentColor }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Trust badges for checkout
function TrustBadges({ textColor }: { textColor: string }) {
  const badges = [
    { icon: '🔒', label: 'SSL Encrypted', desc: '256-bit security' },
    { icon: '🛡️', label: 'Buyer Protected', desc: 'Secure payments' },
    { icon: '↩️', label: 'Easy Returns', desc: '30-day policy' },
  ];
  return (
    <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t" style={{ borderColor: `${textColor}08` }}>
      {badges.map((b) => (
        <div key={b.label} className="flex flex-col items-center text-center gap-1">
          <span className="text-lg">{b.icon}</span>
          <span className="text-[10px] font-semibold" style={{ color: `${textColor}60` }}>{b.label}</span>
          <span className="text-[9px]" style={{ color: `${textColor}25` }}>{b.desc}</span>
        </div>
      ))}
    </div>
  );
}

// Success overlay
function SuccessOverlay({ textColor, accentColor }: { textColor: string; accentColor: string }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="text-center p-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="text-7xl mb-4"
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          🎉
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
        <p className="text-white/60 text-sm">Redirecting to your order...</p>
      </motion.div>
    </motion.div>
  );
}

export default function CheckoutPage() {
  const shop = useShop();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '', country: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  if (!shop) return null;
  const { brand, cart, cartTotal, clearCart, websiteTemplate: template } = shop;
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
  const borderRadius = templateId === 'playful' ? '16px' : templateId === 'classic' ? '12px' : '0';

  const inputStyle = (hasError: boolean): React.CSSProperties => {
    const errorBorder = hasError ? '#EF4444' : undefined;
    if (templateId === 'bold') return {
      borderColor: errorBorder || `${textColor}15`,
      color: textColor,
      backgroundColor: `${textColor}04`,
      borderWidth: '2px',
      borderRadius: '0',
      padding: '0.875rem 1rem',
      outline: 'none',
      transition: 'border-color 0.2s',
    };
    if (templateId === 'playful') return {
      borderColor: errorBorder || `${textColor}12`,
      color: textColor,
      backgroundColor: isDark ? '#1a1a1a' : '#FFFFFF',
      borderRadius: '12px',
      borderWidth: '2px',
      padding: '0.875rem 1rem',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    };
    if (templateId === 'classic') return {
      borderColor: errorBorder || `${textColor}10`,
      color: textColor,
      backgroundColor: bgColor,
      borderRadius: '8px',
      borderWidth: '1px',
      padding: '0.875rem 1rem',
      outline: 'none',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03)',
    };
    return {
      borderColor: errorBorder || `${textColor}12`,
      color: textColor,
      backgroundColor: 'transparent',
      borderWidth: '0 0 1.5px 0',
      borderRadius: '0',
      padding: '0.875rem 0',
      outline: 'none',
    };
  };

  const labelStyle: React.CSSProperties = {
    color: `${textColor}${templateId === 'bold' ? '55' : '50'}`,
    fontSize: '0.6875rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: '0.5rem',
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className={`${containerWidth} mx-auto px-5 sm:px-8 py-20 text-center`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-6xl mb-6">🛒</div>
        <p className="text-lg mb-4" style={{ color: `${textColor}50` }}>Your cart is empty</p>
        <Link
          href={`/shop/${slug}`}
          className="inline-block px-6 py-2.5 text-sm font-medium"
          style={{
            backgroundColor: isDark ? accentColor : textColor,
            color: isDark ? '#000' : bgColor,
            borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
          }}
        >
          Start Shopping
        </Link>
      </motion.div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email.trim()) newErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email';
    if (!form.address.trim()) newErrors.address = 'Street address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP / Postal code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateForm()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) { handleNext(); return; }

    setSubmitting(true);
    setServerError('');
    try {
      const res = await fetch(`/api/public/brand/${slug}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          shipping_address: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: cartTotal,
          currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order failed');
      setSuccess(true);
      clearCart();
      setTimeout(() => router.push(`/shop/${slug}/order/${data.order.id}`), 1800);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const estimatedShipping = cartTotal > 50 ? 0 : 5.99;
  const estimatedTotal = cartTotal + estimatedShipping;

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  return (
    <>
      {success && <SuccessOverlay textColor={textColor} accentColor={accentColor} />}

      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16`}>
        <motion.h1
          className="text-2xl sm:text-3xl mb-8"
          style={headingStyle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {templateId === 'bold' ? 'CHECKOUT' : templateId === 'playful' ? 'Checkout 🛍️' : 'Checkout'}
        </motion.h1>

        <StepIndicator currentStep={step} accentColor={accentColor} textColor={textColor} templateId={templateId} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Step 1: Shipping */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionLabel label={templateId === 'bold' ? 'CONTACT INFORMATION' : 'Contact Information'} textColor={textColor} headingFont={brand.font_heading} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div>
                        <label style={labelStyle}>Full Name</label>
                        <input
                          type="text"
                          value={form.name}
                          onChange={updateField('name')}
                          placeholder="Jane Doe"
                          className="w-full text-sm border"
                          style={inputStyle(!!errors.name)}
                          autoComplete="name"
                        />
                        <FieldError error={errors.name} />
                      </div>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={updateField('email')}
                          placeholder="jane@example.com"
                          className="w-full text-sm border"
                          style={inputStyle(!!errors.email)}
                          autoComplete="email"
                        />
                        <FieldError error={errors.email} />
                      </div>
                    </div>

                    <SectionLabel label={templateId === 'bold' ? 'SHIPPING ADDRESS' : 'Shipping Address'} textColor={textColor} headingFont={brand.font_heading} />
                    <div className="mb-4">
                      <label style={labelStyle}>Street Address</label>
                      <input
                        type="text"
                        value={form.address}
                        onChange={updateField('address')}
                        placeholder="123 Main Street"
                        className="w-full text-sm border"
                        style={inputStyle(!!errors.address)}
                        autoComplete="street-address"
                      />
                      <FieldError error={errors.address} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label style={labelStyle}>City</label>
                        <input
                          type="text"
                          value={form.city}
                          onChange={updateField('city')}
                          placeholder="New York"
                          className="w-full text-sm border"
                          style={inputStyle(!!errors.city)}
                          autoComplete="address-level2"
                        />
                        <FieldError error={errors.city} />
                      </div>
                      <div>
                        <label style={labelStyle}>ZIP / Postal</label>
                        <input
                          type="text"
                          value={form.zip}
                          onChange={updateField('zip')}
                          placeholder="10001"
                          className="w-full text-sm border"
                          style={inputStyle(!!errors.zip)}
                          autoComplete="postal-code"
                        />
                        <FieldError error={errors.zip} />
                      </div>
                      <div>
                        <label style={labelStyle}>Country</label>
                        <input
                          type="text"
                          value={form.country}
                          onChange={updateField('country')}
                          placeholder="United States"
                          className="w-full text-sm border"
                          style={inputStyle(!!errors.country)}
                          autoComplete="country-name"
                        />
                        <FieldError error={errors.country} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionLabel label={templateId === 'bold' ? 'PAYMENT METHOD' : 'Payment'} textColor={textColor} headingFont={brand.font_heading} />
                    <motion.div
                      className="p-10 text-center mb-6 flex flex-col items-center gap-4"
                      style={{
                        borderRadius,
                        border: `1px solid ${textColor}10`,
                        backgroundColor: isDark ? '#111' : `${textColor}02`,
                      }}
                      initial={{ scale: 0.96 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="text-5xl"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      >
                        💳
                      </motion.div>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ fontFamily: brand.font_heading }}>Demo Checkout</p>
                        <p className="text-xs" style={{ color: `${textColor}40` }}>
                          This is a demo store — no real payment will be processed.
                          <br />In production, Stripe or other payment providers would be integrated here.
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {['🔒', '🛡️', '✓'].map((icon, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${textColor}06`, color: `${textColor}50` }}>
                            {icon} {['SSL', 'Protected', 'Verified'][i]}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionLabel label={templateId === 'bold' ? 'REVIEW YOUR ORDER' : 'Review Your Order'} textColor={textColor} headingFont={brand.font_heading} />
                    <div
                      className="p-6 mb-5"
                      style={{
                        borderRadius,
                        border: `1px solid ${textColor}08`,
                        backgroundColor: isDark ? '#111' : `${textColor}02`,
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: `${textColor}40` }}>Name</p>
                          <p className="font-medium">{form.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: `${textColor}40` }}>Email</p>
                          <p className="font-medium">{form.email}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: `${textColor}40` }}>Shipping to</p>
                          <p className="font-medium">{form.address}, {form.city}, {form.zip}, {form.country}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs underline"
                        style={{ color: accentColor }}
                      >
                        Edit shipping info
                      </button>
                    </div>

                    {/* Items in review */}
                    <div
                      className="p-5"
                      style={{
                        borderRadius,
                        border: `1px solid ${textColor}08`,
                        backgroundColor: isDark ? '#111' : `${textColor}01`,
                      }}
                    >
                      <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: `${textColor}40` }}>Items</p>
                      <div className="space-y-2.5">
                        {cart.map((item) => (
                          <div key={item.productId} className="flex items-center gap-3">
                            {item.image_url && (
                              <div
                                className="h-10 w-10 flex-shrink-0 overflow-hidden"
                                style={{ borderRadius: templateId === 'playful' ? '8px' : '4px', backgroundColor: isDark ? '#222' : `${textColor}04` }}
                              >
                                <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">{item.name}</p>
                              <p className="text-[10px]" style={{ color: `${textColor}40` }}>×{item.quantity}</p>
                            </div>
                            <p className="text-xs font-semibold">{item.currency} {(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {serverError && (
                <motion.div
                  className="mt-4 p-3 rounded-lg text-sm flex items-center gap-2"
                  style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '8px' }}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span>⚠️</span> {serverError}
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8">
                {step > 1 && (
                  <motion.button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {templateId === 'bold' ? '← BACK' : '← Back'}
                  </motion.button>
                )}
                <motion.button
                  type={step === 3 ? 'submit' : 'button'}
                  onClick={step < 3 ? handleNext : undefined}
                  disabled={submitting}
                  className="flex-1 py-3.5 text-sm font-medium transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isDark ? accentColor : textColor,
                    color: isDark ? '#000' : bgColor,
                    borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                    fontWeight: templateId === 'bold' ? 700 : 500,
                    letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  {submitting ? (
                    <>
                      <motion.div
                        className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                      />
                      Placing Order...
                    </>
                  ) : step === 3 ? (
                    <>
                      {templateId === 'bold' ? 'PLACE ORDER' : 'Place Order'} — {currency} {estimatedTotal.toFixed(2)}
                    </>
                  ) : step === 2 ? (
                    templateId === 'bold' ? 'REVIEW ORDER →' : 'Review Order →'
                  ) : (
                    templateId === 'bold' ? 'CONTINUE TO PAYMENT →' : 'Continue to Payment →'
                  )}
                </motion.button>
              </div>

              <p className="text-[11px] text-center mt-3" style={{ color: `${textColor}25` }}>
                🔒 This is a demo checkout. No real payment will be processed.
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <motion.div
              className="p-6 sticky top-20"
              style={{
                borderRadius,
                border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}08`,
                backgroundColor: isDark ? '#111111' : `${textColor}02`,
                boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)' : undefined,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
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
                        className="h-11 w-11 flex-shrink-0 overflow-hidden relative"
                        style={{
                          borderRadius: templateId === 'playful' ? '8px' : templateId === 'classic' ? '6px' : '0',
                          backgroundColor: isDark ? '#222' : `${textColor}04`,
                        }}
                      >
                        <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                        <span
                          className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ backgroundColor: accentColor, color: '#fff' }}
                        >
                          {item.quantity}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="truncate block text-xs font-medium">{item.name}</span>
                      {!item.image_url && <span className="text-[10px]" style={{ color: `${textColor}35` }}>×{item.quantity}</span>}
                    </div>
                    <span className="font-semibold text-xs ml-2">
                      {item.currency} {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t" style={{ borderColor: `${textColor}08` }}>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: `${textColor}50` }}>Subtotal</span>
                  <span className="font-medium">{currency} {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: `${textColor}50` }}>Shipping</span>
                  <span className="font-medium" style={{ color: estimatedShipping === 0 ? '#22c55e' : undefined }}>
                    {estimatedShipping === 0 ? '🚚 Free' : `${currency} ${estimatedShipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t flex items-center justify-between" style={{ borderColor: `${textColor}08` }}>
                <span className="font-semibold text-sm" style={{ fontFamily: brand.font_heading }}>
                  {templateId === 'bold' ? 'TOTAL' : 'Total'}
                </span>
                <span className="font-bold text-lg" style={{ color: accentColor }}>
                  {currency} {estimatedTotal.toFixed(2)}
                </span>
              </div>

              <TrustBadges textColor={textColor} />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

function SectionLabel({ label, textColor, headingFont }: { label: string; textColor: string; headingFont: string }) {
  return (
    <h2
      className="text-sm font-semibold mb-5"
      style={{
        fontFamily: headingFont,
        color: textColor,
        letterSpacing: '0.03em',
      }}
    >
      {label}
    </h2>
  );
}
