'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

/**
 * FloatingInput — Input with animated floating label.
 * Label moves up and scales down when focused or has a value.
 *
 * Usage:
 *   <FloatingInput label="Email address" type="email" value={email} onChange={...} />
 *
 * Features:
 * - Floating label effect (label moves above input on focus/fill)
 * - Success checkmark animation (show success={true} after save)
 * - Full dark-mode compatible via Tailwind dark: variants
 * - Integrates with existing Input styles
 */

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Shows a green checkmark animation to confirm success */
  success?: boolean;
  /** Error message to display below input */
  error?: string;
  /** Wrapper className */
  wrapperClassName?: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, success, error, className, wrapperClassName, id, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const inputId = id || `floating-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const hasValue = Boolean(props.value || props.defaultValue);
    const isFloating = focused || hasValue;

    return (
      <div className={cn('relative', wrapperClassName)}>
        <input
          id={inputId}
          ref={ref}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            // Base styles matching existing Input component
            'peer flex h-12 w-full rounded-lg border bg-white dark:bg-zinc-800 px-4 pt-4 pb-1 text-sm text-zinc-900 dark:text-zinc-100 transition-all',
            // Border: normal → focused → success/error
            error
              ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
              : success
              ? 'border-emerald-400 dark:border-emerald-500 focus-visible:ring-emerald-400'
              : 'border-zinc-200 dark:border-zinc-700 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            // Placeholder: only visible when not floating
            'placeholder:transition-opacity',
            isFloating ? 'placeholder:opacity-0' : 'placeholder:opacity-100',
            className
          )}
          {...props}
        />

        {/* Floating label */}
        <motion.label
          htmlFor={inputId}
          animate={isFloating ? 'float' : 'rest'}
          variants={{
            rest: { y: 0, scale: 1, color: error ? '#f87171' : '#9ca3af' },
            float: {
              y: -10,
              scale: 0.78,
              color: error ? '#f87171' : focused
                ? (success ? '#10b981' : '#7c3aed')
                : '#6b7280',
            },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="pointer-events-none absolute left-4 top-3.5 origin-left text-sm font-medium cursor-text select-none"
          style={{ transformOrigin: 'top left' }}
        >
          {label}
        </motion.label>

        {/* Success checkmark */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-xs text-red-500 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FloatingInput.displayName = 'FloatingInput';

/**
 * FloatingTextarea — Same floating label treatment for textarea.
 */
interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  success?: boolean;
  error?: string;
  wrapperClassName?: string;
}

export const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ label, success, error, className, wrapperClassName, id, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false);
    const inputId = id || `floating-ta-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const hasValue = Boolean(props.value || props.defaultValue);
    const isFloating = focused || hasValue;

    return (
      <div className={cn('relative', wrapperClassName)}>
        <textarea
          id={inputId}
          ref={ref}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={cn(
            'peer flex min-h-[80px] w-full rounded-lg border bg-white dark:bg-zinc-800 px-4 pt-6 pb-2 text-sm text-zinc-900 dark:text-zinc-100 transition-all resize-none',
            error
              ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
              : success
              ? 'border-emerald-400 dark:border-emerald-500 focus-visible:ring-emerald-400'
              : 'border-zinc-200 dark:border-zinc-700 focus-visible:ring-violet-500 dark:focus-visible:ring-violet-400',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:transition-opacity',
            isFloating ? 'placeholder:opacity-0' : 'placeholder:opacity-100',
            className
          )}
          {...props}
        />

        <motion.label
          htmlFor={inputId}
          animate={isFloating ? 'float' : 'rest'}
          variants={{
            rest: { y: 0, scale: 1, color: error ? '#f87171' : '#9ca3af' },
            float: {
              y: -10,
              scale: 0.78,
              color: error ? '#f87171' : focused
                ? (success ? '#10b981' : '#7c3aed')
                : '#6b7280',
            },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="pointer-events-none absolute left-4 top-3.5 origin-left text-sm font-medium cursor-text select-none"
          style={{ transformOrigin: 'top left' }}
        >
          {label}
        </motion.label>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-1 text-xs text-red-500 dark:text-red-400"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
FloatingTextarea.displayName = 'FloatingTextarea';

/**
 * SuccessCheckmark — Standalone animated success checkmark.
 * Use after form saves.
 */
export function SuccessCheckmark({ show, size = 20 }: { show: boolean; size?: number }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0, rotate: 30 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          className="inline-flex items-center justify-center"
        >
          <CheckCircle2 style={{ width: size, height: size }} className="text-emerald-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
