'use client';

import { useMemo } from 'react';
import { Globe, Monitor, Tablet, Smartphone } from 'lucide-react';
import { WEBSITE_TEMPLATES, type WebsiteTemplate } from '@/lib/website-templates';
import { getTextOnColor } from '@/lib/color-utils';

interface SitePreviewProps {
  brandName: string;
  tagline?: string;
  templateId: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontHeading?: string;
  fontBody?: string;
  products?: Array<{ name: string; price?: number; category?: string }>;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  showChrome?: boolean;
  className?: string;
}

function getTemplate(id: string): WebsiteTemplate {
  return WEBSITE_TEMPLATES.find(t => t.id === id) || WEBSITE_TEMPLATES[0];
}

// ─── Nav Section ─────────────────────────────────────────────────
function PreviewNav({
  template, brandName, accentColor, textColor, bgColor
}: {
  template: WebsiteTemplate; brandName: string; accentColor: string; textColor: string; bgColor: string;
}) {
  const navItems = ['Home', 'Shop', 'Blog', 'About'];
  const tp = template.preview;
  const isUppercase = tp.typography.headingCase === 'uppercase';
  const isBold = template.id === 'bold';

  const navBg = isBold ? '#000000' : bgColor;
  const navText = isBold ? '#FFFFFF' : textColor;

  return (
    <div
      className="flex items-center justify-between px-4 py-2.5"
      style={{ backgroundColor: navBg, borderBottom: `1px solid ${template.colors.light.border}` }}
    >
      <span
        className="text-[10px] font-semibold truncate"
        style={{
          color: navText,
          fontFamily: template.fonts.heading,
          fontWeight: Number(template.fonts.headingWeight) || 600,
          letterSpacing: isBold ? '0.08em' : tp.typography.headingTracking,
          textTransform: isUppercase ? 'uppercase' : undefined,
        }}
      >
        {isUppercase ? brandName.toUpperCase() : brandName}
      </span>
      <div className="flex items-center gap-3">
        {navItems.map(item => (
          <span
            key={item}
            className="text-[7px] hidden sm:inline"
            style={{ color: `${navText}88`, fontFamily: template.fonts.body }}
          >
            {isUppercase ? item.toUpperCase() : item}
          </span>
        ))}
        <span
          className="text-[7px] px-2 py-0.5 font-medium"
          style={{
            backgroundColor: accentColor,
            color: getTextOnColor(accentColor),
            borderRadius: template.id === 'playful' ? '9999px' : template.id === 'bold' ? '0' : tp.borderRadius,
            fontFamily: template.fonts.body,
          }}
        >
          {isUppercase ? 'SHOP' : 'Shop'}
        </span>
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────
function PreviewHero({
  template, brandName, tagline, accentColor, textColor, bgColor
}: {
  template: WebsiteTemplate; brandName: string; tagline?: string; accentColor: string; textColor: string; bgColor: string;
}) {
  const tp = template.preview;
  const isUppercase = tp.typography.headingCase === 'uppercase';
  const isCentered = tp.heroStyle === 'centered' || tp.heroStyle === 'stacked';
  const headingText = tagline || `Welcome to ${brandName}`;
  const subText = `Discover what makes ${brandName} unique. Quality, craft, and attention to detail in everything we do.`;

  return (
    <div
      className={`px-4 ${tp.spacing === 'spacious' ? 'py-10' : tp.spacing === 'generous' ? 'py-8' : 'py-6'} ${isCentered ? 'text-center' : ''}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Accent label */}
      <div
        className={`text-[6px] font-semibold mb-2 tracking-wider ${isCentered ? 'mx-auto' : ''}`}
        style={{ color: accentColor, fontFamily: template.fonts.body, textTransform: 'uppercase', letterSpacing: '0.1em' }}
      >
        {isUppercase ? brandName.toUpperCase() : brandName}
      </div>

      {/* Heading */}
      <div
        className={`text-[14px] leading-tight mb-2 ${isCentered ? 'max-w-[80%] mx-auto' : 'max-w-[75%]'}`}
        style={{
          color: textColor,
          fontFamily: template.fonts.heading,
          fontWeight: Number(tp.typography.headingWeight) || Number(template.fonts.headingWeight) || 600,
          letterSpacing: tp.typography.headingTracking,
          textTransform: isUppercase ? 'uppercase' : undefined,
        }}
      >
        {isUppercase ? headingText.toUpperCase() : headingText}
      </div>

      {/* Subtext */}
      <div
        className={`text-[7px] leading-relaxed mb-4 ${isCentered ? 'max-w-[70%] mx-auto' : 'max-w-[65%]'}`}
        style={{
          color: `${textColor}99`,
          fontFamily: template.fonts.body,
        }}
      >
        {subText}
      </div>

      {/* CTA buttons */}
      <div className={`flex gap-2 ${isCentered ? 'justify-center' : ''}`}>
        <span
          className="text-[7px] px-3 py-1.5 font-medium inline-block"
          style={{
            backgroundColor: accentColor,
            color: getTextOnColor(accentColor),
            borderRadius: template.id === 'playful' ? '9999px' : template.id === 'bold' ? '0' : tp.borderRadius,
            fontFamily: template.fonts.body,
          }}
        >
          {isUppercase ? 'SHOP NOW' : 'Shop Now'}
        </span>
        <span
          className="text-[7px] px-3 py-1.5 font-medium inline-block"
          style={{
            border: `1px solid ${textColor}22`,
            color: textColor,
            borderRadius: template.id === 'playful' ? '9999px' : template.id === 'bold' ? '0' : tp.borderRadius,
            fontFamily: template.fonts.body,
          }}
        >
          {isUppercase ? 'LEARN MORE' : 'Learn More'}
        </span>
      </div>
    </div>
  );
}

// ─── Product Cards ───────────────────────────────────────────────
function PreviewProducts({
  template, products, accentColor, textColor, bgColor
}: {
  template: WebsiteTemplate;
  products: Array<{ name: string; price?: number; category?: string }>;
  accentColor: string; textColor: string; bgColor: string;
}) {
  const tp = template.preview;
  const isUppercase = tp.typography.headingCase === 'uppercase';
  const items = products.length > 0 ? products.slice(0, 3) : [
    { name: 'Product One', price: 49, category: 'Featured' },
    { name: 'Product Two', price: 79, category: 'New' },
    { name: 'Product Three', price: 99, category: 'Popular' },
  ];

  const cardBg = template.colors.light.surface;
  const borderColor = template.colors.light.border;

  const cardStyle = {
    minimal: { border: 'none', shadow: 'none', radius: tp.borderRadius },
    bordered: { border: `1px solid ${borderColor}`, shadow: 'none', radius: tp.borderRadius },
    elevated: { border: 'none', shadow: '0 2px 8px rgba(0,0,0,0.08)', radius: tp.borderRadius },
    flat: { border: 'none', shadow: 'none', radius: '0px' },
    rounded: { border: `1px solid ${borderColor}`, shadow: 'none', radius: '12px' },
  }[tp.cardStyle];

  return (
    <div
      className="px-4 py-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="text-[9px] font-semibold mb-3"
        style={{
          color: textColor,
          fontFamily: template.fonts.heading,
          fontWeight: Number(tp.typography.headingWeight) || 600,
          textTransform: isUppercase ? 'uppercase' : undefined,
          letterSpacing: isUppercase ? '0.06em' : tp.typography.headingTracking,
        }}
      >
        {isUppercase ? 'FEATURED PRODUCTS' : 'Featured Products'}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((p, i) => (
          <div
            key={i}
            style={{
              backgroundColor: cardBg,
              border: cardStyle.border,
              boxShadow: cardStyle.shadow,
              borderRadius: cardStyle.radius,
              overflow: 'hidden',
            }}
          >
            <div
              className="aspect-square"
              style={{ backgroundColor: `${textColor}08` }}
            />
            <div className="p-1.5">
              <div
                className="text-[7px] font-medium truncate"
                style={{
                  color: textColor,
                  fontFamily: template.fonts.body,
                  textTransform: isUppercase ? 'uppercase' : undefined,
                }}
              >
                {isUppercase ? p.name.toUpperCase() : p.name}
              </div>
              {p.price && (
                <div
                  className="text-[7px] font-semibold mt-0.5"
                  style={{ color: accentColor, fontFamily: template.fonts.body }}
                >
                  ${p.price}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Footer ──────────────────────────────────────────────────────
function PreviewFooter({ template, brandName, textColor }: { template: WebsiteTemplate; brandName: string; textColor: string }) {
  return (
    <div
      className="px-4 py-3 text-center"
      style={{
        backgroundColor: template.id === 'bold' ? '#000000' : template.colors.light.surface,
        borderTop: `1px solid ${template.colors.light.border}`,
      }}
    >
      <span
        className="text-[6px]"
        style={{ color: `${textColor}66`, fontFamily: template.fonts.body }}
      >
        © 2026 {brandName}. All rights reserved.
      </span>
    </div>
  );
}

// ─── Browser Chrome ──────────────────────────────────────────────
function BrowserChrome({ brandName }: { brandName: string }) {
  const slug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'brand';
  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-2 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex gap-1" aria-hidden="true">
        <div className="h-2 w-2 rounded-full bg-red-400" />
        <div className="h-2 w-2 rounded-full bg-yellow-400" />
        <div className="h-2 w-2 rounded-full bg-green-400" />
      </div>
      <div className="flex-1 flex justify-center">
        <div className="bg-white dark:bg-zinc-800 rounded px-2 py-0.5 text-[8px] text-zinc-400 flex items-center gap-1 min-w-[120px]">
          <Globe className="h-2 w-2" />
          {slug}.example.com
        </div>
      </div>
    </div>
  );
}

// ─── Device Toggle ───────────────────────────────────────────────
export function DeviceToggle({
  viewMode, onViewModeChange
}: {
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}) {
  const modes = [
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => onViewModeChange(m.id)}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === m.id
              ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white'
              : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
          }`}
          title={m.label}
          aria-label={`Preview ${m.label}`}
        >
          <m.icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

// ─── Main SitePreview Component ──────────────────────────────────
export default function SitePreview({
  brandName,
  tagline,
  templateId,
  primaryColor,
  secondaryColor,
  accentColor,
  fontHeading,
  fontBody,
  products = [],
  viewMode = 'desktop',
  showChrome = true,
  className = '',
}: SitePreviewProps) {
  const template = useMemo(() => getTemplate(templateId), [templateId]);

  // Use brand colors if provided, otherwise fall back to template defaults
  const colors = useMemo(() => {
    const c = template.colors.light;
    return {
      text: primaryColor || c.text,
      background: secondaryColor || c.background,
      accent: accentColor || c.accent,
    };
  }, [template, primaryColor, secondaryColor, accentColor]);

  // Merge font overrides
  const fonts = useMemo(() => ({
    heading: fontHeading || template.fonts.heading,
    body: fontBody || template.fonts.body,
  }), [template, fontHeading, fontBody]);

  // Override template fonts for rendering
  const renderTemplate = useMemo(() => ({
    ...template,
    fonts: { ...template.fonts, heading: fonts.heading, body: fonts.body },
  }), [template, fonts]);

  const containerWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };
  const containerWidth = containerWidths[viewMode];

  const name = brandName || 'Your Brand';

  return (
    <div className={`relative ${className}`}>
      <div
        className="mx-auto rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-lg transition-all duration-300"
        style={{ maxWidth: containerWidth }}
      >
        {showChrome && <BrowserChrome brandName={name} />}
        <div
          style={{
            backgroundColor: colors.background,
            fontFamily: fonts.body,
          }}
        >
          <PreviewNav
            template={renderTemplate}
            brandName={name}
            accentColor={colors.accent}
            textColor={colors.text}
            bgColor={colors.background}
          />
          <PreviewHero
            template={renderTemplate}
            brandName={name}
            tagline={tagline}
            accentColor={colors.accent}
            textColor={colors.text}
            bgColor={colors.background}
          />
          <PreviewProducts
            template={renderTemplate}
            products={products}
            accentColor={colors.accent}
            textColor={colors.text}
            bgColor={colors.background}
          />
          <PreviewFooter
            template={renderTemplate}
            brandName={name}
            textColor={colors.text}
          />
        </div>
      </div>
    </div>
  );
}
