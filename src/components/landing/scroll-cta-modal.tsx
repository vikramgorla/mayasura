'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ScrollCTAModal() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('mayasura-cta-dismissed')) {
      setDismissed(true);
      return;
    }

    const handleScroll = () => {
      // Trigger at 65% scroll depth
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 65) {
        setShow(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    // Delay attaching to avoid triggering immediately
    const timeout = setTimeout(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mayasura-cta-dismissed', '1');
    }
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] w-[90vw] max-w-md"
          >
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] shadow-2xl overflow-hidden">
              {/* Gradient header */}
              <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-6 py-8 text-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }} />
                </div>
                <button
                  onClick={dismiss}
                  className="absolute top-3 right-3 p-1.5 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
                <Sparkles className="h-8 w-8 text-white/80 mx-auto mb-3" />
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  Don&apos;t leave without your brand
                </h3>
                <p className="text-sm text-white/70">
                  Join 10,000+ founders who launched in minutes
                </p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Zap, text: 'AI generates your entire brand in seconds' },
                    { icon: Shield, text: 'Free forever — no credit card needed' },
                    { icon: Sparkles, text: 'Website, shop, blog & chatbot included' },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      </div>
                      <span className="text-sm text-[var(--text-secondary)]">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link href="/create" onClick={dismiss}>
                  <Button variant="brand" size="xl" className="w-full">
                    Create Your Brand — Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <button
                  onClick={dismiss}
                  className="block w-full text-center text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] mt-3 py-1 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
