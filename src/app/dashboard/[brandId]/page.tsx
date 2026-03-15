'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, MessageSquare, Package, FileText, BarChart3,
  ArrowRight, ShoppingBag, Sparkles, Plus, CheckCircle,
  Circle, HeadphonesIcon, TrendingUp, Clock, Eye,
  Users, DollarSign, Paintbrush, Newspaper, Zap,
  ArrowUpRight, ArrowDownRight, Settings, Mail, X,
  Lightbulb, Activity,
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkline } from '@/components/ui/sparkline';
import { Brand } from '@/lib/types';
import { useToast } from '@/components/ui/toast';
import { OnboardingChecklist } from '@/components/onboarding-checklist';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import { BrandScoreCard } from '@/components/brand-score';
import { HelpTooltip } from '@/components/help-tooltip';

interface DashboardData {
  brand: Brand;
  productCount: number;
  contentCount: number;
  blogPostCount: number;
  ticketStats: { total: number; open: number; resolved: number; satisfaction: number | null };
  analytics: {
    pageViews: { total: number; prevTotal: number; byDay: Array<{ day: string; count: number }> };
    uniqueVisitors: number;
    prevUniqueVisitors: number;
    revenue: number;
    currentRevenue: number;
    prevRevenue: number;
    conversionRate: number;
    prevConversionRate: number;
    orderCount: number;
  } | null;
  recentActivity: Array<{ id: string; type: string; description: string; created_at: string; metadata: string }>;
}

function AnimatedCounter({ value, duration = 1000, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function CircularProgress({ value, size = 120, strokeWidth = 8, color = '#6366F1' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
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
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

function TrendIndicator({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return null;
  const pct = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

function calculateHealthScore(data: DashboardData): { score: number; recommendations: string[] } {
  const recommendations: string[] = [];
  let score = 0;
  const checks = [
    { check: !!data.brand.name, label: 'Set brand name', weight: 10 },
    { check: !!data.brand.tagline, label: 'Add a tagline', weight: 10 },
    { check: !!data.brand.description, label: 'Add a brand description', weight: 10 },
    { check: !!data.brand.brand_voice, label: 'Define your brand voice', weight: 10 },
    { check: data.productCount > 0, label: 'Add at least one product', weight: 15 },
    { check: data.contentCount > 0, label: 'Generate website content', weight: 10 },
    { check: data.blogPostCount > 0, label: 'Publish a blog post', weight: 10 },
    { check: JSON.parse(data.brand.channels || '[]').length >= 2, label: 'Enable 2+ channels', weight: 10 },
    { check: data.brand.website_template !== 'minimal', label: 'Customize your design template', weight: 5 },
    { check: data.brand.status === 'launched', label: 'Launch your brand', weight: 10 },
  ];

  for (const c of checks) {
    if (c.check) {
      score += c.weight;
    } else {
      recommendations.push(c.label);
    }
  }

  return { score, recommendations: recommendations.slice(0, 3) };
}

const activityIcons: Record<string, { emoji: string; color: string }> = {
  'brand_created': { emoji: '🚀', color: 'bg-violet-100 dark:bg-violet-900/30' },
  'brand_launched': { emoji: '🏛️', color: 'bg-emerald-100 dark:bg-emerald-900/30' },
  'product_added': { emoji: '📦', color: 'bg-amber-100 dark:bg-amber-900/30' },
  'product_deleted': { emoji: '🗑️', color: 'bg-red-100 dark:bg-red-900/30' },
  'content_generated': { emoji: '✍️', color: 'bg-purple-100 dark:bg-purple-900/30' },
  'blog_published': { emoji: '📝', color: 'bg-blue-100 dark:bg-blue-900/30' },
  'order_placed': { emoji: '🛒', color: 'bg-green-100 dark:bg-green-900/30' },
  'contact_received': { emoji: '📧', color: 'bg-cyan-100 dark:bg-cyan-900/30' },
  'ticket_created': { emoji: '🎫', color: 'bg-rose-100 dark:bg-rose-900/30' },
  'settings_updated': { emoji: '⚙️', color: 'bg-zinc-100 dark:bg-zinc-800' },
  'design_updated': { emoji: '🎨', color: 'bg-pink-100 dark:bg-pink-900/30' },
  'import': { emoji: '📥', color: 'bg-indigo-100 dark:bg-indigo-900/30' },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// ─── Announcement Banner ──────────────────────────────────────────
const TIPS = [
  { id: 'chatbot', text: '💡 Tip: Set up your chatbot to engage visitors 24/7', action: 'Set up chatbot', key: 'chatbot' },
  { id: 'blog', text: '📝 Tip: Publishing weekly blog posts boosts SEO by 3x', action: 'Write a post', key: 'blog' },
  { id: 'analytics', text: '📊 New: Advanced analytics with cohort analysis is now available', action: 'View analytics', key: 'analytics' },
];

function AnnouncementBanner({ brandId }: { brandId: string }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [tipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`banner-dismissed-${brandId}`);
      if (stored) setDismissed(JSON.parse(stored));
    } catch { /**/ }
  }, [brandId]);

  const tip = TIPS[tipIndex];
  if (dismissed.includes(tip.id)) return null;

  const dismiss = () => {
    const next = [...dismissed, tip.id];
    setDismissed(next);
    try { localStorage.setItem(`banner-dismissed-${brandId}`, JSON.stringify(next)); } catch { /**/ }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={{ opacity: 0, y: -8, height: 0 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/60 dark:border-violet-800/40">
          <p className="text-sm text-violet-800 dark:text-violet-300 flex-1">{tip.text}</p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href={`/dashboard/${brandId}/${tip.key}`}
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline whitespace-nowrap"
            >
              {tip.action} →
            </Link>
            <button
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="h-5 w-5 rounded-full hover:bg-violet-200 dark:hover:bg-violet-800 flex items-center justify-center text-violet-400 transition-colors"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── AI Insights Card ─────────────────────────────────────────────
function AIInsightsCard({ data }: { data: DashboardData }) {
  const insights = [];

  const pageViews = data.analytics?.pageViews?.total || 0;
  const prevPageViews = data.analytics?.pageViews?.prevTotal || 0;
  if (pageViews > 0 && prevPageViews > 0) {
    const pct = Math.round(((pageViews - prevPageViews) / prevPageViews) * 100);
    if (pct > 0) {
      insights.push(`📈 Traffic is up ${pct}% vs last period — great momentum!`);
    } else if (pct < 0) {
      insights.push(`📉 Traffic dipped ${Math.abs(pct)}% vs last period — consider publishing a new blog post.`);
    }
  }

  if (data.productCount === 0) {
    insights.push('📦 Add products to start selling — brands with 3+ products see 5x more engagement.');
  } else if (data.productCount < 3) {
    insights.push(`📦 You have ${data.productCount} product${data.productCount > 1 ? 's' : ''}. Adding 2 more typically doubles store visits.`);
  }

  if (data.blogPostCount === 0) {
    insights.push('✍️ Brands that blog get 3x more organic traffic. Write your first post today.');
  }

  if (data.ticketStats.open > 3) {
    insights.push(`🎫 You have ${data.ticketStats.open} open support tickets — quick responses improve retention by 40%.`);
  }

  if (insights.length === 0) {
    insights.push('🚀 Your brand is looking great! Keep the momentum going.');
  }

  const insight = insights[0];

  return (
    <Card className="border-violet-200/50 dark:border-violet-800/30 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-zinc-900">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-600" />
          AI Insight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <motion.p
          key={insight}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed"
        >
          {insight}
        </motion.p>
        {insights.length > 1 && (
          <p className="text-xs text-zinc-400 mt-3">+{insights.length - 1} more insights for your brand</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Revenue Area Chart ────────────────────────────────────────────
function RevenueChart({ data }: { data: DashboardData }) {
  const byDay = data.analytics?.pageViews?.byDay || [];

  // Build 7-day revenue chart data (use page views as proxy if no order revenue by day)
  const chartData = byDay.slice(-7).map((d: { day: string; count: number }) => ({
    day: new Date(d.day).toLocaleDateString('en', { weekday: 'short' }),
    views: d.count,
  }));

  if (chartData.length < 2) {
    // Generate mock 7-day data for first-time users
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    chartData.push(...days.map((day, i) => ({ day, views: Math.floor(Math.random() * 30 + i * 5) })));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          7-Day Traffic Trend
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[120px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="viewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg, #1e1e2e)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#e2e8f0',
                }}
                formatter={(val) => [val, 'Views']}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#6366F1"
                strokeWidth={2}
                fill="url(#viewGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-5 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-8" />
      <div className="h-8 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
      <div className="h-4 w-96 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
      <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        <div className="lg:col-span-2 h-48 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
        <div className="h-64 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

export default function BrandDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.brandId as string;
  const [data, setData] = useState<DashboardData | null>(null);
  const toast = useToast();

  useEffect(() => {
    const safeFetch = (url: string, fallback: unknown = null) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(); return r.json(); }).catch(() => fallback);

    Promise.all([
      safeFetch(`/api/brands/${brandId}`, { brand: null }),
      safeFetch(`/api/brands/${brandId}/products`, { products: [] }),
      safeFetch(`/api/brands/${brandId}/content`, { content: [] }),
      safeFetch(`/api/brands/${brandId}/tickets`, { stats: { total: 0, open: 0, resolved: 0, satisfaction: null } }),
      safeFetch(`/api/brands/${brandId}/analytics`),
      safeFetch(`/api/brands/${brandId}/blog`, { posts: [] }),
    ]).then(([brandData, productData, contentData, ticketData, analyticsData, blogData]) => {
      if (!brandData?.brand) {
        toast.error('Failed to load dashboard data');
        return;
      }
      // Build recent activity from various sources
      const activities: Array<{ id: string; type: string; description: string; created_at: string; metadata: string }> = [];

      // Brand creation
      if (brandData.brand) {
        activities.push({
          id: 'brand-created',
          type: 'brand_created',
          description: `Brand "${brandData.brand.name}" created`,
          created_at: brandData.brand.created_at,
          metadata: '{}',
        });
      }

      if (brandData.brand?.status === 'launched') {
        activities.push({
          id: 'brand-launched',
          type: 'brand_launched',
          description: 'Brand launched and live',
          created_at: brandData.brand.updated_at,
          metadata: '{}',
        });
      }

      const products = productData.products || [];
      products.slice(0, 3).forEach((p: { id: string; name: string; created_at?: string }) => {
        activities.push({
          id: `product-${p.id}`,
          type: 'product_added',
          description: `Product "${p.name}" added`,
          created_at: p.created_at || brandData.brand.created_at,
          metadata: '{}',
        });
      });

      const posts = blogData.posts || [];
      posts.filter((p: { status: string }) => p.status === 'published').slice(0, 3).forEach((p: { id: string; title: string; published_at?: string; created_at: string }) => {
        activities.push({
          id: `blog-${p.id}`,
          type: 'blog_published',
          description: `Blog post "${p.title}" published`,
          created_at: p.published_at || p.created_at,
          metadata: '{}',
        });
      });

      // Sort by date and take latest 10
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const newData = {
        brand: brandData.brand,
        productCount: products.length,
        contentCount: contentData.content?.length || 0,
        blogPostCount: posts.length,
        ticketStats: ticketData.stats || { total: 0, open: 0, resolved: 0, satisfaction: null },
        analytics: analyticsData,
        recentActivity: activities.slice(0, 10),
      };
      setData(newData);

      // Motivational micro-copy — show encouraging toasts on milestones
      try {
        const seenKey = `mayasura-milestones-${brandId}`;
        const seen = JSON.parse(localStorage.getItem(seenKey) || '{}');
        const milestones: Array<{ key: string; check: boolean; title: string; msg: string }> = [
          { key: 'first_product', check: products.length === 1, title: "Your shop is coming to life! 🛍️", msg: "You added your first product. Keep going!" },
          { key: 'three_products', check: products.length >= 3, title: "Product catalog growing! 📦", msg: "Brands with 3+ products see 5x more engagement." },
          { key: 'first_blog', check: posts.length === 1, title: "Content is king 👑", msg: "Your first blog post is live. Great for SEO!" },
          { key: 'launched', check: brandData.brand.status === 'launched', title: "You're live! 🚀", msg: "Your brand is out in the world. Amazing!" },
          { key: 'first_view', check: (analyticsData?.pageViews?.total || 0) > 0, title: "First visitor! 👀", msg: "Someone is checking out your brand." },
        ];
        for (const m of milestones) {
          if (m.check && !seen[m.key]) {
            seen[m.key] = true;
            setTimeout(() => toast.success(m.title, m.msg), 1500);
            break; // Only show one per load
          }
        }
        localStorage.setItem(seenKey, JSON.stringify(seen));
      } catch { /* localStorage may not be available */ }
    });
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) return <DashboardSkeleton />;

  const channels = JSON.parse(data.brand.channels || '[]');
  const { score: healthScore, recommendations } = calculateHealthScore(data);
  const healthColor = healthScore >= 80 ? '#10b981' : healthScore >= 60 ? '#3b82f6' : healthScore >= 40 ? '#f59e0b' : '#ef4444';

  const pageViews = data.analytics?.pageViews?.total || 0;
  const prevPageViews = data.analytics?.pageViews?.prevTotal || 0;
  const uniqueVisitors = data.analytics?.uniqueVisitors || 0;
  const prevUniqueVisitors = data.analytics?.prevUniqueVisitors || 0;
  const revenue = data.analytics?.currentRevenue || 0;
  const prevRevenue = data.analytics?.prevRevenue || 0;
  const conversionRate = data.analytics?.conversionRate || 0;
  const prevConversionRate = data.analytics?.prevConversionRate || 0;
  const sparkData = data.analytics?.pageViews?.byDay?.map((d: { count: number }) => d.count) || [0, 0, 0, 0, 0];

  const subscriberCount = (data.analytics as Record<string, unknown>)?.subscriberCount as number || 0;

  const statsCards = [
    { label: 'Page Views', value: pageViews, prev: prevPageViews, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30', sparkColor: '#2563EB', prefix: '' },
    { label: 'Unique Visitors', value: uniqueVisitors, prev: prevUniqueVisitors, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/30', sparkColor: '#059669', prefix: '' },
    { label: 'Subscribers', value: subscriberCount, prev: 0, icon: Mail, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/30', sparkColor: '#7C3AED', prefix: '' },
    { label: 'Revenue', value: revenue, prev: prevRevenue, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/30', sparkColor: '#7C3AED', prefix: '$' },
  ];

  const onboardingItems = [
    { done: !!data.brand.name, label: 'Create your brand', link: '' },
    { done: !!data.brand.tagline, label: 'Add a tagline', link: `/dashboard/${brandId}/settings` },
    { done: data.productCount > 0, label: 'Add your first product', link: `/dashboard/${brandId}/products` },
    { done: data.contentCount > 0, label: 'Generate website content', link: `/dashboard/${brandId}/content` },
    { done: data.blogPostCount > 0, label: 'Publish a blog post', link: `/dashboard/${brandId}/blog` },
    { done: data.brand.status === 'launched', label: 'Launch your brand', link: `/dashboard/${brandId}/settings` },
  ];

  const completedItems = onboardingItems.filter(i => i.done).length;
  const showOnboarding = completedItems < onboardingItems.length;

  const quickActions = [
    {
      icon: Plus,
      label: 'Add Product',
      desc: 'Grow your catalog',
      href: `/dashboard/${brandId}/products`,
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      hoverBg: 'hover:border-amber-200 dark:hover:border-amber-800/60 hover:bg-amber-50/50 dark:hover:bg-amber-900/10',
    },
    {
      icon: Newspaper,
      label: 'Write Blog Post',
      desc: 'Boost your SEO',
      href: `/dashboard/${brandId}/blog`,
      iconBg: 'bg-purple-100 dark:bg-purple-900/40',
      iconColor: 'text-purple-600 dark:text-purple-400',
      hoverBg: 'hover:border-purple-200 dark:hover:border-purple-800/60 hover:bg-purple-50/50 dark:hover:bg-purple-900/10',
    },
    {
      icon: BarChart3,
      label: 'Check Analytics',
      desc: 'See what\'s working',
      href: `/dashboard/${brandId}/analytics`,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      hoverBg: 'hover:border-blue-200 dark:hover:border-blue-800/60 hover:bg-blue-50/50 dark:hover:bg-blue-900/10',
    },
    {
      icon: Sparkles,
      label: 'AI Strategy',
      desc: 'Brand intelligence',
      href: `/dashboard/${brandId}/strategy`,
      iconBg: 'bg-violet-100 dark:bg-violet-900/40',
      iconColor: 'text-violet-600 dark:text-violet-400',
      hoverBg: 'hover:border-violet-200 dark:hover:border-violet-800/60 hover:bg-violet-50/50 dark:hover:bg-violet-900/10',
    },
  ];

  return (
    <PageTransition>
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: data.brand.name },
        ]}
        className="mb-4"
      />
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{data.brand.name}</h1>
          <Badge variant={data.brand.status === 'launched' ? 'success' : 'secondary'}>
            {data.brand.status}
          </Badge>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">{data.brand.tagline || 'Your brand command center'}</p>
      </motion.div>

      {/* Announcement Banner */}
      <AnnouncementBanner brandId={brandId} />

      {/* Onboarding Checklist */}
      <OnboardingChecklist
        brandId={brandId}
        brandName={data.brand.name}
        productCount={data.productCount}
        contentCount={data.contentCount}
        blogPostCount={data.blogPostCount}
        hasChatbot={data.contentCount > 0}
        brandSlug={data.brand.slug ?? undefined}
        hasDesignCustomization={
          data.brand.website_template !== 'minimal' ||
          data.brand.primary_color !== '#6366F1'
        }
      />

      {/* Quick Stats Cards */}
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-medium text-zinc-400">Key Metrics</h2>
        <HelpTooltip text="These metrics update in real-time. Track page views, visitors, subscribers, and revenue." side="right" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Sparkline data={sparkData.length > 1 ? sparkData : [0, 1, 2, 1, stat.value]} color={stat.sparkColor} width={60} height={24} />
                    <TrendIndicator current={stat.value} previous={stat.prev} />
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
                  <AnimatedCounter value={Math.round(stat.value)} prefix={stat.prefix} suffix={(stat as { suffix?: string }).suffix || ''} />
                </p>
                <p className="text-xs text-zinc-400 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Brand Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BrandScoreCard brandId={brandId} />
        </motion.div>

        {/* Quick Actions 2x2 Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Quick Actions
                <HelpTooltip text="Shortcuts to common tasks. Building a brand is faster with these one-click actions." side="bottom" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, i) => (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.92, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 340, damping: 25 }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href={action.href}
                      className={`flex flex-col gap-3 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-all duration-200 group ${action.hoverBg}`}
                    >
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${action.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                        <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                          {action.label}
                        </p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{action.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-200 mt-auto" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Getting started mini-list when onboarding incomplete */}
              {showOnboarding && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800"
                >
                  <p className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {completedItems}/{onboardingItems.length} setup steps complete
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {onboardingItems.filter(i => !i.done && i.link).slice(0, 2).map(item => (
                      <Link
                        key={item.label}
                        href={item.link}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors border border-zinc-100 dark:border-zinc-700"
                      >
                        <Circle className="h-2.5 w-2.5" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Revenue Chart + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <RevenueChart data={data} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <AIInsightsCard data={data} />
        </motion.div>
      </div>

      {/* Quick Access + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Quick Access */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Quick Access</h2>
          <div className="space-y-2">
            {[
              { href: `/dashboard/${brandId}/website`, icon: Globe, label: 'Website', desc: 'View & manage pages', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600' },
              { href: `/dashboard/${brandId}/products`, icon: Package, label: 'Products', desc: `${data.productCount} products`, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600' },
              { href: `/dashboard/${brandId}/blog`, icon: Newspaper, label: 'Blog', desc: `${data.blogPostCount} posts`, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
              { href: `/dashboard/${brandId}/support`, icon: HeadphonesIcon, label: 'Support', desc: `${data.ticketStats.open} open tickets`, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' },
              { href: `/dashboard/${brandId}/chatbot`, icon: MessageSquare, label: 'Chatbot', desc: 'Test AI assistant', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' },
              { href: `/dashboard/${brandId}/strategy`, icon: Sparkles, label: 'AI Strategy', desc: 'Brand insights', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600' },
            ].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.03 }}
              >
                <Link href={link.href}>
                  <Card className="hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${link.color}`}>
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-zinc-900 dark:text-white">{link.label}</p>
                        <p className="text-xs text-zinc-400">{link.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-zinc-400" />
            Recent Activity
          </h2>
          <Card>
            <CardContent className="p-4">
              {data.recentActivity.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="py-8 text-center"
                >
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                  </div>
                  <p className="text-sm text-zinc-400">No activity yet.</p>
                  <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1">Start building your brand to see events here.</p>
                </motion.div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-px bg-zinc-100 dark:bg-zinc-800/80" />
                  <div className="space-y-0">
                    {data.recentActivity.map((activity, i) => {
                      const iconInfo = activityIcons[activity.type] || { emoji: '📋', color: 'bg-zinc-100 dark:bg-zinc-800' };
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: 16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.38 + i * 0.05,
                            type: 'spring',
                            stiffness: 300,
                            damping: 28,
                          }}
                          className="relative flex items-start gap-3 py-2.5 pl-1 group"
                        >
                          {/* Timeline dot / icon */}
                          <div className={`relative z-10 h-8 w-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${iconInfo.color} ring-2 ring-white dark:ring-zinc-900 shadow-sm`}>
                            {iconInfo.emoji}
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                              {activity.description}
                            </p>
                            <p className="text-[10px] text-zinc-300 dark:text-zinc-600 mt-0.5 tabular-nums">
                              {timeAgo(activity.created_at)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Live Ecosystem Links */}
      {data.brand.status === 'launched' && data.brand.slug && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">🏛️ Live Ecosystem</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { href: `/site/${data.brand.slug}`, icon: Globe, label: 'Website', desc: 'Live brand website', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' },
              { href: `/shop/${data.brand.slug}`, icon: ShoppingBag, label: 'Shop', desc: 'E-commerce store', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
              { href: `/blog/${data.brand.slug}`, icon: FileText, label: 'Blog', desc: 'Live blog', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
              { href: `/chat/${data.brand.slug}`, icon: MessageSquare, label: 'Chatbot', desc: 'AI assistant', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
            ].map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-600 transition-all cursor-pointer group h-full">
                  <CardContent className="p-4">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${link.color}`}>
                      <link.icon className="h-5 w-5" />
                    </div>
                    <p className="font-medium text-sm text-zinc-900 dark:text-white">{link.label}</p>
                    <p className="text-xs text-zinc-400 mt-0.5">{link.desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* Active Channels */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-white">Active Channels</h2>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {channels.length === 0 ? (
                <p className="text-sm text-zinc-400">No channels enabled — <Link href={`/dashboard/${brandId}/settings`} className="text-violet-500 hover:underline">enable channels</Link></p>
              ) : (
                channels.map((channel: string) => (
                  <Badge key={channel} variant="default" className="capitalize">
                    {channel === 'ecommerce' ? (
                      <><ShoppingBag className="h-3 w-3 mr-1" /> E-Commerce</>
                    ) : (
                      channel.replace(/-/g, ' ')
                    )}
                  </Badge>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </PageTransition>
  );
}
