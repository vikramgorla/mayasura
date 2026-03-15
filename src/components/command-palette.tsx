'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, LayoutDashboard, Globe, MessageSquare,
  Package, FileText, Sparkles, Home, Palette, HeadphonesIcon,
  Wand2, Type, PenTool, BarChart3, Paintbrush, Newspaper,
  Settings, ShoppingBag, Clock, Zap, ArrowRight, Command,
  BookOpen, Share2, MessageSquareQuote, Star,
} from 'lucide-react';

interface CommandPaletteProps {
  brandId?: string;
}

// ── Fuzzy match ──────────────────────────────────────────────────────────────
function fuzzyMatch(haystack: string, needle: string): boolean {
  if (!needle) return true;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  // Substring match first (fast path)
  if (h.includes(n)) return true;
  // Fuzzy: all chars of needle in order within haystack
  let hi = 0;
  for (let ni = 0; ni < n.length; ni++) {
    const found = h.indexOf(n[ni], hi);
    if (found === -1) return false;
    hi = found + 1;
  }
  return true;
}

// ── Types ────────────────────────────────────────────────────────────────────
interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

const RECENTLY_USED_KEY = 'mayasura_cmd_recently_used';
const MAX_RECENT = 5;

function getRecentlyUsed(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENTLY_USED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentlyUsed(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getRecentlyUsed();
    const updated = [id, ...current.filter((i) => i !== id)].slice(0, MAX_RECENT);
    localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/** Keyboard shortcut badge */
function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-auto hidden sm:inline-flex items-center rounded border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-50 dark:bg-zinc-800">
      {children}
    </kbd>
  );
}

export function CommandPalette({ brandId }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const toggle = useCallback(() => setOpen((o) => !o), []);

  // ── Register global keyboard shortcuts ───────────────────────────────────
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // ⌘K / Ctrl+K — Toggle command palette
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
        return;
      }

      // Ctrl+/ — also opens command palette
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
        return;
      }

      // Shortcuts only when palette is closed and brandId exists
      if (!brandId || open) return;

      // Ctrl+N — New product
      if (e.key === 'n' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        // Only if no input is focused
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return;
        e.preventDefault();
        router.push(`/dashboard/${brandId}/products?new=1`);
        return;
      }

      // Ctrl+B — New blog post
      if (e.key === 'b' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return;
        e.preventDefault();
        router.push(`/dashboard/${brandId}/blog?new=1`);
        return;
      }

      // Ctrl+D — Design editor
      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && !e.shiftKey && !e.altKey) {
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || (active as HTMLElement).isContentEditable)) return;
        e.preventDefault();
        router.push(`/dashboard/${brandId}/design`);
        return;
      }

      // ⌘+Shift shortcuts (existing, kept for compatibility)
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

  // Load recently used when palette opens
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setRecentlyUsed(getRecentlyUsed());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Build all command items ──────────────────────────────────────────────
  const allItems = useCallback((): CommandItem[] => {
    const items: CommandItem[] = [
      // Navigation
      {
        id: 'nav-home',
        label: 'Home',
        icon: Home,
        category: 'Navigation',
        action: () => router.push('/'),
      },
      {
        id: 'nav-dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        category: 'Navigation',
        action: () => router.push('/dashboard'),
      },
      {
        id: 'nav-templates',
        label: 'Template Gallery',
        icon: Palette,
        category: 'Navigation',
        action: () => router.push('/templates'),
      },
      // Actions
      {
        id: 'action-new-brand',
        label: 'Create New Brand',
        icon: Plus,
        category: 'Actions',
        action: () => router.push('/create'),
      },
    ];

    if (brandId) {
      items.push(
        // Brand pages
        {
          id: 'page-overview',
          label: 'Overview',
          description: 'Brand dashboard overview',
          icon: LayoutDashboard,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}`),
        },
        {
          id: 'page-products',
          label: 'Products',
          description: 'Manage your products',
          icon: Package,
          category: 'Pages',
          shortcut: '⌘⇧P',
          action: () => router.push(`/dashboard/${brandId}/products`),
        },
        {
          id: 'page-blog',
          label: 'Blog',
          description: 'Manage blog posts',
          icon: Newspaper,
          category: 'Pages',
          shortcut: '⌘⇧B',
          action: () => router.push(`/dashboard/${brandId}/blog`),
        },
        {
          id: 'page-design',
          label: 'Design Studio',
          description: 'Edit brand design',
          icon: Paintbrush,
          category: 'Pages',
          shortcut: '⌃D',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/design`),
        },
        {
          id: 'page-content',
          label: 'Content Hub',
          description: 'AI content generation',
          icon: Sparkles,
          category: 'Pages',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/content`),
        },
        {
          id: 'page-website',
          label: 'Website Preview',
          description: 'Preview your live site',
          icon: Globe,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/website`),
        },
        {
          id: 'page-chatbot',
          label: 'Chatbot',
          description: 'Test your AI chatbot',
          icon: MessageSquare,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/chatbot`),
        },
        {
          id: 'page-orders',
          label: 'Orders',
          description: 'View customer orders',
          icon: ShoppingBag,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/orders`),
        },
        {
          id: 'page-testimonials',
          label: 'Testimonials',
          description: 'Manage customer testimonials',
          icon: MessageSquareQuote,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/testimonials`),
        },
        {
          id: 'page-social',
          label: 'Social Preview',
          description: 'Preview social media cards',
          icon: Share2,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/social`),
        },
        {
          id: 'page-support',
          label: 'Customer Support',
          description: 'Manage support tickets',
          icon: HeadphonesIcon,
          category: 'Pages',
          action: () => router.push(`/dashboard/${brandId}/support`),
        },
        {
          id: 'page-analytics',
          label: 'Analytics',
          description: 'View brand analytics',
          icon: BarChart3,
          category: 'Pages',
          shortcut: '⌘⇧A',
          action: () => router.push(`/dashboard/${brandId}/analytics`),
        },
        {
          id: 'page-settings',
          label: 'Settings',
          description: 'Brand settings',
          icon: Settings,
          category: 'Pages',
          shortcut: '⌘⇧S',
          action: () => router.push(`/dashboard/${brandId}/settings`),
        },
        // Quick Actions
        {
          id: 'action-new-product',
          label: 'New Product',
          description: 'Create a new product',
          icon: Plus,
          category: 'Quick Actions',
          shortcut: '⌃N',
          iconColor: 'text-emerald-500',
          action: () => router.push(`/dashboard/${brandId}/products?new=1`),
        },
        {
          id: 'action-new-blog',
          label: 'New Blog Post',
          description: 'Write a new blog post',
          icon: BookOpen,
          category: 'Quick Actions',
          shortcut: '⌃B',
          iconColor: 'text-blue-500',
          action: () => router.push(`/dashboard/${brandId}/blog?new=1`),
        },
        {
          id: 'action-publish',
          label: 'Publish Website',
          description: 'Go live with your site',
          icon: Zap,
          category: 'Quick Actions',
          iconColor: 'text-amber-500',
          action: () => router.push(`/dashboard/${brandId}/website`),
        },
        // AI features
        {
          id: 'ai-strategy',
          label: 'AI Brand Strategy',
          description: 'Generate brand strategy',
          icon: Wand2,
          category: '✨ AI Assist',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/strategy`),
        },
        {
          id: 'ai-copy',
          label: 'AI Copy Writer',
          description: 'Generate marketing copy',
          icon: PenTool,
          category: '✨ AI Assist',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/content`),
        },
        {
          id: 'ai-seo',
          label: 'AI SEO Analyzer',
          description: 'Optimize for search engines',
          icon: BarChart3,
          category: '✨ AI Assist',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/analytics`),
        },
        {
          id: 'ai-fonts',
          label: 'AI Font Pairing',
          description: 'Get font recommendations',
          icon: Type,
          category: '✨ AI Assist',
          iconColor: 'text-violet-500',
          action: () => router.push(`/dashboard/${brandId}/design`),
        },
      );
    }

    return items;
  }, [brandId, router]);

  // ── Filtered results ─────────────────────────────────────────────────────
  const items = allItems();
  const filtered = query
    ? items.filter((item) =>
        fuzzyMatch(item.label, query) ||
        (item.description && fuzzyMatch(item.description, query)) ||
        fuzzyMatch(item.category, query)
      )
    : items;

  // Group filtered items by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Recently used section (when no query)
  const recentItems = !query
    ? recentlyUsed
        .map((id) => items.find((i) => i.id === id))
        .filter(Boolean) as CommandItem[]
    : [];

  // Flat list for keyboard nav (recent first if no query)
  const flatList: CommandItem[] = !query
    ? [...recentItems, ...filtered.filter((i) => !recentlyUsed.includes(i.id))]
    : filtered;

  // Clamp selectedIndex
  const safeIndex = Math.min(selectedIndex, flatList.length - 1);

  const runCommand = useCallback(
    (item: CommandItem) => {
      saveRecentlyUsed(item.id);
      setOpen(false);
      item.action();
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && safeIndex >= 0 && flatList[safeIndex]) {
      e.preventDefault();
      runCommand(flatList[safeIndex]);
    }
  };

  // Reset selected when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // ── Category icons ───────────────────────────────────────────────────────
  const categoryIcon: Record<string, React.ComponentType<{ className?: string }>> = {
    'Navigation': Globe,
    'Pages': LayoutDashboard,
    'Quick Actions': Zap,
    'Actions': Plus,
    '✨ AI Assist': Sparkles,
  };

  // Build flat index map for keyboard nav across groups
  let flatIdx = 0;
  // Map item.id → flat position (for isSelected)
  const itemToFlatIdx: Record<string, number> = {};
  if (!query && recentItems.length > 0) {
    for (const item of recentItems) {
      itemToFlatIdx[`recent_${item.id}`] = flatIdx++;
    }
  }
  for (const cat of Object.keys(grouped)) {
    for (const item of grouped[cat]) {
      if (!query && recentlyUsed.includes(item.id)) continue; // skip if already shown in recent
      itemToFlatIdx[item.id] = flatIdx++;
    }
  }

  const renderItem = (item: CommandItem, idPrefix: string = '') => {
    const idx = itemToFlatIdx[`${idPrefix}${item.id}`];
    const isSelected = idx === safeIndex;
    const Icon = item.icon;
    return (
      <motion.button
        key={`${idPrefix}${item.id}`}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.12, delay: (idx ?? 0) * 0.02 }}
        onClick={() => runCommand(item)}
        onMouseEnter={() => setSelectedIndex(idx ?? 0)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors"
        style={{
          backgroundColor: isSelected
            ? 'var(--cmd-selected-bg, rgba(99,102,241,0.1))'
            : 'transparent',
        }}
      >
        <div
          className={`h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
            isSelected ? 'bg-violet-100 dark:bg-violet-900/40' : 'bg-zinc-100 dark:bg-zinc-800'
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              item.iconColor ??
              (isSelected
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-zinc-400 dark:text-zinc-500')
            }`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
            {item.label}
          </p>
          {item.description && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{item.description}</p>
          )}
        </div>
        {item.shortcut && (
          <Kbd>{item.shortcut}</Kbd>
        )}
        {isSelected && !item.shortcut && (
          <ArrowRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
        )}
      </motion.button>
    );
  };

  const CatIcon = ({ cat }: { cat: string }) => {
    const Icon = categoryIcon[cat] ?? FileText;
    return <Icon className="h-3 w-3" />;
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
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-2 px-4 border-b border-zinc-100 dark:border-zinc-800">
                  <Search className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Type a command or search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-12 bg-transparent text-sm text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <kbd className="hidden sm:inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-700 px-1.5 text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                    ESC
                  </kbd>
                </div>

                {/* Results list */}
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {flatList.length === 0 && (
                    <div className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
                      No results for &ldquo;{query}&rdquo;
                    </div>
                  )}

                  {/* Recently used */}
                  {!query && recentItems.length > 0 && (
                    <div className="mb-2">
                      <p className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                        <Clock className="h-3 w-3" />
                        Recently Used
                      </p>
                      {recentItems.map((item) => renderItem(item, 'recent_'))}
                    </div>
                  )}

                  {/* Grouped results */}
                  {Object.entries(grouped).map(([cat, catItems]) => {
                    // In non-query mode, filter out recently used from categories
                    const displayItems = !query
                      ? catItems.filter((i) => !recentlyUsed.includes(i.id))
                      : catItems;
                    if (displayItems.length === 0) return null;
                    return (
                      <div key={cat} className="mb-2">
                        <p className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 px-2 py-1.5 font-medium">
                          <CatIcon cat={cat} />
                          {cat}
                        </p>
                        {displayItems.map((item) => renderItem(item))}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 px-4 py-2 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <span>↑↓ navigate · ↵ select · ESC close</span>
                  <span className="flex items-center gap-1">
                    <Command className="h-3 w-3" />
                    K to toggle
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
