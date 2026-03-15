export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="h-7 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 space-y-4">
                <div className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-zinc-100 dark:bg-zinc-700 rounded-lg" />
                  <div className="h-10 bg-zinc-100 dark:bg-zinc-700 rounded-lg" />
                </div>
                <div className="h-10 bg-zinc-100 dark:bg-zinc-700 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 border border-zinc-100 dark:border-zinc-700 space-y-4">
              <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-700 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-3 w-1/2 bg-zinc-100 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
              ))}
              <div className="h-10 bg-zinc-200 dark:bg-zinc-700 rounded-lg mt-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
