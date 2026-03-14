'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, LayoutDashboard, Globe, MessageSquare,
  Package, FileText, Sparkles, Home, Palette, HeadphonesIcon,
  Wand2, Type, PenTool, BarChart3, Paintbrush
} from 'lucide-react';

interface CommandPaletteProps {
  brandId?: string;
}

export function CommandPalette({ brandId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const toggle = useCallback(() => setOpen(o => !o), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

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
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Home className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      Home
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/dashboard'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <LayoutDashboard className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      Dashboard
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/templates'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Palette className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      Template Gallery
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Actions" className="text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/create'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                    >
                      <Plus className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                      Create New Brand
                    </Command.Item>
                    {brandId && (
                      <>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/content`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                        >
                          <Sparkles className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          Generate Content
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/products`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                        >
                          <Package className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          Manage Products
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/website`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                        >
                          <Globe className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          Website Preview
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/chatbot`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                        >
                          <MessageSquare className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          Test Chatbot
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/support`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                        >
                          <HeadphonesIcon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                          Customer Support
                        </Command.Item>
                      </>
                    )}
                  </Command.Group>

                  {brandId && (
                    <Command.Group heading="✨ AI Assist" className="text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                      <Command.Item
                        onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/strategy`))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                      >
                        <Wand2 className="h-4 w-4 text-violet-500" />
                        AI Brand Strategy
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/design`))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                      >
                        <Paintbrush className="h-4 w-4 text-violet-500" />
                        AI Color Palette Generator
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/content`))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                      >
                        <PenTool className="h-4 w-4 text-violet-500" />
                        AI Copy Writer
                      </Command.Item>
                      <Command.Item
                        onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/analytics`))}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800"
                      >
                        <BarChart3 className="h-4 w-4 text-violet-500" />
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
