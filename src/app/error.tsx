'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle, Github } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('[GlobalError]', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary,#fafafa)] flex items-center justify-center px-4">
      {/* Soft background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/6 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/6 rounded-full blur-[100px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Broken palace illustration */}
        <div className="mb-8">
          <svg width="200" height="120" viewBox="0 0 200 120" fill="none" className="mx-auto" aria-hidden="true">
            {/* Pillars */}
            <rect x="20" y="45" width="10" height="65" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="45" y="35" width="10" height="75" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="145" y="35" width="10" height="75" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="170" y="45" width="10" height="65" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            {/* Cracked roof — left side intact */}
            <path d="M15 45 L100 8" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="3" strokeLinecap="round" />
            {/* Cracked roof — right side broken with gap */}
            <path d="M107 14 L185 45" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />
            {/* Crack mark */}
            <path d="M100 8 L105 16 L103 12 L108 20" stroke="currentColor" className="text-red-400/80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Base */}
            <rect x="10" y="110" width="180" height="5" rx="2.5" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            {/* Error code */}
            <text x="100" y="90" textAnchor="middle" fill="currentColor" className="text-red-500" fontSize="36" fontWeight="800">!</text>
            {/* Floating debris */}
            <motion.g animate={{ y: [0, -6, 0], rotate: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
              <rect x="108" y="14" width="6" height="6" rx="1" fill="currentColor" className="text-zinc-300/60 dark:text-zinc-600/60" transform="rotate(25 111 17)" />
            </motion.g>
            <motion.g animate={{ y: [0, -9, 0], x: [0, 4, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}>
              <rect x="120" y="22" width="4" height="4" rx="1" fill="currentColor" className="text-zinc-200/50 dark:text-zinc-700/50" transform="rotate(45 122 24)" />
            </motion.g>
          </svg>
        </div>

        {/* Error icon */}
        <motion.div
          className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center mx-auto mb-5"
          initial={{ scale: 0.8, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
          A crack in the palace
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          An unexpected error occurred in your digital palace. Our architects have been notified and are on their way.
        </p>

        {/* Error details — dev only */}
        {process.env.NODE_ENV !== 'production' && error?.message && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 mb-2 font-medium inline-flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono">DEV</span>
              Technical details
            </summary>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 overflow-auto max-h-36">
              <code className="text-xs text-red-600 dark:text-red-400 break-all font-mono leading-relaxed">
                {error.message}
                {error.digest && (
                  <>
                    <br />
                    <span className="text-zinc-400">Digest: {error.digest}</span>
                  </>
                )}
              </code>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>

          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>

        {/* Secondary help */}
        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-zinc-400">
          <Link href="/dashboard" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
            Dashboard
          </Link>
          <span>·</span>
          <a
            href="https://github.com/vikramgorla/mayasura/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <Github className="h-3 w-3" />
            Report on GitHub
          </a>
        </div>

        {error?.digest && (
          <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-4">
            Error ID: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </motion.div>
    </div>
  );
}
