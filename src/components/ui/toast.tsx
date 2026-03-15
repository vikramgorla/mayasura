'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (opts: Omit<Toast, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: 'bg-white/90 dark:bg-zinc-900/90 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100',
  error: 'bg-white/90 dark:bg-zinc-900/90 border-red-200 dark:border-red-800/50 text-red-900 dark:text-red-100',
  info: 'bg-white/90 dark:bg-zinc-900/90 border-violet-200 dark:border-violet-800/50 text-indigo-900 dark:text-indigo-100',
  warning: 'bg-white/90 dark:bg-zinc-900/90 border-amber-200 dark:border-amber-800/50 text-amber-900 dark:text-amber-100',
};

const iconStyles: Record<ToastType, string> = {
  success: 'text-emerald-500',
  error: 'text-red-500',
  info: 'text-indigo-500',
  warning: 'text-amber-500',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((opts: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const newToast = { ...opts, id };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => removeToast(id), opts.duration || 4000);
  }, [removeToast]);

  const contextValue: ToastContextType = {
    toast: addToast,
    success: (title, description) => addToast({ type: 'success', title, description }),
    error: (title, description) => addToast({ type: 'error', title, description }),
    info: (title, description) => addToast({ type: 'info', title, description }),
    warning: (title, description) => addToast({ type: 'warning', title, description }),
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none bottom-4 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:top-4 sm:right-4 sm:bottom-auto px-4 sm:px-0" role="status" aria-live="polite" aria-label="Notifications">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 64, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', damping: 22, stiffness: 380, mass: 0.8 }}
                className={cn(
                  'pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md',
                  styles[t.type]
                )}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconStyles[t.type])} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{t.title}</p>
                  {t.description && (
                    <p className="text-xs mt-0.5 opacity-70">{t.description}</p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex-shrink-0 rounded-md p-1 opacity-40 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}
