'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pipette, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTextOnColor, validateColorSystem, type ContrastIssue } from '@/lib/color-utils';

// ─── Types ───────────────────────────────────────────────────────
export interface ColorSystem {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  muted: string;
  surface: string;
  border: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: ColorSystem;
}

// ─── Preset Palettes ─────────────────────────────────────────────
// All palettes validated for WCAG AA contrast:
// - text on secondary (bg): ≥4.5:1
// - muted on secondary: ≥3:1
// - surface vs secondary: ≥5% lightness difference
// - border visible against surface AND secondary
// - accent works as button bg with auto text color
export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark navy + gold',
    colors: { primary: '#0F172A', secondary: '#F8FAFC', accent: '#B8922E', text: '#0F172A', muted: '#64748B', surface: '#E8ECF2', border: '#CDD4E0' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Blues + teal accent',
    colors: { primary: '#0C4A6E', secondary: '#F0F9FF', accent: '#0891B2', text: '#0C4A6E', muted: '#546E7A', surface: '#DAEDF8', border: '#9ECEE8' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep greens + warm cream',
    colors: { primary: '#14532D', secondary: '#FDF8F0', accent: '#15803D', text: '#14532D', muted: '#5C6560', surface: '#F2E9D8', border: '#C5BFAB' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges + deep purple',
    colors: { primary: '#431407', secondary: '#FFFBEB', accent: '#D9520A', text: '#431407', muted: '#78716C', surface: '#F5EDD4', border: '#E5D5A0' },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Soft pinks + deep rose',
    colors: { primary: '#4C0519', secondary: '#FFF1F2', accent: '#E11D48', text: '#4C0519', muted: '#71717A', surface: '#FADCE0', border: '#F0B8C0' },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Pure black/white/gray',
    colors: { primary: '#09090B', secondary: '#FAFAFA', accent: '#3F3F46', text: '#09090B', muted: '#71717A', surface: '#EBEBEB', border: '#D4D4D8' },
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Black + neon green/cyan',
    colors: { primary: '#000000', secondary: '#0A0A0A', accent: '#06B6D4', text: '#F4F4F5', muted: '#A1A1AA', surface: '#1E1E2E', border: '#333347' },
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Terracotta + olive + cream',
    colors: { primary: '#44403C', secondary: '#FAFAF9', accent: '#A34A09', text: '#292524', muted: '#78716C', surface: '#EDEBE7', border: '#C8C3BC' },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purples + warm gray',
    colors: { primary: '#3B0764', secondary: '#FAF5FF', accent: '#7C3AED', text: '#3B0764', muted: '#71717A', surface: '#EBDFF6', border: '#C9B8E8' },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    description: 'Cool blues + white + steel',
    colors: { primary: '#1E3A5F', secondary: '#F8FAFC', accent: '#2563EB', text: '#1E3A5F', muted: '#6B7F99', surface: '#E5EBF2', border: '#B8C8D8' },
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Warm coral + turquoise + sand',
    colors: { primary: '#B83B5E', secondary: '#FFF5F0', accent: '#0E8A96', text: '#3D1C2F', muted: '#887070', surface: '#F5E8E0', border: '#E0C8BE' },
  },
  {
    id: 'studio',
    name: 'Studio',
    description: 'Charcoal + warm white + sienna',
    colors: { primary: '#2D2D2D', secondary: '#FAF8F5', accent: '#C75B2A', text: '#1A1A1A', muted: '#7A7A7A', surface: '#EDE8E2', border: '#D4CEC6' },
  },
  {
    id: 'minimal-ink',
    name: 'Minimal Ink',
    description: 'Near-black + white + blue accent',
    colors: { primary: '#111111', secondary: '#FFFFFF', accent: '#2563EB', text: '#111111', muted: '#6B7280', surface: '#F0F1F3', border: '#D1D5DB' },
  },
  {
    id: 'candy',
    name: 'Candy',
    description: 'Bright pink + cyan + warm yellow',
    colors: { primary: '#C4167A', secondary: '#FFF8FC', accent: '#0891B2', text: '#1F1235', muted: '#887098', surface: '#F7DFEC', border: '#E8B8D4' },
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Sepia + parchment + olive green',
    colors: { primary: '#5C3D2E', secondary: '#F5F0E1', accent: '#5A6E30', text: '#3C2A1E', muted: '#8B7D6B', surface: '#FFFDF7', border: '#D0C8B4' },
  },
  {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Dark gray + black + electric blue',
    colors: { primary: '#0A0A0F', secondary: '#0F0F17', accent: '#3B82F6', text: '#E2E8F0', muted: '#8090A8', surface: '#1C1C30', border: '#2A3550' },
  },
];

// ─── Color Swatch Input ──────────────────────────────────────────
function ColorInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (color: string) => void;
  label: string;
}) {
  const [editing, setEditing] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexSubmit = () => {
    const cleaned = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) {
      onChange(cleaned);
    } else {
      setHexInput(value);
    }
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2.5 group">
      <div className="relative">
        <input
          type="color"
          value={value}
          onChange={e => { onChange(e.target.value); setHexInput(e.target.value); }}
          className="h-9 w-9 rounded-lg cursor-pointer border border-zinc-200 dark:border-zinc-700 shadow-sm"
          style={{ padding: 0 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-0.5">{label}</p>
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={hexInput}
            onChange={e => setHexInput(e.target.value)}
            onBlur={handleHexSubmit}
            onKeyDown={e => e.key === 'Enter' && handleHexSubmit()}
            className="w-full px-1.5 py-0.5 text-xs font-mono bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded outline-none focus:ring-1 focus:ring-violet-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-xs font-mono text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            {value}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Mini Website Thumbnail for Palette ──────────────────────────
function PaletteMiniSite({ colors }: { colors: ColorSystem }) {
  const isDark = isColorDark(colors.secondary);
  const textColor = isDark ? '#FFFFFF' : colors.text;
  const navBg = isDark ? colors.primary : colors.text;
  const navText = isDark ? '#FFFFFF' : colors.secondary;

  return (
    <div className="rounded overflow-hidden" style={{ backgroundColor: colors.secondary }}>
      {/* Tiny nav */}
      <div
        className="flex items-center justify-between px-1.5 py-1"
        style={{ backgroundColor: navBg }}
      >
        <div className="h-1 w-4 rounded-sm" style={{ backgroundColor: navText, opacity: 0.9 }} />
        <div className="flex gap-0.5 items-center">
          <div className="h-0.5 w-2 rounded-sm" style={{ backgroundColor: navText, opacity: 0.4 }} />
          <div className="h-0.5 w-2 rounded-sm" style={{ backgroundColor: navText, opacity: 0.4 }} />
          <div
            className="h-2 w-3 rounded-sm"
            style={{ backgroundColor: colors.accent, opacity: 0.9 }}
          />
        </div>
      </div>
      {/* Tiny hero */}
      <div className="px-1.5 py-2 text-center">
        <div className="h-1 w-8 mx-auto rounded-sm mb-0.5" style={{ backgroundColor: textColor, opacity: 0.8 }} />
        <div className="h-0.5 w-6 mx-auto rounded-sm mb-1" style={{ backgroundColor: colors.muted, opacity: 0.5 }} />
        <div className="h-2 w-5 mx-auto rounded-sm" style={{ backgroundColor: colors.accent }} />
      </div>
      {/* Tiny cards */}
      <div className="px-1 pb-1 grid grid-cols-3 gap-0.5">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="p-0.5 rounded-sm"
            style={{ backgroundColor: colors.surface, border: `0.5px solid ${colors.border}` }}
          >
            <div className="h-2 rounded-sm mb-0.5" style={{ backgroundColor: `${colors.muted}15` }} />
            <div className="h-0.5 w-3/4 rounded-sm" style={{ backgroundColor: textColor, opacity: 0.15 }} />
          </div>
        ))}
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

// ─── Color Palette Presets ───────────────────────────────────────
export function ColorPalettePresets({
  activeId,
  onSelect,
  compact,
}: {
  activeId?: string;
  onSelect: (palette: ColorPalette) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn('grid gap-2', compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-4')}>
      {COLOR_PALETTES.map(palette => {
        const isActive = activeId === palette.id;
        return (
          <motion.button
            key={palette.id}
            onClick={() => onSelect(palette)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative p-2 rounded-xl border-2 text-left transition-all',
              isActive
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            )}
          >
            {isActive && (
              <div className="absolute top-1.5 right-1.5 z-10">
                <Check className="h-3.5 w-3.5 text-violet-600" />
              </div>
            )}
            {/* Mini website thumbnail */}
            <div className="mb-1.5">
              <PaletteMiniSite colors={palette.colors} />
            </div>
            <p className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200 truncate">{palette.name}</p>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate">{palette.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Full Color System Editor ────────────────────────────────────
export function ColorSystemEditor({
  colors,
  onChange,
  onPaletteSelect,
  activePaletteId,
}: {
  colors: ColorSystem;
  onChange: (colors: ColorSystem) => void;
  onPaletteSelect?: (palette: ColorPalette) => void;
  activePaletteId?: string;
}) {
  const handleChange = useCallback((key: keyof ColorSystem, value: string) => {
    onChange({ ...colors, [key]: value });
  }, [colors, onChange]);

  const COLOR_FIELDS: { key: keyof ColorSystem; label: string }[] = [
    { key: 'primary', label: 'Primary' },
    { key: 'secondary', label: 'Background' },
    { key: 'accent', label: 'Accent' },
    { key: 'text', label: 'Text' },
    { key: 'muted', label: 'Muted' },
    { key: 'surface', label: 'Surface' },
    { key: 'border', label: 'Border' },
  ];

  return (
    <div className="space-y-5">
      {/* Preset palettes */}
      {onPaletteSelect && (
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
            Preset Palettes
          </p>
          <ColorPalettePresets activeId={activePaletteId} onSelect={onPaletteSelect} />
        </div>
      )}

      {/* Individual color controls */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
          Custom Colors
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COLOR_FIELDS.map(({ key, label }) => (
            <ColorInput
              key={key}
              value={colors[key]}
              onChange={v => handleChange(key, v)}
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Accessibility warning */}
      <ContrastWarning colors={colors} />

      {/* Live color preview */}
      <ColorSchemePreview colors={colors} />
    </div>
  );
}

// ─── Contrast Warning Banner ─────────────────────────────────────
function ContrastWarning({ colors }: { colors: ColorSystem }) {
  const issues = validateColorSystem(colors);
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');

  if (issues.length === 0) return null;

  return (
    <div
      className={cn(
        'rounded-lg p-3 text-xs',
        errors.length > 0
          ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
      )}
    >
      <div className="flex items-start gap-2">
        <span className="text-sm flex-shrink-0">
          {errors.length > 0 ? '⚠️' : 'ℹ️'}
        </span>
        <div>
          <p className={cn(
            'font-medium mb-1',
            errors.length > 0
              ? 'text-amber-800 dark:text-amber-200'
              : 'text-blue-800 dark:text-blue-200',
          )}>
            {errors.length > 0
              ? 'Low contrast — colors will be auto-adjusted for readability'
              : 'Minor contrast suggestions'}
          </p>
          <ul className={cn(
            'space-y-0.5',
            errors.length > 0
              ? 'text-amber-700 dark:text-amber-300'
              : 'text-blue-700 dark:text-blue-300',
          )}>
            {issues.map((issue, i) => (
              <li key={i}>• {issue.message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Color Scheme Preview (mini website mockup) ──────────────────
export function ColorSchemePreview({ colors }: { colors: ColorSystem }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 px-4 pt-3 pb-2">
        Color Preview
      </p>
      <div className="mx-3 mb-3 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-700" style={{ backgroundColor: colors.secondary }}>
        {/* Nav */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded flex items-center justify-center text-[8px] font-bold"
              style={{ backgroundColor: colors.accent, color: getTextOnColor(colors.accent) }}
            >
              B
            </div>
            <span className="text-[10px] font-medium" style={{ color: colors.secondary }}>
              Brand
            </span>
          </div>
          <div className="flex gap-3">
            {['Home', 'Shop', 'About'].map(t => (
              <span key={t} className="text-[8px]" style={{ color: `${colors.secondary}88` }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="px-4 py-5 text-center" style={{ backgroundColor: colors.secondary }}>
          <h3 className="text-sm font-bold mb-1" style={{ color: colors.text }}>
            Welcome to Your Brand
          </h3>
          <p className="text-[10px] mb-3" style={{ color: colors.muted }}>
            The perfect design for your audience.
          </p>
          <button
            className="px-3 py-1 rounded text-[9px] font-medium"
            style={{ backgroundColor: colors.accent, color: getTextOnColor(colors.accent) }}
          >
            Get Started
          </button>
        </div>

        {/* Cards */}
        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="p-2 rounded"
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className="h-6 rounded mb-1.5"
                style={{ backgroundColor: `${colors.muted}15` }}
              />
              <div className="h-1.5 w-3/4 rounded" style={{ backgroundColor: colors.text, opacity: 0.15 }} />
              <div className="h-1 w-1/2 rounded mt-1" style={{ backgroundColor: colors.muted, opacity: 0.2 }} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-2 text-center"
          style={{ backgroundColor: colors.primary }}
        >
          <span className="text-[8px]" style={{ color: `${colors.secondary}55` }}>
            © 2026 Brand · Powered by Mayasura
          </span>
        </div>
      </div>
    </div>
  );
}
