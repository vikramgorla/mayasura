import { Skeleton } from "@/components/ui/skeleton";

export default function BlogListingLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-10 w-24 mb-2" />
      <Skeleton className="h-4 w-48 mb-8" />

      {/* Featured skeleton */}
      <div className="p-6 border rounded-xl mb-8 border-zinc-200 dark:border-zinc-800">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-7 w-80 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-3" />
        <div className="flex gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Post list skeletons */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 border rounded-lg border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
