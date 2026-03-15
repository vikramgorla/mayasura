/**
 * Design Settings — Shared constants and helpers for the Design Studio
 * and consumer site to ensure preview-to-reality consistency.
 *
 * Both `template-preview.tsx` and `site/[slug]/layout.tsx` use these
 * maps so that the same settings produce identical visual results.
 *
 * Resolves #93
 */

import { getTextOnColor } from '@/lib/color-utils';

// ─── Button Shape ────────────────────────────────────────────────
export type ButtonShape = 'sharp' | 'soft' | 'rounded' | 'pill';

export const BUTTON_SHAPE_MAP: Record<ButtonShape, string> = {
  sharp: '0px',
  soft: '4px',
  rounded: '8px',
  pill: '9999px',
};

// ─── Button Size ─────────────────────────────────────────────────
export type ButtonSize = 'small' | 'medium' | 'large';

export const BUTTON_SIZE_MAP: Record<ButtonSize, { px: string; py: string; fontSize: string }> = {
  small: { px: '12px', py: '6px', fontSize: '11px' },
  medium: { px: '20px', py: '10px', fontSize: '13px' },
  large: { px: '28px', py: '14px', fontSize: '15px' },
};

// ─── Button Variant ──────────────────────────────────────────────
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

// ─── Spacing Density ─────────────────────────────────────────────
export type SpacingDensity = 'compact' | 'normal' | 'generous' | 'spacious';

export const SPACING_MAP: Record<SpacingDensity, { sectionPadding: string; cardGap: string; sectionPaddingPx: number }> = {
  compact: { sectionPadding: '32px', cardGap: '12px', sectionPaddingPx: 32 },
  normal: { sectionPadding: '48px', cardGap: '16px', sectionPaddingPx: 48 },
  generous: { sectionPadding: '64px', cardGap: '20px', sectionPaddingPx: 64 },
  spacious: { sectionPadding: '96px', cardGap: '24px', sectionPaddingPx: 96 },
};

// ─── Border Radius ───────────────────────────────────────────────
export type BorderRadiusPreset = 'none' | 'subtle' | 'rounded' | 'extra-rounded' | 'pill';

export const BORDER_RADIUS_MAP: Record<BorderRadiusPreset, string> = {
  none: '0px',
  subtle: '4px',
  rounded: '8px',
  'extra-rounded': '16px',
  pill: '9999px',
};

// ─── Resolved Design Settings ────────────────────────────────────
export interface ResolvedDesignSettings {
  textColor: string;
  mutedColor: string;
  surfaceColor: string;
  borderColor: string;
  buttonShape: ButtonShape;
  buttonSize: ButtonSize;
  buttonVariant: ButtonVariant;
  spacingDensity: SpacingDensity;
  borderRadius: BorderRadiusPreset;
}

/**
 * Resolve design settings from brand_settings record.
 * Falls back to sensible defaults matching the "normal/rounded" preset.
 */
export function resolveDesignSettings(
  settings: Record<string, string> | undefined,
  fallbackTextColor: string,
): ResolvedDesignSettings {
  const s = settings || {};
  return {
    textColor: s.text_color || fallbackTextColor,
    mutedColor: s.muted_color || '#64748b',
    surfaceColor: s.surface_color || '#ffffff',
    borderColor: s.border_color || '#e2e8f0',
    buttonShape: (s.button_shape as ButtonShape) || 'rounded',
    buttonSize: (s.button_size as ButtonSize) || 'medium',
    buttonVariant: (s.button_variant as ButtonVariant) || 'solid',
    spacingDensity: (s.spacing_density as SpacingDensity) || 'normal',
    borderRadius: (s.border_radius as BorderRadiusPreset) || 'rounded',
  };
}

/**
 * Generate CSS custom properties from resolved design settings.
 * These are applied to the consumer site root element.
 */
export function designSettingsToCSSVars(
  ds: ResolvedDesignSettings,
  primaryColor: string,
  secondaryColor: string,
  accentColor: string,
): Record<string, string> {
  const sp = SPACING_MAP[ds.spacingDensity];
  const rad = BORDER_RADIUS_MAP[ds.borderRadius];
  const btnRad = BUTTON_SHAPE_MAP[ds.buttonShape];
  const btnSize = BUTTON_SIZE_MAP[ds.buttonSize];

  return {
    '--brand-primary': primaryColor,
    '--brand-secondary': secondaryColor,
    '--brand-accent': accentColor,
    '--brand-accent-text': getTextOnColor(accentColor),
    '--brand-text': ds.textColor,
    '--brand-muted': ds.mutedColor,
    '--brand-surface': ds.surfaceColor,
    '--brand-border': ds.borderColor,
    '--brand-radius': rad,
    '--brand-button-radius': btnRad,
    '--brand-button-px': btnSize.px,
    '--brand-button-py': btnSize.py,
    '--brand-button-font-size': btnSize.fontSize,
    '--brand-section-padding': sp.sectionPadding,
    '--brand-card-gap': sp.cardGap,
  };
}

/**
 * Get button CSS properties for primary CTA buttons.
 */
export function getPrimaryButtonStyle(
  ds: ResolvedDesignSettings,
  accentColor: string,
): React.CSSProperties {
  const btnRad = BUTTON_SHAPE_MAP[ds.buttonShape];
  const btnSize = BUTTON_SIZE_MAP[ds.buttonSize];
  const base: React.CSSProperties = {
    borderRadius: btnRad,
    padding: `${btnSize.py} ${btnSize.px}`,
    fontSize: btnSize.fontSize,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2,
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
  };

  if (ds.buttonVariant === 'solid') {
    return { ...base, backgroundColor: accentColor, color: getTextOnColor(accentColor), border: 'none' };
  }
  if (ds.buttonVariant === 'outline') {
    return { ...base, backgroundColor: 'transparent', color: accentColor, border: `1.5px solid ${accentColor}` };
  }
  // ghost
  return { ...base, backgroundColor: `${accentColor}12`, color: accentColor, border: 'none' };
}

/**
 * Get button CSS properties for secondary/outline buttons.
 */
export function getSecondaryButtonStyle(
  ds: ResolvedDesignSettings,
  textColor: string,
): React.CSSProperties {
  const btnRad = BUTTON_SHAPE_MAP[ds.buttonShape];
  const btnSize = BUTTON_SIZE_MAP[ds.buttonSize];
  return {
    borderRadius: btnRad,
    padding: `${btnSize.py} ${btnSize.px}`,
    fontSize: btnSize.fontSize,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1.2,
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap' as const,
    transition: 'all 0.15s ease',
    backgroundColor: 'transparent',
    border: `1.5px solid ${textColor}25`,
    color: textColor,
  };
}
