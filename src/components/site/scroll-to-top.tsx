'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { getTextOnColor } from '@/lib/color-utils';

export function ScrollToTop({ accentColor = '#6366F1' }: { accentColor?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 h-10 w-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{ backgroundColor: accentColor, color: getTextOnColor(accentColor) }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
