import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4">
              <Skeleton className="w-20 h-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    </div>
  );
}
