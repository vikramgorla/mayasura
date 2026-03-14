'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Paintbrush, FileText, MessageSquare, Eye,
  Check, ArrowRight, X, Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OnboardingChecklistProps {
  brandId: string;
  productCount: number;
  contentCount: number;
  blogPostCount: number;
  hasChatbot: boolean;
  brandSlug?: string | null;
  hasDesignCustomization: boolean;
}

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isComplete: boolean;
  external?: boolean;
}

function ProgressRing({ percent, size = 56, strokeWidth = 4 }: { percent: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
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
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-zinc-900 dark:text-white">{Math.round(percent)}%</span>
      </div>
    </div>
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
  const [dismissed, setDismissed] = useState(false);
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});

  // Load dismissed / manual checks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`onboarding-${brandId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.dismissed) setDismissed(true);
        if (parsed.manualChecks) setManualChecks(parsed.manualChecks);
      }
    } catch {
      // ignore
    }
  }, [brandId]);

  // Persist to localStorage
  const persist = (updates: { dismissed?: boolean; manualChecks?: Record<string, boolean> }) => {
    try {
      const stored = localStorage.getItem(`onboarding-${brandId}`);
      const current = stored ? JSON.parse(stored) : {};
      const next = { ...current, ...updates };
      localStorage.setItem(`onboarding-${brandId}`, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const items: ChecklistItem[] = [
    {
      id: 'product',
      label: 'Add your first product',
      description: 'Start building your product catalog',
      href: `/dashboard/${brandId}/products`,
      icon: Package,
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
      isComplete: productCount > 0 || !!manualChecks['product'],
    },
    {
      id: 'design',
      label: 'Customize your design',
      description: 'Make it yours with colors, fonts & templates',
      href: `/dashboard/${brandId}/design`,
      icon: Paintbrush,
      color: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600',
      isComplete: hasDesignCustomization || !!manualChecks['design'],
    },
    {
      id: 'blog',
      label: 'Write a blog post',
      description: 'Share your story and boost SEO',
      href: `/dashboard/${brandId}/blog`,
      icon: FileText,
      color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600',
      isComplete: blogPostCount > 0 || !!manualChecks['blog'],
    },
    {
      id: 'chatbot',
      label: 'Configure chatbot',
      description: 'AI assistant trained on your brand voice',
      href: `/dashboard/${brandId}/chatbot`,
      icon: MessageSquare,
      color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600',
      isComplete: hasChatbot || !!manualChecks['chatbot'],
    },
    {
      id: 'preview',
      label: 'Preview your site',
      description: 'See how visitors experience your brand',
      href: brandSlug ? `/site/${brandSlug}` : `/dashboard/${brandId}/website`,
      icon: Eye,
      color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
      isComplete: !!manualChecks['preview'],
      external: !!brandSlug,
    },
  ];

  const completedCount = items.filter(i => i.isComplete).length;
  const totalCount = items.length;
  const percent = Math.round((completedCount / totalCount) * 100);
  const allComplete = completedCount === totalCount;

  const handleDismiss = () => {
    setDismissed(true);
    persist({ dismissed: true });
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-violet-200/50 dark:border-violet-800/30 bg-gradient-to-br from-white via-violet-50/20 to-white dark:from-zinc-900 dark:via-violet-950/10 dark:to-zinc-900">
          <CardContent className="p-5 sm:p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-4">
                <ProgressRing percent={percent} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">
                      {allComplete ? '🎉 All set! Your brand is ready' : 'Set up your brand'}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {allComplete
                      ? 'You\'ve completed all the steps. Your digital palace is ready.'
                      : `${completedCount} of ${totalCount} steps complete — let's build your palace`
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Dismiss onboarding checklist"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-1.5">
              {items.map((item, i) => {
                const ItemWrapper = item.external
                  ? ({ children, className }: { children: React.ReactNode; className: string }) => (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
                    )
                  : ({ children, className }: { children: React.ReactNode; className: string }) => (
                      <Link href={item.href} className={className}>{children}</Link>
                    );

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <ItemWrapper
                      className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-200 group ${
                        item.isComplete
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/10'
                          : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer'
                      }`}
                    >
                      {/* Check circle */}
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        item.isComplete
                          ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                          : 'border-2 border-zinc-200 dark:border-zinc-700 group-hover:border-violet-400 dark:group-hover:border-violet-500'
                      }`}>
                        {item.isComplete && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </motion.div>
                        )}
                      </div>

                      {/* Icon */}
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
                        <item.icon className="h-4 w-4" />
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          item.isComplete
                            ? 'text-zinc-400 dark:text-zinc-500 line-through'
                            : 'text-zinc-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400'
                        } transition-colors`}>
                          {item.label}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:block">
                          {item.description}
                        </p>
                      </div>

                      {/* Arrow */}
                      {!item.isComplete && (
                        <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                      )}
                    </ItemWrapper>
                  </motion.div>
                );
              })}
            </div>

            {/* All complete CTA */}
            {allComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between"
              >
                <p className="text-xs text-zinc-500">Your brand ecosystem is live and ready.</p>
                <Button size="sm" variant="outline" onClick={handleDismiss} className="text-xs">
                  Dismiss
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
