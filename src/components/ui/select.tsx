'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ value, onValueChange, options, placeholder = 'Select...', className, disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 transition-all',
          'hover:border-slate-300 dark:hover:border-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400',
          disabled && 'opacity-50 cursor-not-allowed',
          open && 'ring-2 ring-indigo-500 dark:ring-indigo-400 border-transparent'
        )}
      >
        <span className={cn(!selected && 'text-slate-400 dark:text-slate-500')}>
          {selected ? (
            <span className="flex items-center gap-2">
              {selected.icon}
              {selected.label}
            </span>
          ) : placeholder}
        </span>
        <ChevronDown className={cn('h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl overflow-hidden py-1"
          >
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => { onValueChange(option.value); setOpen(false); }}
                className={cn(
                  'flex items-center justify-between w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200',
                  option.value === value && 'bg-slate-50 dark:bg-slate-700 font-medium'
                )}
              >
                <span className="flex items-center gap-2">
                  {option.icon}
                  {option.label}
                </span>
                {option.value === value && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
