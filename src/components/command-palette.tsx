'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, LayoutDashboard, Globe, MessageSquare,
  Package, FileText, Sparkles, Settings, Home, Palette, HeadphonesIcon
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
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
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
              <Command className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-2 px-4 border-b border-slate-100">
                  <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full h-12 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                  <kbd className="hidden sm:inline-flex items-center rounded-md border border-slate-200 px-1.5 text-[10px] font-medium text-slate-400">
                    ESC
                  </kbd>
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-sm text-slate-400">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Navigation" className="text-xs text-slate-400 px-2 py-1.5 font-medium">
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                    >
                      <Home className="h-4 w-4 text-slate-400" />
                      Home
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/dashboard'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      Dashboard
                    </Command.Item>
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/templates'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                    >
                      <Palette className="h-4 w-4 text-slate-400" />
                      Template Gallery
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Actions" className="text-xs text-slate-400 px-2 py-1.5 font-medium">
                    <Command.Item
                      onSelect={() => runCommand(() => router.push('/create'))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                    >
                      <Plus className="h-4 w-4 text-slate-400" />
                      Create New Brand
                    </Command.Item>
                    {brandId && (
                      <>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/content`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                        >
                          <Sparkles className="h-4 w-4 text-slate-400" />
                          Generate Content
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/products`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                        >
                          <Package className="h-4 w-4 text-slate-400" />
                          Manage Products
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/website`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                        >
                          <Globe className="h-4 w-4 text-slate-400" />
                          Website Preview
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/chatbot`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                        >
                          <MessageSquare className="h-4 w-4 text-slate-400" />
                          Test Chatbot
                        </Command.Item>
                        <Command.Item
                          onSelect={() => runCommand(() => router.push(`/dashboard/${brandId}/support`))}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer text-slate-700 hover:bg-slate-50 data-[selected=true]:bg-slate-100"
                        >
                          <HeadphonesIcon className="h-4 w-4 text-slate-400" />
                          Customer Support
                        </Command.Item>
                      </>
                    )}
                  </Command.Group>
                </Command.List>
                <div className="border-t border-slate-100 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
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
