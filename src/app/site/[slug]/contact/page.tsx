'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBrandSite } from '../layout';

export default function ContactPage() {
  const data = useBrandSite();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  if (!data) return null;

  const { brand, websiteTemplate: template } = data;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const res = await fetch(`/api/public/brand/${slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
    setSending(false);
  };

  // Input styles per template
  const inputStyle = ((): React.CSSProperties => {
    if (templateId === 'bold') return {
      borderColor: '#FFFFFF20',
      color: '#FFFFFF',
      backgroundColor: '#FFFFFF06',
      borderWidth: '2px',
      borderRadius: '0',
      padding: '0.875rem 1rem',
    };
    if (templateId === 'playful') return {
      borderColor: `${textColor}12`,
      color: textColor,
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      borderWidth: '2px',
      padding: '0.875rem 1rem',
    };
    if (templateId === 'classic') return {
      borderColor: `${textColor}12`,
      color: textColor,
      backgroundColor: bgColor,
      borderRadius: '8px',
      borderWidth: '1px',
      padding: '0.875rem 1rem',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)',
    };
    if (templateId === 'editorial') return {
      borderColor: `${textColor}12`,
      color: textColor,
      backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0',
      borderRadius: '0',
      padding: '0.875rem 0',
    };
    // minimal
    return {
      borderColor: `${textColor}10`,
      color: textColor,
      backgroundColor: 'transparent',
      borderWidth: '0 0 1px 0',
      borderRadius: '0',
      padding: '0.875rem 0',
    };
  })();

  const labelStyle: React.CSSProperties = {
    color: `${textColor}${templateId === 'bold' ? '55' : '45'}`,
    fontSize: '0.75rem',
    fontWeight: templateId === 'bold' ? 700 : 500,
    letterSpacing: templateId === 'bold' ? '0.1em' : '0.06em',
    textTransform: 'uppercase' as const,
  };

  const submitBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF',
      padding: '0.875rem 2.5rem', borderRadius: '0',
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
      fontSize: '0.75rem',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF',
      padding: '0.875rem 2.5rem', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.875rem',
      boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
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
      fontWeight: 500, fontSize: '0.8125rem',
      letterSpacing: '0.02em',
    };
  })();

  // Success state
  if (sent) {
    return (
      <section className="t-hero">
        <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
          <div className="mb-6">
            <span className="text-4xl">{templateId === 'playful' ? '🎉' : '✓'}</span>
          </div>
          <h1 className="text-2xl mb-4" style={headingStyle}>
            {templateId === 'playful' ? 'Message Sent! 🎊' : templateId === 'bold' ? 'MESSAGE SENT' : 'Message sent'}
          </h1>
          <p className="text-sm mb-8" style={{ color: `${textColor}50` }}>
            Thank you for reaching out. We&apos;ll get back to you soon.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: accentColor, textDecoration: 'underline', textUnderlineOffset: '4px' }}
          >
            Send another message
          </button>
        </div>
      </section>
    );
  }

  // BOLD template — full dark page, prominent heading
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {['name', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block mb-3" style={labelStyle}>{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full text-sm outline-none border transition-colors focus:border-current"
                      style={inputStyle}
                      placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                    />
                  </div>
                ))}
                <div>
                  <label className="block mb-3" style={labelStyle}>MESSAGE</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full text-sm outline-none border transition-colors focus:border-current resize-none"
                    style={inputStyle}
                    placeholder="Your message"
                  />
                </div>
                {error && <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>}
                <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>

              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#FFFFFF' }}>
                    SAY HELLO
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#FFFFFF55' }}>
                    We&apos;re always open to hearing from you. Drop us a line and we&apos;ll respond as soon as possible.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.12em] mb-3" style={{ color: '#FFFFFF' }}>
                    OTHER WAYS
                  </h3>
                  <div className="space-y-3">
                    <Link href={`/chat/${slug}`} className="block text-sm font-medium transition-opacity hover:opacity-60" style={{ color: accentColor }}>
                      CHAT WITH US →
                    </Link>
                    <Link href={`/site/${slug}`} className="block text-sm transition-opacity hover:opacity-60" style={{ color: '#FFFFFF55' }}>
                      VISIT WEBSITE →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // PLAYFUL template — rounded, friendly, pastel accents
  if (templateId === 'playful') {
    return (
      <>
        <section className="t-hero relative">
          <div className="t-blob" style={{ width: 250, height: 250, top: '-10%', right: '-5%', backgroundColor: accentColor }} />
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative z-10">
            <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              💬 Contact Us
            </span>
            <h1 className="t-hero-heading mb-4" style={headingStyle}>
              Say Hello! 👋
            </h1>
            <p className="t-hero-desc mx-auto" style={{ color: `${textColor}50` }}>
              We&apos;d love to hear from you. Fill out the form and we&apos;ll get back to you soon.
            </p>
          </div>
        </section>

        <section className="t-section">
          <div className="max-w-xl mx-auto px-5 sm:px-8">
            <div className="p-8 sm:p-10" style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {['name', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block mb-2 text-sm font-semibold capitalize" style={{ color: textColor }}>{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full text-sm outline-none border-2 transition-all focus:border-current"
                      style={inputStyle}
                      placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                    />
                  </div>
                ))}
                <div>
                  <label className="block mb-2 text-sm font-semibold" style={{ color: textColor }}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full text-sm outline-none border-2 transition-all focus:border-current resize-none"
                    style={inputStyle}
                    placeholder="Tell us what's on your mind 💭"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={sending} className="w-full t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'Sending...' : 'Send Message 🚀'}
                </button>
              </form>
            </div>

            <div className="mt-10 text-center">
              <p className="text-sm" style={{ color: `${textColor}40` }}>
                Prefer chatting?{' '}
                <Link href={`/chat/${slug}`} className="font-semibold transition-opacity hover:opacity-60" style={{ color: accentColor }}>
                  Talk to our AI assistant 🤖
                </Link>
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  // CLASSIC template — structured, professional
  if (templateId === 'classic') {
    return (
      <>
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
              Contact Us
            </span>
            <h1 className="t-hero-heading" style={headingStyle}>
              Get in Touch
            </h1>
            <p className="t-hero-desc" style={{ color: `${textColor}55` }}>
              We welcome your inquiries. Please fill out the form below and our team will respond promptly.
            </p>
          </div>
        </section>

        <section className="t-section">
          <div className="max-w-2xl mx-auto px-5 sm:px-8">
            <div className="t-card p-8 sm:p-10" style={{ backgroundColor: bgColor }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2" style={labelStyle}>Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full text-sm outline-none border transition-colors focus:border-current"
                      style={inputStyle}
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2" style={labelStyle}>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      className="w-full text-sm outline-none border transition-colors focus:border-current"
                      style={inputStyle}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2" style={labelStyle}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full text-sm outline-none border transition-colors focus:border-current resize-none"
                    style={inputStyle}
                    placeholder="How can we help you?"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex items-center justify-between">
                  <p className="text-xs" style={{ color: `${textColor}35` }}>
                    All fields are required
                  </p>
                  <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                    {sending ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 grid grid-cols-3 gap-6 text-center">
              {[
                { icon: '🔒', label: 'Secure' },
                { icon: '⚡', label: 'Fast Response' },
                { icon: '✓', label: 'Professional' },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xl">{item.icon}</span>
                  <p className="text-xs mt-1" style={{ color: `${textColor}40` }}>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  // EDITORIAL template — underlined inputs, serif heading
  if (templateId === 'editorial') {
    return (
      <>
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
              Contact
            </span>
            <h1 className="t-hero-heading mb-4" style={headingStyle}>
              We&apos;d love to hear from you
            </h1>
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
              <form onSubmit={handleSubmit} className="space-y-8">
                {['name', 'email'].map((field) => (
                  <div key={field}>
                    <label className="block mb-3" style={labelStyle}>{field}</label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                      required
                      className="w-full text-sm outline-none border-0 border-b transition-colors focus:border-current"
                      style={inputStyle}
                      placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                    />
                  </div>
                ))}
                <div>
                  <label className="block mb-3" style={labelStyle}>Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full text-sm outline-none border-0 border-b transition-colors focus:border-current resize-none"
                    style={inputStyle}
                    placeholder="What's on your mind?"
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div className="space-y-10 pt-4">
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>
                    Visit Us
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: `${textColor}45` }}>
                    We&apos;re always happy to connect. Reach out through this form or find us through our other channels.
                  </p>
                </div>
                <div className="h-px" style={{ backgroundColor: `${textColor}08` }} />
                <div>
                  <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>
                    Other Channels
                  </h3>
                  <div className="space-y-2">
                    <Link href={`/chat/${slug}`} className="block text-sm transition-opacity hover:opacity-60" style={{ color: accentColor }}>
                      Chat with us →
                    </Link>
                    <Link href={`/blog/${slug}`} className="block text-sm transition-opacity hover:opacity-60" style={{ color: `${textColor}50` }}>
                      Read our journal →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  // MINIMAL template (default) — ultra-clean, bottom-line inputs
  return (
    <>
      <section className="t-hero">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <span
            className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block"
            style={{ color: `${textColor}25` }}
          >
            Contact
          </span>
          <h1 className="t-hero-heading mb-6" style={{ ...headingStyle, fontWeight: 300 }}>
            Get in touch
          </h1>
          <p className="t-hero-desc" style={{ color: `${textColor}35` }}>
            Send us a message and we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <section className="t-section">
        <div className="max-w-xl mx-auto px-5 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-10">
            {['name', 'email'].map((field) => (
              <div key={field}>
                <label className="block mb-3" style={labelStyle}>{field}</label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  required
                  className="w-full text-sm outline-none border-0 border-b transition-colors focus:border-current"
                  style={inputStyle}
                  placeholder={field === 'email' ? 'you@example.com' : 'Your name'}
                />
              </div>
            ))}
            <div>
              <label className="block mb-3" style={labelStyle}>Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                required
                rows={5}
                className="w-full text-sm outline-none border-0 border-b transition-colors focus:border-current resize-none"
                style={inputStyle}
                placeholder="How can we help?"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={sending} className="t-btn-primary disabled:opacity-50" style={submitBtnStyle}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
