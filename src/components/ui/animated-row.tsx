'use client';

import { useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedRowProps {
  children: ReactNode;
  className?: string;
  /** Optional unique key used for AnimatePresence tracking */
  rowKey?: string | number;
}

/**
 * Wrapper for table rows / list items that:
 * - Adds smooth hover highlight
 * - Exposes `remove()` → item shrinks and fades out before being removed from DOM
 *
 * Usage:
 *   const [items, setItems] = useState([...]);
 *   {items.map(item => (
 *     <AnimatedRow key={item.id}>
 *       {({ remove }) => (
 *         <td>
 *           <button onClick={() => remove(() => setItems(i => i.filter(x => x.id !== item.id)))}>
 *             Delete
 *           </button>
 *         </td>
 *       )}
 *     </AnimatedRow>
 *   ))}
 */
export function AnimatedRow({
  children,
  className,
}: Omit<AnimatedRowProps, 'rowKey'> & {
  children: ReactNode | ((helpers: { remove: (onComplete?: () => void) => void }) => ReactNode);
}) {
  const [visible, setVisible] = useState(true);
  const [removing, setRemoving] = useState(false);

  const remove = useCallback((onComplete?: () => void) => {
    setRemoving(true);
    // After animation ends, mark as not visible and call onComplete
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 350);
  }, []);

  if (!visible) return null;

  return (
    <motion.tr
      layout
      animate={removing ? { opacity: 0, scaleY: 0, height: 0 } : { opacity: 1, scaleY: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40',
        className
      )}
      style={{ originY: 0 }}
    >
      {typeof children === 'function' ? children({ remove }) : children}
    </motion.tr>
  );
}

/**
 * For non-table list items (div/li based)
 */
export function AnimatedListItem({
  children,
  className,
}: {
  children: ReactNode | ((helpers: { remove: (onComplete?: () => void) => void }) => ReactNode);
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const [removing, setRemoving] = useState(false);

  const remove = useCallback((onComplete?: () => void) => {
    setRemoving(true);
    setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 350);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      layout
      animate={removing ? { opacity: 0, scale: 0.95, height: 0 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'overflow-hidden transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 rounded-lg',
        className
      )}
    >
      {typeof children === 'function' ? children({ remove }) : children}
    </motion.div>
  );
}
