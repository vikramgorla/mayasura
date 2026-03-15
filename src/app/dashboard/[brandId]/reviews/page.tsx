'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Check, X, Filter, Search, ChevronDown,
  MessageSquare, CheckCircle2, XCircle, Clock, Trash2,
  ThumbsUp, RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import { useToast } from '@/components/ui/toast';

interface Review {
  id: string;
  product_id: string;
  author_name: string;
  author_email: string;
  rating: number;
  title: string | null;
  body: string;
  verified_purchase: number;
  helpful_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

interface Counts {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sz} ${i <= rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`}
        />
      ))}
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ReviewsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [counts, setCounts] = useState<Counts>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [moderating, setModerating] = useState(false);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/reviews${filter !== 'all' ? `?status=${filter}` : ''}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setCounts(data.counts || { total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [brandId, filter]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const moderate = async (ids: string[], action: 'approve' | 'reject') => {
    setModerating(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/reviews`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewIds: ids, action }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${action === 'approve' ? 'Approved' : 'Rejected'} ${data.updated} review${data.updated !== 1 ? 's' : ''}`);
        setSelected(new Set());
        await loadReviews();
      }
    } catch {
      toast.error('Moderation failed');
    }
    setModerating(false);
  };

  const filtered = reviews.filter(r =>
    search === '' ||
    r.author_name.toLowerCase().includes(search.toLowerCase()) ||
    r.body.toLowerCase().includes(search.toLowerCase()) ||
    (r.title?.toLowerCase().includes(search.toLowerCase()))
  );

  const allSelected = filtered.length > 0 && filtered.every(r => selected.has(r.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(r => r.id)));
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: counts.pending, color: 'text-amber-600' },
    { key: 'approved', label: 'Approved', count: counts.approved, color: 'text-emerald-600' },
    { key: 'rejected', label: 'Rejected', count: counts.rejected, color: 'text-red-600' },
    { key: 'all', label: 'All', count: counts.total, color: 'text-zinc-600' },
  ];

  return (
    <PageTransition>
      <div className="p-4 sm:p-8">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Reviews' },
          ]}
          className="mb-4"
        />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                <MessageSquare className="h-6 w-6 text-violet-600" />
                Product Reviews
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Moderate customer reviews for your products
              </p>
            </div>
            <button
              onClick={loadReviews}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 transition-all shadow-sm"
            >
              <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
              Refresh
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  filter === tab.key
                    ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800'
                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <p className={`text-xl font-bold ${tab.color}`}>{tab.count}</p>
                <p className="text-xs text-zinc-500">{tab.label}</p>
              </button>
            ))}
          </div>

          {/* Bulk Actions + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 dark:text-zinc-200"
              />
            </div>
            {selected.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">{selected.size} selected</span>
                <button
                  onClick={() => moderate(Array.from(selected), 'approve')}
                  disabled={moderating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => moderate(Array.from(selected), 'reject')}
                  disabled={moderating}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <X className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-16 text-center text-zinc-400 text-sm">Loading reviews...</div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <MessageSquare className="h-10 w-10 text-zinc-200 dark:text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-400">
                    {filter === 'pending' ? 'No reviews awaiting moderation' : `No ${filter} reviews`}
                  </p>
                  <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1">
                    Reviews will appear here once customers submit them
                  </p>
                </div>
              ) : (
                <>
                  {/* Table Header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-t-xl">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                      {filtered.length} review{filtered.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <AnimatePresence>
                      {filtered.map((review, i) => (
                        <motion.div
                          key={review.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-3 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selected.has(review.id)}
                            onChange={e => {
                              const next = new Set(selected);
                              if (e.target.checked) next.add(review.id);
                              else next.delete(review.id);
                              setSelected(next);
                            }}
                            className="rounded border-zinc-300 mt-1"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium text-sm text-zinc-900 dark:text-white">
                                    {review.author_name}
                                  </span>
                                  {review.verified_purchase ? (
                                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                                      <Check className="h-2.5 w-2.5" /> Verified
                                    </span>
                                  ) : null}
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                    review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : review.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  }`}>
                                    {review.status}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                  {review.author_email} · {timeAgo(review.created_at)}
                                </p>
                              </div>
                              <StarRating rating={review.rating} />
                            </div>

                            {review.title && (
                              <p className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">{review.title}</p>
                            )}
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-3">{review.body}</p>

                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-zinc-400 flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {review.helpful_count} found helpful
                              </span>
                              <span className="text-xs text-zinc-300">·</span>
                              <span className="text-xs text-zinc-400 font-mono">
                                Product: {review.product_id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {review.status !== 'approved' && (
                              <button
                                onClick={() => moderate([review.id], 'approve')}
                                disabled={moderating}
                                title="Approve"
                                className="p-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-zinc-400 hover:text-emerald-600 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </button>
                            )}
                            {review.status !== 'rejected' && (
                              <button
                                onClick={() => moderate([review.id], 'reject')}
                                disabled={moderating}
                                title="Reject"
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-zinc-400 hover:text-red-600 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
