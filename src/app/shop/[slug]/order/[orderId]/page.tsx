'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../layout';
import {
  Twitter,
  Facebook,
  Share2,
  Link2,
  Check,
  Printer,
  Mail,
  Package,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

// ── Tracking steps ─────────────────────────────────────────────────────────────
const TRACKING_STEPS = [
  {
    key: 'confirmed',
    label: 'Order Confirmed',
    icon: '✓',
    description: 'Your order has been received',
    time: 'Just now',
  },
  {
    key: 'processing',
    label: 'Processing',
    icon: '⚙',
    description: "We're preparing your items",
    time: 'In progress',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    icon: '🚚',
    description: 'Your order is on the way',
    time: '2–5 business days',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    icon: '📦',
    description: 'Delivered to your door',
    time: '3–7 business days',
  },
];

// ── Social share buttons ───────────────────────────────────────────────────────
function SocialShareButtons({
  orderId,
  brandName,
  textColor,
  accentColor,
  templateId,
}: {
  orderId: string;
  brandName: string;
  textColor: string;
  accentColor: string;
  templateId: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Just ordered from ${brandName}! 🛍️`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareButtons = [
    {
      id: 'twitter',
      label: templateId === 'bold' ? 'TWITTER' : 'Twitter',
      icon: <Twitter className="h-3.5 w-3.5" />,
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
        ),
      bg: '#1DA1F2',
    },
    {
      id: 'facebook',
      label: templateId === 'bold' ? 'FACEBOOK' : 'Facebook',
      icon: <Facebook className="h-3.5 w-3.5" />,
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
        ),
      bg: '#1877F2',
    },
    {
      id: 'whatsapp',
      label: templateId === 'bold' ? 'WHATSAPP' : 'WhatsApp',
      icon: <Share2 className="h-3.5 w-3.5" />,
      onClick: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
          '_blank',
        ),
      bg: '#25D366',
    },
    {
      id: 'copy',
      label: copied ? (templateId === 'bold' ? 'COPIED!' : 'Copied!') : (templateId === 'bold' ? 'COPY LINK' : 'Copy Link'),
      icon: copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />,
      onClick: handleCopy,
      bg: accentColor,
    },
  ];

  const btnRadius =
    templateId === 'playful'
      ? '9999px'
      : templateId === 'classic'
      ? '8px'
      : templateId === 'bold'
      ? '0'
      : '4px';

  return (
    <div className="flex flex-wrap gap-2">
      {shareButtons.map((btn) => (
        <motion.button
          key={btn.id}
          onClick={btn.onClick}
          className="flex items-center gap-2 px-3 py-2 text-white text-xs font-medium transition-all hover:opacity-90"
          style={{
            backgroundColor: btn.bg,
            borderRadius: btnRadius,
            fontWeight: templateId === 'bold' ? 700 : 500,
            letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
            fontSize: templateId === 'bold' ? '0.6rem' : '0.75rem',
          }}
          whileTap={{ scale: 0.94 }}
        >
          {btn.icon}
          {btn.label}
        </motion.button>
      ))}
    </div>
  );
}

// ── Email receipt preview ──────────────────────────────────────────────────────
function EmailReceiptPreview({
  orderId,
  brandName,
  textColor,
  accentColor,
  isDark,
  templateId,
}: {
  orderId: string;
  brandName: string;
  textColor: string;
  accentColor: string;
  isDark: boolean;
  templateId: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const cardRadius =
    templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : '0';

  return (
    <motion.div
      className="p-5 mb-8 cursor-pointer"
      style={{
        backgroundColor: isDark ? '#0a0a0a' : `${textColor}02`,
        borderRadius: cardRadius,
        border: templateId === 'bold'
          ? `2px solid ${textColor}10`
          : `1px solid ${textColor}06`,
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}18` }}
          >
            <Mail className="h-4 w-4" style={{ color: accentColor }} />
          </div>
          <div>
            <p
              className="text-sm font-semibold"
              style={{
                color: textColor,
                fontWeight: templateId === 'bold' ? 700 : 600,
                textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
              }}
            >
              {templateId === 'bold' ? 'EMAIL RECEIPT PREVIEW' : 'Email Receipt Preview'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: `${textColor}45` }}>
              {expanded ? 'Click to collapse' : 'See what your receipt will look like'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4" style={{ color: `${textColor}40` }} />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 rounded-lg overflow-hidden border"
              style={{
                borderColor: `${textColor}10`,
                borderRadius: templateId === 'playful' ? '12px' : '6px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Email header */}
              <div
                className="px-6 py-4 text-center"
                style={{ backgroundColor: isDark ? '#111' : `${accentColor}10` }}
              >
                <p
                  className="text-base font-bold mb-0.5"
                  style={{ color: accentColor }}
                >
                  {brandName}
                </p>
                <p className="text-xs" style={{ color: `${textColor}50` }}>
                  Order Confirmation
                </p>
              </div>

              {/* Email body */}
              <div
                className="px-6 py-5"
                style={{ backgroundColor: isDark ? '#0d0d0d' : '#ffffff' }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: textColor }}>
                  Thank you for your order! 🎉
                </p>
                <p className="text-xs mb-4" style={{ color: `${textColor}50` }}>
                  Hi there, your order has been confirmed. Here&apos;s a summary:
                </p>

                <div
                  className="rounded p-3 mb-4"
                  style={{
                    backgroundColor: isDark ? '#181818' : `${textColor}04`,
                    borderRadius: '6px',
                  }}
                >
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: `${textColor}50` }}>Order ID</span>
                    <span className="font-mono font-semibold" style={{ color: textColor }}>
                      #{orderId.slice(0, 12)}...
                    </span>
                  </div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: `${textColor}50` }}>Date</span>
                    <span style={{ color: textColor }}>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: `${textColor}50` }}>Status</span>
                    <span className="font-semibold" style={{ color: '#22c55e' }}>
                      Confirmed ✓
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-3 p-3 rounded"
                  style={{
                    backgroundColor: isDark ? '#181818' : `${textColor}03`,
                    borderRadius: '6px',
                  }}
                >
                  <div
                    className="h-10 w-10 flex-shrink-0 rounded"
                    style={{ backgroundColor: `${textColor}08` }}
                  />
                  <div className="flex-1">
                    <p className="text-xs font-medium" style={{ color: textColor }}>
                      Your ordered item(s)
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: `${textColor}40` }}>
                      Details will appear in your full receipt
                    </p>
                  </div>
                </div>

                <p className="text-xs mt-4 text-center" style={{ color: `${textColor}35` }}>
                  You&apos;ll receive a full receipt at your registered email. Questions?{' '}
                  <span style={{ color: accentColor }}>Reply to this email.</span>
                </p>
              </div>

              {/* Email footer */}
              <div
                className="px-6 py-3 text-center text-[10px]"
                style={{
                  backgroundColor: isDark ? '#0a0a0a' : `${textColor}04`,
                  color: `${textColor}30`,
                }}
              >
                © {new Date().getFullYear()} {brandName} · Unsubscribe
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Recommended products ───────────────────────────────────────────────────────
function RecommendedProducts({
  products,
  slug,
  textColor,
  accentColor,
  isDark,
  templateId,
  brand,
}: {
  products: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    image_url: string | null;
  }>;
  slug: string;
  textColor: string;
  accentColor: string;
  isDark: boolean;
  templateId: string;
  brand: { font_heading?: string };
}) {
  if (products.length === 0) return null;

  const cardRadius =
    templateId === 'playful' ? '20px' : templateId === 'classic' ? '12px' : '0';
  const imgRadius =
    templateId === 'playful' ? '14px' : templateId === 'classic' ? '8px' : '0';

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6 }}
    >
      <h2
        className="text-sm font-semibold uppercase tracking-wider mb-5"
        style={{
          color: `${textColor}45`,
          letterSpacing: templateId === 'bold' ? '0.12em' : '0.08em',
        }}
      >
        {templateId === 'bold'
          ? 'YOU MIGHT ALSO LIKE'
          : templateId === 'playful'
          ? 'You might also like ✨'
          : 'You might also like'}
      </h2>

      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            className="flex-shrink-0 w-40 sm:w-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 + i * 0.08 }}
            whileHover={{ y: -3 }}
          >
            <Link href={`/shop/${slug}/product/${product.id}`} className="group block">
              <div
                className="aspect-square overflow-hidden flex items-center justify-center mb-2.5 relative"
                style={{
                  backgroundColor: isDark ? '#111' : `${textColor}04`,
                  borderRadius: imgRadius,
                  border: templateId === 'bold'
                    ? `2px solid ${textColor}10`
                    : `1px solid ${textColor}06`,
                }}
              >
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 160px, 200px"
                    loading="lazy"
                  />
                ) : (
                  <Package
                    className="h-8 w-8"
                    style={{ color: `${textColor}15` }}
                  />
                )}
              </div>
              <p
                className="text-xs font-medium truncate group-hover:opacity-60 transition-opacity"
                style={{
                  color: textColor,
                  fontFamily: brand.font_heading,
                  textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                  letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                }}
              >
                {product.name}
              </p>
              {product.price > 0 && (
                <p className="text-xs mt-0.5 font-semibold" style={{ color: accentColor }}>
                  {product.currency} {product.price.toFixed(2)}
                </p>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function OrderConfirmationPage() {
  const shop = useShop();
  const params = useParams();
  const orderId = params.orderId as string;
  const [activeStep, setActiveStep] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    window.print();
  };

  if (!shop) return null;
  const { brand, products, websiteTemplate: template } = shop;
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

  // Recommended products: up to 4, random from available
  const recommended = products
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; }
        }
        .print-only { display: none; }
      `}</style>

      <div
        ref={printRef}
        className={`${templateId === 'bold' ? 'max-w-4xl' : 'max-w-2xl'} mx-auto px-5 sm:px-8 py-16 sm:py-24`}
      >
        {/* ── Success card ─────────────────────────── */}
        <motion.div
          className="p-8 sm:p-12 text-center mb-8"
          style={{
            backgroundColor: isDark ? '#111111' : `${accentColor}06`,
            borderRadius,
            border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
            boxShadow:
              templateId === 'classic'
                ? '8px 8px 16px rgba(0,0,0,0.04), -8px -8px 16px rgba(255,255,255,0.7)'
                : undefined,
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
            {templateId === 'playful' ? (
              '🎉'
            ) : templateId === 'bold' ? (
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
            {templateId === 'playful'
              ? 'Order Confirmed! 🎊'
              : templateId === 'bold'
              ? 'ORDER CONFIRMED'
              : 'Order Confirmed'}
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
              borderRadius:
                templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
              border: templateId === 'bold' ? `1px solid ${textColor}15` : undefined,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div>
              <p
                className="text-[10px] uppercase tracking-wider mb-0.5"
                style={{ color: `${textColor}40` }}
              >
                Order ID
              </p>
              <p className="font-mono font-semibold text-sm">{orderId}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Tracking Timeline ─────────────────────── */}
        <motion.div
          className="p-6 sm:p-8 mb-8"
          style={{
            backgroundColor: isDark ? '#111111' : `${textColor}03`,
            borderRadius: cardRadius,
            border:
              templateId === 'bold'
                ? `2px solid ${textColor}10`
                : `1px solid ${textColor}06`,
            boxShadow:
              templateId === 'classic'
                ? '6px 6px 12px rgba(0,0,0,0.03), -6px -6px 12px rgba(255,255,255,0.6)'
                : undefined,
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
              animate={{
                height: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.8 }}
            />

            <div className="space-y-6">
              {TRACKING_STEPS.map((step, i) => {
                const isActive = i <= activeStep;
                const isCurrent = i === Math.min(activeStep, 1);

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
                        backgroundColor: isActive
                          ? accentColor
                          : `${textColor}08`,
                        color: isActive ? '#FFFFFF' : `${textColor}30`,
                        border: isCurrent ? `3px solid ${accentColor}` : 'none',
                        boxShadow: isCurrent
                          ? `0 0 0 4px ${accentColor}25`
                          : undefined,
                        borderRadius: templateId === 'bold' ? '0' : '50%',
                      }}
                    >
                      {i === 0 ? (
                        '✓'
                      ) : i === 1 && activeStep >= 1 ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: 2, ease: 'linear' }}
                        >
                          ⚙
                        </motion.span>
                      ) : (
                        step.icon
                      )}
                    </div>

                    <div className="pt-1.5 flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{
                          color: isActive ? textColor : `${textColor}35`,
                          fontFamily: brand.font_heading,
                          textTransform:
                            templateId === 'bold' ? 'uppercase' : undefined,
                          letterSpacing:
                            templateId === 'bold' ? '0.06em' : undefined,
                          fontSize:
                            templateId === 'bold' ? '0.6875rem' : undefined,
                        }}
                      >
                        {step.label}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: `${textColor}35` }}
                      >
                        {step.time}
                      </p>
                    </div>

                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                      >
                        <span
                          className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: `${accentColor}18`,
                            color: accentColor,
                          }}
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

        {/* ── Share your purchase ────────────────────── */}
        <motion.div
          className="p-6 mb-8 no-print"
          style={{
            backgroundColor: isDark ? '#111111' : `${textColor}02`,
            borderRadius: cardRadius,
            border:
              templateId === 'bold'
                ? `2px solid ${textColor}10`
                : `1px solid ${textColor}06`,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3
            className="text-sm font-semibold mb-1"
            style={{
              fontFamily: brand.font_heading,
              color: textColor,
              textTransform: templateId === 'bold' ? 'uppercase' : undefined,
              letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
              fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
            }}
          >
            {templateId === 'bold' ? 'SHARE YOUR PURCHASE' : templateId === 'playful' ? 'Share your purchase 🎉' : 'Share your purchase'}
          </h3>
          <p className="text-xs mb-4" style={{ color: `${textColor}45` }}>
            Let your friends know what you just ordered!
          </p>
          <SocialShareButtons
            orderId={orderId}
            brandName={brand.name}
            textColor={textColor}
            accentColor={accentColor}
            templateId={templateId}
          />
        </motion.div>

        {/* ── Email receipt preview ──────────────────── */}
        <EmailReceiptPreview
          orderId={orderId}
          brandName={brand.name}
          textColor={textColor}
          accentColor={accentColor}
          isDark={isDark}
          templateId={templateId}
        />

        {/* ── Email confirmation prompt ──────────────── */}
        <AnimatePresence>
          {showEmailPrompt && !emailSent && (
            <motion.div
              className="p-6 mb-8 no-print"
              style={{
                backgroundColor: isDark ? '#111111' : `${textColor}02`,
                borderRadius: cardRadius,
                border:
                  templateId === 'bold'
                    ? `2px solid ${textColor}10`
                    : `1px solid ${textColor}06`,
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
                  color: textColor,
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
                    borderRadius:
                      templateId === 'playful'
                        ? '10px'
                        : templateId === 'classic'
                        ? '8px'
                        : '0',
                    borderWidth: templateId === 'bold' ? '2px' : '1px',
                  }}
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: isDark ? accentColor : textColor,
                    color: isDark ? '#FFFFFF' : bgColor,
                    borderRadius:
                      templateId === 'playful'
                        ? '10px'
                        : templateId === 'classic'
                        ? '8px'
                        : '0',
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
                  {templateId === 'playful' ? "You're all set! 🎉" : 'Confirmation sent'}
                </p>
                <p className="text-xs" style={{ color: `${textColor}45` }}>
                  We&apos;ll notify you at {emailInput}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Recommended products ───────────────────── */}
        {recommended.length > 0 && (
          <RecommendedProducts
            products={recommended}
            slug={slug}
            textColor={textColor}
            accentColor={accentColor}
            isDark={isDark}
            templateId={templateId}
            brand={brand}
          />
        )}

        {/* ── Actions ───────────────────────────────── */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          {/* Primary CTA: Continue Shopping */}
          <Link
            href={`/shop/${slug}`}
            className="flex items-center justify-center gap-2 w-full py-4 text-sm font-medium transition-all hover:opacity-90 no-print"
            style={{
              backgroundColor: isDark ? accentColor : textColor,
              color: isDark ? '#FFFFFF' : bgColor,
              borderRadius:
                templateId === 'playful'
                  ? '9999px'
                  : templateId === 'classic'
                  ? '8px'
                  : '0',
              fontWeight: templateId === 'bold' ? 700 : 600,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
            }}
          >
            <ShoppingBag className="h-4 w-4" />
            {templateId === 'bold'
              ? 'CONTINUE SHOPPING'
              : templateId === 'playful'
              ? 'Continue Shopping ✨'
              : 'Continue Shopping'}
          </Link>

          {/* Secondary row */}
          <div className="flex gap-3 no-print">
            <Link
              href={`/site/${slug}`}
              className="flex-1 py-3.5 text-center text-sm font-medium border transition-all hover:opacity-80"
              style={{
                borderColor: `${textColor}15`,
                color: textColor,
                borderRadius:
                  templateId === 'playful'
                    ? '9999px'
                    : templateId === 'classic'
                    ? '8px'
                    : '0',
                borderWidth: templateId === 'bold' ? '2px' : '1px',
              }}
            >
              {templateId === 'bold' ? 'BACK TO WEBSITE' : 'Back to Website'}
            </Link>

            {/* Print button */}
            <motion.button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
              style={{
                borderColor: `${textColor}15`,
                color: `${textColor}60`,
                borderRadius:
                  templateId === 'playful'
                    ? '9999px'
                    : templateId === 'classic'
                    ? '8px'
                    : '0',
                borderWidth: templateId === 'bold' ? '2px' : '1px',
              }}
              whileTap={{ scale: 0.95 }}
              title="Print order confirmation"
            >
              <Printer className="h-4 w-4" />
              {templateId === 'bold' ? 'PRINT' : 'Print'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
