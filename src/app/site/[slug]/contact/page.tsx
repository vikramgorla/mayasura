'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrandSite } from '../layout';
import {
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  BORDER_RADIUS_MAP,
} from '@/lib/design-settings';
import { ContactPageMeta } from '@/components/site/site-meta';

/* ─── Validation helpers ──────────────────────────────────────── */
interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validateForm(form: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) {
    errors.name = 'Name is required';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (form.name.trim().length > 100) {
    errors.name = 'Name must be under 100 characters';
  }

  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!form.message.trim()) {
    errors.message = 'Message is required';
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  } else if (form.message.trim().length > 2000) {
    errors.message = 'Message must be under 2000 characters';
  }

  return errors;
}

/* ─── Inline error component ─────────────────────────────────── */
function InlineError({ message, templateId }: { message?: string; templateId: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      className="text-xs mt-1.5"
      style={{
        color: templateId === 'bold' ? '#FF6B6B' : '#EF4444',
        fontWeight: templateId === 'bold' ? 600 : 400,
      }}
    >
      {message}
    </motion.p>
  );
}

/* ─── Social icon SVGs ───────────────────────────────────────── */
function SocialIcon({ type, color, size = 18 }: { type: string; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {type === 'twitter' && <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />}
      {type === 'instagram' && <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill={color} stroke="none" /></>}
      {type === 'linkedin' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>}
      {type === 'facebook' && <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
      {type === 'email' && <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>}
    </svg>
  );
}

/* ─── Clock icon ─────────────────────────────────────────────── */
function ClockIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* ─── Map pin icon ───────────────────────────────────────────── */
function MapPinIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactPage() {
  const data = useBrandSite();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!data) return null;

  const { brand, websiteTemplate: template, designSettings } = data;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;

  const ds = designSettings;
  const primaryBtnStyle = getPrimaryButtonStyle(ds, accentColor);
  const dsRadius = BORDER_RADIUS_MAP[ds.borderRadius];

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  /* ─── Field blur handler ────────────────────────────────────── */
  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const fieldErrors = validateForm(form);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
  };

  /* ─── Field change handler ──────────────────────────────────── */
  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear error on change if touched
    if (touched[field]) {
      const updated = { ...form, [field]: value };
      const fieldErrors = validateForm(updated);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FormErrors] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const allErrors = validateForm(form);
    setErrors(allErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(allErrors).length > 0) return;

    setSending(true);
    setServerError('');
    try {
      const res = await fetch(`/api/public/brand/${slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to send');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setSending(false);
  };

  /* ─── Input styles per template ─────────────────────────────── */
  const inputStyle = (hasError: boolean): React.CSSProperties => {
    const errorBorder = hasError ? '#EF4444' : undefined;
    if (templateId === 'bold') return {
      borderColor: hasError ? '#FF6B6B' : '#FFFFFF20',
      color: '#FFFFFF', backgroundColor: '#FFFFFF06',
      borderWidth: '2px', borderRadius: '0', padding: '0.875rem 1rem',
    };
    if (templateId === 'playful') return {
      borderColor: errorBorder || `${textColor}12`,
      color: textColor, backgroundColor: '#FFFFFF',
      borderRadius: '12px', borderWidth: '2px', padding: '0.875rem 1rem',
    };
    if (templateId === 'classic') return {
      borderColor: errorBorder || `${textColor}12`,
      color: textColor, backgroundColor: bgColor,
      borderRadius: '8px', borderWidth: '1px', padding: '0.875rem 1rem',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)',
    };
    if (templateId === 'editorial') return {
      borderColor: errorBorder || `${textColor}12`,
      color: textColor, backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0', borderRadius: '0', padding: '0.875rem 0',
    };
    return {
      borderColor: errorBorder || `${textColor}10`,
      color: textColor, backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0', borderRadius: '0', padding: '0.875rem 0',
    };
  };

  const labelStyle: React.CSSProperties = {
    color: `${textColor}${templateId === 'bold' ? '55' : '45'}`,
    fontSize: '0.75rem', fontWeight: templateId === 'bold' ? 700 : 500,
    letterSpacing: templateId === 'bold' ? '0.1em' : '0.06em',
    textTransform: 'uppercase' as const,
  };

  const submitBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF',
      padding: '0.875rem 2.5rem', borderRadius: '0',
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, fontSize: '0.75rem',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF',
      padding: '0.875rem 2.5rem', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF',
      padding: '0.75rem 2rem', borderRadius: '8px',
      fontWeight: 500, fontSize: '0.875rem',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.06), -3px -3px 6px rgba(255,255,255,0.6)',
    };
    return {
      backgroundColor: textColor, color: bgColor,
      padding: '0.75rem 2rem', borderRadius: '0',
      fontWeight: 500, fontSize: '0.8125rem', letterSpacing: '0.02em',
    };
  })();

  /* ─── Social links list ─────────────────────────────────────── */
  const socialLinks = [
    { type: 'twitter', label: 'Twitter' },
    { type: 'instagram', label: 'Instagram' },
    { type: 'linkedin', label: 'LinkedIn' },
    { type: 'facebook', label: 'Facebook' },
  ];

  /* ─── Business hours ────────────────────────────────────────── */
  const businessHours = [
    { day: 'Monday – Friday', hours: '9:00 AM – 6:00 PM' },
    { day: 'Saturday', hours: '10:00 AM – 4:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
  ];

  /* ─── Shared sidebar ────────────────────────────────────────── */
  const renderSidebar = () => (
    <div className="space-y-10">
      {/* Map placeholder */}
      <div>
        <h3
          className={`text-xs font-${templateId === 'bold' ? 'bold' : 'semibold'} uppercase tracking-wider mb-4`}
          style={{
            color: textColor,
            letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
          }}
        >
          {templateId === 'bold' ? 'FIND US' : 'Find Us'}
        </h3>
        <div
          className="w-full overflow-hidden flex items-center justify-center"
          style={{
            aspectRatio: '16/10',
            backgroundColor: isDark ? '#111111' : `${textColor}04`,
            borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : dsRadius,
            border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
          }}
        >
          <div className="flex flex-col items-center gap-2 opacity-40">
            <MapPinIcon color={textColor} />
            <span className="text-xs" style={{ color: `${textColor}40` }}>Map location</span>
          </div>
        </div>
      </div>

      {/* Business hours */}
      <div>
        <h3
          className={`text-xs font-${templateId === 'bold' ? 'bold' : 'semibold'} uppercase tracking-wider mb-4`}
          style={{
            color: textColor,
            letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
          }}
        >
          {templateId === 'bold' ? 'BUSINESS HOURS' : 'Business Hours'}
        </h3>
        <div className="space-y-2.5">
          {businessHours.map((bh) => (
            <div key={bh.day} className="flex items-center justify-between text-sm gap-4">
              <span className="flex items-center gap-2" style={{ color: `${textColor}55` }}>
                <ClockIcon color={`${textColor}30`} />
                {bh.day}
              </span>
              <span
                style={{
                  color: bh.hours === 'Closed' ? `${textColor}30` : `${textColor}70`,
                  fontWeight: templateId === 'bold' ? 600 : 400,
                }}
              >
                {bh.hours}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social links */}
      <div>
        <h3
          className={`text-xs font-${templateId === 'bold' ? 'bold' : 'semibold'} uppercase tracking-wider mb-4`}
          style={{
            color: textColor,
            letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
          }}
        >
          {templateId === 'bold' ? 'FOLLOW US' : 'Follow Us'}
        </h3>
        <div className="flex gap-3">
          {socialLinks.map((s) => (
            <button
              key={s.type}
              className="w-10 h-10 flex items-center justify-center transition-opacity hover:opacity-60"
              style={{
                backgroundColor: isDark ? '#FFFFFF08' : `${textColor}06`,
                borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '12px' : '8px',
                border: templateId === 'bold' ? `1px solid ${textColor}12` : undefined,
              }}
              aria-label={s.label}
              title={s.label}
            >
              <SocialIcon type={s.type} color={`${textColor}50`} size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Chat link */}
      <div>
        <h3
          className={`text-xs font-${templateId === 'bold' ? 'bold' : 'semibold'} uppercase tracking-wider mb-3`}
          style={{
            color: textColor,
            letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
          }}
        >
          {templateId === 'bold' ? 'QUICK CHAT' : 'Quick Chat'}
        </h3>
        <Link
          href={`/chat/${slug}`}
          className="text-sm font-medium transition-opacity hover:opacity-60"
          style={{ color: accentColor }}
        >
          {templateId === 'bold' ? 'CHAT WITH US →' : templateId === 'playful' ? 'Talk to our AI assistant 🤖' : 'Chat with us →'}
        </Link>
      </div>
    </div>
  );

  /* ─── Shared form fields ────────────────────────────────────── */
  const renderFormFields = (layout: 'stacked' | 'grid') => (
    <>
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {['name', 'email'].map((field) => (
            <div key={field}>
              <label className="block mb-2" style={labelStyle}>{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
                onBlur={() => handleBlur(field)}
                className="w-full text-sm outline-none border transition-colors focus:border-current"
                style={inputStyle(!!errors[field as keyof FormErrors] && !!touched[field])}
                placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
              />
              <AnimatePresence>
                {touched[field] && <InlineError message={errors[field as keyof FormErrors]} templateId={templateId} />}
              </AnimatePresence>
            </div>
          ))}
        </div>
      ) : (
        ['name', 'email'].map((field) => (
          <div key={field}>
            <label className="block mb-3" style={labelStyle}>{field}</label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={form[field as keyof typeof form]}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              className="w-full text-sm outline-none border transition-colors focus:border-current"
              style={inputStyle(!!errors[field as keyof FormErrors] && !!touched[field])}
              placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
            />
            <AnimatePresence>
              {touched[field] && <InlineError message={errors[field as keyof FormErrors]} templateId={templateId} />}
            </AnimatePresence>
          </div>
        ))
      )}
      <div>
        <label className="block mb-3" style={labelStyle}>
          Message
          <span className="text-xs font-normal ml-2" style={{ color: `${textColor}25` }}>
            {form.message.length}/2000
          </span>
        </label>
        <textarea
          value={form.message}
          onChange={(e) => handleChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          rows={5}
          className="w-full text-sm outline-none border transition-colors focus:border-current resize-none"
          style={inputStyle(!!errors.message && !!touched.message)}
          placeholder={templateId === 'playful' ? 'Tell us what\'s on your mind 💭' : 'Your message'}
          maxLength={2000}
        />
        <AnimatePresence>
          {touched.message && <InlineError message={errors.message} templateId={templateId} />}
        </AnimatePresence>
      </div>
      {serverError && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm" style={{ color: '#EF4444' }}>
          {serverError}
        </motion.p>
      )}
    </>
  );

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';
  const metaTags = (
    <ContactPageMeta
      org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
      canonicalUrl={`${baseUrl}/site/${slug}/contact`}
    />
  );

  /* ═══════ SUCCESS STATE with animation ═══════ */
  if (sent) {
    return (
      <>
        {metaTags}
        <section className="t-hero">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div
              className="w-20 h-20 mx-auto flex items-center justify-center rounded-full"
              style={{ backgroundColor: `${accentColor}12` }}
            >
              <motion.svg
                width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke={accentColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
              >
                <motion.path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                />
                <motion.polyline
                  points="22 4 12 14.01 9 11.01"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                />
              </motion.svg>
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl mb-4"
            style={headingStyle}
          >
            {templateId === 'playful' ? 'Message Sent! 🎊' : templateId === 'bold' ? 'MESSAGE SENT' : 'Message sent'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm mb-8"
            style={{ color: `${textColor}50` }}
          >
            Thank you for reaching out. We&apos;ll get back to you soon.
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => setSent(false)}
            className="text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: accentColor, textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Send another message
          </motion.button>
        </div>
      </section>
    );
  }

  /* ═══════ BOLD TEMPLATE ═══════ */
  if (templateId === 'bold') {
    return (
      <>
        <section className="t-hero" style={{ backgroundColor: '#000000', minHeight: 'auto', padding: '5rem 0 3rem' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>
              — CONTACT
            </span>
            <h1 className="t-hero-heading mb-4" style={{ ...headingStyle, fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
              GET IN TOUCH
            </h1>
            <div className="h-0.5 w-16 mt-2" style={{ backgroundColor: accentColor }} />
          </div>
        </section>

        <section className="t-section" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {renderFormFields('stacked')}
                <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
              {renderSidebar()}
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ═══════ PLAYFUL TEMPLATE ═══════ */
  if (templateId === 'playful') {
    return (
      <>
        <section className="t-hero relative">
          <div className="t-blob" style={{ width: 250, height: 250, top: '-10%', right: '-5%', backgroundColor: accentColor }} />
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10">
            <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              💬 Contact Us
            </span>
            <h1 className="t-hero-heading mb-4" style={headingStyle}>Say Hello! 👋</h1>
            <p className="t-hero-desc mx-auto" style={{ color: `${textColor}50` }}>
              We&apos;d love to hear from you. Fill out the form and we&apos;ll get back to you soon.
            </p>
          </div>
        </section>

        <section className="t-section">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
              {/* Form card */}
              <div className="md:col-span-3 p-8 sm:p-10" style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {renderFormFields('grid')}
                  <button type="submit" disabled={sending} className="w-full t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                    {sending ? 'Sending...' : 'Send Message 🚀'}
                  </button>
                </form>
              </div>
              {/* Sidebar */}
              <div className="md:col-span-2">
                {renderSidebar()}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ═══════ CLASSIC TEMPLATE ═══════ */
  if (templateId === 'classic') {
    return (
      <>
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
              Contact Us
            </span>
            <h1 className="t-hero-heading" style={headingStyle}>Get in Touch</h1>
            <p className="t-hero-desc" style={{ color: `${textColor}55` }}>
              We welcome your inquiries. Please fill out the form below and our team will respond promptly.
            </p>
          </div>
        </section>

        <section className="t-section">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
              <div className="md:col-span-3 t-card p-8 sm:p-10" style={{ backgroundColor: bgColor }}>
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {renderFormFields('grid')}
                  <div className="flex items-center justify-between">
                    <p className="text-xs" style={{ color: `${textColor}35` }}>All fields are required</p>
                    <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                      {sending ? 'Sending...' : 'Submit Inquiry'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="md:col-span-2">
                {renderSidebar()}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ═══════ EDITORIAL TEMPLATE ═══════ */
  if (templateId === 'editorial') {
    return (
      <>
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
              Contact
            </span>
            <h1 className="t-hero-heading mb-4" style={headingStyle}>We&apos;d love to hear from you</h1>
            <p className="t-hero-desc" style={{ color: `${textColor}50` }}>
              Drop us a line. We read every message and respond thoughtfully.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="t-divider" style={{ backgroundColor: `${textColor}06` }} />
        </div>

        <section className="t-section">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {renderFormFields('stacked')}
                <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              {renderSidebar()}
            </div>
          </div>
        </section>
      </>
    );
  }

  /* ═══════ MINIMAL TEMPLATE (default) ═══════ */
  return (
    <>
      <section className="t-hero">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <span className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block" style={{ color: `${textColor}25` }}>
            Contact
          </span>
          <h1 className="t-hero-heading mb-6" style={{ ...headingStyle, fontWeight: 300 }}>Get in touch</h1>
          <p className="t-hero-desc" style={{ color: `${textColor}35` }}>
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="t-section">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16">
            <div className="md:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-10" noValidate>
                {renderFormFields('stacked')}
                <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
            <div className="md:col-span-2">
              {renderSidebar()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
