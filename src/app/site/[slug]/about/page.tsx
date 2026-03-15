'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useBrandSite, BrandPlaceholder } from '../layout';
import { AboutPageMeta } from '@/components/site/site-meta';
import { getPrimaryButtonStyle, getSecondaryButtonStyle, BORDER_RADIUS_MAP } from '@/lib/design-settings';

/* ─── Animation Variants ──────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring' as const, stiffness: 200, damping: 20 } } };
const slideIn = { hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } };

const VALUES = [
  { title: 'Innovation', desc: 'Constantly evolving to stay ahead', icon: '💡', svg: 'M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17H8v-2.3A7 7 0 0 1 12 2z', gradient: 'from-violet-500 to-purple-600' },
  { title: 'Precision', desc: 'Every detail matters in what we do', icon: '🎯', svg: 'circle', gradient: 'from-blue-500 to-cyan-600' },
  { title: 'Sustainability', desc: 'Building for the future responsibly', icon: '🌱', svg: 'M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66L7 18M17 8a14 14 0 0 0-10 6M17 8c2-2 4-3.1 6-4', gradient: 'from-emerald-500 to-teal-600' },
  { title: 'Community', desc: 'People at the heart of everything', icon: '🤝', svg: 'users', gradient: 'from-amber-500 to-orange-600' },
];

const MILESTONES = [
  { year: 'Founded', title: 'The Beginning', desc: 'Started with a mission to make a difference', icon: '🌱' },
  { year: 'Growth', title: 'Expanding Reach', desc: 'Grew to serve customers worldwide', icon: '🚀' },
  { year: 'Innovation', title: 'Breaking New Ground', desc: 'Launched breakthrough products and services', icon: '💡' },
  { year: 'Today', title: 'Building the Future', desc: 'Continuing to push boundaries every day', icon: '🏆' },
];

const TEAM = [
  { name: 'Founder', role: 'CEO & Visionary', initial: 'F', color: '#6366F1' },
  { name: 'Lead Designer', role: 'Creative Director', initial: 'D', color: '#EC4899' },
  { name: 'Head of Product', role: 'Product Lead', initial: 'P', color: '#F59E0B' },
  { name: 'Community Lead', role: 'People & Culture', initial: 'C', color: '#10B981' },
];

/* ─── Value icon SVG ─────────────────────────────────────────── */
function ValueIcon({ type, color }: { type: string; color: string }) {
  const p = { fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" {...p}>
      {type === 'circle' ? <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></> :
       type === 'users' ? <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></> :
       type.split('M').length > 1 ? type.split('M').filter(Boolean).map((d, i) => <path key={i} d={`M${d}`} />) : null}
    </svg>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────── */
function tLabel(templateId: string, normal: string, bold: string, playful: string) {
  return templateId === 'bold' ? bold : templateId === 'playful' ? playful : normal;
}

export default function AboutPage() {
  const data = useBrandSite();
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
  const maxW = tid === 'bold' ? 'max-w-7xl' : 'max-w-6xl';
  const cardVariant = tid === 'playful' ? scaleIn : tid === 'bold' ? slideIn : fadeUp;

  const hs: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || '600',
    letterSpacing: tp?.typography.headingTracking || '-0.02em',
    textTransform: (tp?.typography.headingCase || 'normal') as React.CSSProperties['textTransform'],
    color: tc,
  };

  const cardRadius = tid === 'playful' ? '24px' : tid === 'classic' ? '12px' : tid === 'bold' ? '0' : dsRadius;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';

  return (
    <>
      <AboutPageMeta
        org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/site/${slug}`, logoUrl: brand.logo_url }}
        canonicalUrl={`${baseUrl}/site/${slug}/about`}
      />
      {/* ═══════ HERO ═══════ */}
      <ParallaxHero brand={brand} tid={tid} hs={hs} tc={tc} ac={ac} bgColor={bgColor} isDark={isDark} />

      {(tid === 'minimal' || tid === 'editorial') && (
        <div className={`${maxW} mx-auto px-5 sm:px-8`}><div className="t-divider" style={{ backgroundColor: `${tc}06` }} /></div>
      )}

      {/* ═══════ STORY ═══════ */}
      <section className="t-section">
        <div className={`${maxW} mx-auto px-5 sm:px-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="t-section-heading mb-6" style={hs}>
                {tLabel(tid, 'Our Story', 'OUR STORY', 'Our Story 📖')}
              </motion.h2>
              {tid === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mb-6" style={{ backgroundColor: ac }} />}
              <motion.div variants={fadeUp} className="space-y-5 text-[15px] leading-relaxed" style={{ color: `${tc}60` }}>
                <p>{brand.description || `${brand.name} was founded with a clear purpose: to deliver exceptional quality and build lasting relationships with our community.`}</p>
                <p>We believe in transparency, innovation, and an unwavering commitment to excellence in everything we do.</p>
                {brand.brand_voice && <p>Our voice is <span className="font-medium" style={{ color: tc }}>{brand.brand_voice}</span> — every interaction reflects who we are.</p>}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex items-center justify-center overflow-hidden"
              style={{ aspectRatio: tid === 'editorial' ? '4/5' : '4/3', backgroundColor: isDark ? '#111111' : `${tc}04`, borderRadius: cardRadius, border: tid === 'bold' ? `2px solid ${tc}10` : undefined }}>
              {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="max-w-[50%] max-h-[50%] object-contain" /> : <BrandPlaceholder color={isDark ? '#FFFFFF' : tc} className="w-full h-full" variant="about" />}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ VALUES ═══════ */}
      <section className="t-section">
        <div className={`${maxW} mx-auto px-5 sm:px-8`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className={`${tid === 'classic' || tid === 'playful' ? 'text-center' : ''} mb-12`}>
            <motion.h2 variants={fadeUp} className="t-section-heading" style={hs}>{tLabel(tid, 'What We Stand For', 'WHAT WE STAND FOR', 'Our Values 💛')}</motion.h2>
            {tid === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: ac }} />}
            <motion.p variants={fadeUp} className="text-sm mt-3 max-w-lg" style={{ color: `${tc}45` }}>
              {tLabel(tid, 'The principles that guide everything we do.', 'The principles that guide everything we do.', 'The principles that guide everything we do ✨')}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger}
            className={tid === 'editorial' ? '' : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${tid === 'minimal' ? 'gap-px' : 'gap-6 sm:gap-8'}`}
            style={tid === 'minimal' ? { backgroundColor: `${tc}06` } : {}}>
            {VALUES.map((v, i) => {
              const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF'];
              if (tid === 'editorial') return (
                <motion.div key={v.title} variants={fadeUp} className="t-card flex items-start gap-6" style={{ borderColor: `${tc}08` }}>
                  <span className="text-2xl font-light" style={{ color: `${tc}15`, fontFamily: brand.font_heading }}>{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-base font-semibold mb-1" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                    <p className="text-sm" style={{ color: `${tc}45` }}>{v.desc}</p>
                  </div>
                </motion.div>
              );
              return (
                <motion.div key={v.title} variants={cardVariant}
                  className={`${tid === 'minimal' ? 'p-8 sm:p-10' : 't-card'} ${tid === 'playful' ? 'text-center cursor-default' : tid === 'classic' ? 'text-center' : ''} ${tid === 'playful' || tid === 'bold' ? 'transition-transform hover:translate-y-[-2px]' : ''}`}
                  style={{
                    backgroundColor: tid === 'minimal' ? bgColor : tid === 'playful' ? pastels[i % pastels.length] : tid === 'classic' ? bgColor : `${tc}03`,
                    borderRadius: !['minimal', 'bold', 'classic', 'playful'].includes(tid) ? dsRadius : undefined,
                    borderColor: tid === 'bold' ? `${tc}15` : undefined,
                  }}
                  {...(tid === 'playful' ? { whileHover: { y: -6, transition: { duration: 0.2 } } } : {})}>
                  {tid === 'bold' ? <span className="text-2xl mb-3 block" style={{ color: ac }}>{v.icon}</span> :
                   tid === 'playful' ? <span className="text-3xl mb-3 block">{v.icon}</span> :
                   tid === 'classic' ? (
                    <div className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-4" style={{ backgroundColor: `${ac}12` }}>
                      <ValueIcon type={v.svg} color={ac} />
                    </div>
                   ) : <div className={`mb-${tid === 'minimal' ? '4' : '3'} opacity-${tid === 'minimal' ? '40' : '50'}`}><ValueIcon type={v.svg} color={tid === 'minimal' ? tc : ac} /></div>}
                  <h3 className={`text-sm font-${tid === 'bold' ? 'bold uppercase tracking-wider' : tid === 'minimal' ? 'medium' : 'semibold'} mb-2`} style={{ fontFamily: brand.font_heading, fontWeight: tid === 'minimal' ? 400 : undefined }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${tc}${tid === 'playful' ? '50' : tid === 'minimal' ? '35' : '45'}` }}>{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section className="t-section">
        <div className={`${maxW} mx-auto px-5 sm:px-8`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className={`${tid === 'classic' || tid === 'playful' ? 'text-center' : ''} mb-12`}>
            <motion.h2 variants={fadeUp} className="t-section-heading" style={hs}>{tLabel(tid, 'Our Journey', 'OUR JOURNEY', 'Our Journey 🗺️')}</motion.h2>
            {tid === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: ac }} />}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={stagger} className="relative">
            {/* Desktop center line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ backgroundColor: `${tc}08` }} />
            {/* Mobile left line */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-px" style={{ backgroundColor: `${tc}08` }} />
            <div className="space-y-10 md:space-y-0">
              {MILESTONES.map((m, i) => (
                <motion.div key={m.year} variants={cardVariant} className={`relative md:grid md:grid-cols-2 md:gap-12 ${i > 0 ? 'md:mt-14' : ''}`}>
                  {/* Desktop dot with pulse */}
                  <div className="hidden md:block absolute left-1/2 top-5 -translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: i * 0.1 }}
                      className="relative flex items-center justify-center"
                      style={{ width: 36, height: 36 }}
                    >
                      <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: `${ac}20` }} />
                      <div className="relative w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        style={{ backgroundColor: isDark ? '#111' : bgColor, border: `2px solid ${ac}` }}>
                        <span>{m.icon}</span>
                      </div>
                    </motion.div>
                  </div>
                  {/* Mobile dot */}
                  <div className="md:hidden absolute left-4 top-1.5 w-3 h-3 -translate-x-1/2 rounded-full z-10"
                    style={{ backgroundColor: ac, boxShadow: `0 0 0 4px ${bgColor}, 0 0 0 5px ${tc}10` }} />
                  {/* Content */}
                  <div className={`pl-10 md:pl-0 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:col-start-2 md:pl-12'}`}>
                    <span className={`text-xs font-${tid === 'bold' ? 'bold' : 'medium'} uppercase tracking-wider mb-2 block`}
                      style={{ color: ac, letterSpacing: tid === 'bold' ? '0.12em' : '0.06em' }}>{m.year}</span>
                    <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ fontFamily: brand.font_heading, textTransform: tid === 'bold' ? 'uppercase' : undefined }}>{m.title}</h3>
                    <p className="text-sm" style={{ color: `${tc}45` }}>{m.desc}</p>
                  </div>
                  {i % 2 !== 0 && <div className="hidden md:block" />}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TEAM ═══════ */}
      <section className="t-section">
        <div className={`${maxW} mx-auto px-5 sm:px-8`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }} variants={stagger}
            className={`${tid === 'classic' || tid === 'playful' ? 'text-center' : ''} mb-12`}>
            <motion.h2 variants={fadeUp} className="t-section-heading" style={hs}>{tLabel(tid, 'The Team', 'THE TEAM', 'Meet the Team 👋')}</motion.h2>
            {tid === 'bold' && <motion.div variants={fadeUp} className="h-0.5 w-12 mt-2" style={{ backgroundColor: ac }} />}
            <motion.p variants={fadeUp} className="text-sm mt-3" style={{ color: `${tc}45` }}>
              {tLabel(tid, 'The people behind the brand.', 'The people behind the brand.', 'The people who make the magic happen ✨')}
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                variants={cardVariant}
                className="text-center group cursor-default"
                whileHover={{ y: tid === 'bold' ? 0 : -6 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Avatar with gradient ring on hover */}
                <div className="relative mx-auto mb-4 inline-flex">
                  {/* Glowing ring */}
                  {tid !== 'bold' && (
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${member.color}30, transparent 70%)`,
                        filter: 'blur(8px)',
                        transform: 'scale(1.3)',
                        borderRadius: tid === 'playful' ? '24px' : '50%',
                      }}
                    />
                  )}
                  <motion.div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{
                      width: tid === 'bold' ? 80 : 88,
                      height: tid === 'bold' ? 80 : 88,
                      borderRadius: tid === 'bold' ? '0' : tid === 'playful' ? '24px' : '50%',
                      backgroundColor: isDark ? '#111111' : `${tc}06`,
                      border: tid === 'bold'
                        ? `2px solid ${tc}12`
                        : `2px solid transparent`,
                      backgroundClip: 'padding-box',
                    }}
                    whileHover={tid !== 'bold' ? {
                      borderColor: member.color,
                      boxShadow: `0 0 0 3px ${member.color}20`,
                    } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <span
                      className="text-xl font-bold transition-all duration-300"
                      style={{
                        color: isDark ? `${tc}25` : `${tc}20`,
                        fontFamily: brand.font_heading,
                      }}
                    >
                      {member.initial}
                    </span>
                    {/* Hover color overlay */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        background: `linear-gradient(135deg, ${member.color}18, ${member.color}30)`,
                        borderRadius: 'inherit',
                      }}
                    >
                      <span className="text-xl font-bold" style={{ color: member.color, fontFamily: brand.font_heading }}>
                        {member.initial}
                      </span>
                    </motion.div>
                  </motion.div>
                </div>
                <h3 className="text-sm font-medium mb-0.5 transition-colors duration-200 group-hover:opacity-80"
                  style={{
                    fontFamily: brand.font_heading,
                    textTransform: tid === 'bold' ? 'uppercase' : undefined,
                    letterSpacing: tid === 'bold' ? '0.04em' : undefined,
                    fontWeight: tid === 'minimal' ? 400 : 500,
                    color: tc,
                  }}>
                  {member.name}
                </h3>
                <p className="text-xs" style={{ color: `${tc}35` }}>{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="t-section">
        <div className={`${tid === 'bold' ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8 text-center`}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="text-2xl font-semibold tracking-tight mb-4" style={hs}>
              {tLabel(tid, "Let's Connect", "LET'S CONNECT", "Let's Connect! 🤝")}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${tc}45` }}>
              Whether you have questions, ideas, or just want to say hello — we&apos;d love to hear from you.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
              <Link href={`/site/${slug}/contact`} className="t-btn-primary"
                style={{ ...getPrimaryButtonStyle(designSettings, ac), backgroundColor: isDark ? ac : tc, color: isDark ? '#FFFFFF' : bgColor }}>
                {tLabel(tid, 'Get in Touch', 'GET IN TOUCH', 'Get in Touch 💬')}
              </Link>
              <Link href={`/shop/${slug}`} className="t-btn-secondary"
                style={{ ...getSecondaryButtonStyle(designSettings, tc), borderColor: `${tc}${isDark ? '25' : '15'}`, color: tc }}>
                {tLabel(tid, 'Browse Shop', 'BROWSE SHOP', 'Browse Shop 🛍️')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

/* ─── Parallax Hero ──────────────────────────────────────────── */
function ParallaxHero({ brand, tid, hs, tc, ac, bgColor, isDark }: {
  brand: any; tid: string; hs: React.CSSProperties; tc: string; ac: string; bgColor: string; isDark: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const desc = brand.description || `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value.`;
  const tagline = brand.tagline || (tid === 'bold' ? `THE STORY BEHIND ${brand.name.toUpperCase()}` : `The story behind ${brand.name}`);

  const badge = tid === 'playful' ? (
    <span className="t-badge mb-6 inline-flex" style={{ backgroundColor: `${ac}15`, color: ac }}>✨ About Us</span>
  ) : (
    <span className={`text-xs font-${tid === 'bold' ? 'bold' : 'medium'} uppercase tracking-[0.2em] mb-6 block`}
      style={{ color: tid === 'editorial' || tid === 'bold' ? ac : tid === 'classic' ? ac : `${tc}30` }}>
      {tid === 'bold' ? '— ABOUT' : 'About' + (tid === 'classic' ? ' Us' : '')}
    </span>
  );

  return (
    <section ref={ref} className="t-hero relative overflow-hidden">
      <motion.div style={{ y, opacity }} className={tid === 'playful' ? 'relative z-10' : undefined}>
        <div className={`${tid === 'bold' ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8 ${tid === 'playful' || tid === 'classic' ? 'text-center' : ''}`}>
          {badge}
          <h1 className="t-hero-heading mb-8" style={tid === 'playful' ? hs : { ...hs, ...(tid === 'bold' ? {} : {}) }}>
            {tid === 'playful' ? `${tagline} 💫` : tagline}
          </h1>
          <p className={`t-hero-desc ${tid === 'playful' || tid === 'classic' ? 'mx-auto' : ''}`}
            style={{ color: `${tc}${tid === 'bold' ? '60' : tid === 'classic' ? '55' : '50'}` }}>{desc}</p>
          {tid === 'bold' && <div className="h-0.5 w-16 mt-6" style={{ backgroundColor: ac }} />}
        </div>
      </motion.div>
    </section>
  );
}
