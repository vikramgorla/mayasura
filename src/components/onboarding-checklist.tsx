'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Paintbrush, FileText, MessageSquare, Globe,
  CheckCircle2, Circle, X, ChevronDown, ChevronUp,
  ArrowRight, Trophy, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChecklistItem {
  id: string;
  icon: React.ElementType;
  label: string;
  desc: string;
  link: string;
  done: boolean;
  color: string;
}

interface OnboardingChecklistProps {
  brandId: string;
  productCount: number;
  contentCount: number;
  blogPostCount: number;
  hasChatbot: boolean;
  brandSlug?: string;
  hasDesignCustomization: boolean;
}

function CircularRing({
  value,
  size = 72,
  strokeWidth = 5,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 100 ? '#10b981' : value >= 60 ? '#6366f1' : value >= 30 ? '#3b82f6' : '#a78bfa';

  return (
    <svg width={size} height={size} className="transform -rotate-90 shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-zinc-100 dark:text-zinc-800"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

export function OnboardingChecklist({
  brandId,
  productCount,
  contentCount,
  blogPostCount,
  hasChatbot,
  brandSlug,
  hasDesignCustomization,
}: OnboardingChecklistProps) {
  const storageKey = `mayasura-onboarding-${brandId}`;
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setDismissed(parsed.dismissed ?? false);
          setCollapsed(parsed.collapsed ?? false);
        } catch {
          // ignore
        }
      }
    }
  }, [storageKey]);

  const items: ChecklistItem[] = [
    {
      id: 'product',
      icon: Package,
      label: 'Add your first product',
      desc: 'Start selling with a product catalog',
      link: `/dashboard/${brandId}/products`,
      done: productCount > 0,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30',
    },
    {
      id: 'design',
      icon: Paintbrush,
      label: 'Customize your design',
      desc: 'Pick a template, colors, and fonts',
      link: `/dashboard/${brandId}/design`,
      done: hasDesignCustomization,
      color: 'text-pink-600 bg-pink-50 dark:bg-pink-900/30',
    },
    {
      id: 'blog',
      icon: FileText,
      label: 'Write a blog post',
      desc: 'Drive traffic with AI-generated content',
      link: `/dashboard/${brandId}/blog`,
      done: blogPostCount > 0,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30',
    },
    {
      id: 'chatbot',
      icon: MessageSquare,
      label: 'Set up your chatbot',
      desc: 'Train your AI on your brand voice',
      link: `/dashboard/${brandId}/chatbot`,
      done: hasChatbot,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30',
    },
    {
      id: 'preview',
      icon: Globe,
      label: 'Preview your site',
      desc: 'See your brand live in the browser',
      link: brandSlug ? `/site/${brandSlug}` : `/dashboard/${brandId}/website`,
      done: contentCount > 0 || blogPostCount > 0,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30',
    },
  ];

  const doneCount = items.filter(i => i.done).length;
  const totalCount = items.length;
  const percent = Math.round((doneCount / totalCount) * 100);
  const allDone = doneCount === totalCount;

  const persist = (updates: { dismissed?: boolean; collapsed?: boolean }) => {
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem(storageKey) || '{}');
      localStorage.setItem(storageKey, JSON.stringify({ ...current, ...updates }));
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    persist({ dismissed: true });
  };

  const handleCollapse = () => {
    setCollapsed(prev => {
      persist({ collapsed: !prev });
      return !prev;
    });
  };

  if (!mounted || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-6"
      >
        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
          allDone
            ? 'border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30'
            : 'border-violet-200 dark:border-violet-800/50 bg-gradient-to-br from-violet-50/80 to-indigo-50/50 dark:from-violet-950/20 dark:to-indigo-950/20'
        }`}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center gap-4">
            {/* Progress ring */}
            <div className="relative shrink-0">
              <CircularRing value={percent} />
              <div className="absolute inset-0 flex items-center justify-center">
                {allDone ? (
                  <Trophy className="h-5 w-5 text-emerald-500" />
                ) : (
                  <span className="text-xs font-bold text-[var(--text-primary)]">{percent}%</span>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              {allDone ? (
                <>
                  <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-400">
                    🎉 You&apos;re all set!
                  </p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70 mt-0.5">
                    Your brand is ready to grow. Keep going!
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    Get started — {doneCount}/{totalCount} complete
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                    {totalCount - doneCount} step{totalCount - doneCount !== 1 ? 's' : ''} left to launch your digital palace
                  </p>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleCollapse}
                className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
              {allDone && (
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-black/5 dark:bg-white/5">
            <motion.div
              className={`h-full rounded-full transition-colors duration-500 ${allDone ? 'bg-emerald-500' : 'bg-violet-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </div>

          {/* Checklist items */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="overflow-hidden"
              >
                <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {item.done ? (
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/50 dark:bg-white/5 opacity-70">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-[var(--text-secondary)] line-through">{item.label}</p>
                          </div>
                        </div>
                      ) : (
                        <Link href={item.link} target={item.id === 'preview' && brandSlug ? '_blank' : undefined} rel={item.id === 'preview' && brandSlug ? 'noopener noreferrer' : undefined}>
                          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors cursor-pointer group border border-transparent hover:border-violet-200 dark:hover:border-violet-800/50">
                            <div className={`h-6 w-6 rounded-md flex items-center justify-center shrink-0 ${item.color}`}>
                              <item.icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[var(--text-primary)] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">{item.label}</p>
                              <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5 hidden sm:block leading-tight">{item.desc}</p>
                            </div>
                            <ArrowRight className="h-3 w-3 text-[var(--text-tertiary)] group-hover:text-violet-500 transition-colors shrink-0 mt-0.5 opacity-0 group-hover:opacity-100" />
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {allDone && (
                  <div className="px-5 pb-4 flex items-center gap-3">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Amazing work! Your brand ecosystem is fully set up.
                    </p>
                    <button onClick={handleDismiss} className="ml-auto text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
