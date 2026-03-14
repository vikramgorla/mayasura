export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] dark:bg-[#09090B]">
      {/* Nav skeleton */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-violet-600 animate-pulse" />
          <div className="h-4 w-20 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          {[64, 48, 36].map((w, i) => (
            <div key={i} className="h-4 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse hidden sm:block" style={{ width: `${w}px`, animationDelay: `${i * 100}ms` }} />
          ))}
          <div className="h-8 w-20 rounded-lg bg-violet-100 dark:bg-violet-900/30 animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="pt-28 pb-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <div className="h-7 w-48 rounded-full bg-violet-100 dark:bg-violet-900/30 animate-pulse mb-6" />
            <div className="space-y-3 mb-6">
              <div className="h-10 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              <div className="h-10 w-4/5 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '100ms' }} />
              <div className="h-10 w-3/5 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
            <div className="space-y-2 mb-8">
              <div className="h-5 w-full rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '150ms' }} />
              <div className="h-5 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '200ms' }} />
            </div>
            <div className="flex gap-3">
              <div className="h-12 w-32 rounded-lg bg-violet-600/20 animate-pulse" />
              <div className="h-12 w-28 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '100ms' }} />
            </div>
          </div>

          {/* Right browser mockup */}
          <div className="hidden lg:block">
            <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <div className="h-10 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
              <div className="h-[300px] bg-zinc-50 dark:bg-zinc-950 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar skeleton */}
      <div className="border-y border-zinc-100 dark:border-zinc-900 py-12 px-6 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="h-14 w-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto mb-3" />
              <div className="h-10 w-20 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto mb-2" />
              <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Feature grid skeleton */}
      <div className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="h-9 w-64 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto mb-3" />
          <div className="h-5 w-48 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-100 dark:border-zinc-900 p-7 animate-pulse"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="h-11 w-11 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-5" />
              <div className="h-5 w-40 rounded bg-zinc-100 dark:bg-zinc-800 mb-2" />
              <div className="space-y-1.5">
                <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-4 w-4/5 rounded bg-zinc-100 dark:bg-zinc-800" />
                <div className="h-4 w-3/5 rounded bg-zinc-100 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mayasura logo watermark */}
      <div className="fixed bottom-8 right-8 flex items-center gap-2 opacity-30">
        <div className="h-5 w-5 rounded bg-violet-600" />
        <span className="text-xs font-semibold text-zinc-400">Mayasura</span>
      </div>
    </div>
  );
}
