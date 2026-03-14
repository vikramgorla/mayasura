'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Monitor, Tablet, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type WebsiteTemplate } from '@/lib/website-templates';

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
              color: '#FFFFFF',
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
}: {
  template: WebsiteTemplate;
  brandName?: string;
  colors?: PreviewColors;
  headingFont?: string;
  bodyFont?: string;
}) {
  const [viewport, setViewport] = useState<Viewport>('desktop');

  const c: PreviewColors = colors || templateColorsToPreview(template.colors.light);
  const tp = template.preview;
  const hFont = headingFont || template.fonts.heading;
  const bFont = bodyFont || template.fonts.body;
  const isDark = template.id === 'bold' || (colors && isColorDark(c.secondary));

  const textColor = isDark ? '#FFFFFF' : c.text;
  const bgColor = c.secondary;
  const accentColor = c.accent;

  const viewportWidths: Record<Viewport, string> = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-900/50">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
          Preview — {template.name}
        </p>
        <div className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-700 p-0.5">
          {([
            { id: 'desktop' as Viewport, icon: Monitor },
            { id: 'tablet' as Viewport, icon: Tablet },
            { id: 'mobile' as Viewport, icon: Smartphone },
          ]).map(v => (
            <button
              key={v.id}
              onClick={() => setViewport(v.id)}
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
                yourbrand.com
              </div>
            </div>
          </div>

          {/* Simulated Site */}
          <div style={{ backgroundColor: bgColor }}>
            {/* Nav */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: isDark ? '#000000' : textColor }}
            >
              <span
                className="text-xs font-semibold"
                style={{
                  color: bgColor,
                  fontFamily: hFont,
                  textTransform: tp.typography.headingCase === 'uppercase' ? 'uppercase' : undefined,
                }}
              >
                {brandName || 'Your Brand'}
              </span>
              <div className="flex items-center gap-3">
                {['Home', 'Products', 'Blog', 'Contact'].map(l => (
                  <span key={l} className="text-[9px]" style={{ color: `${bgColor}77` }}>
                    {tp.typography.headingCase === 'uppercase' ? l.toUpperCase() : l}
                  </span>
                ))}
                <span
                  className="text-[9px] px-2 py-1 font-medium"
                  style={{
                    backgroundColor: accentColor,
                    color: '#FFFFFF',
                    borderRadius: tp.borderRadius,
                  }}
                >
                  Shop
                </span>
              </div>
            </div>

            {/* Hero */}
            <div
              className={cn(
                'px-6',
                tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'text-center' : '',
                tp.spacing === 'spacious' ? 'py-14' : tp.spacing === 'generous' ? 'py-10' : tp.spacing === 'compact' ? 'py-6' : 'py-8',
              )}
            >
              <h2
                className="mb-2 leading-tight"
                style={{
                  fontFamily: hFont,
                  fontWeight: Number(tp.typography.headingWeight),
                  letterSpacing: tp.typography.headingTracking,
                  textTransform: tp.typography.headingCase === 'uppercase' ? 'uppercase' : undefined,
                  color: textColor,
                  fontSize: viewport === 'mobile' ? '18px' : '24px',
                }}
              >
                {brandName || 'Your Brand'} — Where Quality Meets Design
              </h2>
              <p
                className="text-sm mb-4 max-w-lg"
                style={{
                  fontFamily: bFont,
                  color: `${textColor}55`,
                  marginLeft: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'auto' : undefined,
                  marginRight: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'auto' : undefined,
                }}
              >
                Discover our curated collection of premium products designed with care and crafted to perfection.
              </p>
              <div className="flex gap-2" style={{ justifyContent: tp.heroStyle === 'centered' || tp.heroStyle === 'stacked' ? 'center' : 'flex-start' }}>
                <span
                  className="text-xs px-4 py-2 font-medium"
                  style={{
                    backgroundColor: isDark ? accentColor : textColor,
                    color: isDark ? '#FFFFFF' : bgColor,
                    borderRadius: tp.borderRadius,
                  }}
                >
                  Shop Now
                </span>
                <span
                  className="text-xs px-4 py-2 font-medium"
                  style={{
                    border: `1px solid ${textColor}20`,
                    color: textColor,
                    borderRadius: tp.borderRadius,
                  }}
                >
                  Learn More
                </span>
              </div>
            </div>

            {/* Product Cards */}
            <div className="px-6 pb-8">
              <h3
                className="text-base font-semibold mb-4"
                style={{
                  fontFamily: hFont,
                  color: textColor,
                  fontWeight: Number(tp.typography.headingWeight),
                  textTransform: tp.typography.headingCase === 'uppercase' ? 'uppercase' : undefined,
                }}
              >
                {tp.typography.headingCase === 'uppercase' ? 'PRODUCTS' : 'Products'}
              </h3>
              <div className={cn('grid gap-3', viewport === 'mobile' ? 'grid-cols-1' : 'grid-cols-3')}>
                {['Premium Coffee', 'Artisan Candle', 'Leather Journal'].map((name, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: c.surface,
                      borderRadius: tp.borderRadius,
                      border: tp.cardStyle === 'bordered' ? `1px solid ${c.border}` : tp.cardStyle === 'minimal' ? 'none' : undefined,
                      boxShadow: tp.cardStyle === 'elevated' ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="h-20"
                      style={{ backgroundColor: `${c.muted}10` }}
                    />
                    <div className="p-3">
                      <p className="text-xs font-medium" style={{ fontFamily: hFont, color: textColor }}>{name}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: c.muted }}>$29.00</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{
                backgroundColor: isDark ? '#000000' : textColor,
                borderTop: `1px solid ${textColor}08`,
              }}
            >
              <span className="text-[9px]" style={{ color: `${bgColor}55` }}>
                © 2026 {brandName || 'Your Brand'}
              </span>
              <span className="text-[9px]" style={{ color: `${bgColor}35` }}>
                Powered by Mayasura
              </span>
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
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
