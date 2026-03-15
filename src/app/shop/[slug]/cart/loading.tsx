export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="space-y-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700">
              <div className="h-20 w-20 bg-zinc-100 dark:bg-zinc-700 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-700 rounded" />
                <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 space-y-3">
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-700 rounded" />
          <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-700 rounded" />
          <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
