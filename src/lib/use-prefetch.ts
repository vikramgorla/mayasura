/**
 * Prefetch utility for critical routes.
 * Wraps Next.js router.prefetch to eagerly load page bundles.
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Prefetch a list of routes on mount, with a small delay to avoid
 * blocking the initial render/paint.
 *
 * @param routes Array of href strings to prefetch
 * @param delayMs Milliseconds to wait before prefetching (default 1500)
 */
export function usePrefetch(routes: string[], delayMs = 1500): void {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      for (const route of routes) {
        try {
          router.prefetch(route);
        } catch {
          // prefetch is best-effort; ignore errors
        }
      }
    }, delayMs);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
