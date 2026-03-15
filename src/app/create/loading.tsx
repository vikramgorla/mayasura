export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="text-center">
        <div className="h-10 w-10 rounded-xl bg-violet-600 animate-pulse mx-auto mb-4" />
        <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse mx-auto mb-2" />
        <div className="h-4 w-32 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse mx-auto" />
      </div>
    </div>
  );
}
