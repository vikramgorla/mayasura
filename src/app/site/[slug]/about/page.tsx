'use client';

import Link from 'next/link';
import { useBrandSite, BrandPlaceholder } from '../layout';
import {
  getPrimaryButtonStyle,
  getSecondaryButtonStyle,
  BORDER_RADIUS_MAP,
} from '@/lib/design-settings';

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

  const values = [
    { title: 'Innovation', desc: 'Constantly evolving to stay ahead', icon: '✦' },
    { title: 'Precision', desc: 'Every detail matters in what we do', icon: '◆' },
    { title: 'Sustainability', desc: 'Building for the future responsibly', icon: '○' },
    { title: 'Community', desc: 'People at the heart of everything', icon: '◇' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="t-hero">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8`}>
          {templateId === 'playful' ? (
            <div className="text-center">
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
          ) : templateId === 'bold' ? (
            <>
              <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] mb-6" style={{ color: accentColor }}>
                — ABOUT
              </span>
              <h1 className="t-hero-heading mb-8" style={headingStyle}>
                {brand.tagline || `THE STORY BEHIND ${brand.name.toUpperCase()}`}
              </h1>
              <p className="t-hero-desc" style={{ color: `${textColor}60` }}>
                {brand.description || `${brand.name} was founded with a clear purpose.`}
              </p>
            </>
          ) : templateId === 'classic' ? (
            <div className="text-center">
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
          ) : (
            <>
              <span
                className="text-xs font-medium uppercase tracking-[0.2em] mb-6 block"
                style={{ color: templateId === 'editorial' ? accentColor : `${textColor}30` }}
              >
                About
              </span>
              <h1 className="t-hero-heading mb-8" style={headingStyle}>
                {brand.tagline || `The story behind ${brand.name}`}
              </h1>
              <p
                className="t-hero-desc"
                style={{ color: `${textColor}50` }}
              >
                {brand.description || `${brand.name} was founded with a simple yet powerful mission: to deliver exceptional quality and value.`}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Divider */}
      {(templateId === 'minimal' || templateId === 'editorial') && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="t-divider" style={{ backgroundColor: `${textColor}06` }} />
        </div>
      )}

      {/* Story — Two column layout */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-start ${templateId === 'classic' ? '' : ''}`}>
            <div>
              <h2 className="t-section-heading mb-6" style={headingStyle}>
                {templateId === 'bold' ? 'OUR STORY' : templateId === 'playful' ? 'Our Story 📖' : 'Our Story'}
              </h2>
              {templateId === 'bold' && <div className="h-0.5 w-12 mb-6" style={{ backgroundColor: accentColor }} />}
              <div className="space-y-5 text-[15px] leading-relaxed" style={{ color: `${textColor}60` }}>
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
              </div>
            </div>

            {/* Image placeholder */}
            <div
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
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-5 sm:px-8`}>
          <div className={templateId === 'classic' || templateId === 'playful' ? 'text-center mb-12' : 'mb-12'}>
            <h2 className="t-section-heading" style={headingStyle}>
              {templateId === 'bold' ? 'WHAT WE STAND FOR' : templateId === 'playful' ? 'Our Values 💛' : 'What We Stand For'}
            </h2>
            {templateId === 'bold' && <div className="h-0.5 w-12 mt-2" style={{ backgroundColor: accentColor }} />}
          </div>

          {/* Minimal: gap-px grid */}
          {templateId === 'minimal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: `${textColor}06` }}>
              {values.map((v) => (
                <div key={v.title} className="p-8 sm:p-10" style={{ backgroundColor: bgColor }}>
                  <h3 className="text-sm font-medium mb-2" style={{ fontFamily: brand.font_heading, fontWeight: 400 }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}35` }}>{v.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Editorial: numbered list with dividers */}
          {templateId === 'editorial' && (
            <div>
              {values.map((v, i) => (
                <div key={v.title} className="t-card flex items-start gap-6" style={{ borderColor: `${textColor}08` }}>
                  <span className="text-2xl font-light" style={{ color: `${textColor}15`, fontFamily: brand.font_heading }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold mb-1" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                    <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bold: thick bordered grid */}
          {templateId === 'bold' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <div key={v.title} className="t-card" style={{ borderColor: `${textColor}15` }}>
                  <span className="text-2xl mb-3 block" style={{ color: accentColor }}>{v.icon}</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Classic: neumorphic cards */}
          {templateId === 'classic' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v) => (
                <div key={v.title} className="t-card text-center" style={{ backgroundColor: bgColor }}>
                  <div
                    className="w-12 h-12 rounded-lg mx-auto flex items-center justify-center mb-4 text-lg"
                    style={{
                      backgroundColor: `${accentColor}12`,
                      color: accentColor,
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.04), inset -2px -2px 4px rgba(255,255,255,0.5)',
                    }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="text-sm font-semibold mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: `${textColor}45` }}>{v.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Playful: pastel rounded cards */}
          {templateId === 'playful' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v, i) => {
                const pastels = ['#FFF7ED', '#EFF6FF', '#F0FDF4', '#FAF5FF'];
                const emojis = ['💡', '🎯', '🌱', '🤝'];
                return (
                  <div key={v.title} className="t-card text-center" style={{ backgroundColor: pastels[i % pastels.length] }}>
                    <span className="text-3xl mb-3 block">{emojis[i]}</span>
                    <h3 className="text-sm font-bold mb-2" style={{ fontFamily: brand.font_heading }}>{v.title}</h3>
                    <p className="text-sm" style={{ color: `${textColor}50` }}>{v.desc}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="t-section">
        <div className={`${templateId === 'bold' ? 'max-w-7xl' : 'max-w-3xl'} mx-auto px-5 sm:px-8 text-center`}>
          <h2 className="text-2xl font-semibold tracking-tight mb-4" style={headingStyle}>
            {templateId === 'playful' ? "Let's Connect! 🤝" : templateId === 'bold' ? "LET'S CONNECT" : "Let's Connect"}
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto" style={{ color: `${textColor}45` }}>
            Whether you have questions, ideas, or just want to say hello — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
          </div>
        </div>
      </section>
    </>
  );
}
