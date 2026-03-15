/**
 * Color accessibility utilities for WCAG contrast enforcement.
 * Ensures all palette/template combinations produce readable, visible UI.
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */

import type { ColorSystem } from '@/components/design/color-system';

// ─── Core Color Math ─────────────────────────────────────────────

/** Parse a hex color string to RGB components (0–255). */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
}

/** Convert RGB (0–255) back to hex. */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    [clamp(r), clamp(g), clamp(b)]
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/** Convert hex to HSL (h: 0–360, s: 0–100, l: 0–100). */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r: r8, g: g8, b: b8 } = hexToRgb(hex);
  const r = r8 / 255;
  const g = g8 / 255;
  const b = b8 / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: l * 100 };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return { h: h * 360, s: s * 100, l: l * 100 };
}

/** Convert HSL (h: 0–360, s: 0–100, l: 0–100) to hex. */
export function hslToHex(h: number, s: number, l: number): string {
  const s1 = s / 100;
  const l1 = l / 100;
  const c = (1 - Math.abs(2 * l1 - 1)) * s1;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l1 - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

// ─── WCAG Contrast Calculations ──────────────────────────────────

/**
 * Calculate the relative luminance of a hex color per WCAG 2.1.
 * Returns a value between 0 (black) and 1 (white).
 */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rL, gL, bL] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Calculate the WCAG contrast ratio between two colors.
 * Returns a value between 1 (identical) and 21 (black/white).
 */
export function contrastRatio(color1: string, color2: string): number {
  const l1 = luminance(color1);
  const l2 = luminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if text is readable on a background (WCAG AA: ≥4.5:1 for normal text).
 */
export function isReadable(textColor: string, bgColor: string, threshold = 4.5): boolean {
  return contrastRatio(textColor, bgColor) >= threshold;
}

/**
 * Check if a color is perceptually dark (luminance < 0.5 using simplified formula).
 */
export function isColorDark(hex: string): boolean {
  return luminance(hex) < 0.18; // Threshold tuned for practical dark detection
}

/**
 * Get the best text color (black or white) for a given background, 
 * choosing whichever gives better contrast.
 */
export function getTextOnColor(bgColor: string): '#FFFFFF' | '#000000' {
  const whiteContrast = contrastRatio('#FFFFFF', bgColor);
  const blackContrast = contrastRatio('#000000', bgColor);
  return whiteContrast >= blackContrast ? '#FFFFFF' : '#000000';
}

// ─── Color Adjustment Helpers ────────────────────────────────────

/** Lighten a hex color by a percentage (0–100). */
export function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.min(100, l + amount));
}

/** Darken a hex color by a percentage (0–100). */
export function darken(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex);
  return hslToHex(h, s, Math.max(0, l - amount));
}

/**
 * Adjust a foreground color to meet a minimum contrast ratio against a background.
 * Tries lightening or darkening depending on background luminance.
 */
export function ensureContrast(
  fgColor: string,
  bgColor: string,
  minRatio: number,
): string {
  if (contrastRatio(fgColor, bgColor) >= minRatio) return fgColor;

  const bgLum = luminance(bgColor);
  const shouldLighten = bgLum < 0.5; // Dark bg → lighten text
  let adjusted = fgColor;

  // Step in small increments
  for (let step = 1; step <= 100; step++) {
    adjusted = shouldLighten ? lighten(fgColor, step) : darken(fgColor, step);
    if (contrastRatio(adjusted, bgColor) >= minRatio) return adjusted;
  }

  // Fallback: use white or black
  return shouldLighten ? '#FFFFFF' : '#000000';
}

// ─── Color System Validation ─────────────────────────────────────

export interface ContrastIssue {
  type: 'error' | 'warning';
  field: string;
  message: string;
  ratio: number;
  required: number;
}

/**
 * Validate a full color system and return all accessibility issues.
 */
export function validateColorSystem(colors: ColorSystem): ContrastIssue[] {
  const issues: ContrastIssue[] = [];

  // 1. Text on background (WCAG AA = 4.5:1)
  const textOnBg = contrastRatio(colors.text, colors.secondary);
  if (textOnBg < 4.5) {
    issues.push({
      type: 'error',
      field: 'text',
      message: `Text on background: ${textOnBg.toFixed(1)}:1 (need ≥4.5:1)`,
      ratio: textOnBg,
      required: 4.5,
    });
  }

  // 2. Muted text on background (WCAG AA large text = 3:1)
  const mutedOnBg = contrastRatio(colors.muted, colors.secondary);
  if (mutedOnBg < 3) {
    issues.push({
      type: 'error',
      field: 'muted',
      message: `Muted text on background: ${mutedOnBg.toFixed(1)}:1 (need ≥3:1)`,
      ratio: mutedOnBg,
      required: 3,
    });
  }

  // 3. Surface vs background distinctness (lightness difference ≥ 10%)
  const surfaceHsl = hexToHsl(colors.surface);
  const bgHsl = hexToHsl(colors.secondary);
  const lightnessDiff = Math.abs(surfaceHsl.l - bgHsl.l);
  if (lightnessDiff < 5) {
    issues.push({
      type: 'warning',
      field: 'surface',
      message: `Surface too close to background (${lightnessDiff.toFixed(0)}% lightness diff, need ≥5%)`,
      ratio: lightnessDiff,
      required: 5,
    });
  }

  // 4. Border visibility against both surface and background
  const borderOnSurface = contrastRatio(colors.border, colors.surface);
  const borderOnBg = contrastRatio(colors.border, colors.secondary);
  if (borderOnSurface < 1.3 && borderOnBg < 1.3) {
    issues.push({
      type: 'warning',
      field: 'border',
      message: `Border invisible (${borderOnSurface.toFixed(1)}:1 on surface, ${borderOnBg.toFixed(1)}:1 on bg)`,
      ratio: Math.max(borderOnSurface, borderOnBg),
      required: 1.3,
    });
  }

  // 5. Text on surface (cards)
  const textOnSurface = contrastRatio(colors.text, colors.surface);
  if (textOnSurface < 4.5) {
    issues.push({
      type: 'error',
      field: 'text',
      message: `Text on surface: ${textOnSurface.toFixed(1)}:1 (need ≥4.5:1)`,
      ratio: textOnSurface,
      required: 4.5,
    });
  }

  // 6. Muted text on surface
  const mutedOnSurface = contrastRatio(colors.muted, colors.surface);
  if (mutedOnSurface < 3) {
    issues.push({
      type: 'warning',
      field: 'muted',
      message: `Muted text on surface: ${mutedOnSurface.toFixed(1)}:1 (need ≥3:1)`,
      ratio: mutedOnSurface,
      required: 3,
    });
  }

  // 7. Accent as button bg — check readability with white or black text
  const accentTextWhite = contrastRatio('#FFFFFF', colors.accent);
  const accentTextBlack = contrastRatio('#000000', colors.accent);
  if (accentTextWhite < 3 && accentTextBlack < 3) {
    issues.push({
      type: 'warning',
      field: 'accent',
      message: `Accent button needs contrast fix (white: ${accentTextWhite.toFixed(1)}:1, black: ${accentTextBlack.toFixed(1)}:1)`,
      ratio: Math.max(accentTextWhite, accentTextBlack),
      required: 3,
    });
  }

  return issues;
}

/**
 * Auto-fix a color system to ensure minimum contrast requirements.
 * Returns a new color system with adjusted colors.
 * Preserves the palette's vibe while ensuring readability.
 */
export function autoFixColorSystem(colors: ColorSystem): ColorSystem {
  const fixed = { ...colors };
  const bgIsDark = isColorDark(fixed.secondary);

  // 1. Fix text contrast on background (≥4.5:1)
  if (!isReadable(fixed.text, fixed.secondary, 4.5)) {
    fixed.text = ensureContrast(fixed.text, fixed.secondary, 4.5);
  }

  // 2. Fix muted text contrast on background (≥3:1)
  if (!isReadable(fixed.muted, fixed.secondary, 3)) {
    fixed.muted = ensureContrast(fixed.muted, fixed.secondary, 3);
  }

  // 3. Fix surface vs background distinctness
  const surfaceHsl = hexToHsl(fixed.surface);
  const bgHsl = hexToHsl(fixed.secondary);
  const lightnessDiff = Math.abs(surfaceHsl.l - bgHsl.l);
  if (lightnessDiff < 5) {
    // Push surface away from background
    if (bgIsDark) {
      // Dark bg: make surface lighter
      fixed.surface = hslToHex(
        surfaceHsl.h,
        surfaceHsl.s,
        Math.min(100, bgHsl.l + 8),
      );
    } else {
      // Light bg: make surface slightly different (could be lighter or darker)
      if (bgHsl.l > 95) {
        fixed.surface = hslToHex(surfaceHsl.h, surfaceHsl.s, bgHsl.l - 5);
      } else {
        fixed.surface = hslToHex(surfaceHsl.h, surfaceHsl.s, Math.min(100, bgHsl.l + 5));
      }
    }
  }

  // 4. Fix border visibility
  const borderOnSurface = contrastRatio(fixed.border, fixed.surface);
  const borderOnBg = contrastRatio(fixed.border, fixed.secondary);
  if (borderOnSurface < 1.3 && borderOnBg < 1.3) {
    const borderHsl = hexToHsl(fixed.border);
    if (bgIsDark) {
      // Dark theme: make border lighter
      fixed.border = hslToHex(borderHsl.h, borderHsl.s, Math.min(100, borderHsl.l + 12));
    } else {
      // Light theme: make border darker
      fixed.border = hslToHex(borderHsl.h, borderHsl.s, Math.max(0, borderHsl.l - 12));
    }
  }

  // 5. Ensure text is readable on fixed surface
  if (!isReadable(fixed.text, fixed.surface, 4.5)) {
    fixed.text = ensureContrast(fixed.text, fixed.surface, 4.5);
  }

  // 6. Ensure muted text is readable on fixed surface
  if (!isReadable(fixed.muted, fixed.surface, 3)) {
    fixed.muted = ensureContrast(fixed.muted, fixed.surface, 3);
  }

  return fixed;
}

/**
 * Check if a color system has any errors (not just warnings).
 */
export function hasContrastErrors(colors: ColorSystem): boolean {
  return validateColorSystem(colors).some((i) => i.type === 'error');
}

/**
 * Get a human-readable summary of contrast issues.
 */
export function getContrastSummary(colors: ColorSystem): string[] {
  return validateColorSystem(colors).map((i) => i.message);
}
