'use client';

/**
 * Section Renderer — Renders page sections based on layout config.
 * Used by the consumer site to dynamically render sections.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedCounter, ScrollReveal } from '@/components/site/hero-animations';
import type { Brand } from '@/lib/types';
import type { WebsiteTemplate } from '@/lib/website-templates';
import type {
  PageSection,
  PageLayout,
  HeroConfig,
  FeaturesConfig,
  ProductsConfig,
  BlogConfig,
  TestimonialsConfig,
  NewsletterConfig,
  ContactCtaConfig,
  StatsConfig,
  FaqConfig,
} from '@/lib/page-layout';
import {
  getPrimaryButtonStyle,
  BORDER_RADIUS_MAP,
  SPACING_MAP,
  type ResolvedDesignSettings,
} from '@/lib/design-settings';

interface SectionProps {
  brand: Brand;
  template?: WebsiteTemplate;
  designSettings?: ResolvedDesignSettings;
  products?: Array<{ id: string; name: string; description: string; price: number; currency: string; image_url: string | null; category: string | null }>;
  blogPosts?: Array<{ id: string; title: string; slug: string; excerpt: string | null; category: string | null; published_at: string }>;
}

// ─── Testimonials Section (scroll-triggered) ────────────────────
function TestimonialsSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as TestimonialsConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <ScrollReveal>
          <h2
            className="t-section-heading mb-8 text-center"
            style={{
              fontFamily: brand.font_heading,
              fontWeight: tp?.typography.headingWeight || '600',
              letterSpacing: tp?.typography.headingTracking,
              color: textColor,
            }}
          >
            {templateId === 'bold' ? 'TESTIMONIALS' : templateId === 'playful' ? 'What People Say 💬' : 'What People Say'}
          </h2>
        </ScrollReveal>
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(config.items.length, 3)} gap-6 max-w-4xl mx-auto`}>
          {config.items.map((item, i) => (
            <div
              key={i}
              className="p-6 text-center"
              style={{
                backgroundColor: templateId === 'playful' ? ['#FFF7ED', '#EFF6FF', '#F0FDF4'][i % 3] : isDark ? `${textColor}06` : `${textColor}04`,
                borderRadius: templateId === 'playful' ? '20px' : tp?.borderRadius || '8px',
                border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
              }}
            >
              <p className="text-sm italic mb-4 leading-relaxed" style={{ color: `${textColor}70` }}>
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-sm font-medium" style={{ color: accentColor }}>
                — {item.author}
              </p>
              {item.role && (
                <p className="text-xs mt-0.5" style={{ color: `${textColor}40` }}>
                  {item.role}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section (animated counters) ───────────────────────────
function StatsSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as StatsConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;

  // Try to parse numeric values for animated counters
  const parseStatNumber = (numStr: string): { value: number; prefix: string; suffix: string } | null => {
    const match = numStr.match(/^([^0-9]*)(\d[\d,.]*)([^0-9]*)$/);
    if (!match) return null;
    const value = parseFloat(match[2].replace(/,/g, ''));
    if (isNaN(value)) return null;
    return { value, prefix: match[1], suffix: match[3] };
  };

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <ScrollReveal>
          <div className={`grid grid-cols-2 md:grid-cols-${Math.min(config.items.length, 4)} gap-8 text-center`}>
            {config.items.map((item, i) => {
              const parsed = parseStatNumber(item.number);
              return (
                <div key={i}>
                  <p
                    className="text-3xl sm:text-4xl font-bold mb-1"
                    style={{
                      fontFamily: brand.font_heading,
                      color: accentColor,
                      fontWeight: tp?.typography.headingWeight || '700',
                    }}
                  >
                    {parsed ? (
                      <AnimatedCounter
                        end={parsed.value}
                        prefix={parsed.prefix}
                        suffix={parsed.suffix}
                        duration={1800}
                      />
                    ) : (
                      item.number
                    )}
                  </p>
                  <p className="text-sm" style={{ color: `${textColor}50` }}>
                    {item.label}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ─── Newsletter Section ──────────────────────────────────────────
function NewsletterSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as NewsletterConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;
  const slug = brand.slug || brand.id;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const inputRadius = templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : tp?.borderRadius || '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/brand/${slug}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubscribed(true);
      setEmail('');
      setName('');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-14 sm:py-20 px-8 sm:px-16 text-center relative overflow-hidden"
          style={{
            background: isDark
              ? `linear-gradient(135deg, ${accentColor}20 0%, #11111180 100%)`
              : `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}15 50%, ${textColor}04 100%)`,
            borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : tp?.borderRadius || '8px',
          }}
        >
          {/* Decorative gradient blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none" style={{ backgroundColor: `${accentColor}10` }} />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-[60px] pointer-events-none" style={{ backgroundColor: `${textColor}06` }} />
          <div className="relative z-10">
            <h2
              className="text-xl sm:text-2xl mb-3"
              style={{
                fontFamily: brand.font_heading,
                fontWeight: tp?.typography.headingWeight || '600',
                color: textColor,
              }}
            >
              {config.heading || 'Stay Updated'}
            </h2>
            <p className="text-sm mb-8" style={{ color: `${textColor}55` }}>
              {config.subheading || `Join 1,000+ subscribers who get the latest from ${brand.name}.`}
            </p>
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 250, damping: 12 }}
                    className="h-16 w-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${accentColor}15` }}
                  >
                    <motion.svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <motion.path
                        d="M8 16L14 22L24 10"
                        stroke={accentColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                      />
                    </motion.svg>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm font-medium"
                    style={{ color: accentColor }}
                  >
                    You&apos;re subscribed! Thank you for joining.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-xs"
                    style={{ color: `${textColor}40` }}
                  >
                    Check your inbox for a welcome message.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Name (optional)"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-1/3 px-4 py-3 text-sm border outline-none transition-all focus:ring-2"
                      style={{
                        borderColor: `${textColor}12`,
                        color: textColor,
                        backgroundColor: isDark ? '#FFFFFF08' : '#FFFFFF',
                        borderRadius: inputRadius,
                      }}
                    />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      className={`flex-1 px-4 py-3 text-sm border outline-none transition-all focus:ring-2 ${error ? 'ring-2 ring-red-400' : ''}`}
                      style={{
                        borderColor: error ? '#ef4444' : `${textColor}12`,
                        color: textColor,
                        backgroundColor: isDark ? '#FFFFFF08' : '#FFFFFF',
                        borderRadius: inputRadius,
                      }}
                      required
                    />
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-red-500 text-left"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 text-sm font-medium transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                    style={{
                      backgroundColor: isDark ? accentColor : textColor,
                      color: isDark ? '#FFFFFF' : bgColor,
                      borderRadius: inputRadius,
                    }}
                  >
                    {submitting ? 'Subscribing...' : (config.buttonText || 'Subscribe')}
                  </button>
                  <p className="text-[10px]" style={{ color: `${textColor}30` }}>
                    No spam, unsubscribe anytime.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────
function FaqSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as FaqConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <h2
          className="t-section-heading mb-8 text-center"
          style={{
            fontFamily: brand.font_heading,
            fontWeight: tp?.typography.headingWeight || '600',
            color: textColor,
          }}
        >
          {templateId === 'bold' ? 'FAQ' : templateId === 'playful' ? 'FAQ ❓' : 'Frequently Asked Questions'}
        </h2>
        <div className="max-w-2xl mx-auto space-y-2">
          {config.items.map((item, i) => (
            <div
              key={i}
              className="border overflow-hidden"
              style={{
                borderColor: `${textColor}10`,
                borderRadius: tp?.borderRadius || '8px',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-medium" style={{ color: textColor }}>
                  {item.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  className="text-sm ml-2"
                  style={{ color: `${textColor}40` }}
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed" style={{ color: `${textColor}55` }}>
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Contact CTA Section ─────────────────────────────────────────
function ContactCtaSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as ContactCtaConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;
  const slug = brand.slug || brand.id;

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <div
          className="py-16 sm:py-20 px-8 sm:px-16 text-center"
          style={{
            backgroundColor: isDark ? '#111111' : `${textColor}04`,
            borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : '0',
            border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
          }}
        >
          <h2
            className="text-2xl sm:text-3xl mb-4"
            style={{
              fontFamily: brand.font_heading,
              fontWeight: tp?.typography.headingWeight || '600',
              color: textColor,
            }}
          >
            {config.heading || 'Ready to get started?'}
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${textColor}45` }}>
            {config.subheading || 'Get in touch with us today.'}
          </p>
          <Link
            href={config.buttonLink || `/site/${slug}/contact`}
            className="t-btn-primary inline-block"
            style={{
              backgroundColor: isDark ? accentColor : textColor,
              color: isDark ? '#FFFFFF' : bgColor,
            }}
          >
            {config.buttonText || 'Contact Us'}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Main Section Renderer ───────────────────────────────────────
export function SectionRenderer({
  section,
  ...props
}: {
  section: PageSection;
} & SectionProps) {
  if (!section.visible) return null;

  switch (section.type) {
    case 'testimonials':
      return <TestimonialsSection section={section} {...props} />;
    case 'stats':
      return <StatsSection section={section} {...props} />;
    case 'newsletter':
      return <NewsletterSection section={section} {...props} />;
    case 'faq':
      return <FaqSection section={section} {...props} />;
    case 'contact-cta':
      return <ContactCtaSection section={section} {...props} />;
    // hero, features, products, blog are handled by the existing page.tsx
    // to maintain template-specific rendering
    default:
      return null;
  }
}

/**
 * Render additional layout sections (testimonials, stats, newsletter, FAQ, contact-cta)
 * that the consumer site doesn't render by default.
 */
export function LayoutSections({
  layout,
  brand,
  template,
  products,
  blogPosts,
  designSettings,
}: {
  layout: PageLayout;
} & SectionProps) {
  // Only render sections that aren't already handled by the default page
  const extraTypes = ['testimonials', 'stats', 'newsletter', 'faq', 'contact-cta'];
  const sections = layout.sections
    .filter(s => s.visible && extraTypes.includes(s.type))
    .sort((a, b) => a.order - b.order);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map(section => (
        <SectionRenderer
          key={section.id}
          section={section}
          brand={brand}
          template={template}
          products={products}
          blogPosts={blogPosts}
        />
      ))}
    </>
  );
}
