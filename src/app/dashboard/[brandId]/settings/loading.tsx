import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <Skeleton className="h-7 w-28 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="max-w-2xl space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </div>
  );
}
