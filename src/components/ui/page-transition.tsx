'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * PageTransition — wraps dashboard page content with a smooth
 * fade + slide-up entrance animation using framer-motion.
 *
 * Usage: wrap the top-level return of any dashboard page.
 */

const pageVariants: Variants = {
  initial: { opacity: 0, y: 16 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.55, 0, 1, 0.45] },
  },
};

export const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  /** Key to force re-animation when route changes */
  routeKey?: string;
}

export function PageTransition({ children, className, routeKey }: PageTransitionProps) {
  return (
    <motion.div
      key={routeKey}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Animate individual sections within a page */
export function AnimatedSection({ children, className, delay = 0 }: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.38,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
