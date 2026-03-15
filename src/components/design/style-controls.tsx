'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { getTextOnColor } from '@/lib/color-utils';

// ─── Button Style Types ──────────────────────────────────────────
export type ButtonShape = 'rounded' | 'pill' | 'sharp' | 'soft';
export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

export interface ButtonStyleConfig {
  shape: ButtonShape;
  size: ButtonSize;
  variant: ButtonVariant;
}

// ─── Spacing / Density ───────────────────────────────────────────
export type SpacingDensity = 'compact' | 'normal' | 'generous' | 'spacious';

// ─── Border Radius ───────────────────────────────────────────────
export type BorderRadiusPreset = 'none' | 'subtle' | 'rounded' | 'extra-rounded' | 'pill';

export const BORDER_RADIUS_VALUES: Record<BorderRadiusPreset, string> = {
  'none': '0px',
  'subtle': '4px',
  'rounded': '8px',
  'extra-rounded': '16px',
  'pill': '9999px',
};

// ─── Design Settings (combined) ──────────────────────────────────
export interface DesignSettings {
  buttonShape: ButtonShape;
  buttonSize: ButtonSize;
  buttonVariant: ButtonVariant;
  spacing: SpacingDensity;
  borderRadius: BorderRadiusPreset;
}

export const DEFAULT_DESIGN_SETTINGS: DesignSettings = {
  buttonShape: 'rounded',
  buttonSize: 'medium',
  buttonVariant: 'solid',
  spacing: 'normal',
  borderRadius: 'rounded',
};

// ─── Button Style Editor ─────────────────────────────────────────
export function ButtonStyleEditor({
  shape,
  size,
  variant,
  onShapeChange,
  onSizeChange,
  onVariantChange,
  accentColor = '#6366F1',
}: {
  shape: ButtonShape;
  size: ButtonSize;
  variant: ButtonVariant;
  onShapeChange: (shape: ButtonShape) => void;
  onSizeChange: (size: ButtonSize) => void;
  onVariantChange: (variant: ButtonVariant) => void;
  accentColor?: string;
}) {
  const shapes: { id: ButtonShape; label: string; radius: string }[] = [
    { id: 'sharp', label: 'Sharp', radius: '0px' },
    { id: 'soft', label: 'Soft', radius: '4px' },
    { id: 'rounded', label: 'Rounded', radius: '8px' },
    { id: 'pill', label: 'Pill', radius: '9999px' },
  ];

  const sizes: { id: ButtonSize; label: string }[] = [
    { id: 'small', label: 'S' },
    { id: 'medium', label: 'M' },
    { id: 'large', label: 'L' },
  ];

  const variants: { id: ButtonVariant; label: string }[] = [
    { id: 'solid', label: 'Solid' },
    { id: 'outline', label: 'Outline' },
    { id: 'ghost', label: 'Ghost' },
  ];

  const getButtonRadius = () => {
    const found = shapes.find(s => s.id === shape);
    return found?.radius || '8px';
  };

  const getButtonPadding = () => {
    if (size === 'small') return '0.375rem 0.875rem';
    if (size === 'large') return '0.75rem 2rem';
    return '0.5rem 1.25rem';
  };

  const getButtonFontSize = () => {
    if (size === 'small') return '0.75rem';
    if (size === 'large') return '0.9375rem';
    return '0.8125rem';
  };

  const getButtonStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: getButtonRadius(),
      padding: getButtonPadding(),
      fontSize: getButtonFontSize(),
      fontWeight: 500,
      transition: 'all 0.2s',
    };
    if (variant === 'solid') {
      return { ...base, backgroundColor: accentColor, color: getTextOnColor(accentColor), border: 'none' };
    }
    if (variant === 'outline') {
      return { ...base, backgroundColor: 'transparent', color: accentColor, border: `2px solid ${accentColor}` };
    }
    // ghost
    return { ...base, backgroundColor: `${accentColor}12`, color: accentColor, border: 'none' };
  };

  return (
    <div className="space-y-4">
      {/* Shape */}
      <div>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">Shape</p>
        <div className="flex gap-1.5">
          {shapes.map(s => (
            <button
              key={s.id}
              onClick={() => onShapeChange(s.id)}
              className={cn(
                'flex-1 px-3 py-2 text-xs font-medium border-2 transition-all',
                shape === s.id
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'
              )}
              style={{ borderRadius: s.radius }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">Size</p>
        <div className="flex gap-1.5">
          {sizes.map(s => (
            <button
              key={s.id}
              onClick={() => onSizeChange(s.id)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                size === s.id
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Variant */}
      <div>
        <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-2">Style</p>
        <div className="flex gap-1.5">
          {variants.map(v => (
            <button
              key={v.id}
              onClick={() => onVariantChange(v.id)}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                variant === v.id
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300'
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live preview */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center gap-4">
        <button style={getButtonStyle()}>
          Get Started
        </button>
        <button style={{ ...getButtonStyle(), ...(variant === 'solid' ? { backgroundColor: `${accentColor}88` } : {}) }}>
          Learn More
        </button>
      </div>
    </div>
  );
}

// ─── Spacing / Density Editor ────────────────────────────────────
export function SpacingEditor({
  value,
  onChange,
}: {
  value: SpacingDensity;
  onChange: (spacing: SpacingDensity) => void;
}) {
  const options: { id: SpacingDensity; label: string; desc: string; bars: number[] }[] = [
    { id: 'compact', label: 'Compact', desc: 'Tight spacing', bars: [2, 3, 2] },
    { id: 'normal', label: 'Normal', desc: 'Balanced', bars: [3, 4, 3] },
    { id: 'generous', label: 'Generous', desc: 'Extra room', bars: [4, 6, 4] },
    { id: 'spacious', label: 'Spacious', desc: 'Maximum breathing room', bars: [6, 8, 6] },
  ];

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
        Layout Density
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {options.map(opt => (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative p-3 rounded-xl border-2 text-left transition-all',
              value === opt.id
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
            )}
          >
            {value === opt.id && (
              <div className="absolute top-1.5 right-1.5">
                <Check className="h-3 w-3 text-violet-600" />
              </div>
            )}
            {/* Visual spacing indicator */}
            <div className="flex flex-col items-center gap-px mb-2">
              {opt.bars.map((h, i) => (
                <div key={i} style={{ height: `${h}px` }} className="w-full flex gap-px">
                  <div className="flex-1 bg-zinc-300 dark:bg-zinc-600 rounded-sm" />
                  <div className="w-1/3 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
                </div>
              ))}
            </div>
            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">{opt.label}</p>
            <p className="text-[10px] text-zinc-400 truncate">{opt.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Border Radius Editor ────────────────────────────────────────
export function BorderRadiusEditor({
  value,
  onChange,
}: {
  value: BorderRadiusPreset;
  onChange: (radius: BorderRadiusPreset) => void;
}) {
  const options: { id: BorderRadiusPreset; label: string; value: string }[] = [
    { id: 'none', label: 'None', value: '0px' },
    { id: 'subtle', label: 'Subtle', value: '4px' },
    { id: 'rounded', label: 'Rounded', value: '8px' },
    { id: 'extra-rounded', label: 'Extra', value: '16px' },
    { id: 'pill', label: 'Pill', value: '9999px' },
  ];

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">
        Border Radius
      </p>
      <div className="flex gap-2">
        {options.map(opt => (
          <motion.button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              'flex-1 flex flex-col items-center gap-1.5 p-2.5 border-2 transition-all',
              value === opt.id
                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/10'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300'
            )}
            style={{ borderRadius: '8px' }}
          >
            {/* Visual indicator */}
            <div
              className="w-8 h-8 border-2 border-zinc-400 dark:border-zinc-500"
              style={{ borderRadius: opt.id === 'pill' ? '9999px' : opt.value }}
            />
            <p className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{opt.label}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
