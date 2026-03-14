'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { ToastProvider } from './ui/toast';
import { CommandPalette } from './command-palette';
import { ErrorBoundary } from './error-boundary';
import { AuthProvider } from './auth-provider';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            {children}
            <CommandPalette />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
