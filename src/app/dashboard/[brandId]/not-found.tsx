import Link from 'next/link';

/**
 * Shown when a brand ID is not found in the dashboard.
 * This is a server component — rendered by Next.js when notFound() is called.
 */
export default function BrandNotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        {/* Palace illustration — empty/ghost */}
        <svg
          width="160"
          height="100"
          viewBox="0 0 160 100"
          fill="none"
          className="mx-auto mb-8 opacity-20"
          aria-hidden="true"
        >
          <rect x="10" y="75" width="140" height="4" rx="2" fill="currentColor" className="text-zinc-500" />
          <rect x="30" y="30" width="8" height="45" rx="2" fill="currentColor" className="text-zinc-400" />
          <rect x="50" y="22" width="8" height="53" rx="2" fill="currentColor" className="text-zinc-400" />
          <rect x="102" y="22" width="8" height="53" rx="2" fill="currentColor" className="text-zinc-400" />
          <rect x="122" y="30" width="8" height="45" rx="2" fill="currentColor" className="text-zinc-400" />
          <path d="M25 30 L80 6 L135 30" stroke="currentColor" className="text-zinc-400" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
          <rect x="65" y="42" width="30" height="33" rx="3" fill="none" stroke="currentColor" className="text-zinc-300" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="80" cy="58" r="4" fill="none" stroke="currentColor" className="text-zinc-300" strokeWidth="1.5" />
        </svg>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 mb-5">
          <span className="text-2xl">🏛️</span>
        </div>

        <h1 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Brand not found
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
          This brand doesn&apos;t exist or you don&apos;t have access to it. Head back to your dashboard to find your brands.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}
          >
            ← Back to Dashboard
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          >
            Create a Brand
          </Link>
        </div>
      </div>
    </div>
  );
}
