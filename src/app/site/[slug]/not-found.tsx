import Link from 'next/link';

/**
 * Shown when a brand site slug is not found.
 */
export default function SiteNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        <svg
          className="w-28 h-28 mx-auto mb-8 opacity-10"
          viewBox="0 0 120 120"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="60" cy="60" r="56" stroke="#000" strokeWidth="2" />
          <path d="M40 50 Q60 35 80 50" stroke="#000" strokeWidth="2" strokeLinecap="round" />
          <circle cx="45" cy="58" r="4" fill="#000" />
          <circle cx="75" cy="58" r="4" fill="#000" />
          <path d="M42 78 Q60 68 78 78" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <h1 className="text-4xl font-light tracking-tight text-zinc-900 mb-2">404</h1>
        <h2 className="text-lg font-medium text-zinc-700 mb-3">Page not found</h2>
        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          This brand site doesn&apos;t exist or hasn&apos;t been launched yet. Check the URL or explore Mayasura.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 text-sm font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
          >
            ← Back to Mayasura
          </Link>
          <Link
            href="/templates"
            className="px-6 py-2.5 text-sm font-medium rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            View Templates
          </Link>
        </div>
      </div>
    </div>
  );
}
