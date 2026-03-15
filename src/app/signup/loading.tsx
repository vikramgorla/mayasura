export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <div className="h-8 w-8 rounded-md bg-violet-600 animate-pulse mx-auto mb-6" />
        <div className="h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto mb-8" />
        <div className="space-y-4">
          <div className="h-10 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          <div className="h-10 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '100ms' }} />
          <div className="h-10 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" style={{ animationDelay: '200ms' }} />
          <div className="h-12 w-full rounded-lg bg-violet-200 dark:bg-violet-900/30 animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
