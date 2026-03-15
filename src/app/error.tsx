'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      console.error('[GlobalError]', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      {/* Soft background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-md w-full"
      >
        {/* Error icon */}
        <motion.div
          className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0.8, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <AlertTriangle className="h-9 w-9 text-red-500" />
        </motion.div>

        <h1 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">
          Something went wrong
        </h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed max-w-sm mx-auto">
          An unexpected error occurred. Our team has been notified. Please try again or go back home.
        </p>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV !== 'production' && error?.message && (
          <details className="mb-6 text-left">
            <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 mb-2 font-medium">
              Technical details
            </summary>
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 overflow-auto max-h-32">
              <code className="text-xs text-red-600 break-all">
                {error.message}
                {error.digest && <><br /><span className="text-zinc-400">Digest: {error.digest}</span></>}
              </code>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
            whileTap={{ scale: 0.97 }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>

          <a
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </a>
        </div>

        {error?.digest && (
          <p className="text-xs text-zinc-400 mt-6">
            Error ID: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </motion.div>
    </div>
  );
}
