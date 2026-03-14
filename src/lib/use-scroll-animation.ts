'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook that observes elements with .anim-on-scroll and adds .anim-visible
 * when they enter the viewport. Uses IntersectionObserver for performance.
 */
export function useScrollAnimation(options?: { threshold?: number; rootMargin?: string }) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const threshold = options?.threshold ?? 0.1;
    const rootMargin = options?.rootMargin ?? '0px 0px -50px 0px';

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('anim-visible');
            // Once visible, stop observing (one-time animation)
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe all elements with .anim-on-scroll
    const elements = document.querySelectorAll('.anim-on-scroll');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [options?.threshold, options?.rootMargin]);
}

/**
 * Apply scroll animation to a container's children.
 * Call this after dynamic content loads.
 */
export function observeScrollAnimations(container?: HTMLElement) {
  const root = container || document;
  const elements = root.querySelectorAll('.anim-on-scroll:not(.anim-visible)');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}
