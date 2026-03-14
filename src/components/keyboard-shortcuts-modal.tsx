'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutGroup {
  label: string;
  shortcuts: Array<{ keys: string[]; description: string }>;
}

const shortcutGroups: ShortcutGroup[] = [
  {
    label: 'Navigation',
    shortcuts: [
      { keys: ['⌘', 'K'], description: 'Open command palette' },
      { keys: ['⌘', 'J'], description: 'Open AI assistant' },
      { keys: ['⌘', '?'], description: 'Show keyboard shortcuts' },
      { keys: ['G', 'H'], description: 'Go to dashboard home' },
      { keys: ['G', 'P'], description: 'Go to products' },
      { keys: ['G', 'B'], description: 'Go to blog' },
    ],
  },
  {
    label: 'Actions',
    shortcuts: [
      { keys: ['⌘', 'S'], description: 'Save current changes' },
      { keys: ['⌘', 'N'], description: 'Create new item' },
      { keys: ['⌘', 'E'], description: 'Export brand data' },
      { keys: ['⌘', '/'], description: 'Toggle dark / light mode' },
      { keys: ['Esc'], description: 'Close modal / palette' },
    ],
  },
  {
    label: 'View',
    shortcuts: [
      { keys: ['⌘', 'D'], description: 'Toggle debug info' },
      { keys: ['⌘', 'Shift', 'P'], description: 'Preview live site' },
      { keys: ['⌘', 'Shift', 'A'], description: 'View analytics' },
    ],
  },
];

function KbdKey({ children }: { children: string }) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-0.5 min-w-[28px] h-6 rounded-md border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-[0_1px_0_rgba(0,0,0,0.12)] font-mono">
      {children}
    </kbd>
  );
}

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[81] w-[90vw] max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-primary)]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <Keyboard className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm text-[var(--text-primary)]">Keyboard Shortcuts</h2>
                    <p className="text-xs text-[var(--text-tertiary)]">Speed up your workflow</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Close shortcuts"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Shortcut groups */}
              <div className="p-5 space-y-6">
                {shortcutGroups.map((group, gi) => (
                  <motion.div
                    key={group.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: gi * 0.05 }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-3">{group.label}</h3>
                    <div className="space-y-1">
                      {group.shortcuts.map((shortcut, si) => (
                        <div
                          key={si}
                          className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <span className="text-sm text-[var(--text-secondary)]">{shortcut.description}</span>
                          <div className="flex items-center gap-1">
                            {shortcut.keys.map((key, ki) => (
                              <KbdKey key={ki}>{key}</KbdKey>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 border-t border-[var(--border-primary)] bg-zinc-50 dark:bg-zinc-900/50">
                <p className="text-xs text-[var(--text-tertiary)] text-center">
                  Press <KbdKey>⌘</KbdKey> + <KbdKey>?</KbdKey> to toggle this panel
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to register Cmd/Ctrl + ? to open the shortcuts modal
 */
export function useKeyboardShortcutsModal() {
  const [open, setOpen] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === '?') {
      e.preventDefault();
      setOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return { open, setOpen, onClose: () => setOpen(false) };
}
