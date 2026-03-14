'use client';

import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400" />
    </div>
  )
}

export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500 [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 dark:bg-slate-500" />
    </span>
  )
}

export function PageLoader() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-indigo-600 dark:border-t-indigo-400" />
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
