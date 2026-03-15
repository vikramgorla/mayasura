'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SaveState = 'idle' | 'saving' | 'saved';

interface SaveButtonProps {
  onSave: () => Promise<void>;
  label?: string;
  savedLabel?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A save button with three states:
 * idle → saving (spinner) → saved (checkmark + "Saved!") → idle
 *
 * Usage:
 *   <SaveButton onSave={async () => { await saveData(); }} />
 */
export function SaveButton({
  onSave,
  label = 'Save',
  savedLabel = 'Saved!',
  className,
  disabled = false,
  variant = 'default',
  size = 'md',
}: SaveButtonProps) {
  const [state, setState] = useState<SaveState>('idle');

  const handleClick = useCallback(async () => {
    if (state !== 'idle') return;
    setState('saving');
    try {
      await onSave();
      setState('saved');
      setTimeout(() => setState('idle'), 2000);
    } catch {
      setState('idle');
    }
  }, [state, onSave]);

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-9 px-4 text-sm gap-2',
    lg: 'h-11 px-6 text-base gap-2',
  }[size];

  const variantClasses = {
    default:
      'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-50',
    outline:
      'border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50',
  }[variant];

  const savedClasses = state === 'saved'
    ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-transparent hover:bg-emerald-600 dark:hover:bg-emerald-500'
    : '';

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state !== 'idle'}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500',
        'disabled:cursor-not-allowed active:scale-[0.97]',
        sizeClasses,
        variantClasses,
        savedClasses,
        className
      )}
    >
      <AnimatePresence mode="wait">
        {state === 'saving' && (
          <motion.span
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving…
          </motion.span>
        )}
        {state === 'saved' && (
          <motion.span
            key="saved"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-1.5"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, stiffness: 300 }}
            >
              <Check className="h-3.5 w-3.5" />
            </motion.span>
            {savedLabel}
          </motion.span>
        )}
        {state === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
