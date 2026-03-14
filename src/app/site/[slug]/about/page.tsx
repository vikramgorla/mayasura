'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBrandSite, BrandPlaceholder } from '../layout';
import {
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  BORDER_RADIUS_MAP,
} from '@/lib/design-settings';

/* ─── Animation Variants ──────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' as const, stiffness: 200, damping: 20 } },
};

export default function AboutPage() {
  const data = useBrandSite();
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
  const secondaryBtnStyle = getSecondaryButtonStyle(ds, textColor);
  const dsRadius = BORDER_RADIUS_MAP[ds.borderRadius];

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  /* ─── Template-specific animation chooser ─────────────────── */
  const cardVariant = templateId === 'playful'
    ? scaleIn
    : templateId === 'bold'
    ? { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }
    : fadeUp;

  const values = [
    { title: 'Innovation', desc: 'Constantly evolving to stay ahead', icon: '💡', svgIcon: 'lightbulb' },
    { title: 'Precision', desc: 'Every detail matters in what we do', icon: '🎯', svgIcon: 'target' },
    { title: 'Sustainability', desc: 'Building for the future responsibly', icon: '🌱', svgIcon: 'leaf' },
    { title: 'Community', desc: 'People at the heart of everything', icon: '🤝', svgIcon: 'users' },
  ];

  const milestones = [
    { year: 'Founded', title: 'The Beginning', desc: 'Started with a mission to make a difference' },
    { year: 'Growth', title: 'Expanding Reach', desc: 'Grew to serve customers worldwide' },
    { year: 'Innovation', title: 'Breaking New Ground', desc: 'Launched breakthrough products and services' },
    { year: 'Today', title: 'Building the Future', desc: 'Continuing to push boundaries every day' },
  ];

  const team = [
    { name: 'Founder', role: 'CEO & Visionary', initial: 'F' },
    { name: 'Lead Designer', role: 'Creative Director', initial: 'D' },
    { name: 'Head of Product', role: 'Product Lead', initial: 'P' },
    { name: 'Community Lead', role: 'People & Culture', initial: 'C' },
  ];

  /* ─── Value icon SVG renderer ──────────────────────────────── */
  const ValueIcon = ({ type, color }: { type: string; color: string }) => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {type === 'lightbulb' && <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z" /></>}
      {type === 'target' && <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>}
      {type === 'leaf' && <><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18" /><path d="M17 8a14 14 0 0 0-10 6" /><path d="M17 8c2-2 4-3.1 6-4" /></>}
      {type === 'users' && <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>}
    </svg>
  );

  return (
    <>
      {/* ═══════ HERO with parallax area ═══════ */}
      <ParallaxHero
        brand={brand}
        templateId={templateId}
        headingStyle={headingStyle}
        textColor={textColor}
        accentColor={accentColor}
        bgColor={bgColor}
        isDark={isDark}
      />

      {/* Divider */}
      {(templateId === 'minimal' || templateId === 'editorial') && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="t-divider" style={{ backgroundColor: `${textColor}06` }} />
        </div>
      )}

      {/* ═══════ STORY — Two column layout ═══════ */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="t-section-heading mb-6" style={headingStyle}>
                {templateId === 'bold' ? 'OUR STORY' : templateId === 'playful' ? 'Our Story 📖' : 'Our Story'}
              </motion.h2>
              {templateId === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mb-6" style={{ backgroundColor: accentColor }} />}
              <motion.div variants={fadeUp} className="space-y-5 text-[15px] leading-relaxed" style={{ color: `${textColor}60` }}>
                <p>
                  {brand.description || `${brand.name} was founded with a clear purpose: to deliver exceptional quality and build lasting relationships with our community.`}
                </p>
                <p>
                  We believe in transparency, innovation, and an unwavering commitment to excellence in everything we do.
                </p>
                {brand.brand_voice && (
                  <p>
                    Our voice is{' '}
                    <span className="font-medium" style={{ color: textColor }}>
                      {brand.brand_voice}
                    </span>{' '}
                    — every interaction reflects who we are and what we stand for.
                  </p>
                )}
              </motion.div>
            </motion.div>

            {/* Image placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center overflow-hidden"
              style={{
                aspectRatio: templateId === 'editorial' ? '4/5' : '4/3',
                backgroundColor: isDark ? '#111111' : `${textColor}04`,
                borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : templateId === 'bold' ? '0' : dsRadius,
                border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
              }}
            >
              {brand.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="max-w-[50%] max-h-[50%] object-contain" />
              ) : (
                <BrandPlaceholder color={isDark ? '#FFFFFF' : textColor} className="w-full h-full" variant="about" />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ MISSION & VALUES ═══════ */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className={templateId === 'classic' || templateId === 'playful' ? 'text-center mb-12' : 'mb-12'}
          >
            <motion.h2 variants={fadeUp} className="t-section-heading" style={headingStyle}>
              {templateId === 'bold' ? 'WHAT WE STAND FOR' : templateId === 'playful' ? 'Our Values 💛' : 'What We Stand For'}
            </motion.h2>
            {templateId === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
            <motion.p variants={fadeUp} className="text-sm mt-3 max-w-lg" style={{ color: `${textColor}45` }}>
              {templateId === 'playful'
                ? 'The principles that guide everything we do ✨'
                : 'The principles that guide everything we do.'}
            </motion.p>
          </motion.div>

          {/* Minimal */}
          {templateId === 'minimal' && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
              style={{ backgroundColor: `${textColor}06` }}
            >
              {values.map((v) => (
                <motion.div key={v.title} variants={fadeUp} className="p-8 sm:p-10" style={{ backgroundColor: bgColor }}>
                  <div className="mb-4 opacity-40"><ValueIcon type={v.svgIcon} color={textColor} /></div>
                  <h3 className="text-sm font-medium mb-2" style={{ fontFamily: brand.font_heading, fontWeight: 400 }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}35` }}>{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Editorial */}
          {templateId === 'editorial' && (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              {values.map((v, i) => (
                <motion.div key={v.title} variants={fadeUp} className="t-card flex items-start gap-6" style={{ borderColor: `${textColor}08` }}>
                  <span className="text-2xl font-light" style={{ color: `${textColor}15`, fontFamily: brand.font_heading }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold mb-1" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                    <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Bold */}
          {templateId === 'bold' && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={cardVariant}
                  className="t-card transition-transform hover:translate-y-[-2px]"
                  style={{ borderColor: `${textColor}15` }}
                >
                  <span className="text-2xl mb-3 block" style={{ color: accentColor }}>{v.icon}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Classic */}
          {templateId === 'classic' && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {values.map((v) => (
                <motion.div key={v.title} variants={fadeUp} className="t-card text-center" style={{ backgroundColor: bgColor }}>
                  <div
                    className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.04), inset -2px -2px 4px rgba(255,255,255,0.5)',
                    }}
                  >
                    <ValueIcon type={v.svgIcon} color={accentColor} />
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Playful */}
          {templateId === 'playful' && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((v, i) => {
                const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF'];
                return (
                  <motion.div
                    key={v.title}
                    variants={scaleIn}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="t-card text-center cursor-default"
                    style={{ backgroundColor: pastels[i % pastels.length] }}
                  >
                    <span className="text-3xl mb-3 block">{v.icon}</span>
                    <h3 className="text-sm font-bold mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                    <p className="text-sm" style={{ color: `${textColor}50` }}>{v.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Fallback for other templates */}
          {!['minimal', 'editorial', 'bold', 'classic', 'playful'].includes(templateId) && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {values.map((v) => (
                <motion.div key={v.title} variants={fadeUp} className="p-6" style={{ backgroundColor: `${textColor}03`, borderRadius: dsRadius }}>
                  <div className="mb-3 opacity-50"><ValueIcon type={v.svgIcon} color={accentColor} /></div>
                  <h3 className="text-sm font-medium mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}40` }}>{v.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ TIMELINE / MILESTONES ═══════ */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className={templateId === 'classic' || templateId === 'playful' ? 'text-center mb-12' : 'mb-12'}
          >
            <motion.h2 variants={fadeUp} className="t-section-heading" style={headingStyle}>
              {templateId === 'bold' ? 'OUR JOURNEY' : templateId === 'playful' ? 'Our Journey 🗺️' : 'Our Journey'}
            </motion.h2>
            {templateId === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={stagger}
            className="relative"
          >
            {/* Timeline line */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ backgroundColor: `${textColor}08` }}
            />

            <div className="space-y-8 md:space-y-0">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={cardVariant}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 ${i > 0 ? 'md:mt-12' : ''}`}
                >
                  {/* Dot on timeline */}
                  <div
                    className="hidden md:block absolute left-1/2 top-6 w-3 h-3 -translate-x-1/2 rounded-full z-10"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 0 4px ${bgColor}, 0 0 0 5px ${textColor}10`,
                    }}
                  />

                  {/* Content alternates sides */}
                  <div className={`${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <span
                      className={`text-xs font-${templateId === 'bold' ? 'bold' : 'medium'} uppercase tracking-wider mb-2 block`}
                      style={{
                        color: accentColor,
                        letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em',
                      }}
                    >
                      {m.year}
                    </span>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                      }}
                    >
                      {m.title}
                    </h3>
                    <p className="text-sm" style={{ color: `${textColor}45` }}>{m.desc}</p>
                  </div>

                  {/* Empty cell for alternation */}
                  {i % 2 !== 0 && <div className="hidden md:block" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TEAM SECTION ═══════ */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={stagger}
            className={templateId === 'classic' || templateId === 'playful' ? 'text-center mb-12' : 'mb-12'}
          >
            <motion.h2 variants={fadeUp} className="t-section-heading" style={headingStyle}>
              {templateId === 'bold' ? 'THE TEAM' : templateId === 'playful' ? 'Meet the Team 👋' : 'The Team'}
            </motion.h2>
            {templateId === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
            <motion.p variants={fadeUp} className="text-sm mt-3" style={{ color: `${textColor}45` }}>
              {templateId === 'playful'
                ? 'The people who make the magic happen ✨'
                : 'The people behind the brand.'}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={cardVariant}
                className={`text-center ${templateId === 'playful' ? 'cursor-default' : ''}`}
              >
                {/* Avatar placeholder */}
                <div
                  className="mx-auto mb-4 flex items-center justify-center"
                  style={{
                    width: templateId === 'bold' ? '80px' : '88px',
                    height: templateId === 'bold' ? '80px' : '88px',
                    borderRadius: templateId === 'bold' ? '0' : templateId === 'playful' ? '24px' : '50%',
                    backgroundColor: isDark ? '#111111' : `${textColor}06`,
                    border: templateId === 'bold' ? `2px solid ${textColor}12` : undefined,
                  }}
                >
                  <span
                    className="text-lg font-semibold"
                    style={{
                      color: `${textColor}20`,
                      fontFamily: brand.font_heading,
                    }}
                  >
                    {member.initial}
                  </span>
                </div>
                <h3
                  className="text-sm font-medium mb-0.5"
                  style={{
                    fontFamily: brand.font_heading,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                    fontWeight: templateId === 'minimal' ? 400 : 500,
                  }}
                >
                  {member.name}
                </h3>
                <p className="text-xs" style={{ color: `${textColor}35` }}>{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8 text-center`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight mb-4" style={headingStyle}>
              {templateId === 'playful' ? "Let's Connect! 🤝" : templateId === 'bold' ? "LET'S CONNECT" : "Let's Connect"}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${textColor}45` }}>
              Whether you have questions, ideas, or just want to say hello — we&apos;d love to hear from you.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/site/${slug}/contact`}
                className="t-btn-primary"
                style={{
                  ...primaryBtnStyle,
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                }}
              >
                {templateId === 'playful' ? 'Get in Touch 💬' : templateId === 'bold' ? 'GET IN TOUCH' : 'Get in Touch'}
              </Link>
              <Link
                href={`/shop/${slug}`}
                className="t-btn-secondary"
                style={{
                  ...secondaryBtnStyle,
                  borderColor: `${textColor}${isDark ? '25' : '15'}`,
                  color: textColor,
                }}
              >
                {templateId === 'playful' ? 'Browse Shop 🛍️' : templateId === 'bold' ? 'BROWSE SHOP' : 'Browse Shop'}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ─── Parallax Hero Component ───────────────────────────────── */
function ParallaxHero({
  brand,
  templateId,
  headingStyle,
  textColor,
  accentColor,
  bgColor,
  isDark,
}: {
  brand: any;
  templateId: string;
  headingStyle: React.CSSProperties;
  textColor: string;
  accentColor: string;
  bgColor: string;
  isDark: boolean;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (templateId === 'playful') {
    return (
      <section ref={heroRef} className="t-hero relative overflow-hidden">
        <motion.div style={{ y, opacity }} className="relative z-10">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              ✨ About Us
            </span>
            <h1 className="t-hero-heading mb-8" style={headingStyle}>
              {brand.tagline || `The story behind ${brand.name}`} 💫
            </h1>
            <p className="t-hero-desc mx-auto" style={{ color: `${textColor}50` }}>
              {brand.description || `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value.`}
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  if (templateId === 'bold') {
    return (
      <section ref={heroRef} className="t-hero relative overflow-hidden">
        <motion.div style={{ y, opacity }}>
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>
              — ABOUT
            </span>
            <h1 className="t-hero-heading mb-8" style={headingStyle}>
              {brand.tagline || `THE STORY BEHIND ${brand.name.toUpperCase()}`}
            </h1>
            <p className="t-hero-desc" style={{ color: `${textColor}60` }}>
              {brand.description || `${brand.name} was founded with a clear purpose.`}
            </p>
            <div className="h-0.5 w-16 mt-6" style={{ backgroundColor: accentColor }} />
          </div>
        </motion.div>
      </section>
    );
  }

  if (templateId === 'classic') {
    return (
      <section ref={heroRef} className="t-hero relative overflow-hidden">
        <motion.div style={{ y, opacity }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.12em] mb-6" style={{ color: accentColor }}>
              About Us
            </span>
            <h1 className="t-hero-heading" style={headingStyle}>
              {brand.tagline || `The story behind ${brand.name}`}
            </h1>
            <p className="t-hero-desc" style={{ color: `${textColor}55` }}>
              {brand.description || `${brand.name} was founded with a simple yet powerful mission.`}
            </p>
          </div>
        </motion.div>
      </section>
    );
  }

  // Minimal / Editorial / other
  return (
    <section ref={heroRef} className="t-hero relative overflow-hidden">
      <motion.div style={{ y, opacity }}>
        <div className={`${templateId === 'editorial' ? 'max-w-3xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8`}>
          <span
            className="text-xs font-medium uppercase tracking-[0.2em] mb-6 block"
            style={{ color: templateId === 'editorial' ? accentColor : `${textColor}30` }}
          >
            About
          </span>
          <h1 className="t-hero-heading mb-8" style={headingStyle}>
            {brand.tagline || `The story behind ${brand.name}`}
          </h1>
          <p className="t-hero-desc" style={{ color: `${textColor}50` }}>
            {brand.description || `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value.`}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
