'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '@/lib/types';
import { getTextOnColor } from '@/lib/color-utils';

interface NewsletterPopupProps {
  brand: Brand;
  templateId?: string;
  delay?: number; // ms before showing (default 30000)
}

export function NewsletterPopup({ brand, templateId = 'minimal', delay = 30000 }: NewsletterPopupProps) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const slug = brand.slug || brand.id;
  const isDark = templateId === 'bold' || templateId === 'tech' || templateId === 'neon';
  const accentColor = brand.accent_color || brand.primary_color;

  useEffect(() => {
    // Check if already dismissed
    try {
      const dismissed = localStorage.getItem(`newsletter-popup-${slug}`);
      if (dismissed) return;
    } catch { /* localStorage unavailable */ }

    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [slug, delay]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(`newsletter-popup-${slug}`, '1');
    } catch { /* localStorage unavailable */ }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/brand/${slug}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }
      setSubscribed(true);
      // Auto-dismiss after success
      setTimeout(() => {
        dismiss();
      }, 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed z-[101] inset-0 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-md pointer-events-auto overflow-hidden"
              style={{
                backgroundColor: isDark ? '#111111' : '#FFFFFF',
                borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : '12px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              }}
            >
              {/* Top accent bar */}
              <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(90deg, ${accentColor}, ${brand.primary_color})` }}
              />

              {/* Close button */}
              <button
                onClick={dismiss}
                className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center transition-colors z-10"
                style={{
                  backgroundColor: isDark ? '#FFFFFF10' : '#00000008',
                  color: isDark ? '#FFFFFF60' : '#00000040',
                }}
                aria-label="Close newsletter popup"
              >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="text-center py-4"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.15, type: 'spring', stiffness: 250, damping: 12 }}
                        className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        <motion.svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <motion.path
                            d="M8 16L14 22L24 10"
                            stroke={accentColor}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
                          />
                        </motion.svg>
                      </motion.div>
                      <p className="text-base font-semibold mb-1" style={{ color: isDark ? '#FFFFFF' : brand.primary_color }}>
                        You&apos;re in! 🎉
                      </p>
                      <p className="text-sm" style={{ color: isDark ? '#FFFFFF60' : '#00000050' }}>
                        Check your inbox for a welcome message.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {/* Icon */}
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 mx-auto text-2xl"
                        style={{ backgroundColor: `${accentColor}12` }}
                      >
                        📧
                      </div>

                      <h3
                        className="text-lg font-bold mb-2 text-center"
                        style={{
                          fontFamily: brand.font_heading,
                          color: isDark ? '#FFFFFF' : brand.primary_color,
                        }}
                      >
                        Don&apos;t miss out!
                      </h3>
                      <p className="text-sm text-center mb-6" style={{ color: isDark ? '#FFFFFF55' : '#00000055' }}>
                        Subscribe to get the latest updates, exclusive offers, and news from {brand.name}.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          className="w-full px-4 py-3 text-sm border outline-none transition-all focus:ring-2"
                          style={{
                            borderColor: isDark ? '#FFFFFF15' : '#00000010',
                            color: isDark ? '#FFFFFF' : brand.primary_color,
                            backgroundColor: isDark ? '#FFFFFF08' : '#FAFAFA',
                            borderRadius: templateId === 'playful' ? '12px' : '8px',
                          }}
                        />
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setError(''); }}
                          className={`w-full px-4 py-3 text-sm border outline-none transition-all focus:ring-2 ${error ? 'ring-2 ring-red-400' : ''}`}
                          style={{
                            borderColor: error ? '#ef4444' : isDark ? '#FFFFFF15' : '#00000010',
                            color: isDark ? '#FFFFFF' : brand.primary_color,
                            backgroundColor: isDark ? '#FFFFFF08' : '#FAFAFA',
                            borderRadius: templateId === 'playful' ? '12px' : '8px',
                          }}
                          required
                        />
                        <AnimatePresence>
                          {error && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs text-red-500"
                            >
                              {error}
                            </motion.p>
                          )}
                        </AnimatePresence>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                          style={{
                            backgroundColor: accentColor,
                            color: getTextOnColor(accentColor),
                            borderRadius: templateId === 'playful' ? '12px' : '8px',
                          }}
                        >
                          {submitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                        <p className="text-[10px] text-center" style={{ color: isDark ? '#FFFFFF25' : '#00000025' }}>
                          No spam, unsubscribe anytime.
                        </p>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
