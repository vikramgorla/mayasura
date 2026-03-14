'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (~600px)
      const scrolled = window.scrollY > 600;
      // Hide near bottom (within 200px of footer)
      const nearBottom = window.scrollY + window.innerHeight > document.body.scrollHeight - 200;
      setVisible(scrolled && !nearBottom);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900/95 dark:bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/20 border border-zinc-700/50 dark:border-zinc-300/50"
        >
          <span className="text-sm font-medium text-white dark:text-zinc-900 hidden sm:inline">
            Ready to build your brand?
          </span>
          <Link href="/create">
            <Button size="sm" variant="brand" className="rounded-full text-xs h-8 px-4">
              Start Free
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-full text-zinc-400 hover:text-white dark:hover:text-zinc-900 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
