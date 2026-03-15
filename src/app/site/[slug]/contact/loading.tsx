export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] animate-pulse">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <div className="h-8 w-36 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto mb-4" />
          <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800 rounded mx-auto" />
        </div>
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-700 space-y-5">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
              <div className={`bg-zinc-100 dark:bg-zinc-700 rounded-lg ${i === 3 ? 'h-28' : 'h-10'}`} />
            </div>
          ))}
          <div className="h-11 w-full bg-violet-200 dark:bg-violet-900 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
