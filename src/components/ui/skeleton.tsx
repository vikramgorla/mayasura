import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

export function Skeleton({ className, shimmer = true }: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        shimmer
          ? 'relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/5 before:to-transparent before:animate-[shimmer_1.5s_infinite]'
          : 'animate-pulse bg-zinc-100 dark:bg-zinc-800',
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 px-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-4 w-1/6" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/6" />
          <Skeleton className="h-5 w-1/5" />
          <Skeleton className="h-5 w-1/6" />
        </div>
      ))}
    </div>
  );
}
