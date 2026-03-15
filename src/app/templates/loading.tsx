export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-9 w-56 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto mb-3" />
          <div className="h-5 w-72 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-100 dark:border-zinc-900 overflow-hidden animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-32 rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-4 w-48 rounded bg-zinc-50 dark:bg-zinc-800/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
