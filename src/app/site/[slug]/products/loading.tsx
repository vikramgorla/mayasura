export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto mb-4" />
          <div className="h-4 w-56 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-700">
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-700" />
              <div className="p-5 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-700 rounded" />
                <div className="flex items-center justify-between pt-2">
                  <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  <div className="h-9 w-24 bg-violet-200 dark:bg-violet-900 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
