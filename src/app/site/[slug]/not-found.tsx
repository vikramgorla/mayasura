import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="text-6xl">🏛️</div>
        <h1 className="text-2xl font-semibold text-zinc-900">
          This palace hasn&apos;t been built yet
        </h1>
        <p className="text-zinc-500 max-w-md mx-auto">
          The brand you&apos;re looking for either doesn&apos;t exist or
          hasn&apos;t been launched yet.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            Back to Mayasura
          </Link>
        </div>
      </div>
    </div>
  );
}
