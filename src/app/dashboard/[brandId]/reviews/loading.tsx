import { Skeleton } from '@/components/ui/skeleton';

export default function ReviewsLoading() {
  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-28 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-8 w-12 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1.5" />
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Skeleton key={j} className="h-3 w-3 rounded-sm" />
                    ))}
                  </div>
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-1.5" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}
