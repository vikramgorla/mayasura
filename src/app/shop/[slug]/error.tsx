'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, ShoppingBag, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ShopError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const slug = params?.slug as string;

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.error('[ShopError]', error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>
        <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
          We had trouble loading this page. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          {slug && (
            <Link
              href={`/shop/${slug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Back to Shop
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
