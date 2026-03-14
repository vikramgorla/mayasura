'use client';

/**
 * Section Renderer — Renders page sections based on layout config.
 * Used by the consumer site to dynamically render sections.
 */

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

interface SectionProps {
  brand: Brand;
  template?: WebsiteTemplate;
  products?: Array<{ id: string; name: string; description: string; price: number; currency: string; image_url: string | null; category: string | null }>;
  blogPosts?: Array<{ id: string; title: string; slug: string; excerpt: string | null; category: string | null; published_at: string }>;
}

// ─── Testimonials Section ────────────────────────────────────────
function TestimonialsSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as TestimonialsConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
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
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(config.items.length, 3)} gap-6 max-w-4xl mx-auto`}>
          {config.items.map((item, i) => (
            <div
              key={i}
              className="p-6 text-center"
              style={{
                backgroundColor: templateId === 'playful' ? ['#FFF7ED', '#EFF6FF', '#F0FDF4'][i % 3] : `${textColor}04`,
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

// ─── Stats Section ───────────────────────────────────────────────
function StatsSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as StatsConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(config.items.length, 4)} gap-8 text-center`}>
          {config.items.map((item, i) => (
            <div key={i}>
              <p
                className="text-3xl sm:text-4xl font-bold mb-1"
                style={{
                  fontFamily: brand.font_heading,
                  color: accentColor,
                  fontWeight: tp?.typography.headingWeight || '700',
                }}
              >
                {item.number}
              </p>
              <p className="text-sm" style={{ color: `${textColor}50` }}>
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Newsletter Section ──────────────────────────────────────────
function NewsletterSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as NewsletterConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;
  const tp = template?.preview;
  const slug = brand.slug || brand.id;
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch(`/api/public/brand/${slug}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubscribed(true);
      setEmail('');
    } catch { /* silent */ }
  };

  return (
    <section className="t-section">
      <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <div
          className="py-12 sm:py-16 px-8 sm:px-16 text-center"
          style={{
            backgroundColor: `${textColor}04`,
            borderRadius: tp?.borderRadius || '8px',
          }}
        >
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
          <p className="text-sm mb-6" style={{ color: `${textColor}45` }}>
            {config.subheading || 'Subscribe to our newsletter.'}
          </p>
          {subscribed ? (
            <p className="text-sm font-medium" style={{ color: accentColor }}>
              ✓ Subscribed! Thank you.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 text-sm border outline-none transition-colors"
                style={{
                  borderColor: `${textColor}12`,
                  color: textColor,
                  backgroundColor: 'transparent',
                  borderRadius: tp?.borderRadius || '0',
                }}
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                  borderRadius: tp?.borderRadius || '0',
                }}
              >
                {config.buttonText || 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────────────────
function FaqSection({ section, brand, template }: { section: PageSection } & SectionProps) {
  const config = section.config as FaqConfig;
  const templateId = template?.id || 'minimal';
  const isDark = templateId === 'bold';
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
  const isDark = templateId === 'bold';
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
