export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-700" />
              <div>
                <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-700 rounded" />
              </div>
            </div>
            <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-3 w-2/3 bg-zinc-100 dark:bg-zinc-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
