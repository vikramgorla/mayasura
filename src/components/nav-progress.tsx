'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * NavProgress — thin animated progress bar at top of viewport
 * during Next.js route transitions, similar to YouTube/GitHub.
 * 
 * Uses pathname changes to detect navigation start/end.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = useCallback(() => {
    setIsNavigating(true);
    setProgress(0);

    // Simulate progress: fast start, then slow trickle
    let current = 0;
    const tick = () => {
      current += Math.random() * 15;
      if (current > 90) current = 90;
      setProgress(current);
      progressTimerRef.current = setTimeout(tick, 200 + Math.random() * 300);
    };
    tick();
  }, []);

  const completeProgress = useCallback(() => {
    if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    setProgress(100);
    timerRef.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // New pathname → complete the progress
      completeProgress();
      prevPathname.current = pathname;
    }
  }, [pathname, completeProgress]);

  // Intercept link clicks to detect navigation start
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;
      
      // Only track internal navigation (not external links, anchors, or same page)
      if (
        href.startsWith('/') &&
        !href.startsWith('//') &&
        href !== pathname &&
        !anchor.getAttribute('target') &&
        !e.ctrlKey && !e.metaKey && !e.shiftKey
      ) {
        startProgress();
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [pathname, startProgress]);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearTimeout(progressTimerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Glow dot at leading edge */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-violet-400/50 blur-sm" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
