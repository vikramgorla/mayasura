'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Paintbrush, FileText, MessageSquare, Eye,
  Check, ArrowRight, X, Sparkles, ChevronDown, ChevronUp,
  Database, Rocket, Globe, HelpCircle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OnboardingChecklistProps {
  brandId: string;
  brandName?: string;
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

// ─── Progress Ring ────────────────────────────────────────────────
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

// ─── Confetti ────────────────────────────────────────────────────
function triggerConfetti() {
  import('canvas-confetti').then(({ default: confetti }) => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#7C3AED', '#6366F1', '#EC4899', '#10B981', '#F59E0B'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  });
}

// ─── Welcome Modal ───────────────────────────────────────────────
function WelcomeModal({ brandName, onClose, onTour }: { brandName: string; onClose: () => void; onTour: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient header */}
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-white text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 15 }}
              className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4"
            >
              <Rocket className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Welcome to Mayasura! 🏛️
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-sm"
            >
              {brandName ? `Your brand "${brandName}" is ready to build.` : "Let's build your digital palace."}
            </motion.p>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 text-center">
              You&apos;re moments away from having a complete digital presence — website, shop, chatbot, and blog.
              All in one place.
            </p>

            <div className="space-y-3 mb-6">
              {[
                { icon: Globe, label: 'Beautiful brand website', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
                { icon: Package, label: 'E-commerce store ready', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
                { icon: MessageSquare, label: 'AI chatbot trained on your brand', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800"
                >
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                  <Check className="h-4 w-4 text-emerald-500 ml-auto" />
                </motion.div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                Skip Tour
              </Button>
              <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={onTour}>
                <Sparkles className="h-4 w-4 mr-2" />
                Take a Tour
              </Button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Guided Tour Tooltip ──────────────────────────────────────────
const TOUR_STEPS = [
  {
    id: 'dashboard',
    title: 'Your Command Center',
    description: 'This is your dashboard — a real-time view of your brand\'s performance, activity, and health score.',
    emoji: '🏛️',
    position: { top: '80px', left: '50%' },
  },
  {
    id: 'stats',
    title: 'Live Analytics',
    description: 'Track page views, visitors, subscribers, and revenue at a glance. All updated in real time.',
    emoji: '📊',
    position: { top: '180px', left: '50%' },
  },
  {
    id: 'quickactions',
    title: 'Quick Actions',
    description: 'Add products, write blog posts, check analytics, or design your brand — all in one click.',
    emoji: '⚡',
    position: { top: '320px', left: '50%' },
  },
  {
    id: 'design',
    title: 'Design Studio',
    description: 'Make it uniquely yours. Choose from templates, palettes, fonts, and button styles with live preview.',
    emoji: '🎨',
    position: { top: '50%', left: '50%' },
  },
  {
    id: 'done',
    title: 'You\'re All Set! 🎉',
    description: 'That\'s a quick look around. Complete the checklist below to launch your brand.',
    emoji: '🚀',
    position: { top: '50%', left: '50%' },
  },
];

function GuidedTour({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      />
      <motion.div
        key={step}
        initial={{ opacity: 0, scale: 0.9, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
      >
        {/* Progress bar */}
        <div className="h-1 bg-zinc-100 dark:bg-zinc-800">
          <motion.div
            className="h-full bg-violet-500"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / TOUR_STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="p-5">
          <div className="flex items-start gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-xl flex-shrink-0">
              {current.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white text-sm">{current.title}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{current.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-zinc-400">{step + 1} of {TOUR_STEPS.length}</span>
            <div className="flex gap-2">
              {step > 0 && (
                <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)} className="text-xs h-8">
                  Back
                </Button>
              )}
              <Button
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"
                onClick={() => {
                  if (isLast) {
                    onClose();
                  } else {
                    setStep(s => s + 1);
                  }
                }}
              >
                {isLast ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1.5" />
                    Done
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 h-6 w-6 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-400 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sample Data Button ───────────────────────────────────────────
function SampleDataButton({ brandId, onDone }: { brandId: string; onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleLoadSampleData = useCallback(async () => {
    setLoading(true);
    try {
      // Create sample products
      const sampleProducts = [
        {
          name: 'Premium Starter Kit',
          description: 'Everything you need to get started. High-quality materials, beautifully packaged.',
          price: 49.99,
          status: 'active',
          tags: ['starter', 'popular'],
          images: [],
        },
        {
          name: 'Pro Bundle',
          description: 'Our best-selling bundle for serious users. Includes all premium features.',
          price: 99.99,
          status: 'active',
          tags: ['pro', 'bundle'],
          images: [],
        },
      ];

      for (const product of sampleProducts) {
        await fetch(`/api/brands/${brandId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        });
      }

      // Create sample blog post
      await fetch(`/api/brands/${brandId}/blog`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Welcome to Our Brand Blog',
          content: '# Welcome!\n\nWe\'re excited to share our story with you. This is a sample post to show what your blog will look like. Replace this with your own content to connect with your audience.\n\n## Our Mission\n\nWe believe in creating products that make a real difference. Every item we craft is designed with care, quality, and you in mind.\n\n## What\'s Next\n\nStay tuned for updates, stories, and exclusive content.',
          excerpt: 'We\'re excited to share our story with you. This is a sample post to show what your blog will look like.',
          status: 'published',
          tags: ['welcome', 'introduction'],
        }),
      });

      setDone(true);
      onDone();
    } catch {
      // silently fail - demo data is non-critical
    }
    setLoading(false);
  }, [brandId, onDone]);

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"
      >
        <Check className="h-3.5 w-3.5" />
        Demo data loaded!
      </motion.div>
    );
  }

  return (
    <button
      onClick={handleLoadSampleData}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors disabled:opacity-50"
    >
      <Database className="h-3.5 w-3.5" />
      {loading ? 'Loading...' : 'Use demo data'}
    </button>
  );
}

// ─── Main Onboarding Checklist ────────────────────────────────────
export function OnboardingChecklist({
  brandId,
  brandName,
  productCount,
  contentCount,
  blogPostCount,
  hasChatbot,
  brandSlug,
  hasDesignCustomization,
}: OnboardingChecklistProps) {
  const [dismissed, setDismissed] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});
  const [showWelcome, setShowWelcome] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [confettiFired, setConfettiFired] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load dismissed / manual checks from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`onboarding-${brandId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.dismissed) setDismissed(true);
        if (parsed.manualChecks) setManualChecks(parsed.manualChecks);
        if (parsed.collapsed) setCollapsed(parsed.collapsed);
        if (parsed.confettiFired) setConfettiFired(true);
      } else {
        // First time — show welcome modal
        setTimeout(() => setShowWelcome(true), 800);
      }
    } catch {
      // ignore
    }
  }, [brandId]);

  // Persist to localStorage
  const persist = (updates: { dismissed?: boolean; manualChecks?: Record<string, boolean>; collapsed?: boolean; confettiFired?: boolean }) => {
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
      id: 'brand',
      label: 'Create your brand',
      description: 'Your brand is live and ready to customize',
      href: `/dashboard/${brandId}/settings`,
      icon: Rocket,
      color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600',
      isComplete: true, // Always complete since they're here
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
      id: 'product',
      label: 'Add your first product',
      description: 'Start building your product catalog',
      href: `/dashboard/${brandId}/products`,
      icon: Package,
      color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600',
      isComplete: productCount > 0 || !!manualChecks['product'],
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
      isComplete: hasChatbot || contentCount > 0 || !!manualChecks['chatbot'],
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

  // Fire confetti when all complete
  const prevAllCompleteRef = useRef(false);
  useEffect(() => {
    if (allComplete && !prevAllCompleteRef.current && !confettiFired) {
      triggerConfetti();
      setConfettiFired(true);
      persist({ confettiFired: true });
    }
    prevAllCompleteRef.current = allComplete;
  }, [allComplete, confettiFired]);

  const handleDismiss = () => {
    setDismissed(true);
    persist({ dismissed: true });
  };

  const handleToggleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    persist({ collapsed: next });
  };

  if (dismissed) return null;

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal
          brandName={brandName || ''}
          onClose={() => setShowWelcome(false)}
          onTour={() => {
            setShowWelcome(false);
            setShowTour(true);
          }}
        />
      )}

      {/* Guided Tour */}
      {showTour && (
        <GuidedTour onClose={() => setShowTour(false)} />
      )}

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
              <div className="flex items-start justify-between mb-4">
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
                        ? "You've completed all the steps. Your digital palace is ready."
                        : `${completedCount} of ${totalCount} steps complete — let's build your palace`
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowTour(true)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Start guided tour"
                    title="Take a tour"
                  >
                    <HelpCircle className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleToggleCollapse}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label={collapsed ? 'Expand checklist' : 'Collapse checklist'}
                  >
                    {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    aria-label="Dismiss onboarding checklist"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Collapsible content */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    {/* Checklist items */}
                    <div className="space-y-1.5 mb-4">
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
                            transition={{ delay: i * 0.04, duration: 0.3 }}
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

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <SampleDataButton
                        brandId={brandId}
                        onDone={() => setRefreshKey(k => k + 1)}
                      />

                      {allComplete ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex items-center gap-2"
                        >
                          <p className="text-xs text-zinc-500">Your brand ecosystem is live.</p>
                          <Button size="sm" variant="outline" onClick={handleDismiss} className="text-xs h-7">
                            Dismiss
                          </Button>
                        </motion.div>
                      ) : (
                        <p className="text-xs text-zinc-400">{totalCount - completedCount} steps left</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      {/* Hidden ref to suppress unused refreshKey warning */}
      <span className="hidden" aria-hidden="true" data-refresh={refreshKey} />
    </>
  );
}
