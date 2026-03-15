'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WebsiteTemplate } from '@/lib/website-templates';
import { getTextOnColor } from '@/lib/color-utils';

// ─── Mini Website Preview ────────────────────────────────────────
// A realistic mini website preview showing nav, hero, cards, footer
function MiniWebsitePreview({
  template,
  brandName,
  className,
}: {
  template: WebsiteTemplate;
  brandName?: string;
  className?: string;
}) {
  const c = template.colors.light;
  const tp = template.preview;
  const isDark = template.id === 'bold';
  const navBg = isDark ? '#000000' : c.text;
  const navText = isDark ? '#FFFFFF' : c.background;
  const heroBg = isDark ? '#000000' : c.background;
  const heroText = isDark ? '#FFFFFF' : c.text;
  const accentColor = c.accent;
  const name = brandName || 'Brand';

  return (
    <div
      className={cn('overflow-hidden select-none', className)}
      style={{
        backgroundColor: heroBg,
        fontFamily: template.fonts.body,
        borderRadius: '6px',
      }}
    >
      {/* Mini Nav */}
      <div
        className="flex items-center justify-between px-2.5 py-1.5"
        style={{ backgroundColor: navBg }}
      >
        <span
          className="text-[7px] font-semibold truncate"
          style={{
            color: navText,
            fontFamily: template.fonts.heading,
            fontWeight: Number(tp.typography.headingWeight) || 600,
            letterSpacing: template.id === 'bold' ? '0.06em' : undefined,
            textTransform: tp.typography.headingCase === 'uppercase' ? 'uppercase' : undefined,
          }}
        >
          {template.id === 'bold' ? name.toUpperCase() : name}
        </span>
        <div className="flex gap-1.5">
          {['Home', 'Shop', 'Blog'].map(l => (
            <span key={l} className="text-[5px]" style={{ color: `${navText}66` }}>
              {template.id === 'bold' ? l.toUpperCase() : l}
            </span>
          ))}
          <span
            className="text-[5px] px-1 py-0.5 font-medium"
            style={{
              backgroundColor: accentColor,
              color: getTextOnColor(accentColor),
              borderRadius: template.id === 'playful' ? '9999px' : template.id === 'bold' ? '0' : tp.borderRadius,
            }}
          >
            {template.id === 'bold' ? 'SHOP' : 'Shop'}
          </span>
        </div>
      </div>

      {/* Hero */}
      <div
        className={cn(
          'px-3',
          tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'text-center' : '',
          tp.spacing === 'spacious' ? 'py-5' : tp.spacing === 'generous' ? 'py-4' : 'py-3'
        )}
        style={{ backgroundColor: heroBg }}
      >
        {template.id === 'playful' && (
          <span
            className="inline-block text-[5px] px-1.5 py-0.5 mb-1 font-medium"
            style={{
              backgroundColor: `${accentColor}15`,
              color: accentColor,
              borderRadius: '9999px',
            }}
          >
            ✨ Welcome
          </span>
        )}
        {template.id === 'bold' && (
          <span
            className="block text-[5px] mb-1 font-bold"
            style={{ color: accentColor, letterSpacing: '0.1em' }}
          >
            — WELCOME
          </span>
        )}
        <h3
          className="mb-0.5 leading-tight"
          style={{
            color: heroText,
            fontFamily: template.fonts.heading,
            fontWeight: Number(tp.typography.headingWeight) || 600,
            fontSize: template.id === 'bold' ? '11px' : '9px',
            letterSpacing: tp.typography.headingTracking,
            textTransform: tp.typography.headingCase === 'uppercase' ? 'uppercase' : undefined,
          }}
        >
          {template.id === 'bold' ? 'MAKE IT BOLD' : template.id === 'editorial' ? 'Tell Your Story' : 'Welcome'}
        </h3>
        <p className="text-[5px] mb-2" style={{ color: `${heroText}45` }}>
          A beautiful brand experience.
        </p>
        <div className="flex gap-1" style={{ justifyContent: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'center' : 'flex-start' }}>
          <span
            className="text-[5px] px-1.5 py-0.5 font-medium"
            style={{
              backgroundColor: isDark ? accentColor : heroText,
              color: isDark ? '#FFFFFF' : heroBg,
              borderRadius: template.id === 'playful' ? '9999px' : template.id === 'bold' ? '0' : tp.borderRadius,
            }}
          >
            {template.id === 'bold' ? 'SHOP NOW' : 'Shop Now'}
          </span>
        </div>
      </div>

      {/* Cards Section */}
      <div className="px-2.5 pb-2 grid grid-cols-3 gap-1">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="p-1.5"
            style={{
              backgroundColor: c.surface,
              borderRadius: template.id === 'playful' ? '6px' : tp.borderRadius === '0px' ? '0' : '3px',
              border: tp.cardStyle === 'bordered' ? `1px solid ${c.border}` : tp.cardStyle === 'minimal' ? 'none' : undefined,
              boxShadow: tp.cardStyle === 'elevated' ? '0 1px 3px rgba(0,0,0,0.05)' : undefined,
            }}
          >
            <div
              className="h-4 mb-1"
              style={{
                backgroundColor: `${c.muted}12`,
                borderRadius: template.id === 'playful' ? '4px' : tp.borderRadius === '0px' ? '0' : '2px',
              }}
            />
            <div className="h-[3px] w-3/4 rounded-sm" style={{ backgroundColor: `${c.text}15` }} />
            <div className="h-[2px] w-1/2 rounded-sm mt-0.5" style={{ backgroundColor: `${c.muted}15` }} />
          </div>
        ))}
      </div>

      {/* Mini Footer */}
      <div
        className="px-2.5 py-1.5 text-center"
        style={{ backgroundColor: navBg, borderTop: template.id === 'bold' ? `1px solid ${heroText}10` : undefined }}
      >
        <span className="text-[4px]" style={{ color: `${navText}40` }}>
          © Brand · Mayasura
        </span>
      </div>
    </div>
  );
}

// ─── Template Selection Card ─────────────────────────────────────
export function TemplatePreviewCard({
  template,
  isSelected,
  brandName,
  onClick,
}: {
  template: WebsiteTemplate;
  isSelected: boolean;
  brandName?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'relative rounded-xl border-2 text-left transition-all overflow-hidden',
        isSelected
          ? 'border-violet-500 shadow-lg shadow-violet-500/10'
          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md'
      )}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5 z-10 h-6 w-6 rounded-full bg-violet-600 flex items-center justify-center shadow-lg"
        >
          <Check className="h-3.5 w-3.5 text-white" />
        </motion.div>
      )}

      {/* Mini website preview */}
      <div className="p-3 pb-0">
        <MiniWebsitePreview
          template={template}
          brandName={brandName}
          className="border border-zinc-100 dark:border-zinc-700"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-sm text-zinc-900 dark:text-white">{template.name}</p>
        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{template.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {template.bestFor.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
          {template.bestFor.length > 3 && (
            <span className="text-[10px] text-zinc-400">+{template.bestFor.length - 3}</span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ─── Large Template Detail Preview ───────────────────────────────
type Viewport = 'desktop' | 'tablet' | 'mobile';

export interface PreviewColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
}

import {
  BORDER_RADIUS_MAP,
  SPACING_MAP,
  BUTTON_SHAPE_MAP,
  BUTTON_SIZE_MAP,
  type ButtonShape,
  type ButtonSize,
  type ButtonVariant,
  type SpacingDensity,
  type BorderRadiusPreset,
} from '@/lib/design-settings';

function getButtonStyle(
  variant: ButtonVariant,
  accentColor: string,
  shape: ButtonShape,
  size: ButtonSize,
  bgColor: string,
): React.CSSProperties {
  const sz = BUTTON_SIZE_MAP[size];
  const base: React.CSSProperties = {
    borderRadius: BUTTON_SHAPE_MAP[shape],
    padding: `${sz.py} ${sz.px}`,
    fontSize: sz.fontSize,
    fontWeight: 500,
    display: 'inline-block',
    lineHeight: 1.2,
  };
  if (variant === 'solid') {
    return { ...base, backgroundColor: accentColor, color: getTextOnColor(accentColor), border: 'none' };
  }
  if (variant === 'outline') {
    return { ...base, backgroundColor: 'transparent', color: accentColor, border: `1.5px solid ${accentColor}` };
  }
  // ghost
  return { ...base, backgroundColor: `${accentColor}12`, color: accentColor, border: 'none' };
}

function getOutlineButtonStyle(
  textColor: string,
  shape: ButtonShape,
  size: ButtonSize,
): React.CSSProperties {
  const sz = BUTTON_SIZE_MAP[size];
  return {
    borderRadius: BUTTON_SHAPE_MAP[shape],
    padding: `${sz.py} ${sz.px}`,
    fontSize: sz.fontSize,
    fontWeight: 500,
    display: 'inline-block',
    lineHeight: 1.2,
    backgroundColor: 'transparent',
    border: `1.5px solid ${textColor}25`,
    color: textColor,
  };
}

function templateColorsToPreview(tc: { text: string; background: string; accent: string; surface: string; muted: string; border: string }): PreviewColors {
  return {
    primary: tc.text,
    secondary: tc.background,
    accent: tc.accent,
    text: tc.text,
    muted: tc.muted,
    surface: tc.surface,
    border: tc.border,
  };
}

export function TemplateDetailPreview({
  template,
  brandName,
  colors,
  headingFont,
  bodyFont,
  buttonShape = 'rounded',
  buttonSize = 'medium',
  buttonVariant = 'solid',
  spacing = 'normal',
  borderRadius = 'rounded',
}: {
  template: WebsiteTemplate;
  brandName?: string;
  colors?: PreviewColors;
  headingFont?: string;
  bodyFont?: string;
  buttonShape?: ButtonShape;
  buttonSize?: ButtonSize;
  buttonVariant?: ButtonVariant;
  spacing?: SpacingDensity;
  borderRadius?: BorderRadiusPreset;
}) {
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const c: PreviewColors = colors || templateColorsToPreview(template.colors.light);
  const tp = template.preview;
  const hFont = headingFont || template.fonts.heading;
  const bFont = bodyFont || template.fonts.body;
  const isDark = (colors && isColorDark(c.secondary)) || (!colors && template.id === 'bold');

  const textColor = isDark ? '#FFFFFF' : c.text;
  const bgColor = c.secondary;
  const accentColor = c.accent;
  const rad = BORDER_RADIUS_MAP[borderRadius];
  const sp = SPACING_MAP[spacing];
  const isMobile = viewport === 'mobile';
  const name = brandName || 'Your Brand';

  const viewportWidths: Record<Viewport, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const headingCase = tp.typography.headingCase === 'uppercase' ? 'uppercase' as const : undefined;

  const primaryBtn = getButtonStyle(buttonVariant, accentColor, buttonShape, buttonSize, bgColor);
  const secondaryBtn = getOutlineButtonStyle(textColor, buttonShape, buttonSize);

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Preview — {template.name}
        </p>
        <div className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-700 p-0.5">
          {([
            { id: 'desktop' as Viewport, icon: Monitor, label: 'Desktop preview' },
            { id: 'tablet' as Viewport, icon: Tablet, label: 'Tablet preview' },
            { id: 'mobile' as Viewport, icon: Smartphone, label: 'Mobile preview' },
          ]).map(v => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
              aria-label={v.label}
              aria-pressed={viewport === v.id}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewport === v.id
                  ? 'bg-white dark:bg-zinc-600 shadow-sm text-zinc-900 dark:text-white'
                  : 'text-zinc-400 hover:text-zinc-600'
              )}
            >
              <v.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-4 flex justify-center overflow-x-auto">
        <motion.div
          animate={{ width: viewportWidths[viewport] }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm"
          style={{ maxWidth: '100%', minHeight: '300px' }}
        >
          {/* Browser Chrome */}
          <div className="bg-zinc-100 dark:bg-zinc-700 px-3 py-2 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-600">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-red-400/80" />
              <div className="h-2 w-2 rounded-full bg-amber-400/80" />
              <div className="h-2 w-2 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 ml-1">
              <div className="bg-white dark:bg-zinc-600 rounded px-2 py-0.5 text-[9px] text-zinc-400 max-w-[200px]">
                {name.toLowerCase().replace(/\s+/g, '')}.com
              </div>
            </div>
          </div>

          {/* Simulated Site */}
          <div style={{ backgroundColor: bgColor, fontFamily: bFont }}>

            {/* ── 1. Nav Bar ────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ backgroundColor: isDark ? c.primary : textColor }}
            >
              <span
                className="text-xs font-semibold"
                style={{
                  color: bgColor,
                  fontFamily: hFont,
                  fontWeight: Number(tp.typography.headingWeight) || 600,
                  textTransform: headingCase,
                  letterSpacing: tp.typography.headingTracking,
                }}
              >
                {name}
              </span>
              <div className="flex items-center gap-3">
                {['Home', 'Products', 'Blog', 'Contact'].map(l => (
                  <span key={l} className="text-[9px]" style={{ color: `${bgColor}77`, fontFamily: bFont }}>
                    {headingCase === 'uppercase' ? l.toUpperCase() : l}
                  </span>
                ))}
                <span style={{ ...primaryBtn, fontSize: '9px', padding: '4px 10px' }}>
                  Shop
                </span>
              </div>
            </div>

            {/* ── 2. Hero Section ───────────────────────── */}
            <div
              className={cn(
                'px-6',
                tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'text-center' : '',
              )}
              style={{ paddingTop: sp.sectionPadding, paddingBottom: sp.sectionPadding }}
            >
              <h2
                className="mb-2 leading-tight"
                style={{
                  fontFamily: hFont,
                  fontWeight: Number(tp.typography.headingWeight),
                  letterSpacing: tp.typography.headingTracking,
                  textTransform: headingCase,
                  color: textColor,
                  fontSize: isMobile ? '18px' : '24px',
                }}
              >
                {name} — Where Quality Meets Design
              </h2>
              <p
                className="mb-5 max-w-lg"
                style={{
                  fontFamily: bFont,
                  color: c.muted,
                  fontSize: '13px',
                  lineHeight: 1.6,
                  marginLeft: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'auto' : undefined,
                  marginRight: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'auto' : undefined,
                }}
              >
                Discover our curated collection of premium products designed with care and crafted to perfection.
              </p>
              <div className="flex gap-2 flex-wrap" style={{ justifyContent: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'center' : 'flex-start' }}>
                <span style={primaryBtn}>Shop Now</span>
                <span style={secondaryBtn}>Learn More</span>
              </div>
            </div>

            {/* ── 3. Features Section ───────────────────── */}
            <div style={{ padding: `${sp.sectionPadding} 24px`, backgroundColor: c.surface }}>
              <h3
                className="mb-1"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: headingCase,
                  fontSize: '16px',
                  letterSpacing: tp.typography.headingTracking,
                }}
              >
                {headingCase === 'uppercase' ? 'WHY CHOOSE US' : 'Why Choose Us'}
              </h3>
              <p className="mb-4" style={{ color: c.muted, fontSize: '12px', fontFamily: bFont }}>
                Everything you need to build a remarkable brand
              </p>
              <div className={cn('grid', isMobile ? 'grid-cols-1' : 'grid-cols-3')} style={{ gap: sp.cardGap }}>
                {[
                  { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized performance at every level' },
                  { icon: '🎨', title: 'Beautiful Design', desc: 'Crafted with pixel-perfect attention' },
                  { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade security built in' },
                ].map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: bgColor,
                      borderRadius: rad,
                      border: `1px solid ${c.border}`,
                      padding: '16px',
                    }}
                  >
                    <span className="text-lg mb-2 block">{feature.icon}</span>
                    <p
                      className="font-medium mb-1"
                      style={{ fontFamily: hFont, color: textColor, fontSize: '12px', fontWeight: Number(tp.typography.headingWeight) }}
                    >
                      {feature.title}
                    </p>
                    <p style={{ color: c.muted, fontSize: '11px', lineHeight: 1.5, fontFamily: bFont }}>
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 4. Product Cards ──────────────────────── */}
            <div style={{ padding: `${sp.sectionPadding} 24px` }}>
              <h3
                className="mb-1"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: headingCase,
                  fontSize: '16px',
                  letterSpacing: tp.typography.headingTracking,
                }}
              >
                {headingCase === 'uppercase' ? 'PRODUCTS' : 'Products'}
              </h3>
              <p className="mb-4" style={{ color: c.muted, fontSize: '12px', fontFamily: bFont }}>
                Our curated selection
              </p>
              <div className={cn('grid', isMobile ? 'grid-cols-1' : 'grid-cols-3')} style={{ gap: sp.cardGap }}>
                {['Premium Coffee', 'Artisan Candle', 'Leather Journal'].map((pname, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: c.surface,
                      borderRadius: rad,
                      border: `1px solid ${c.border}`,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="h-20"
                      style={{ backgroundColor: `${c.muted}10` }}
                    />
                    <div className="p-3">
                      <p style={{ fontFamily: hFont, color: textColor, fontSize: '12px', fontWeight: 600 }}>{pname}</p>
                      <p style={{ color: c.muted, fontSize: '10px', marginTop: '2px' }}>$29.00</p>
                      <div className="mt-2">
                        <span style={{ ...primaryBtn, fontSize: '9px', padding: '4px 10px' }}>
                          Add to Cart
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 5. Testimonial Section ────────────────── */}
            <div
              style={{
                padding: `${sp.sectionPadding} 24px`,
                backgroundColor: c.surface,
              }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: headingCase,
                  fontSize: '16px',
                  letterSpacing: tp.typography.headingTracking,
                  textAlign: 'center',
                }}
              >
                {headingCase === 'uppercase' ? 'WHAT PEOPLE SAY' : 'What People Say'}
              </h3>
              <div
                className="max-w-md mx-auto text-center"
                style={{
                  padding: '20px',
                  borderRadius: rad,
                  border: `1px solid ${c.border}`,
                  backgroundColor: bgColor,
                }}
              >
                <p
                  className="italic mb-3"
                  style={{ color: c.muted, fontSize: '13px', lineHeight: 1.6, fontFamily: bFont }}
                >
                  &ldquo;This product completely transformed how we do business. The quality is unmatched and the design is beautiful.&rdquo;
                </p>
                <p
                  className="font-medium"
                  style={{ color: textColor, fontSize: '12px', fontFamily: hFont }}
                >
                  Sarah Johnson
                </p>
                <p style={{ color: c.muted, fontSize: '10px' }}>CEO, Acme Corp</p>
              </div>
            </div>

            {/* ── 6. Newsletter Section ─────────────────── */}
            <div
              style={{ padding: `${sp.sectionPadding} 24px` }}
              className="text-center"
            >
              <h3
                className="mb-1"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: headingCase,
                  fontSize: '16px',
                  letterSpacing: tp.typography.headingTracking,
                }}
              >
                {headingCase === 'uppercase' ? 'STAY IN THE LOOP' : 'Stay in the Loop'}
              </h3>
              <p className="mb-4" style={{ color: c.muted, fontSize: '12px', fontFamily: bFont }}>
                Get updates on new products and exclusive offers
              </p>
              <div
                className={cn('flex mx-auto max-w-sm', isMobile ? 'flex-col gap-2' : 'gap-2')}
                style={{ justifyContent: 'center' }}
              >
                <input
                  type="text"
                  placeholder="your@email.com"
                  readOnly
                  className="flex-1 outline-none"
                  style={{
                    borderRadius: rad,
                    border: `1px solid ${c.border}`,
                    backgroundColor: c.surface,
                    color: textColor,
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: bFont,
                  }}
                />
                <span style={primaryBtn}>Subscribe</span>
              </div>
            </div>

            {/* ── 7. Contact Form ───────────────────────── */}
            <div style={{ padding: `${sp.sectionPadding} 24px`, backgroundColor: c.surface }}>
              <h3
                className="mb-1"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: headingCase,
                  fontSize: '16px',
                  letterSpacing: tp.typography.headingTracking,
                }}
              >
                {headingCase === 'uppercase' ? 'GET IN TOUCH' : 'Get in Touch'}
              </h3>
              <p className="mb-4" style={{ color: c.muted, fontSize: '12px', fontFamily: bFont }}>
                We&apos;d love to hear from you
              </p>
              <div className="max-w-sm space-y-2">
                <div className={cn('grid gap-2', isMobile ? 'grid-cols-1' : 'grid-cols-2')}>
                  <input
                    type="text"
                    placeholder="Name"
                    readOnly
                    className="outline-none w-full"
                    style={{
                      borderRadius: rad,
                      border: `1px solid ${c.border}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontFamily: bFont,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    readOnly
                    className="outline-none w-full"
                    style={{
                      borderRadius: rad,
                      border: `1px solid ${c.border}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontFamily: bFont,
                    }}
                  />
                </div>
                <textarea
                  placeholder="Your message..."
                  readOnly
                  rows={3}
                  className="outline-none w-full resize-none"
                  style={{
                    borderRadius: rad,
                    border: `1px solid ${c.border}`,
                    backgroundColor: bgColor,
                    color: textColor,
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: bFont,
                  }}
                />
                <div>
                  <span style={primaryBtn}>Send Message</span>
                </div>
              </div>
            </div>

            {/* ── 8. Footer ─────────────────────────────── */}
            <div
              className="px-6 py-5"
              style={{
                backgroundColor: isDark ? c.primary : textColor,
                borderTop: `1px solid ${textColor}08`,
              }}
            >
              <div className={cn('flex mb-4', isMobile ? 'flex-col gap-3' : 'items-start justify-between')}>
                <div>
                  <span
                    className="text-xs font-semibold block mb-1"
                    style={{
                      color: bgColor,
                      fontFamily: hFont,
                      textTransform: headingCase,
                    }}
                  >
                    {name}
                  </span>
                  <span className="text-[9px]" style={{ color: `${bgColor}55` }}>
                    Quality meets design
                  </span>
                </div>
                <div className="flex gap-4">
                  {['About', 'Products', 'Blog', 'Contact'].map(l => (
                    <span key={l} className="text-[9px]" style={{ color: `${bgColor}55` }}>
                      {headingCase === 'uppercase' ? l.toUpperCase() : l}
                    </span>
                  ))}
                </div>
              </div>
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: `1px solid ${bgColor}10` }}
              >
                <span className="text-[8px]" style={{ color: `${bgColor}40` }}>
                  © 2026 {name}. All rights reserved.
                </span>
                <span className="text-[8px]" style={{ color: `${bgColor}30` }}>
                  Powered by Mayasura
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Helper: check if a color is dark
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
