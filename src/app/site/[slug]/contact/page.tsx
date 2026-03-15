'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrandSite } from '../layout';
import { getPrimaryButtonStyle, BORDER_RADIUS_MAP } from '@/lib/design-settings';
import { ContactPageMeta } from '@/components/site/site-meta';

/* ─── Validation ──────────────────────────────────────────────── */
interface FormErrors { name?: string; email?: string; subject?: string; message?: string }

function validate(f: { name: string; email: string; subject: string; message: string }): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = 'Name is required';
  else if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
  if (!f.email.trim()) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Please enter a valid email';
  if (!f.subject.trim()) e.subject = 'Subject is required';
  else if (f.subject.trim().length < 3) e.subject = 'Subject must be at least 3 characters';
  if (!f.message.trim()) e.message = 'Message is required';
  else if (f.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
  else if (f.message.trim().length > 2000) e.message = 'Message must be under 2000 characters';
  return e;
}

/* ─── Inline error ────────────────────────────────────────────── */
function InlineError({ msg, bold }: { msg?: string; bold: boolean }) {
  if (!msg) return null;
  return (
    <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }}
      className="text-xs mt-1.5" style={{ color: bold ? '#FF6B6B' : '#EF4444', fontWeight: bold ? 600 : 400 }}>{msg}</motion.p>
  );
}

/* ─── SVG Icons ───────────────────────────────────────────────── */
const Icon = ({ d, color, size = 16 }: { d: string; color: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    {d.split('|').map((path, i) => <path key={i} d={path} />)}
  </svg>
);

function SocialIcon({ type, color }: { type: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    twitter: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill={color} stroke="none" /></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
    facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  };
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">{icons[type]}</svg>;
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function tLabel(tid: string, normal: string, bold: string, playful: string) {
  return tid === 'bold' ? bold : tid === 'playful' ? playful : normal;
}

export default function ContactPage() {
  const data = useBrandSite();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');

  if (!data) return null;

  const { brand, websiteTemplate: template, designSettings } = data;
  const slug = brand.slug || brand.id;
  const tid = template?.id || 'minimal';
  const tp = template?.preview;
  const isDark = tid === 'bold';
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const tc = isDark ? '#FFFFFF' : brand.primary_color;
  const ac = brand.accent_color || tc;
  const dsRadius = BORDER_RADIUS_MAP[designSettings.borderRadius];

  const hs: React.CSSProperties = {
    fontFamily: brand.font_heading, fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'], color: tc,
  };

  const isBold = tid === 'bold';
  const handleBlur = (field: string) => {
    setTouched(t => ({ ...t, [field]: true }));
    const fe = validate(form);
    setErrors(prev => ({ ...prev, [field]: fe[field as keyof FormErrors] }));
  };
  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    if (touched[field]) {
      const fe = validate({ ...form, [field]: value });
      setErrors(prev => ({ ...prev, [field]: fe[field as keyof FormErrors] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validate(form);
    setErrors(allErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(allErrors).length > 0) return;
    setSending(true);
    setServerError('');
    try {
      const res = await fetch(`/api/public/brand/${slug}/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'Failed to send');
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (err) { setServerError(err instanceof Error ? err.message : 'Something went wrong'); }
    setSending(false);
  };

  /* ─── Input styles ──────────────────────────────────────────── */
  const inputStyle = (hasError: boolean): React.CSSProperties => {
    const eb = hasError ? (isBold ? '#FF6B6B' : '#EF4444') : undefined;
    const base = { color: tc, padding: '0.875rem 1rem' as const };
    if (isBold) return { ...base, borderColor: eb || '#FFFFFF20', backgroundColor: '#FFFFFF06', borderWidth: '2px', borderRadius: '0', color: '#FFFFFF' };
    if (tid === 'playful') return { ...base, borderColor: eb || `${tc}12`, backgroundColor: '#FFFFFF', borderRadius: '12px', borderWidth: '2px' };
    if (tid === 'classic') return { ...base, borderColor: eb || `${tc}12`, backgroundColor: bgColor, borderRadius: '8px', borderWidth: '1px',
      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.03), inset -2px -2px 4px rgba(255,255,255,0.5)' };
    return { ...base, borderColor: eb || `${tc}10`, backgroundColor: 'transparent', borderWidth: '0 0 1px 0', borderRadius: '0', padding: '0.875rem 0' };
  };

  const labelStyle: React.CSSProperties = {
    color: `${tc}${isBold ? '55' : '45'}`, fontSize: '0.75rem', fontWeight: isBold ? 700 : 500,
    letterSpacing: isBold ? '0.1em' : '0.06em', textTransform: 'uppercase',
  };

  const submitStyle: React.CSSProperties = isBold
    ? { backgroundColor: ac, color: '#FFF', padding: '0.875rem 2.5rem', borderRadius: '0', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.75rem' }
    : tid === 'playful'
    ? { backgroundColor: ac, color: '#FFF', padding: '0.875rem 2.5rem', borderRadius: '9999px', fontWeight: 600, fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }
    : tid === 'classic'
    ? { backgroundColor: ac, color: '#FFF', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 500, fontSize: '0.875rem' }
    : { backgroundColor: tc, color: bgColor, padding: '0.75rem 2rem', borderRadius: '0', fontWeight: 500, fontSize: '0.8125rem' };

  const hours = [{ day: 'Mon – Fri', hours: '9:00 AM – 6:00 PM' }, { day: 'Saturday', hours: '10:00 AM – 4:00 PM' }, { day: 'Sunday', hours: 'Closed' }];
  const socials = ['twitter', 'instagram', 'linkedin', 'facebook'];
  const sideH3 = `text-xs font-${isBold ? 'bold' : 'semibold'} uppercase tracking-wider mb-4`;
  const sideH3Style = { color: tc, letterSpacing: isBold ? '0.12em' : '0.06em' };
  const cardR = isBold ? '0' : tid === 'playful' ? '16px' : tid === 'classic' ? '8px' : dsRadius;

  /* ─── Field renderer ────────────────────────────────────────── */
  const Field = ({ name, type = 'text', placeholder, grid }: { name: string; type?: string; placeholder: string; grid?: boolean }) => (
    <div className={grid ? '' : undefined}>
      <label className={`block mb-${grid ? '2' : '3'}`} style={labelStyle}>{name}</label>
      <input type={type} value={form[name as keyof typeof form]} onChange={e => handleChange(name, e.target.value)} onBlur={() => handleBlur(name)}
        className="w-full text-sm outline-none border transition-colors focus:border-current"
        style={inputStyle(!!errors[name as keyof FormErrors] && !!touched[name])} placeholder={placeholder} />
      <AnimatePresence>{touched[name] && <InlineError msg={errors[name as keyof FormErrors]} bold={isBold} />}</AnimatePresence>
    </div>
  );

  const renderForm = (layout: 'stacked' | 'grid') => (
    <form onSubmit={handleSubmit} className={`space-y-${layout === 'grid' ? '6' : '8'}`} noValidate>
      {layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field name="name" placeholder="Your name" grid />
          <Field name="email" type="email" placeholder="you@example.com" grid />
        </div>
      ) : (<><Field name="name" placeholder="Your name" /><Field name="email" type="email" placeholder="you@example.com" /></>)}
      <Field name="subject" placeholder={tid === 'playful' ? 'What\'s this about? 🤔' : 'What is this regarding?'} />
      <div>
        <label className="block mb-3" style={labelStyle}>Message <span className="text-xs font-normal ml-2" style={{ color: `${tc}25` }}>{form.message.length}/2000</span></label>
        <textarea value={form.message} onChange={e => handleChange('message', e.target.value)} onBlur={() => handleBlur('message')} rows={5}
          className="w-full text-sm outline-none border transition-colors focus:border-current resize-none"
          style={inputStyle(!!errors.message && !!touched.message)} placeholder={tid === 'playful' ? 'Tell us what\'s on your mind 💭' : 'Your message'} maxLength={2000} />
        <AnimatePresence>{touched.message && <InlineError msg={errors.message} bold={isBold} />}</AnimatePresence>
      </div>
      {serverError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm" style={{ color: '#EF4444' }}>{serverError}</motion.p>}
      <button type="submit" disabled={sending} className={`t-btn-primary disabled:opacity-50 ${layout === 'grid' && tid === 'playful' ? 'w-full' : ''}`} style={submitStyle}>
        {sending ? (isBold ? 'SENDING...' : 'Sending...') : tLabel(tid, 'Send Message', 'SEND MESSAGE', 'Send Message 🚀')}
      </button>
    </form>
  );

  const renderSidebar = () => {
    // Contact method cards with hover animations
    const contactMethods = [
      {
        icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
        label: 'Email Us',
        value: `hello@${brand.name.toLowerCase().replace(/\s+/g, '')}.com`,
        sublabel: 'We reply within 24 hours',
        color: '#6366F1',
      },
      {
        icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
        label: 'Call Us',
        value: '+1 (555) 000-0000',
        sublabel: 'Mon–Fri, 9am–6pm',
        color: '#10B981',
      },
    ];

    return (
      <div className="space-y-8">
        {/* Contact method hover cards */}
        <div>
          <h3 className={sideH3} style={sideH3Style}>{tLabel(tid, 'Get in Touch', 'GET IN TOUCH', 'Get in Touch')}</h3>
          <div className="space-y-3">
            {contactMethods.map((method, i) => (
              <motion.div
                key={method.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="group flex items-start gap-4 p-4 rounded-lg cursor-default transition-all"
                style={{
                  backgroundColor: isDark ? '#FFFFFF04' : `${tc}03`,
                  border: `1px solid ${isDark ? '#FFFFFF08' : `${tc}06`}`,
                  borderRadius: cardR,
                }}
                whileHover={{
                  backgroundColor: isDark ? '#FFFFFF08' : `${method.color}08`,
                  borderColor: `${method.color}30`,
                  y: -2,
                }}
              >
                <div
                  className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${method.color}12`, color: method.color }}
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={method.color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={method.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: `${tc}50` }}>{method.label}</p>
                  <p className="text-sm font-medium" style={{ color: tc }}>{method.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: `${tc}40` }}>{method.sublabel}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Map placeholder */}
        <div>
          <h3 className={sideH3} style={sideH3Style}>{tLabel(tid, 'Find Us', 'FIND US', 'Find Us')}</h3>
          <div className="w-full overflow-hidden flex items-center justify-center"
            style={{ aspectRatio: '16/10', backgroundColor: isDark ? '#111111' : `${tc}04`, borderRadius: cardR, border: isBold ? `2px solid ${tc}10` : undefined }}>
            <div className="flex flex-col items-center gap-2 opacity-40">
              <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z|M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0" color={tc} />
              <span className="text-xs" style={{ color: `${tc}40` }}>Map location</span>
            </div>
          </div>
        </div>

        {/* Business hours */}
        <div>
          <h3 className={sideH3} style={sideH3Style}>{tLabel(tid, 'Business Hours', 'BUSINESS HOURS', 'Business Hours')}</h3>
          <div className="space-y-2.5">
            {hours.map(h => (
              <div key={h.day} className="flex items-center justify-between text-sm gap-4">
                <span className="flex items-center gap-2" style={{ color: `${tc}55` }}>
                  <Icon d="M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20|M12 6v6l4 2" color={`${tc}30`} />
                  {h.day}
                </span>
                <span style={{ color: h.hours === 'Closed' ? `${tc}30` : `${tc}70`, fontWeight: isBold ? 600 : 400 }}>{h.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className={sideH3} style={sideH3Style}>{tLabel(tid, 'Follow Us', 'FOLLOW US', 'Follow Us')}</h3>
          <div className="flex gap-3">
            {socials.map(s => (
              <motion.button
                key={s}
                className="w-10 h-10 flex items-center justify-center transition-all"
                style={{ backgroundColor: isDark ? '#FFFFFF08' : `${tc}06`, borderRadius: isBold ? '0' : tid === 'playful' ? '12px' : '8px',
                  border: isBold ? `1px solid ${tc}12` : undefined }}
                aria-label={`Follow on ${s}`}
                title={`Follow on ${s}`}
                whileHover={{ scale: 1.1, backgroundColor: `${ac}15` }}
                whileTap={{ scale: 0.95 }}
              >
                <SocialIcon type={s} color={`${tc}50`} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Chat link */}
        <div>
          <h3 className={sideH3} style={sideH3Style}>{tLabel(tid, 'Quick Chat', 'QUICK CHAT', 'Quick Chat')}</h3>
          <Link href={`/chat/${slug}`} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: ac }}>
            {tLabel(tid, 'Chat with us →', 'CHAT WITH US →', 'Talk to our AI assistant 🤖')}
          </Link>
        </div>
      </div>
    );
  };

  /* ═══════ SUCCESS ═══════ */
  if (sent) return (
    <section className="t-hero">
      <div className="max-w-xl mx-auto px-5 sm:px-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="mb-6">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full" style={{ backgroundColor: `${ac}12` }}>
            <motion.svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ac} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <motion.path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />
              <motion.polyline points="22 4 12 14.01 9 11.01" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
            </motion.svg>
          </div>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-2xl mb-4" style={hs}>
          {tLabel(tid, 'Message sent', 'MESSAGE SENT', 'Message Sent! 🎊')}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm mb-8" style={{ color: `${tc}50` }}>
          Thank you for reaching out. We&apos;ll get back to you soon.
        </motion.p>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} onClick={() => setSent(false)}
          className="text-sm font-medium transition-opacity hover:opacity-60"
          style={{ color: ac, textDecoration: 'underline', textUnderlineOffset: '4px' }}>Send another message</motion.button>
      </div>
    </section>
  );

  /* ═══════ HERO ═══════ */
  const hero = (
    <section className="t-hero" style={isBold ? { backgroundColor: '#000', minHeight: 'auto', padding: '5rem 0 3rem' } : {}}>
      <div className={`${isBold ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8 ${tid === 'playful' || tid === 'classic' ? 'text-center' : ''}`}>
        {tid === 'playful' ? (
          <>
            <div className="t-blob" style={{ width: 250, height: 250, top: '-10%', right: '-5%', backgroundColor: ac, position: 'absolute' }} />
            <span className="t-badge mb-6 inline-flex relative z-10" style={{ backgroundColor: `${ac}15`, color: ac }}>💬 Contact Us</span>
            <h1 className="t-hero-heading mb-4 relative z-10" style={hs}>Say Hello! 👋</h1>
          </>
        ) : (
          <>
            <span className={`text-xs font-${isBold ? 'bold' : 'medium'} uppercase tracking-[0.${isBold || tid === 'editorial' ? '2' : '12'}em] mb-6 block`}
              style={{ color: isBold || tid === 'editorial' ? ac : tid === 'classic' ? ac : `${tc}25` }}>
              {isBold ? '— CONTACT' : tid === 'classic' ? 'Contact Us' : 'Contact'}
            </span>
            <h1 className="t-hero-heading mb-4" style={{ ...hs, ...(isBold ? { fontSize: 'clamp(2rem, 6vw, 4rem)' } : tid === 'minimal' ? { fontWeight: 300 } : {}) }}>
              {tLabel(tid, tid === 'editorial' ? 'We\'d love to hear from you' : 'Get in touch', 'GET IN TOUCH', 'Get in Touch')}
            </h1>
          </>
        )}
        <p className={`t-hero-desc ${tid === 'playful' ? 'mx-auto relative z-10' : ''}`} style={{ color: `${tc}${tid === 'classic' ? '55' : '50'}` }}>
          {tid === 'editorial' ? 'Drop us a line. We read every message and respond thoughtfully.' :
           'We\'d love to hear from you. Fill out the form and we\'ll get back to you soon.'}
        </p>
        {isBold && <div className="h-0.5 w-16 mt-2" style={{ backgroundColor: ac }} />}
      </div>
    </section>
  );

  /* ═══════ DIVIDER (editorial) ═══════ */
  const divider = tid === 'editorial' && (
    <div className="max-w-6xl mx-auto px-5 sm:px-8"><div className="t-divider" style={{ backgroundColor: `${tc}06` }} /></div>
  );

  /* ═══════ FORM SECTION ═══════ */
  const formCard = tid === 'playful'
    ? <div className="md:col-span-3 p-8 sm:p-10" style={{ backgroundColor: '#FFF', borderRadius: '24px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>{renderForm('grid')}</div>
    : tid === 'classic'
    ? <div className="md:col-span-3 t-card p-8 sm:p-10" style={{ backgroundColor: bgColor }}>{renderForm('grid')}</div>
    : <div className={isBold ? '' : 'md:col-span-3'}>{renderForm(isBold || tid === 'editorial' ? 'stacked' : 'stacked')}</div>;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';

  return (
    <>
      <ContactPageMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={`${baseUrl}/site/${slug}/contact`}
      />
      {hero}
      {divider}
      <section className="t-section" style={isBold ? { backgroundColor: '#000' } : {}}>
        <div className={`${isBold ? 'max-w-7xl' : tid === 'editorial' ? 'max-w-6xl' : 'max-w-5xl'} mx-auto px-5 sm:px-8`}>
          <div className={`grid grid-cols-1 ${isBold || tid === 'editorial' ? 'md:grid-cols-2 gap-16' : 'md:grid-cols-5 gap-10 sm:gap-12 md:gap-16'}`}>
            {formCard}
            <div className={isBold || tid === 'editorial' ? '' : 'md:col-span-2'}>{renderSidebar()}</div>
          </div>
        </div>
      </section>
    </>
  );
}
