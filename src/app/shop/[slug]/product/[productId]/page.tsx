'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../../layout';
import { ProductMeta, BreadcrumbMeta } from '@/components/site/site-meta';

// ── Star Input ────────────────────────────────────────────────────────────────
function StarInput({ value, onChange, color }: { value: number; onChange: (v: number) => void; color: string }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <svg className="h-7 w-7" viewBox="0 0 24 24" fill={(hovered || value) >= i ? color : 'none'} stroke={color} strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

// ── Star Display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating, size = 16, color = '#f59e0b' }: { rating: number; size?: number; color?: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} style={{ width: size, height: size }} viewBox="0 0 24 24" fill={i <= rating ? color : 'none'} stroke={color} strokeWidth={1.5} opacity={i <= rating ? 1 : 0.3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

// ── Product Reviews Section ───────────────────────────────────────────────────
interface ReviewData {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: number;
  helpful_count: number;
  created_at: string;
}

interface ReviewStats {
  total: number;
  avg: number;
  distribution: Array<{ rating: number; count: number }>;
}

function ProductReviews({
  slug, productId, textColor, accentColor, bgColor, isDark,
}: {
  slug: string; productId: string; textColor: string; accentColor: string; bgColor: string; isDark: boolean;
}) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, avg: 0, distribution: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());

  const [form, setForm] = useState({
    author_name: '',
    author_email: '',
    rating: 0,
    title: '',
    review_body: '',
    hp_field: '', // honeypot
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/public/brand/${slug}/products/${productId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setStats(data.stats || { total: 0, avg: 0, distribution: [] });
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [slug, productId]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.author_name.trim()) e.author_name = 'Name is required';
    if (!form.author_email.trim() || !form.author_email.includes('@')) e.author_email = 'Valid email required';
    if (!form.rating) e.rating = 'Please select a rating';
    if (!form.review_body.trim() || form.review_body.trim().length < 5) e.review_body = 'Review must be at least 5 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/brand/${slug}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
        setShowForm(false);
        setForm({ author_name: '', author_email: '', rating: 0, title: '', review_body: '', hp_field: '' });
      }
    } catch { /* silent */ }
    setSubmitting(false);
  };

  const handleHelpful = async (reviewId: string) => {
    if (helpfulVoted.has(reviewId)) return;
    setHelpfulVoted(prev => new Set([...prev, reviewId]));
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r));
    try {
      await fetch(`/api/public/brand/${slug}/products/${productId}/reviews`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId }),
      });
    } catch { /* silent */ }
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  }

  const borderColor = `${textColor}10`;
  const mutedColor = `${textColor}55`;

  return (
    <motion.section
      className="mt-16 pt-12 border-t"
      style={{ borderColor }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: textColor }}>
            Customer Reviews
          </h2>
          {stats.total > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <StarDisplay rating={Math.round(stats.avg)} color={accentColor} size={16} />
              <span className="text-sm font-semibold" style={{ color: textColor }}>
                {stats.avg.toFixed(1)}
              </span>
              <span className="text-sm" style={{ color: mutedColor }}>
                ({stats.total} review{stats.total !== 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>
        {!submitted && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ backgroundColor: accentColor, color: '#fff' }}
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {stats.total > 0 && (
        <div className="mb-8 max-w-xs space-y-1.5">
          {[5, 4, 3, 2, 1].map(r => {
            const dist = stats.distribution.find(d => d.rating === r);
            const count = dist?.count ?? 0;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={r} className="flex items-center gap-2">
                <span className="text-xs w-3" style={{ color: mutedColor }}>{r}</span>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={accentColor} stroke={accentColor} strokeWidth={1.5} opacity={0.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${textColor}10` }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: accentColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <span className="text-xs w-5 text-right" style={{ color: mutedColor }}>{count}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 p-5 rounded-2xl border overflow-hidden"
            style={{ borderColor, backgroundColor: `${textColor}04` }}
          >
            <h3 className="text-base font-semibold mb-4" style={{ color: textColor }}>Your Review</h3>
            <div className="space-y-4">
              {/* Honeypot - hidden from real users */}
              <input
                type="text"
                name="hp_field"
                value={form.hp_field}
                onChange={e => setForm(f => ({ ...f, hp_field: e.target.value }))}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: mutedColor }}>Rating *</label>
                <StarInput value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} color={accentColor} />
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: mutedColor }}>Your Name *</label>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-1"
                    style={{ borderColor, color: textColor, outlineColor: accentColor }}
                    placeholder="Jane Doe"
                  />
                  {errors.author_name && <p className="text-xs text-red-500 mt-1">{errors.author_name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: mutedColor }}>Email *</label>
                  <input
                    type="email"
                    value={form.author_email}
                    onChange={e => setForm(f => ({ ...f, author_email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-1"
                    style={{ borderColor, color: textColor, outlineColor: accentColor }}
                    placeholder="jane@example.com"
                  />
                  {errors.author_email && <p className="text-xs text-red-500 mt-1">{errors.author_email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: mutedColor }}>Review Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-1"
                  style={{ borderColor, color: textColor, outlineColor: accentColor }}
                  placeholder="Summarize your experience"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: mutedColor }}>Your Review *</label>
                <textarea
                  value={form.review_body}
                  onChange={e => setForm(f => ({ ...f, review_body: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent focus:outline-none focus:ring-1 resize-none"
                  style={{ borderColor, color: textColor, outlineColor: accentColor }}
                  placeholder="Tell others about your experience..."
                />
                {errors.review_body && <p className="text-xs text-red-500 mt-1">{errors.review_body}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
                style={{ backgroundColor: accentColor, color: '#fff' }}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Submitted confirmation */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 rounded-xl border"
          style={{ borderColor: `${accentColor}40`, backgroundColor: `${accentColor}08` }}
        >
          <p className="text-sm font-medium" style={{ color: accentColor }}>
            ✓ Thank you! Your review has been submitted for moderation.
          </p>
        </motion.div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="py-8 text-center text-sm" style={{ color: mutedColor }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm" style={{ color: mutedColor }}>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="pb-6 border-b last:border-0"
              style={{ borderColor }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: textColor }}>{review.author_name}</span>
                    {review.verified_purchase ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        ✓ Verified Purchase
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <StarDisplay rating={review.rating} color={accentColor} size={13} />
                    <span className="text-xs" style={{ color: mutedColor }}>{timeAgo(review.created_at)}</span>
                  </div>
                </div>
              </div>

              {review.title && (
                <p className="text-sm font-semibold mb-1.5" style={{ color: textColor }}>{review.title}</p>
              )}
              <p className="text-sm leading-relaxed mb-3" style={{ color: mutedColor }}>{review.body}</p>

              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulVoted.has(review.id)}
                className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-70 disabled:opacity-50"
                style={{ color: mutedColor }}
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V2.75a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.822-4.385.297-.77.754-1.235 1.234-1.235H9" />
                </svg>
                Helpful ({review.helpful_count})
                {helpfulVoted.has(review.id) && ' · Thanks!'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ── Share buttons ─────────────────────────────────────────────────────────────
function ShareButtons({ url, name, textColor, accentColor }: { url: string; name: string; textColor: string; accentColor: string }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${name}`)}&url=${encodeURIComponent(url)}`, '_blank');
  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`${name} — ${url}`)}`, '_blank');

  return (
    <div className="flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider font-medium" style={{ color: `${textColor}40` }}>Share</span>
      <motion.button
        onClick={copyLink}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all"
        style={{ borderColor: `${textColor}15`, color: copied ? accentColor : `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Copy link"
      >
        {copied ? '✓' : '🔗'}
      </motion.button>
      <motion.button
        onClick={shareTwitter}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all hover:opacity-70"
        style={{ borderColor: `${textColor}15`, color: `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Share on X (Twitter)"
      >
        𝕏
      </motion.button>
      <motion.button
        onClick={shareWhatsApp}
        className="h-8 w-8 flex items-center justify-center rounded-full border text-xs transition-all hover:opacity-70"
        style={{ borderColor: `${textColor}15`, color: `${textColor}50` }}
        whileTap={{ scale: 0.85 }}
        title="Share on WhatsApp"
      >
        💬
      </motion.button>
    </div>
  );
}

// ── Stock indicator ───────────────────────────────────────────────────────────
function StockIndicator({ stockCount, textColor, accentColor }: { stockCount?: number; textColor: string; accentColor: string }) {
  if (stockCount === undefined || stockCount === null) return null;
  if (stockCount === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#EF4444' }}>
        <span className="h-2 w-2 rounded-full bg-red-500" />
        Out of Stock
      </span>
    );
  }
  if (stockCount <= 5) {
    return (
      <motion.span
        className="inline-flex items-center gap-1.5 text-xs font-semibold"
        style={{ color: '#F97316' }}
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        <span className="h-2 w-2 rounded-full bg-orange-500" />
        Only {stockCount} left — order soon!
      </motion.span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#22C55E' }}>
      <span className="h-2 w-2 rounded-full bg-green-500" />
      In Stock
    </span>
  );
}

// ── Image gallery ─────────────────────────────────────────────────────────────
function ImageGallery({
  images,
  productName,
  textColor,
  accentColor,
  borderRadius,
  isDark,
  templateId,
}: {
  images: string[];
  productName: string;
  textColor: string;
  accentColor: string;
  borderRadius: string;
  isDark: boolean;
  templateId: string;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div>
      {/* Main image */}
      <div
        ref={containerRef}
        className="aspect-square overflow-hidden flex items-center justify-center relative cursor-zoom-in"
        style={{
          backgroundColor: isDark ? '#111' : `${textColor}04`,
          borderRadius: templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : '0',
          border: templateId === 'bold' ? `2px solid ${textColor}10` : undefined,
        }}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          {images.length > 0 ? (
            <motion.div
              key={activeImage}
              className="w-full h-full"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{
                opacity: 1,
                scale: isZoomed ? 1.12 : 1,
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={images[activeImage]}
                alt={productName}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              className="flex items-center justify-center w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <svg className="w-16 h-16" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom hint */}
        {images.length > 0 && !isZoomed && (
          <motion.div
            className="absolute bottom-3 right-3 px-2 py-1 rounded text-[9px] font-medium"
            style={{ backgroundColor: `${textColor}80`, color: '#fff', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Hover to zoom
          </motion.div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveImage(i)}
              className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 overflow-hidden transition-all relative"
              style={{
                borderRadius: templateId === 'playful' ? '12px' : templateId === 'classic' ? '8px' : '0',
                border: `${i === activeImage ? '2' : '1'}px solid ${i === activeImage ? accentColor : `${textColor}10`}`,
                opacity: i === activeImage ? 1 : 0.55,
              }}
              whileHover={{ opacity: 0.85, scale: 1.04 }}
              whileTap={{ scale: 0.92 }}
            >
              <Image
                src={img}
                alt={`${productName} view ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type TabId = 'description' | 'specifications' | 'reviews';
const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'reviews', label: 'Reviews' },
];

function ProductTabs({
  product,
  textColor,
  accentColor,
  borderRadius,
  isDark,
  templateId,
}: {
  product: { name: string; description: string; price: number; currency: string; category: string | null };
  textColor: string;
  accentColor: string;
  borderRadius: string;
  isDark: boolean;
  templateId: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>('description');

  return (
    <div className="mt-2">
      {/* Tab nav */}
      <div className="flex border-b" style={{ borderColor: `${textColor}10` }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative pb-3 pr-5 text-sm font-medium transition-colors"
              style={{
                color: isActive ? textColor : `${textColor}40`,
                textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
              }}
            >
              {tab.label}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 right-5 h-0.5"
                  style={{ backgroundColor: accentColor }}
                  layoutId="tab-underline"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-5">
        <AnimatePresence mode="wait">
          {activeTab === 'description' && (
            <motion.div
              key="description"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {product.description ? (
                <p className="text-sm leading-relaxed" style={{ color: `${textColor}60` }}>
                  {product.description}
                </p>
              ) : (
                <p className="text-sm italic" style={{ color: `${textColor}30` }}>No description available.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'specifications' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="space-y-2.5">
                {[
                  { label: 'Category', value: product.category || 'General' },
                  { label: 'Currency', value: product.currency || 'USD' },
                  { label: 'Price', value: `${product.currency || 'USD'} ${product.price?.toFixed(2) || '0.00'}` },
                  { label: 'SKU', value: 'N/A' },
                  { label: 'Weight', value: 'N/A' },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2 border-b"
                    style={{ borderColor: `${textColor}07` }}
                  >
                    <span className="text-xs uppercase tracking-wider font-medium" style={{ color: `${textColor}40` }}>{row.label}</span>
                    <span className="text-sm font-medium" style={{ color: textColor }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⭐</div>
                <p className="text-sm font-medium mb-1" style={{ color: textColor }}>No reviews yet</p>
                <p className="text-xs" style={{ color: `${textColor}40` }}>Be the first to review this product.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Sticky Add to Cart bar ────────────────────────────────────────────────────
function StickyAddToCartBar({
  product,
  quantity,
  onAddToCart,
  addedToCart,
  textColor,
  bgColor,
  accentColor,
  isDark,
  templateId,
  slug,
}: {
  product: { name: string; price: number; currency: string; image_url: string | null };
  quantity: number;
  onAddToCart: () => void;
  addedToCart: boolean;
  textColor: string;
  bgColor: string;
  accentColor: string;
  isDark: boolean;
  templateId: string;
  slug: string;
}) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );
    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  return (
    <>
      <div ref={sentinelRef} />
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 border-t"
            style={{
              backgroundColor: isDark ? '#111' : bgColor,
              borderColor: `${textColor}10`,
              backdropFilter: 'blur(12px)',
            }}
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
              {/* Product thumb */}
              {product.image_url && (
                <div
                  className="h-12 w-12 flex-shrink-0 overflow-hidden rounded relative"
                  style={{ backgroundColor: isDark ? '#222' : `${textColor}06` }}
                >
                  <Image
                    src={product.image_url}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{
                    fontFamily: undefined,
                    textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                    letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                  }}
                >
                  {product.name}
                </p>
                {product.price > 0 && (
                  <p className="text-sm font-bold" style={{ color: accentColor }}>
                    {product.currency} {(product.price * quantity).toFixed(2)}
                  </p>
                )}
              </div>
              <motion.button
                onClick={onAddToCart}
                className="flex-shrink-0 px-5 py-2.5 text-sm font-medium transition-all"
                style={{
                  backgroundColor: isDark ? accentColor : textColor,
                  color: isDark ? '#000' : bgColor,
                  borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                  fontWeight: templateId === 'bold' ? 700 : 500,
                  letterSpacing: templateId === 'bold' ? '0.06em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
                }}
                whileTap={{ scale: 0.95 }}
              >
                {addedToCart ? (templateId === 'playful' ? '✅ Added!' : '✓ Added') : (templateId === 'bold' ? 'ADD TO CART' : 'Add to Cart')}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const shop = useShop();
  const params = useParams();
  const productId = params.productId as string;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!shop) return null;
  const { brand, products, addToCart, cartCount, websiteTemplate: template } = shop;
  const slug = brand.slug || brand.id;
  const templateId = template?.id || 'minimal';
  const tp = template?.preview;

  const isDark = templateId === 'bold';
  const textColor = isDark ? '#FFFFFF' : brand.primary_color;
  const bgColor = isDark ? '#000000' : brand.secondary_color;
  const accentColor = brand.accent_color || textColor;

  const headingStyle: React.CSSProperties = {
    fontFamily: brand.font_heading,
    fontWeight: tp?.typography.headingWeight || (templateId === 'bold' ? '700' : '600'),
    letterSpacing: tp?.typography.headingTracking || (templateId === 'bold' ? '-0.04em' : '-0.02em'),
    textTransform: (tp?.typography.headingCase || (templateId === 'bold' ? 'uppercase' : 'normal')) as React.CSSProperties['textTransform'],
    color: textColor,
  };

  const containerWidth = templateId === 'bold' ? 'max-w-7xl' : 'max-w-6xl';
  const borderRadius = templateId === 'playful' ? '24px' : templateId === 'classic' ? '12px' : '0';

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h1 className="text-2xl font-semibold mb-4" style={headingStyle}>Product not found</h1>
        <Link href={`/shop/${slug}`} className="text-sm font-medium transition-opacity hover:opacity-60" style={{ color: accentColor }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  // Gallery images
  const images = product.image_url ? [product.image_url] : [];

  // Related products
  const related = products
    .filter((p) => p.id !== product.id && (product.category ? p.category === product.category : true))
    .slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price || 0,
        currency: product.currency || 'USD',
        image_url: product.image_url || undefined,
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const addBtnStyle: React.CSSProperties = (() => {
    if (templateId === 'bold') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '0',
      fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
      fontSize: '0.75rem', padding: '1rem 2.5rem',
    };
    if (templateId === 'playful') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '9999px',
      fontWeight: 600, fontSize: '0.9375rem', padding: '0.875rem 2.5rem',
      boxShadow: `0 8px 32px ${accentColor}30`,
    };
    if (templateId === 'classic') return {
      backgroundColor: accentColor, color: '#FFFFFF', borderRadius: '8px',
      fontWeight: 500, fontSize: '0.9375rem', padding: '0.875rem 2.5rem',
      boxShadow: '3px 3px 6px rgba(0,0,0,0.06), -3px -3px 6px rgba(255,255,255,0.6)',
    };
    return {
      backgroundColor: textColor, color: bgColor, borderRadius: '0',
      fontWeight: 500, fontSize: '0.875rem', padding: '0.875rem 2.5rem',
    };
  })();

  const qtyBtnStyle: React.CSSProperties = {
    borderColor: `${textColor}15`,
    borderRadius: templateId === 'playful' ? '10px' : templateId === 'classic' ? '8px' : '0',
    borderWidth: templateId === 'bold' ? '2px' : '1px',
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mayasura.app';
  const productUrl = `${baseUrl}/shop/${slug}/product/${product.id}`;

  return (
    <>
      <StickyAddToCartBar
        product={product}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        addedToCart={addedToCart}
        textColor={textColor}
        bgColor={bgColor}
        accentColor={accentColor}
        isDark={isDark}
        templateId={templateId}
        slug={slug}
      />

      <div className={`${containerWidth} mx-auto px-5 sm:px-8 py-12 sm:py-16 pb-24`}>
        <ProductMeta
          org={{ brandName: brand.name, description: brand.description, url: `${baseUrl}/shop/${slug}`, logoUrl: brand.logo_url }}
          canonicalUrl={productUrl}
          product={{ name: product.name, description: product.description, price: product.price, currency: product.currency, imageUrl: product.image_url }}
        />
        <BreadcrumbMeta items={[
          { name: brand.name, url: `${baseUrl}/site/${slug}` },
          { name: 'Shop', url: `${baseUrl}/shop/${slug}` },
          ...(product.category ? [{ name: product.category, url: `${baseUrl}/shop/${slug}?category=${encodeURIComponent(product.category)}` }] : []),
          { name: product.name, url: productUrl },
        ]} />

        {/* Breadcrumb */}
        <motion.nav
          className="mb-8 flex items-center gap-2 text-sm flex-wrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/shop/${slug}`}
            className="transition-opacity hover:opacity-60"
            style={{
              color: `${textColor}50`,
              fontWeight: templateId === 'bold' ? 700 : 400,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
            }}
          >
            {templateId === 'bold' ? 'SHOP' : 'Shop'}
          </Link>
          <span style={{ color: `${textColor}25` }}>{templateId === 'bold' ? '/' : '›'}</span>
          {product.category && (
            <>
              <Link
                href={`/shop/${slug}?category=${encodeURIComponent(product.category)}`}
                className="transition-opacity hover:opacity-60"
                style={{
                  color: `${textColor}50`,
                  fontWeight: templateId === 'bold' ? 700 : 400,
                  letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
                  textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
                  fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
                }}
              >
                {product.category}
              </Link>
              <span style={{ color: `${textColor}25` }}>{templateId === 'bold' ? '/' : '›'}</span>
            </>
          )}
          <span
            className="truncate max-w-[180px] sm:max-w-xs"
            style={{
              color: textColor,
              fontWeight: templateId === 'bold' ? 700 : 500,
              letterSpacing: templateId === 'bold' ? '0.08em' : undefined,
              textTransform: templateId === 'bold' ? 'uppercase' as const : undefined,
              fontSize: templateId === 'bold' ? '0.6875rem' : '0.8125rem',
            }}
          >
            {product.name}
          </span>
        </motion.nav>

        {/* Product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ImageGallery
              images={images}
              productName={product.name}
              textColor={textColor}
              accentColor={accentColor}
              borderRadius={borderRadius}
              isDark={isDark}
              templateId={templateId}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-start"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.category && (
              <motion.span
                className="text-xs font-medium uppercase tracking-wider mb-3 block"
                style={{ color: accentColor, letterSpacing: templateId === 'bold' ? '0.12em' : '0.06em' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {product.category}
              </motion.span>
            )}

            <h1
              className="mb-4"
              style={{
                ...headingStyle,
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                lineHeight: 1.15,
              }}
            >
              {product.name}
            </h1>

            {/* Stock */}
            <div className="mb-4">
              <StockIndicator stockCount={product.stock_count} textColor={textColor} accentColor={accentColor} />
            </div>

            {/* Price */}
            {product.price != null && product.price > 0 ? (
              <p
                className="text-2xl sm:text-3xl font-bold mb-6"
                style={{ color: accentColor, fontWeight: templateId === 'bold' ? 800 : 700 }}
              >
                {product.currency || 'USD'} {product.price.toFixed(2)}
              </p>
            ) : (
              <p className="text-lg mb-6" style={{ color: `${textColor}40` }}>Free</p>
            )}

            {/* Sentinel for sticky bar */}
            <div id="add-to-cart-sentinel" />

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: `${textColor}50` }}
              >
                {templateId === 'bold' ? 'QTY' : 'Quantity'}
              </span>
              <div className="flex items-center">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 flex items-center justify-center text-sm font-bold border transition-colors"
                  style={qtyBtnStyle}
                  whileHover={{ backgroundColor: `${textColor}08` }}
                  whileTap={{ scale: 0.85 }}
                >
                  −
                </motion.button>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={quantity}
                    className="h-10 w-12 flex items-center justify-center text-sm font-bold border-y"
                    style={{ borderColor: `${textColor}15`, borderWidth: templateId === 'bold' ? '2px 0' : '1px 0' }}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                  >
                    {quantity}
                  </motion.div>
                </AnimatePresence>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 flex items-center justify-center text-sm font-bold border transition-colors"
                  style={qtyBtnStyle}
                  whileHover={{ backgroundColor: `${textColor}08` }}
                  whileTap={{ scale: 0.85 }}
                >
                  +
                </motion.button>
              </div>
            </div>

            {/* Add to cart + view cart */}
            <div className="flex flex-wrap gap-3 mb-6">
              <motion.button
                onClick={handleAddToCart}
                className="transition-all hover:opacity-90"
                style={addBtnStyle}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={addedToCart ? 'added' : 'add'}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'inline-block' }}
                  >
                    {addedToCart
                      ? (templateId === 'playful' ? '🎉 Added to Cart!' : '✓ Added')
                      : (templateId === 'bold' ? 'ADD TO CART' : templateId === 'playful' ? 'Add to Cart 🛒' : 'Add to Cart')
                    }
                  </motion.span>
                </AnimatePresence>
              </motion.button>

              {cartCount > 0 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  <Link
                    href={`/shop/${slug}/cart`}
                    className="inline-block px-6 py-3.5 text-sm font-medium border transition-all hover:opacity-80"
                    style={{
                      borderColor: `${textColor}15`,
                      borderRadius: templateId === 'playful' ? '9999px' : templateId === 'classic' ? '8px' : '0',
                      borderWidth: templateId === 'bold' ? '2px' : '1px',
                    }}
                  >
                    {templateId === 'bold' ? `VIEW CART (${cartCount})` : `View Cart (${cartCount})`}
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Share buttons */}
            <div className="mb-6">
              <ShareButtons url={productUrl} name={product.name} textColor={textColor} accentColor={accentColor} />
            </div>

            {/* Trust indicators */}
            <div
              className="flex items-center gap-5 pt-5 border-t flex-wrap"
              style={{ borderColor: `${textColor}08` }}
            >
              {[
                { icon: '🚚', label: 'Free Shipping 50+' },
                { icon: '↩️', label: '30-Day Returns' },
                { icon: '🔒', label: 'Secure Checkout' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-[11px]" style={{ color: `${textColor}40` }}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs section */}
        <motion.div
          className="mt-14 pt-10 border-t"
          style={{ borderColor: `${textColor}08` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ProductTabs
            product={product}
            textColor={textColor}
            accentColor={accentColor}
            borderRadius={borderRadius}
            isDark={isDark}
            templateId={templateId}
          />
        </motion.div>

        {/* Product Reviews */}
        <ProductReviews
          slug={slug}
          productId={productId}
          textColor={textColor}
          accentColor={accentColor}
          bgColor={bgColor}
          isDark={isDark}
        />

        {/* Related Products */}
        {related.length > 0 && (
          <motion.section
            className="mt-16 pt-12 border-t"
            style={{ borderColor: `${textColor}08` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2
              className="mb-8"
              style={{
                ...headingStyle,
                fontSize: templateId === 'bold' ? '1.125rem' : '1.25rem',
                fontWeight: templateId === 'minimal' ? 400 : headingStyle.fontWeight,
              }}
            >
              {templateId === 'bold' ? 'YOU MAY ALSO LIKE' : templateId === 'playful' ? 'You might also love ✨' : 'You may also like'}
            </h2>

            {/* Scrollable carousel on mobile, grid on desktop */}
            <div className="flex gap-5 overflow-x-auto pb-3 sm:grid sm:grid-cols-4 sm:overflow-x-visible sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="flex-shrink-0 w-44 sm:w-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/shop/${slug}/product/${p.id}`} className="group block">
                    <div
                      className="aspect-square overflow-hidden flex items-center justify-center mb-3"
                      style={{
                        backgroundColor: isDark ? '#111' : `${textColor}04`,
                        borderRadius: templateId === 'playful' ? '16px' : templateId === 'classic' ? '8px' : '0',
                        border: templateId === 'bold' ? `2px solid ${textColor}10` : `1px solid ${textColor}06`,
                      }}
                    >
                      {p.image_url ? (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 160px, 200px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <svg className="w-8 h-8" style={{ color: `${textColor}08` }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                    <h3
                      className="text-sm font-medium truncate group-hover:opacity-60 transition-opacity"
                      style={{
                        fontFamily: brand.font_heading,
                        textTransform: templateId === 'bold' ? 'uppercase' : undefined,
                        letterSpacing: templateId === 'bold' ? '0.04em' : undefined,
                        fontSize: templateId === 'bold' ? '0.6875rem' : '0.875rem',
                      }}
                    >
                      {p.name}
                    </h3>
                    {p.price != null && p.price > 0 && (
                      <p className="text-sm mt-0.5 font-semibold" style={{ color: accentColor }}>
                        {p.currency || 'USD'} {p.price.toFixed(2)}
                      </p>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </>
  );
}
