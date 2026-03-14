'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[350px] h-[350px] bg-indigo-500/6 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-lg"
      >
        {/* 404 illustration */}
        <div className="mb-8">
          <svg width="280" height="160" viewBox="0 0 280 160" fill="none" className="mx-auto" aria-hidden="true">
            {/* Palace pillars - broken */}
            <rect x="40" y="60" width="12" height="80" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="70" y="45" width="12" height="95" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="198" y="45" width="12" height="95" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            <rect x="228" y="60" width="12" height="80" rx="2" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            {/* Broken roof */}
            <path d="M30 60 L140 15 L155 25" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="3" strokeLinecap="round" />
            <path d="M165 35 L250 60" stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 4" />
            {/* Base */}
            <rect x="30" y="140" width="220" height="6" rx="3" fill="currentColor" className="text-zinc-200 dark:text-zinc-800" />
            {/* 404 text */}
            <text x="140" y="115" textAnchor="middle" className="text-violet-500 dark:text-violet-400" fill="currentColor" fontSize="48" fontWeight="800" fontFamily="var(--font-display)">404</text>
            {/* Question mark floating */}
            <motion.g
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <text x="170" y="30" textAnchor="middle" className="text-violet-400/60 dark:text-violet-500/60" fill="currentColor" fontSize="24" fontWeight="700">?</text>
            </motion.g>
          </svg>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
          Palace not found
        </h1>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-8 max-w-sm mx-auto leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved to a different chamber.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button variant="brand" size="lg">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg">
              <ArrowLeft className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <p className="text-xs text-[var(--text-tertiary)] mt-8">
          If you believe this is an error, please{' '}
          <a href="https://github.com/vikramgorla/mayasura/issues" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:text-violet-600 underline underline-offset-2">
            report it on GitHub
          </a>
        </p>
      </motion.div>
    </div>
  );
}
