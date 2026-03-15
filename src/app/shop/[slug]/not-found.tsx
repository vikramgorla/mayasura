'use client';

import Link from 'next/link';

/**
 * Shown when a brand shop slug is not found.
 */
export default function ShopNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <div className="w-20 h-20 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🛍️</span>
        </div>

        <h1 className="text-xl font-semibold text-zinc-900 mb-2">Shop not found</h1>
        <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
          This shop doesn&apos;t exist or hasn&apos;t been launched yet. The brand may have changed their URL.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
          >
            ← Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
