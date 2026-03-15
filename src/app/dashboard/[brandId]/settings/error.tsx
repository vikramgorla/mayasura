'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle, Github, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DashboardRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const brandId = params?.brandId as string;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('[DashboardError]', error);
    }
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-6">
      <motion.div
        className="text-center max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <motion.div
          className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 flex items-center justify-center mx-auto mb-5"
          initial={{ scale: 0.8, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
        >
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </motion.div>

        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          This page ran into an unexpected error. You can try again or go back to the dashboard.
        </p>

        {process.env.NODE_ENV !== 'production' && error?.message && (
          <details className="mb-5 text-left">
            <summary className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors mb-2">
              Technical details
            </summary>
            <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 p-3 overflow-auto max-h-28">
              <code className="text-xs text-red-600 dark:text-red-400 break-all font-mono leading-relaxed">
                {error.message}
              </code>
            </div>
          </details>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <motion.button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </motion.button>

          {brandId && (
            <Link
              href={`/dashboard/${brandId}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-zinc-400">
          <a
            href="https://github.com/vikramgorla/mayasura/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors flex items-center gap-1"
          >
            <Github className="h-3 w-3" />
            Report issue
          </a>
          {error?.digest && (
            <>
              <span>·</span>
              <span className="font-mono">{error.digest}</span>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
