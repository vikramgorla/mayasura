'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../layout';

const TRACKING_STEPS = [
  { key: 'confirmed', label: 'Order Confirmed', icon: '✓', description: 'Your order has been received' },
  { key: 'processing', label: 'Processing', icon: '⚙', description: 'We\'re preparing your items' },
  { key: 'shipped', label: 'Shipped', icon: '🚚', description: 'Your order is on the way' },
  { key: 'delivered', label: 'Delivered', icon: '📦', description: 'Delivered to your door' },
];

export default function OrderConfirmationPage() {
  const shop = useShop();
  const params = useParams();
  const orderId = params.orderId as string;
  const [activeStep, setActiveStep] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  // Fire confetti on mount
  useEffect(() => {
    let cancelled = false;
    import('canvas-confetti').then((confettiModule) => {
      if (cancelled) return;
      const confetti = confettiModule.default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'],
      });
      setTimeout(() => {
        if (cancelled) return;
        confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
      }, 350);
    }).catch(() => {});

    // Animate tracking steps in sequence
    const timers: ReturnType<typeof setTimeout>[] = [];
    TRACKING_STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setActiveStep(i), 400 + i * 600));
    });
    // Show email prompt after animation
    timers.push(setTimeout(() => setShowEmailPrompt(true), 3200));

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  if (!shop) return null;
  const { brand, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: templateId === 'bold' ? 700 : templateId === 'minimal' ? 400 : 600,
    letterSpacing: templateId === 'bold' ? '-0.04em' : '-0.02em',
    textTransform: (templateId === 'bold' ? 'uppercase' : 'none') as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const borderRadius = templateId === 'playful' ? '24px' : templateId === 'classic' ? '16px' : '0';
  const cardRadius = templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : '0';

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <div className={`${templateId === 'bold' ? 'max-w-4xl' : 'max-w-2xl'} mx-auto px-5 sm:px-8 py-16 sm:py-24`}>
      {/* Success card */}
      <motion.div
        className="p-8 sm:p-12 text-center mb-8"
        style={{
          backgroundColor: isDark ? '#111111' : `${accentColor}06`,
          borderRadius,
          border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
          boxShadow: templateId === 'classic' ? '8px 8px 16px rgba(0,0,0,0.04), -8px -8px 16px rgba(255,255,255,0.7)' : undefined,
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Icon */}
        <motion.div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ backgroundColor: `${accentColor}18` }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 20 }}
        >
          {templateId === 'playful' ? '🎉' : templateId === 'bold' ? (
            <span style={{ color: accentColor, fontSize: '1.5rem', fontWeight: 700 }}>✓</span>
          ) : (
            <span style={{ color: accentColor }}>✦</span>
          )}
        </motion.div>

        <motion.h1
          className="text-2xl sm:text-3xl mb-3"
          style={headingStyle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {templateId === 'playful' ? 'Order Confirmed! 🎊' : templateId === 'bold' ? 'ORDER CONFIRMED' : 'Order Confirmed'}
        </motion.h1>

        <motion.p
          className="text-sm mb-6 max-w-sm mx-auto"
          style={{ color: `${textColor}50` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Thank you! Your order has been received and will be processed shortly.
        </motion.p>

        <motion.div
          className="inline-flex items-center gap-3 px-5 py-3 mb-2"
          style={{
            backgroundColor: `${textColor}06`,
            borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
            border: templateId === 'bold' ? `1px solid ${textColor}15` : undefined,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: `${textColor}40` }}>
              Order ID
            </p>
            <p className="font-mono font-semibold text-sm">{orderId}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Tracking Timeline */}
      <motion.div
        className="p-6 sm:p-8 mb-8"
        style={{
          backgroundColor: isDark ? '#111111' : `${textColor}03`,
          borderRadius: cardRadius,
          border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
          boxShadow: templateId === 'classic' ? '6px 6px 12px rgba(0,0,0,0.03), -6px -6px 12px rgba(255,255,255,0.6)' : undefined,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-wider mb-6"
          style={{ color: `${textColor}45`, letterSpacing: '0.1em' }}
        >
          {templateId === 'bold' ? 'ORDER STATUS' : 'Order Status'}
        </h2>

        <div className="relative">
          {/* Connecting line */}
          <div
            className="absolute left-5 top-5 bottom-5 w-0.5"
            style={{ backgroundColor: `${textColor}08` }}
          />
          {/* Progress line */}
          <motion.div
            className="absolute left-5 top-5 w-0.5"
            style={{ backgroundColor: accentColor, originY: 0 }}
            initial={{ height: 0 }}
            animate={{ height: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.8 }}
          />

          <div className="space-y-6">
            {TRACKING_STEPS.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === Math.min(activeStep, 1); // stays at "processing" for demo

              return (
                <motion.div
                  key={step.key}
                  className="flex items-start gap-4 relative"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isActive ? 1 : 0.35, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.15 }}
                >
                  {/* Step dot */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm z-10 transition-all duration-500"
                    style={{
                      backgroundColor: isActive ? accentColor : `${textColor}08`,
                      color: isActive ? '#FFFFFF' : `${textColor}30`,
                      border: isCurrent ? `3px solid ${accentColor}` : 'none',
                      boxShadow: isCurrent ? `0 0 0 4px ${accentColor}25` : undefined,
                      borderRadius: templateId === 'bold' ? '0' : '50%',
                    }}
                  >
                    {i === 0 ? '✓' : i === 1 && activeStep >= 1 ? (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: 2, ease: 'linear' }}
                      >
                        ⚙
                      </motion.span>
                    ) : step.icon}
                  </div>

                  <div className="pt-1.5">
                    <p
                      className="text-sm font-medium"
                      style={{
                        color: isActive ? textColor : `${textColor}35`,
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                        letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                        fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
                      }}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: `${textColor}35` }}>
                      {i === 0 ? 'Just now' : i === 1 ? 'In progress' : i === 2 ? '2–5 business days' : '3–7 business days'}
                    </p>
                  </div>

                  {isCurrent && (
                    <motion.div
                      className="ml-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      <span
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
                      >
                        Active
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Email confirmation prompt */}
      <AnimatePresence>
        {showEmailPrompt && !emailSent && (
          <motion.div
            className="p-6 mb-8"
            style={{
              backgroundColor: isDark ? '#111111' : `${textColor}02`,
              borderRadius: cardRadius,
              border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <h3
              className="text-sm font-semibold mb-1"
              style={{
                fontFamily: brand.font_heading,
                textTransform: templateId === 'bold' ? 'uppercase' : undefined,
              }}
            >
              {templateId === 'bold' ? 'GET ORDER UPDATES' : 'Get order updates'}
            </h3>
            <p className="text-xs mb-4" style={{ color: `${textColor}45` }}>
              Enter your email to receive shipping notifications
            </p>
            <form onSubmit={handleSendEmail} className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="you@example.com"
                required
                className="flex-1 text-sm px-4 py-2.5 outline-none border transition-colors"
                style={{
                  backgroundColor: isDark ? '#1a1a1a' : 'transparent',
                  borderColor: `${textColor}15`,
                  color: textColor,
                  borderRadius: templateId === 'playful' ? '10px' : templateId === 'classic' ? '8px' : '0',
                  borderWidth: templateId === 'bold' ? '2px' : '1px',
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#FFFFFF' : bgColor,
                  borderRadius: templateId === 'playful' ? '10px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : undefined,
                }}
              >
                {templateId === 'bold' ? 'NOTIFY ME' : 'Notify Me'}
              </button>
            </form>
          </motion.div>
        )}

        {emailSent && (
          <motion.div
            className="p-5 mb-8 flex items-center gap-3"
            style={{
              backgroundColor: '#22c55e18',
              borderRadius: cardRadius,
              border: '1px solid #22c55e20',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-lg">✅</span>
            <div>
              <p className="text-sm font-medium" style={{ color: '#22c55e' }}>
                {templateId === 'playful' ? 'You\'re all set! 🎉' : 'Confirmation sent'}
              </p>
              <p className="text-xs" style={{ color: `${textColor}45` }}>
                We&apos;ll notify you at {emailInput}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href={`/shop/${slug}`}
          className="flex-1 py-3.5 text-center text-sm font-medium transition-all hover:opacity-90"
          style={{
            backgroundColor: isDark ? accentColor : textColor,
            color: isDark ? '#FFFFFF' : bgColor,
            borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
            fontWeight: templateId === 'bold' ? 700 : 500,
            letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
            textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
          }}
        >
          {templateId === 'bold' ? 'CONTINUE SHOPPING' : templateId === 'playful' ? 'Continue Shopping ✨' : 'Continue Shopping'}
        </Link>
        <Link
          href={`/site/${slug}`}
          className="flex-1 py-3.5 text-center text-sm font-medium border transition-all hover:opacity-80"
          style={{
            borderColor: `${textColor}15`,
            color: textColor,
            borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
            borderWidth: templateId === 'bold' ? '2px' : '1px',
          }}
        >
          {templateId === 'bold' ? 'BACK TO WEBSITE' : 'Back to Website'}
        </Link>
      </motion.div>
    </div>
  );
}
