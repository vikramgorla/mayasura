'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Type } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FONT_OPTIONS_GROUPED, type FontOption } from '@/lib/types';

interface FontPickerProps {
  value: string;
  onChange: (font: string) => void;
  label?: string;
  className?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'sans-serif': 'Sans-Serif',
  'serif': 'Serif',
  'display': 'Display',
};

// Build Google Fonts URL for all design fonts
function getAllFontsUrl(): string {
  const fonts = FONT_OPTIONS_GROUPED
    .filter(f => f.name !== 'Geist') // Geist isn't on Google Fonts
    .map(f => {
      const family = (f.googleFamily || f.name).replace(/\s+/g, '+');
      return `family=${family}:wght@400;700`;
    })
    .join('&');
  return `https://fonts.googleapis.com/css2?${fonts}&display=swap`;
}

let fontsLoaded = false;

function loadAllFonts() {
  if (fontsLoaded || typeof document === 'undefined') return;
  fontsLoaded = true;
  const url = getAllFontsUrl();
  const existing = document.querySelector(`link[data-design-fonts]`);
  if (!existing) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.setAttribute('data-design-fonts', 'true');
    document.head.appendChild(link);
  }
}

export function FontPicker({ value, onChange, label, className }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllFonts();
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const categories = ['sans-serif', 'serif', 'display'] as const;

  return (
    <div ref={ref} className={cn('relative', className)}>
      {label && (
        <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">
          {label}
        </label>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center justify-between w-full h-10 px-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm transition-all',
          'hover:border-zinc-300 dark:hover:border-zinc-600',
          open && 'ring-2 ring-violet-500/20 border-violet-500'
        )}
      >
        <span
          className="truncate text-zinc-900 dark:text-zinc-100"
          style={{ fontFamily: value || 'Inter' }}
        >
          {value || 'Select font...'}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-zinc-400 transition-transform flex-shrink-0 ml-2', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden max-h-80 overflow-y-auto"
          >
            {categories.map(cat => {
              const fonts = FONT_OPTIONS_GROUPED.filter(f => f.category === cat);
              return (
                <div key={cat}>
                  <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0">
                    {CATEGORY_LABELS[cat]}
                  </div>
                  {fonts.map(font => (
                    <button
                      key={font.name}
                      onClick={() => { onChange(font.name); setOpen(false); }}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-700/50',
                        font.name === value && 'bg-violet-50 dark:bg-violet-900/20'
                      )}
                    >
                      <span
                        className="text-zinc-800 dark:text-zinc-200 truncate"
                        style={{ fontFamily: font.name }}
                      >
                        {font.name}
                      </span>
                      {font.name === value && (
                        <Check className="h-4 w-4 text-violet-600 dark:text-violet-400 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Font preview card — shows heading + body font together */
export function FontPreview({
  headingFont,
  bodyFont,
  brandName,
}: {
  headingFont: string;
  bodyFont: string;
  brandName?: string;
}) {
  useEffect(() => {
    loadAllFonts();
  }, []);

  return (
    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 space-y-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Typography Preview
      </p>
      <div>
        <h3
          className="text-2xl font-bold text-zinc-900 dark:text-white leading-tight"
          style={{ fontFamily: headingFont }}
        >
          {brandName || 'Your Brand Name'}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          Heading · {headingFont}
        </p>
      </div>
      <div>
        <p
          className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed"
          style={{ fontFamily: bodyFont }}
        >
          The quick brown fox jumps over the lazy dog. Every design change should feel immediate
          and visual. No guesswork — just beautiful typography that speaks your brand.
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          Body · {bodyFont}
        </p>
      </div>
      {/* Mini card preview */}
      <div
        className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-700"
      >
        <h4
          className="text-base font-semibold text-zinc-900 dark:text-white mb-1"
          style={{ fontFamily: headingFont }}
        >
          Featured Product
        </h4>
        <p
          className="text-sm text-zinc-500 dark:text-zinc-400"
          style={{ fontFamily: bodyFont }}
        >
          A premium offering crafted with care.
        </p>
        <p
          className="text-sm font-medium text-zinc-900 dark:text-white mt-2"
          style={{ fontFamily: bodyFont }}
        >
          $49.00
        </p>
      </div>
    </div>
  );
}
