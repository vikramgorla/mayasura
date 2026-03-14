import { Skeleton, SkeletonTable } from '@/components/ui/skeleton';

export default function OrdersLoading() {
  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-24 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6">
        <SkeletonTable rows={6} />
      </div>
    </div>
  );
}
