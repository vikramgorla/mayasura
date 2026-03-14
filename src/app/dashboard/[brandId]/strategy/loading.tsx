import { Skeleton } from '@/components/ui/skeleton';

export default function StrategyLoading() {
  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <Skeleton className="h-7 w-36 mb-2" />
        <Skeleton className="h-4 w-60" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
