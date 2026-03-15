export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="space-y-4 mb-12">
          <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-5 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
              <div className="aspect-video bg-zinc-100 dark:bg-zinc-800" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
                <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
