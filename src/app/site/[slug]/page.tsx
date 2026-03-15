'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBrandSite, BrandPlaceholder } from './layout';
import { LayoutSections } from '@/components/site/section-renderer';
import { getDefaultLayout } from '@/lib/page-layout';
import {
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  SPACING_MAP,
  BORDER_RADIUS_MAP,
} from '@/lib/design-settings';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd, getBaseUrl } from '@/lib/seo';

// ─── Template-specific animation variants ────────────────────────
import type { Variants } from 'framer-motion';

const heroAnimations: Record<string, { container: Variants; item: Variants }> = {
  minimal: {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } },
    item: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8 } } },
  },
  bold: {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } } },
    item: { hidden: { opacity: 0, y: 60 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] as const } } },
  },
  editorial: {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    item: { hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.6 } } },
  },
  playful: {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
    item: { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200, damping: 20 } } },
  },
  classic: {
    container: { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.15 } } },
    item: { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.7 } } },
  },
};

const scrollStagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const scrollItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function getHeroAnim(templateId: string) {
  if (templateId in heroAnimations) return heroAnimations[templateId];
  return heroAnimations.minimal;
}

export default function BrandHomePage() {
  const data = useBrandSite();
  if (!data) return null;

  const { brand, products, blogPosts, websiteTemplate: template, pageLayout, designSettings } = data;
  const slug = brand.slug || brand.id;
  const channels = JSON.parse(brand.channels || '[]') as string[];
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold' || templateId === 'tech';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? (templateId === 'tech' ? '#0A0F1A' : '#000000') : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  // Design settings — applied from Design Studio
  const ds = designSettings;
  const primaryBtnStyle = getPrimaryButtonStyle(ds, accentColor);
  const secondaryBtnStyle = getSecondaryButtonStyle(ds, textColor);
  const dsRadius = BORDER_RADIUS_MAP[ds.borderRadius];
  const dsSp = SPACING_MAP[ds.spacingDensity];

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  // ===== HERO SECTION =====
  const renderHero = () => {
    const anim = getHeroAnim(templateId);

    // MINIMAL — Massive whitespace, light-weight typography
    if (templateId === 'minimal') {
      return (
        <section className="t-hero">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <motion.div className="max-w-3xl" variants={anim.container} initial="hidden" animate="show">
              {brand.industry && (
                <motion.span variants={anim.item} className="text-xs font-normal uppercase tracking-[0.2em] mb-8 block" style={{ color: `${textColor}25` }}>
                  {brand.industry}
                </motion.span>
              )}
              <motion.h1 variants={anim.item} className="t-hero-heading mb-8" style={{ ...headingStyle, fontWeight: 300 }}>
                {brand.tagline || brand.name}
              </motion.h1>
              <motion.p variants={anim.item} className="t-hero-desc" style={{ color: `${textColor}35` }}>
                {brand.description || `Welcome to ${brand.name}.`}
              </motion.p>
              <motion.div variants={anim.item} className="flex flex-wrap gap-4 mt-12">
                {channels.includes('ecommerce') && (
                  <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ ...primaryBtnStyle, backgroundColor: textColor, color: bgColor }}>
                    Shop Now
                  </Link>
                )}
                <Link href={`/site/${slug}/about`} className="t-btn-secondary" style={secondaryBtnStyle}>
                  Learn More
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      );
    }

    // EDITORIAL — Split layout with image
    if (templateId === 'editorial') {
      return (
        <section className="t-hero">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="t-hero-split">
              <div>
                {brand.industry && (
                  <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
                    {brand.industry}
                  </span>
                )}
                <h1 className="t-hero-heading mb-6" style={headingStyle}>
                  {brand.tagline || brand.name}
                </h1>
                <p className="t-hero-desc" style={{ color: `${textColor}50` }}>
                  {brand.description || `Welcome to ${brand.name}.`}
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                  {channels.includes('ecommerce') && (
                    <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ ...primaryBtnStyle, backgroundColor: textColor, color: bgColor }}>
                      Shop Now
                    </Link>
                  )}
                  <Link href={`/site/${slug}/about`} className="t-btn-secondary" style={secondaryBtnStyle}>
                    Our Story
                  </Link>
                </div>
              </div>
              <div className="t-hero-image flex items-center justify-center" style={{ backgroundColor: `${textColor}04` }}>
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="max-w-[60%] max-h-[60%] object-contain" />
                ) : (
                  <BrandPlaceholder color={textColor} className="w-full h-full" variant="hero" />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // BOLD — Massive viewport-filling heading with dramatic slide-up
    if (templateId === 'bold') {
      return (
        <section className="t-hero" style={{ backgroundColor: '#000000' }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <motion.div variants={anim.container} initial="hidden" animate="show">
              <motion.span variants={anim.item} className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: accentColor }}>
                — {brand.industry || brand.name}
              </motion.span>
              <motion.h1 variants={anim.item} className="t-hero-heading mb-8" style={{ ...headingStyle, color: '#FFFFFF' }}>
                {(brand.tagline || brand.name).toUpperCase()}
              </motion.h1>
              <motion.p variants={anim.item} className="t-hero-desc" style={{ color: '#FFFFFF60' }}>
                {brand.description || `Welcome to ${brand.name}.`}
              </motion.p>
              <motion.div variants={anim.item} className="h-0.5 w-16 mt-4 mb-10" style={{ backgroundColor: accentColor }} />
              <motion.div variants={anim.item} className="flex flex-wrap gap-4">
                {channels.includes('ecommerce') && (
                  <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ ...primaryBtnStyle, backgroundColor: accentColor, color: '#FFFFFF' }}>
                    SHOP NOW
                  </Link>
                )}
                <Link href={`/site/${slug}/about`} className="t-btn-secondary" style={{ ...secondaryBtnStyle, borderColor: '#FFFFFF20', color: '#FFFFFF' }}>
                  LEARN MORE
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      );
    }

    // CLASSIC — Centered with neumorphic container
    if (templateId === 'classic') {
      return (
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <div className="t-hero-container" style={{ backgroundColor: bgColor }}>
              {brand.industry && (
                <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
                  {brand.industry}
                </span>
              )}
              <h1 className="t-hero-heading mb-6" style={headingStyle}>
                {brand.tagline || brand.name}
              </h1>
              <p className="t-hero-desc" style={{ color: `${textColor}55` }}>
                {brand.description || `Welcome to ${brand.name}.`}
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                {channels.includes('ecommerce') && (
                  <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ ...primaryBtnStyle, backgroundColor: accentColor, color: '#FFFFFF' }}>
                    Shop Now
                  </Link>
                )}
                <Link href={`/site/${slug}/about`} className="t-btn-secondary" style={secondaryBtnStyle}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // STARTUP — Gradient pill style, centered
    if (templateId === 'startup') {
      return (
        <section className="t-hero relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentColor}, transparent 70%), radial-gradient(ellipse at 70% 50%, #818CF8, transparent 70%)` }} />
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
            {brand.industry && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium mb-8" style={{ backgroundColor: `${accentColor}10`, color: accentColor, border: `1px solid ${accentColor}20` }}>
                🚀 {brand.industry}
              </span>
            )}
            <h1 className="t-hero-heading mb-6" style={headingStyle}>
              {brand.tagline || brand.name}
            </h1>
            <p className="t-hero-desc" style={{ color: `${textColor}55` }}>
              {brand.description || `Welcome to ${brand.name}.`}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {channels.includes('ecommerce') && (
                <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ backgroundColor: accentColor, color: '#FFFFFF' }}>
                  Get Started
                </Link>
              )}
              <Link href={`/site/${slug}/about`} className="t-btn-secondary border" style={{ borderColor: `${textColor}15`, color: textColor }}>
                Learn More →
              </Link>
            </div>
          </div>
        </section>
      );
    }

    // PORTFOLIO — Full-bleed, left-aligned minimal
    if (templateId === 'portfolio') {
      return (
        <section className="t-hero">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="max-w-2xl">
              <h1 className="t-hero-heading mb-8" style={{ ...headingStyle, fontWeight: 400 }}>
                {brand.tagline || brand.name}
              </h1>
              <p className="t-hero-desc" style={{ color: `${textColor}40` }}>
                {brand.description || `Welcome to ${brand.name}.`}
              </p>
              <div className="flex flex-wrap gap-4 mt-12">
                <Link href={`/site/${slug}/products`} className="t-btn-primary" style={{ backgroundColor: textColor, color: bgColor }}>
                  View Work
                </Link>
                <Link href={`/site/${slug}/contact`} className="t-btn-secondary border" style={{ borderColor: `${textColor}15`, color: textColor }}>
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    // MAGAZINE — Split with serif focus
    if (templateId === 'magazine') {
      return (
        <section className="t-hero">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="t-hero-split">
              <div>
                <div className="h-0.5 w-10 mb-6" style={{ backgroundColor: accentColor }} />
                <h1 className="t-hero-heading mb-6" style={headingStyle}>
                  {brand.tagline || brand.name}
                </h1>
                <p className="t-hero-desc" style={{ color: `${textColor}55`, fontFamily: brand.font_body }}>
                  {brand.description || `Welcome to ${brand.name}.`}
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                  {channels.includes('ecommerce') && (
                    <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ backgroundColor: accentColor, color: '#FFFFFF' }}>
                      Explore
                    </Link>
                  )}
                  <Link href={`/site/${slug}/about`} className="t-btn-secondary border" style={{ borderColor: `${textColor}15`, color: textColor }}>
                    About Us
                  </Link>
                </div>
              </div>
              <div className="t-hero-image flex items-center justify-center" style={{ backgroundColor: `${textColor}04` }}>
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="max-w-[60%] max-h-[60%] object-contain" />
                ) : (
                  <BrandPlaceholder color={textColor} className="w-full h-full" variant="hero" />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // BOUTIQUE — Luxury, centered, spacious
    if (templateId === 'boutique') {
      return (
        <section className="t-hero">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            {brand.industry && (
              <span className="inline-block text-[10px] font-medium uppercase tracking-[0.2em] mb-8" style={{ color: accentColor }}>
                {brand.industry}
              </span>
            )}
            <h1 className="t-hero-heading mb-8" style={{ ...headingStyle, letterSpacing: '0.04em' }}>
              {(brand.tagline || brand.name).toUpperCase()}
            </h1>
            <div className="h-px w-16 mx-auto mb-8" style={{ backgroundColor: accentColor }} />
            <p className="t-hero-desc mx-auto" style={{ color: `${textColor}45`, letterSpacing: '0.01em' }}>
              {brand.description || `Welcome to ${brand.name}.`}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              {channels.includes('ecommerce') && (
                <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ backgroundColor: textColor, color: bgColor }}>
                  SHOP COLLECTION
                </Link>
              )}
              <Link href={`/site/${slug}/about`} className="t-btn-secondary border" style={{ borderColor: `${textColor}15`, color: textColor }}>
                OUR STORY
              </Link>
            </div>
          </div>
        </section>
      );
    }

    // TECH — Terminal-style, left-aligned
    if (templateId === 'tech') {
      return (
        <section className="t-hero" style={{ backgroundColor: '#0A0F1A' }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <span className="inline-block text-xs font-mono mb-6" style={{ color: accentColor }}>
              {'>'} {brand.industry || brand.name} _
            </span>
            <h1 className="t-hero-heading mb-6" style={{ ...headingStyle, color: '#E2E8F0' }}>
              {brand.tagline || brand.name}
            </h1>
            <p className="t-hero-desc" style={{ color: '#64748B' }}>
              {brand.description || `Welcome to ${brand.name}.`}
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              {channels.includes('ecommerce') && (
                <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ backgroundColor: accentColor, color: '#0A0F1A' }}>
                  Get Started
                </Link>
              )}
              <Link href={`/site/${slug}/about`} className="t-btn-secondary border" style={{ borderColor: '#1E293B', color: '#94A3B8' }}>
                Learn More →
              </Link>
            </div>
          </div>
        </section>
      );
    }

    // WELLNESS — Zen, centered, breathing room
    if (templateId === 'wellness') {
      return (
        <section className="t-hero">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            {brand.industry && (
              <span className="inline-block text-xs font-light tracking-[0.15em] mb-8" style={{ color: accentColor }}>
                {brand.industry}
              </span>
            )}
            <h1 className="t-hero-heading mb-8" style={{ ...headingStyle, fontWeight: 300 }}>
              {brand.tagline || brand.name}
            </h1>
            <p className="t-hero-desc mx-auto" style={{ color: `${textColor}50`, fontWeight: 300 }}>
              {brand.description || `Welcome to ${brand.name}.`}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              {channels.includes('ecommerce') && (
                <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ backgroundColor: accentColor, color: '#FFFFFF' }}>
                  Explore
                </Link>
              )}
              <Link href={`/site/${slug}/about`} className="t-btn-secondary border" style={{ borderColor: `${textColor}12`, color: textColor }}>
                Our Story
              </Link>
            </div>
          </div>
        </section>
      );
    }

    // RESTAURANT — Split with warm vibes
    if (templateId === 'restaurant') {
      return (
        <section className="t-hero">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="t-hero-split">
              <div>
                {brand.industry && (
                  <span className="text-xs font-medium uppercase tracking-[0.15em] mb-6 block" style={{ color: accentColor }}>
                    {brand.industry}
                  </span>
                )}
                <h1 className="t-hero-heading mb-6" style={headingStyle}>
                  {brand.tagline || brand.name}
                </h1>
                <p className="t-hero-desc" style={{ color: `${textColor}50` }}>
                  {brand.description || `Welcome to ${brand.name}.`}
                </p>
                <div className="flex flex-wrap gap-4 mt-10">
                  <Link href={`/site/${slug}/contact`} className="t-btn-primary" style={{ backgroundColor: accentColor, color: '#FFFFFF' }}>
                    Reserve a Table
                  </Link>
                  {channels.includes('ecommerce') && (
                    <Link href={`/shop/${slug}`} className="t-btn-secondary border" style={{ borderColor: `${textColor}12`, color: textColor }}>
                      View Menu
                    </Link>
                  )}
                </div>
              </div>
              <div className="t-hero-image flex items-center justify-center rounded" style={{ backgroundColor: `${textColor}04`, borderRadius: '4px' }}>
                {brand.logo_url ? (
                  <img src={brand.logo_url} alt={brand.name} className="max-w-[60%] max-h-[60%] object-contain" />
                ) : (
                  <BrandPlaceholder color={textColor} className="w-full h-full" variant="hero" />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // PLAYFUL — Rounded, friendly, with blob decorations (default fallback)
    return (
      <section className="t-hero relative">
        <div className="t-blob" style={{ width: 300, height: 300, top: '-15%', right: '-10%', backgroundColor: accentColor }} />
        <div className="t-blob" style={{ width: 200, height: 200, bottom: '-10%', left: '-5%', backgroundColor: textColor }} />
        <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center relative z-10">
          {brand.industry && (
            <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              ✨ {brand.industry}
            </span>
          )}
          <h1 className="t-hero-heading mb-6" style={headingStyle}>
            {brand.tagline || brand.name} 🚀
          </h1>
          <p className="t-hero-desc mx-auto" style={{ color: `${textColor}50` }}>
            {brand.description || `Welcome to ${brand.name}. We're here to serve you.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            {channels.includes('ecommerce') && (
              <Link href={`/shop/${slug}`} className="t-btn-primary" style={{ ...primaryBtnStyle, backgroundColor: accentColor, color: '#FFFFFF' }}>
                Shop Now 🛍️
              </Link>
            )}
            <Link href={`/site/${slug}/about`} className="t-btn-secondary" style={secondaryBtnStyle}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // ===== FEATURES SECTION =====
  const renderFeatures = () => {
    const features = [
      { title: 'Quality First', desc: 'Every product and service is crafted with meticulous attention to detail and unwavering quality standards.', icon: '✦', emoji: '💎' },
      { title: 'Customer Focus', desc: 'Your satisfaction drives us. We listen, adapt, and deliver experiences that exceed expectations.', icon: '◆', emoji: '🎯' },
      { title: 'Innovation', desc: 'We constantly push boundaries to bring you the latest and most thoughtful solutions.', icon: '○', emoji: '💡' },
    ];

    const sectionTitle = templateId === 'bold' ? `WHY ${brand.name.toUpperCase()}`
      : templateId === 'playful' ? `Why ${brand.name} 💛`
      : `Why ${brand.name}`;

    return (
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div className={`mb-14 ${templateId === 'classic' || templateId === 'playful' ? 'text-center' : ''}`}>
            <h2 className="t-section-heading mb-3" style={headingStyle}>
              {sectionTitle}
            </h2>
            {templateId === 'bold' && <div className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
            <p className="text-sm mt-3" style={{ color: `${textColor}45` }}>
              {brand.brand_voice ? `We believe in ${brand.brand_voice.toLowerCase()}.` : 'What sets us apart.'}
            </p>
          </div>

          {/* MINIMAL — gap-px grid */}
          {templateId === 'minimal' && (
            <motion.div
              variants={scrollStagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-px"
              style={{ backgroundColor: `${textColor}06` }}
            >
              {features.map(f => (
                <motion.div key={f.title} variants={scrollItem} className="p-8 sm:p-10" style={{ backgroundColor: bgColor }}>
                  <h3 className="text-sm font-normal mb-2" style={{ fontFamily: brand.font_heading, fontWeight: 400 }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}35` }}>{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* EDITORIAL — Flat with dividers */}
          {templateId === 'editorial' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {features.map((f, i) => (
                <div key={f.title}>
                  <span className="text-2xl font-light mb-4 block" style={{ color: `${textColor}12`, fontFamily: brand.font_heading }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-base font-semibold mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: `${textColor}50` }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* BOLD — Thick bordered */}
          {templateId === 'bold' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map(f => (
                <div key={f.title} className="p-8 border-2 transition-transform hover:translate-y-[-2px]" style={{ borderColor: `${textColor}12` }}>
                  <span className="text-2xl mb-3 block" style={{ color: accentColor }}>{f.icon}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* CLASSIC — Neumorphic cards */}
          {templateId === 'classic' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map(f => (
                <div
                  key={f.title}
                  className="p-8 text-center"
                  style={{
                    backgroundColor: bgColor,
                    borderRadius: '12px',
                    boxShadow: '6px 6px 12px rgba(0,0,0,0.04), -6px -6px 12px rgba(255,255,255,0.7)',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-4 text-lg"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      color: accentColor,
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.04), inset -2px -2px 4px rgba(255,255,255,0.5)',
                    }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{f.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* PLAYFUL — Pastel rounded cards */}
          {templateId === 'playful' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((f, i) => {
                const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4'];
                return (
                  <div
                    key={f.title}
                    className="p-8 text-center transition-all hover:translate-y-[-4px]"
                    style={{ backgroundColor: pastels[i % pastels.length], borderRadius: '20px' }}
                  >
                    <span className="text-3xl mb-3 block">{f.emoji}</span>
                    <h3 className="text-sm font-bold mb-2" style={{ fontFamily: brand.font_heading }}>{f.title}</h3>
                    <p className="text-sm" style={{ color: `${textColor}50` }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  };

  // ===== PRODUCTS SECTION =====
  const renderProducts = () => {
    if (products.length === 0) return null;

    const imgRadius = templateId === 'playful' ? '16px' : templateId === 'classic' ? '10px' : '0';
    const containerClass = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';

    return (
      <section className="t-section">
        <div className={`${containerClass} mx-auto px-5 sm:px-8`}>
          <div className={`flex items-end justify-between mb-12 ${templateId === 'classic' || templateId === 'playful' ? '' : ''}`}>
            <div>
              <h2 className="t-section-heading mb-2" style={headingStyle}>
                {templateId === 'bold' ? 'PRODUCTS' : templateId === 'playful' ? 'Our Products ✨' : 'Products'}
              </h2>
              {templateId === 'bold' && <div className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
              <p className="text-sm mt-2" style={{ color: `${textColor}45` }}>
                {templateId === 'playful' ? 'Our curated collection 🛍️' : 'Our curated collection'}
              </p>
            </div>
            <Link
              href={`/site/${slug}/products`}
              className="hidden sm:inline-flex text-sm font-medium transition-opacity hover:opacity-60"
              style={{
                color: templateId === 'bold' ? accentColor : textColor,
                fontWeight: templateId === 'bold' ? 700 : 400,
                textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
              }}
            >
              {templateId === 'bold' ? 'VIEW ALL →' : 'View All →'}
            </Link>
          </div>

          <motion.div
            variants={scrollStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className={`grid grid-cols-1 sm:grid-cols-2 ${templateId === 'bold' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-6`}
          >
            {products.slice(0, templateId === 'bold' ? 4 : 3).map((product) => (
              <motion.div key={product.id} variants={scrollItem}>
              <Link
                key={product.id}
                href={`/shop/${slug}/product/${product.id}`}
                className="group block"
                style={
                  templateId === 'bold' ? { border: `2px solid ${textColor}10` }
                  : templateId === 'playful' ? { backgroundColor: '#FFFFFF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }
                  : {}
                }
              >
                <div
                  className="aspect-square mb-0 overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundColor: isDark ? '#111111' : `${textColor}04`,
                    borderRadius: templateId === 'playful' || templateId === 'bold' ? '0' : imgRadius,
                    marginBottom: templateId === 'playful' || templateId === 'bold' ? 0 : '1rem',
                  }}
                >
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <svg className="w-10 h-10" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )}
                </div>
                <div className={templateId === 'playful' || templateId === 'bold' ? 'p-4' : 'mt-4'}>
                  {product.category && (
                    <span className="text-[10px] font-medium uppercase tracking-widest mb-1 block" style={{
                      color: templateId === 'bold' ? accentColor : `${textColor}30`,
                      fontWeight: templateId === 'bold' ? 700 : 500,
                    }}>
                      {product.category}
                    </span>
                  )}
                  <h3 className="text-sm font-medium mb-1 group-hover:opacity-60 transition-opacity" style={{
                    fontFamily: brand.font_heading,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    fontWeight: templateId === 'minimal' ? 400 : 500,
                  }}>
                    {product.name}
                  </h3>
                  {product.price != null && product.price > 0 && (
                    <p className="text-sm" style={{ color: `${textColor}50` }}>
                      {product.currency || 'USD'} {product.price.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 text-center sm:hidden">
            <Link href={`/site/${slug}/products`} className="text-sm font-medium" style={{ color: accentColor }}>
              {templateId === 'playful' ? 'View All Products 🛍️' : templateId === 'bold' ? 'VIEW ALL PRODUCTS →' : 'View All Products →'}
            </Link>
          </div>
        </div>
      </section>
    );
  };

  // ===== BLOG SECTION =====
  const renderBlog = () => {
    if (blogPosts.length === 0) return null;
    const containerClass = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';

    return (
      <section className="t-section">
        <div className={`${containerClass} mx-auto px-5 sm:px-8`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="t-section-heading mb-2" style={headingStyle}>
                {templateId === 'bold' ? 'JOURNAL' : templateId === 'editorial' ? 'Journal' : templateId === 'playful' ? 'Latest Posts 📝' : 'Journal'}
              </h2>
              {templateId === 'bold' && <div className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
              <p className="text-sm mt-2" style={{ color: `${textColor}45` }}>
                Latest thoughts and updates
              </p>
            </div>
            <Link
              href={`/blog/${slug}`}
              className="hidden sm:inline-flex text-sm font-medium transition-opacity hover:opacity-60"
              style={{
                color: templateId === 'bold' ? accentColor : textColor,
                fontWeight: templateId === 'bold' ? 700 : 400,
                textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
              }}
            >
              {templateId === 'bold' ? 'ALL POSTS →' : 'All Posts →'}
            </Link>
          </div>

          {/* EDITORIAL — Magazine-style: featured + side */}
          {templateId === 'editorial' && blogPosts.length > 1 ? (
            <div className="t-blog-grid">
              <Link href={`/blog/${slug}/${blogPosts[0].slug}`} className="group block">
                <div className="aspect-[4/3] mb-5" style={{ backgroundColor: `${textColor}04` }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl" style={{ color: `${textColor}08` }}>✦</span>
                  </div>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-widest mb-2 block" style={{ color: accentColor }}>
                  {blogPosts[0].category || 'Article'}
                </span>
                <h3 className="text-xl font-bold group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                  {blogPosts[0].title}
                </h3>
              </Link>
              <div className="space-y-0">
                {blogPosts.slice(1, 4).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/blog/${slug}/${post.slug}`}
                    className="group block py-5"
                    style={{ borderBottom: i < 2 ? `1px solid ${textColor}08` : undefined }}
                  >
                    <span className="text-[10px] font-medium uppercase tracking-widest mb-1 block" style={{ color: `${textColor}35` }}>
                      {post.category || 'Article'}
                    </span>
                    <h4 className="text-sm font-semibold group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                      {post.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          ) : templateId === 'bold' ? (
            /* BOLD — Grid with thick borders */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${slug}/${post.slug}`} className="group block border-2 p-6 transition-transform hover:translate-y-[-2px]" style={{ borderColor: `${textColor}10` }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>{post.category || 'ARTICLE'}</span>
                  <h3 className="text-base font-bold uppercase mt-2 mb-3 group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading }}>
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-xs line-clamp-2" style={{ color: `${textColor}40` }}>{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          ) : templateId === 'playful' ? (
            /* PLAYFUL — Pastel cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.slice(0, 3).map((post, i) => {
                const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4'];
                return (
                  <Link key={post.id} href={`/blog/${slug}/${post.slug}`} className="group block p-6 transition-all hover:translate-y-[-4px]" style={{ backgroundColor: pastels[i % pastels.length], borderRadius: '20px' }}>
                    <span className="text-xs font-semibold" style={{ color: accentColor }}>{post.category || 'Article'}</span>
                    <h3 className="text-base font-bold mt-2 mb-2 group-hover:opacity-60 transition-opacity" style={{ fontFamily: brand.font_heading, color: '#1F2937' }}>
                      {post.title}
                    </h3>
                    {post.excerpt && <p className="text-xs line-clamp-2" style={{ color: '#1F293770' }}>{post.excerpt}</p>}
                  </Link>
                );
              })}
            </div>
          ) : (
            /* MINIMAL / CLASSIC — Clean cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${slug}/${post.slug}`} className="group block">
                  <div className="aspect-[16/10] mb-5" style={{
                    backgroundColor: `${textColor}04`,
                    borderRadius: templateId === 'classic' ? '10px' : '0',
                  }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-xl" style={{ color: `${textColor}08` }}>✦</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: `${textColor}35` }}>{post.category}</span>
                    )}
                    {post.published_at && (
                      <span className="text-xs" style={{ color: `${textColor}25` }}>
                        {new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-medium mb-2 group-hover:opacity-60 transition-opacity" style={{
                    fontFamily: brand.font_heading,
                    fontWeight: templateId === 'minimal' ? 400 : 500,
                  }}>
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-xs line-clamp-2" style={{ color: `${textColor}40` }}>{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  };

  // ===== CTA SECTION =====
  const renderCTA = () => {
    const ctaTitle = templateId === 'bold' ? 'READY TO GET STARTED?'
      : templateId === 'playful' ? "Ready to get started? 🚀"
      : 'Ready to get started?';

    return (
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div
            className="py-16 sm:py-20 px-8 sm:px-16 text-center"
            style={{
              backgroundColor: isDark ? '#111111' : `${textColor}04`,
              borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : '0',
              border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
              boxShadow: templateId === 'classic' ? '8px 8px 16px rgba(0,0,0,0.04), -8px -8px 16px rgba(255,255,255,0.7)' : undefined,
            }}
          >
            <h2 className="text-2xl sm:text-3xl mb-4" style={headingStyle}>
              {ctaTitle}
            </h2>
            <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${textColor}45` }}>
              {channels.includes('ecommerce')
                ? 'Browse our collection and find exactly what you need.'
                : 'Get in touch with us today.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {channels.includes('ecommerce') && (
                <Link href={`/shop/${slug}`} className="t-btn-primary" style={{
                  ...primaryBtnStyle,
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                }}>
                  {templateId === 'bold' ? 'VISIT SHOP' : templateId === 'playful' ? 'Visit Shop 🛍️' : 'Visit Shop'}
                </Link>
              )}
              <Link href={`/site/${slug}/contact`} className="t-btn-secondary" style={{
                ...secondaryBtnStyle,
                borderColor: `${textColor}${isDark ? '20' : '12'}`,
                color: textColor,
              }}>
                {templateId === 'bold' ? 'CONTACT US' : templateId === 'playful' ? 'Contact Us 💬' : 'Contact Us'}
              </Link>
              {channels.includes('chatbot') && (
                <Link href={`/chat/${slug}`} className="t-btn-secondary" style={{
                  ...secondaryBtnStyle,
                  borderColor: `${textColor}${isDark ? '20' : '12'}`,
                  color: textColor,
                }}>
                  {templateId === 'bold' ? 'CHAT NOW' : templateId === 'playful' ? 'Chat Now 🤖' : 'Chat Now'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Divider between sections
  const Divider = () => {
    if (templateId === 'bold' || templateId === 'tech') return null;
    if (templateId === 'playful' || templateId === 'wellness' || templateId === 'startup') return null;
    return (
      <div className={`${templateId === 'bold' || templateId === 'tech' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
        <div className="t-divider" style={{ backgroundColor: `${textColor}06` }} />
      </div>
    );
  };

  const layout = pageLayout || getDefaultLayout(brand.name);
  const baseUrl = getBaseUrl();
  const canonicalUrl = `${baseUrl}/site/${slug}`;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: canonicalUrl },
      ])} />
      {renderHero()}
      <Divider />
      {renderFeatures()}
      <Divider />
      {renderProducts()}
      <Divider />
      {renderBlog()}
      <Divider />
      {/* Render extra layout sections (testimonials, stats, newsletter, FAQ) */}
      <LayoutSections
        layout={layout}
        brand={brand}
        template={template}
        products={products}
        blogPosts={blogPosts}
        designSettings={designSettings}
      />
      <Divider />
      {renderCTA()}
    </>
  );
}
