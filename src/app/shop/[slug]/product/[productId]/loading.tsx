export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-7 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`h-4 bg-zinc-100 dark:bg-zinc-800 rounded ${i === 3 ? 'w-2/3' : 'w-full'}`} />
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <div className="h-12 flex-1 bg-violet-200 dark:bg-violet-900 rounded-xl" />
              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
