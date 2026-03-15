import { useEffect, useRef, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;   // ms
  decimals?: number;
  easing?: (t: number) => number;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Animate a number from 0 (or previous value) to the target value.
 * Returns the current display value.
 *
 * Usage:
 *   const displayValue = useCountUp(totalRevenue, { decimals: 2 });
 */
export function useCountUp(
  target: number,
  { duration = 800, decimals = 0, easing = easeOutExpo }: UseCountUpOptions = {}
): string {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const from = prevRef.current;
    const to = target;

    if (from === to) return;

    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
    }
    startRef.current = null;

    const step = (timestamp: number) => {
      if (startRef.current == null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const current = from + (to - from) * easedProgress;
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        prevRef.current = to;
        setDisplay(to);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, easing]);

  return decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
}
