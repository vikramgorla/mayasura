'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HelpTooltipProps {
  text: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function HelpTooltip({ text, side = 'top', className }: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <button
        type="button"
        className="text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors focus:outline-none"
        aria-label="Help"
        tabIndex={-1}
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? -4 : 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-xs text-white bg-zinc-900 dark:bg-zinc-700 rounded-lg pointer-events-none max-w-[200px] leading-relaxed shadow-lg',
              positions[side],
            )}
          >
            {text}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-zinc-900 dark:bg-zinc-700 rotate-45',
                side === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
                side === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
                side === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
                side === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1',
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
