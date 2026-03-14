'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Pipette, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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
export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Dark navy + gold',
    colors: { primary: '#0F172A', secondary: '#F8FAFC', accent: '#D4A84B', text: '#0F172A', muted: '#64748B', surface: '#FFFFFF', border: '#E2E8F0' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Blues + teal accent',
    colors: { primary: '#0C4A6E', secondary: '#F0F9FF', accent: '#0891B2', text: '#0C4A6E', muted: '#64748B', surface: '#FFFFFF', border: '#BAE6FD' },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep greens + warm cream',
    colors: { primary: '#14532D', secondary: '#FDF8F0', accent: '#16A34A', text: '#14532D', muted: '#6B7280', surface: '#FFFFFF', border: '#D1D5DB' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm oranges + deep purple',
    colors: { primary: '#431407', secondary: '#FFFBEB', accent: '#EA580C', text: '#431407', muted: '#78716C', surface: '#FFFFFF', border: '#FDE68A' },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Soft pinks + deep rose',
    colors: { primary: '#4C0519', secondary: '#FFF1F2', accent: '#E11D48', text: '#4C0519', muted: '#71717A', surface: '#FFFFFF', border: '#FECDD3' },
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Pure black/white/gray',
    colors: { primary: '#09090B', secondary: '#FAFAFA', accent: '#3F3F46', text: '#09090B', muted: '#71717A', surface: '#FFFFFF', border: '#E4E4E7' },
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Black + neon green/cyan',
    colors: { primary: '#000000', secondary: '#0A0A0A', accent: '#22D3EE', text: '#FAFAFA', muted: '#A1A1AA', surface: '#18181B', border: '#27272A' },
  },
  {
    id: 'earth',
    name: 'Earth',
    description: 'Terracotta + olive + cream',
    colors: { primary: '#44403C', secondary: '#FAFAF9', accent: '#B45309', text: '#292524', muted: '#78716C', surface: '#FFFFFF', border: '#D6D3D1' },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    description: 'Soft purples + warm gray',
    colors: { primary: '#3B0764', secondary: '#FAF5FF', accent: '#7C3AED', text: '#3B0764', muted: '#71717A', surface: '#FFFFFF', border: '#DDD6FE' },
  },
  {
    id: 'arctic',
    name: 'Arctic',
    description: 'Cool blues + white + steel',
    colors: { primary: '#1E3A5F', secondary: '#F8FAFC', accent: '#3B82F6', text: '#1E3A5F', muted: '#94A3B8', surface: '#FFFFFF', border: '#CBD5E1' },
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

// ─── Color Palette Presets ───────────────────────────────────────
export function ColorPalettePresets({
  activeId,
  onSelect,
}: {
  activeId?: string;
  onSelect: (palette: ColorPalette) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {COLOR_PALETTES.map(palette => {
        const isActive = activeId === palette.id;
        const colors = palette.colors;
        return (
          <motion.button
            key={palette.id}
            onClick={() => onSelect(palette)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative p-2.5 rounded-xl border-2 text-left transition-all',
              isActive
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10 shadow-sm'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            )}
          >
            {isActive && (
              <div className="absolute top-1.5 right-1.5">
                <Check className="h-3.5 w-3.5 text-violet-600" />
              </div>
            )}
            {/* Color swatch strip */}
            <div className="flex h-5 rounded-md overflow-hidden mb-2">
              {[colors.primary, colors.secondary, colors.accent, colors.text, colors.muted, colors.surface, colors.border].map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{palette.name}</p>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate">{palette.description}</p>
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

      {/* Live color preview */}
      <ColorSchemePreview colors={colors} />
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
              style={{ backgroundColor: colors.accent, color: '#FFFFFF' }}
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
            style={{ backgroundColor: colors.accent, color: '#FFFFFF' }}
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
