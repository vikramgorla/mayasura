'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, LayoutDashboard, Globe, MessageSquare,
  Package, FileText, Sparkles, Home, Palette, HeadphonesIcon,
  Wand2, Type, PenTool, BarChart3, Paintbrush, Newspaper,
  Settings, ShoppingBag
} from 'lucide-react';

interface CommandPaletteProps {
  brandId?: string;
}

/** Keyboard shortcut badge shown inline in command items */
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-auto hidden sm:inline-flex items-center rounded border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800">
      {children}
    </kbd>
  );
}

const itemClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800";
const iconClass = "h-4 w-4 text-zinc-400 dark:text-zinc-500";
const aiIconClass = "h-4 w-4 text-violet-500";

export function CommandPalette({ brandId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggle = useCallback(() => setOpen(o => !o), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ⌘K — Toggle command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
        return;
      }

      // Keyboard shortcuts (only when command palette is closed and brandId exists)
      if (!brandId || open) return;

      // ⌘+Shift shortcuts
      if ((e.metaKey || e.ctrlKey) && e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'p':
            e.preventDefault();
            router.push(`/dashboard/${brandId}/products`);
            return;
          case 'b':
            e.preventDefault();
            router.push(`/dashboard/${brandId}/blog`);
            return;
          case 'd':
            e.preventDefault();
            router.push(`/dashboard/${brandId}/design`);
            return;
          case 'a':
            e.preventDefault();
            router.push(`/dashboard/${brandId}/analytics`);
            return;
          case 's':
            e.preventDefault();
            router.push(`/dashboard/${brandId}/settings`);
            return;
        }
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle, brandId, open, router]);

  const runCommand = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="flex items-start justify-center pt-[20vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg mx-4"
            >
              <Command className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 border-b border-zinc-100 dark:border-zinc-800">
                  <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                  <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full h-12 bg-transparent text-sm text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                  <kbd className="hidden sm:inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-700 px-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    ESC
                  </kbd>
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                    <Command.Item onSelect={() => runCommand(() => router.push('/'))} className={itemClass}>
                      <Home className={iconClass} />
                      Home
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))} className={itemClass}>
                      <LayoutDashboard className={iconClass} />
                      Dashboard
                    </Command.Item>
                    <Command.Item onSelect={() => runCommand(() => router.push('/templates'))} className={itemClass}>
                      <Palette className={iconClass} />
                      Template Gallery
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Actions" className="text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                    <Command.Item onSelect={() => runCommand(() => router.push('/create'))} className={itemClass}>
                      <Plus className={iconClass} />
                      Create New Brand
                    </Command.Item>
                    {brandId && (
                      <>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/products`))} className={itemClass}>
                          <Package className={iconClass} />
                          Products
                          <Kbd>⌘⇧P</Kbd>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/blog`))} className={itemClass}>
                          <Newspaper className={iconClass} />
                          Blog
                          <Kbd>⌘⇧B</Kbd>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/content`))} className={itemClass}>
                          <Sparkles className={iconClass} />
                          Content Hub
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/website`))} className={itemClass}>
                          <Globe className={iconClass} />
                          Website Preview
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/chatbot`))} className={itemClass}>
                          <MessageSquare className={iconClass} />
                          Test Chatbot
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/orders`))} className={itemClass}>
                          <ShoppingBag className={iconClass} />
                          Orders
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/support`))} className={itemClass}>
                          <HeadphonesIcon className={iconClass} />
                          Customer Support
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/analytics`))} className={itemClass}>
                          <BarChart3 className={iconClass} />
                          Analytics
                          <Kbd>⌘⇧A</Kbd>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/settings`))} className={itemClass}>
                          <Settings className={iconClass} />
                          Settings
                          <Kbd>⌘⇧S</Kbd>
                        </Command.Item>
                      </>
                    )}
                  </Command.Group>

                  {brandId && (
                    <Command.Group heading="✨ AI Assist" className="text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                      <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/strategy`))} className={itemClass}>
                        <Wand2 className={aiIconClass} />
                        AI Brand Strategy
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/design`))} className={itemClass}>
                        <Paintbrush className={aiIconClass} />
                        Design Studio
                        <Kbd>⌘⇧D</Kbd>
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/content`))} className={itemClass}>
                        <PenTool className={aiIconClass} />
                        AI Copy Writer
                      </Command.Item>
                      <Command.Item onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/analytics`))} className={itemClass}>
                        <BarChart3 className={aiIconClass} />
                        AI SEO Analyzer
                      </Command.Item>
                    </Command.Group>
                  )}
                </Command.List>
                <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <span>Navigate with ↑↓, select with ↵</span>
                  <span>⌘K to toggle</span>
                </div>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
