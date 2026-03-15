"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageViewTrackerProps {
  slug: string;
}

/**
 * Fires a POST to /api/v1/public/brand/[slug]/track on mount.
 * Debounced so it doesn't double-fire on navigation.
 */
export function PageViewTracker({ slug }: PageViewTrackerProps) {
  const pathname = usePathname();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Debounce: don't re-track same page
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const timer = setTimeout(() => {
      fetch(`/api/v1/public/brand/${slug}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          referrer: document.referrer || null,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Fire and forget
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname, slug]);

  return null;
}
