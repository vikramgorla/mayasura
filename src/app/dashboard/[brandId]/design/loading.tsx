import { Skeleton } from '@/components/ui/skeleton';

export default function DesignStudioLoading() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div>
            <Skeleton className="h-4 w-28 mb-1" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 lg:w-96 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-16 rounded-lg" />
            ))}
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          ))}
        </div>

        {/* Right Panel Preview */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 p-6">
          <Skeleton className="h-full w-full rounded-xl max-w-3xl mx-auto" />
        </div>
      </div>
    </div>
  );
}
