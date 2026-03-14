'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface FirstVisitHintProps {
  hintKey: string;          // unique key per hint
  message: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

/**
 * Wraps any element and shows a one-time tooltip hint on first visit.
 * Persisted in localStorage so it only shows once per browser.
 */
export function FirstVisitHint({
  hintKey,
  message,
  position = 'bottom',
  className = '',
  children,
}: FirstVisitHintProps) {
  const storageKey = `mayasura-hint-${hintKey}`;
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem(storageKey);
      if (!seen) {
        // Small delay so it doesn't flash on page load
        const t = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(t);
      }
    }
  }, [storageKey]);

  const dismiss = () => {
    setVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, '1');
    }
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-violet-600 border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-violet-600 border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-violet-600 border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-violet-600 border-t-transparent border-b-transparent border-l-transparent',
  };

  if (!mounted) return <div className={className}>{children}</div>;

  return (
    <div className={`relative ${className}`}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[position]} w-max max-w-[220px]`}
          >
            <div className="relative bg-violet-600 text-white rounded-xl px-3 py-2.5 shadow-xl shadow-violet-500/20">
              {/* Arrow */}
              <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />

              <div className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-violet-200 shrink-0 mt-0.5" />
                <p className="text-xs leading-snug text-violet-50">{message}</p>
                <button
                  onClick={dismiss}
                  className="ml-1 text-violet-300 hover:text-white transition-colors shrink-0"
                  aria-label="Dismiss hint"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
