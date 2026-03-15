export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto mb-4" />
          <div className="h-5 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-2xl" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-4 bg-zinc-100 dark:bg-zinc-800 rounded ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
