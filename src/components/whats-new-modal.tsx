'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Zap, Shield, BarChart3, MessageSquare, Package, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CHANGELOG_KEY = 'mayasura-whats-new-v3.3-seen';

const changelog = [
  {
    version: 'v3.3',
    date: 'March 2026',
    badge: '🎉 Latest',
    badgeColor: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    entries: [
      {
        icon: Sparkles,
        color: 'text-violet-600',
        bg: 'bg-violet-50 dark:bg-violet-900/30',
        title: 'AI Brand Score',
        desc: 'Real-time health scoring with personalized recommendations to grow your brand.',
      },
      {
        icon: MessageSquare,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
        title: 'Testimonials System',
        desc: 'Collect and showcase customer testimonials. Auto-display on your site.',
      },
      {
        icon: BarChart3,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/30',
        title: 'Social Media Preview',
        desc: 'Preview how your brand looks on Instagram, Twitter, Facebook, and LinkedIn.',
      },
      {
        icon: Zap,
        color: 'text-amber-600',
        bg: 'bg-amber-50 dark:bg-amber-900/30',
        title: 'Neon Template',
        desc: 'New cyberpunk-inspired neon template with glowing accents and dark backgrounds.',
      },
      {
        icon: Package,
        color: 'text-orange-600',
        bg: 'bg-orange-50 dark:bg-orange-900/30',
        title: 'AI Voice Analyzer',
        desc: 'Analyze your brand voice and get AI-powered suggestions for consistency.',
      },
      {
        icon: Shield,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50 dark:bg-indigo-900/30',
        title: 'Performance Boost',
        desc: 'Lazy-loaded landing page sections, faster dashboard loads, and optimized APIs.',
      },
    ],
  },
  {
    version: 'v3.2',
    date: 'February 2026',
    badge: 'Previous',
    badgeColor: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400',
    entries: [
      {
        icon: Star,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50 dark:bg-yellow-900/30',
        title: 'Design Studio',
        desc: '12+ templates, 34 fonts, 16 color systems. Full no-code visual control.',
      },
      {
        icon: Zap,
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/30',
        title: 'AI Content Generation',
        desc: 'One-click blog posts, product descriptions, and SEO content powered by Claude.',
      },
    ],
  },
];

export function WhatsNewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-white">What&apos;s New</h2>
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Latest features and improvements</p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors flex-shrink-0"
                  aria-label="Close changelog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {changelog.map((release) => (
                  <div key={release.version}>
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="font-display font-bold text-base text-zinc-900 dark:text-white">{release.version}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${release.badgeColor}`}>
                        {release.badge}
                      </span>
                      <span className="text-xs text-zinc-400 ml-auto">{release.date}</span>
                    </div>
                    <div className="space-y-3">
                      {release.entries.map((entry, i) => (
                        <motion.div
                          key={entry.title}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                        >
                          <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${entry.bg}`}>
                            <entry.icon className={`h-4.5 w-4.5 ${entry.color}`} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">{entry.title}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{entry.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <p className="text-xs text-zinc-400">Keep building palaces 🏛️</p>
                <Button size="sm" variant="brand" onClick={onClose}>
                  Got it!
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to auto-show on first visit
export function useWhatsNew() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(CHANGELOG_KEY);
      if (!seen) {
        // Small delay so it doesn't pop immediately on page load
        const t = setTimeout(() => setOpen(true), 2000);
        return () => clearTimeout(t);
      }
    } catch { /* */ }
  }, []);

  const close = () => {
    setOpen(false);
    try { localStorage.setItem(CHANGELOG_KEY, '1'); } catch { /* */ }
  };

  const openManually = () => setOpen(true);

  return { open, close, openManually };
}
