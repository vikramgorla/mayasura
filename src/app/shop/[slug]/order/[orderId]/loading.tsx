export default function OrderLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="h-16 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700 mx-auto mb-6" />
        <div className="h-7 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto mb-3" />
        <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto mb-10" />
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-zinc-100 dark:border-zinc-700 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
