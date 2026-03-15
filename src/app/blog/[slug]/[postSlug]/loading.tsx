export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
        <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-2xl mb-8" />
        <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-3" />
        <div className="h-8 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-6" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`h-4 bg-zinc-100 dark:bg-zinc-800 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
