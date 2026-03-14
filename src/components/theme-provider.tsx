'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: 'light' | 'dark';
}>({
  theme: 'system',
  setTheme: () => {},
  resolved: 'light',
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('mayasura-theme') as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (t: 'light' | 'dark') => {
      setResolved(t);
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(media.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'dark' : 'light');
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const handleSetTheme = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('mayasura-theme', t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
