export default function ChatLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col animate-pulse">
      {/* Header */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div>
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
          <div className="h-2.5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
      </div>
      {/* Messages area */}
      <div className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-violet-200 dark:bg-violet-900 flex-shrink-0 mt-1" />
          <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-sm p-4 max-w-xs">
            <div className="h-3 w-40 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-700 rounded" />
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-900">
        <div className="h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl max-w-2xl mx-auto" />
      </div>
    </div>
  );
}
