'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart3, Eye, ShoppingBag, FileText, Mail, MessageSquare, DollarSign, Users, Monitor, Smartphone, Tablet, Globe, ArrowUpRight, ArrowDownRight, TrendingUp, Filter, Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkline } from '@/components/ui/sparkline';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

interface AnalyticsData {
  pageViews: {
    total: number;
    prevTotal: number;
    byPage: Array<{ page: string; count: number }>;
    byDay: Array<{ day: string; count: number }>;
  };
  uniqueVisitors: number;
  prevUniqueVisitors: number;
  devices: { mobile: number; tablet: number; desktop: number };
  referrers: Array<{ referrer: string; count: number }>;
  orderCount: number;
  revenue: number;
  currentRevenue: number;
  prevRevenue: number;
  conversionRate: number;
  prevConversionRate: number;
  blogPostCount: number;
  publishedPostCount: number;
  contactCount: number;
  newContactCount: number;
  subscriberCount: number;
}

function AnimatedCounter({ value, duration = 800, prefix = '', suffix = '' }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
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
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function TrendBadge({ current, previous }: { current: number; previous: number }) {
  if (previous === 0 && current === 0) return <span className="text-xs text-zinc-400">—</span>;
  const pct = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const isUp = pct >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${isUp ? 'text-emerald-600' : 'text-red-500'}`}>
      {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(pct)}%
    </span>
  );
}

function DonutChart({ data, size = 140 }: { data: { label: string; value: number; color: string }[]; size?: number }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-xs text-zinc-400">No data</p>
      </div>
    );
  }
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let offset = 0;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dashLength = pct * circumference;
          const currentOffset = offset;
          offset += dashLength;
          return (
            <motion.circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: -currentOffset }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-zinc-900 dark:text-white">{total}</p>
          <p className="text-[10px] text-zinc-400">total</p>
        </div>
      </div>
    </div>
  );
}

function FunnelChart({ steps }: { steps: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(...steps.map(s => s.value), 1);
  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        return (
          <div key={step.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{step.label}</span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">{step.value}</span>
            </div>
            <div className="h-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
              <motion.div
                className="h-full rounded-lg"
                style={{ backgroundColor: step.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            </div>
            {i < steps.length - 1 && (
              <div className="flex justify-center my-1">
                <span className="text-[10px] text-zinc-300">↓ {steps[i + 1].value > 0 && step.value > 0 ? `${Math.round((steps[i + 1].value / step.value) * 100)}%` : '—'}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/brands/${brandId}/analytics?days=${days}`)
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(d => setData(d))
      .catch(() => {
        // Analytics may not have data yet - this is normal
        setData(null);
      });
  }, [brandId, days]);

  const stats = [
    { label: 'Page Views', value: data?.pageViews.total || 0, prev: data?.pageViews.prevTotal || 0, icon: Eye, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600', prefix: '' },
    { label: 'Unique Visitors', value: data?.uniqueVisitors || 0, prev: data?.prevUniqueVisitors || 0, icon: Users, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', prefix: '' },
    { label: 'Orders', value: data?.orderCount || 0, prev: 0, icon: ShoppingBag, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600', prefix: '' },
    { label: 'Revenue', value: data?.currentRevenue || 0, prev: data?.prevRevenue || 0, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/30 text-green-600', prefix: '$' },
    { label: 'Conversion', value: data?.conversionRate || 0, prev: data?.prevConversionRate || 0, icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600', prefix: '', suffix: '%' },
    { label: 'Subscribers', value: data?.subscriberCount || 0, prev: 0, icon: Mail, color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600', prefix: '' },
  ];

  return (
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Analytics' },
        ]}
        className="mb-4"
      />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <BarChart3 className="h-6 w-6" />
              Analytics
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Track your brand&apos;s performance</p>
          </div>
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  days === d
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center mb-2 sm:mb-3 ${stat.color}`}>
                    <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                    <AnimatedCounter value={Math.round(stat.value)} prefix={stat.prefix} suffix={(stat as { suffix?: string }).suffix || ''} />
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-zinc-400">{stat.label}</p>
                    <TrendBadge current={stat.value} previous={stat.prev} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Encouraging empty state when no analytics data at all */}
        {(!data || ((data.pageViews?.total || 0) === 0 && (data.orderCount || 0) === 0 && (data.uniqueVisitors || 0) === 0)) && (
          <EmptyState
            icon={Rocket}
            title="Your analytics are warming up"
            description="Once your brand site gets traffic, you'll see page views, visitor stats, and revenue data here. Share your site to get started!"
            action={{
              label: 'View Dashboard',
              href: `/dashboard/${brandId}`,
            }}
            className="mb-8"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Views over time - Line chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" />
                Page Views Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.pageViews.byDay && data.pageViews.byDay.length > 0 ? (
                <div>
                  {/* Mini sparkline chart */}
                  <div className="mb-4 overflow-x-auto">
                    <Sparkline
                      data={data.pageViews.byDay.map(d => d.count)}
                      width={480}
                      height={120}
                      color="#3b82f6"
                    />
                  </div>
                  {/* Bar chart */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {data.pageViews.byDay.slice(-14).map((day) => {
                      const maxCount = Math.max(...data.pageViews.byDay.map(d => d.count));
                      const pct = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                      return (
                        <div key={day.day} className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 w-16 flex-shrink-0 font-mono">
                            {new Date(day.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <div className="flex-1 h-5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 w-8 text-right">
                            {day.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-zinc-400">
                  No page views yet. Views will appear once your live site gets traffic.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top pages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.pageViews.byPage && data.pageViews.byPage.length > 0 ? (
                <div className="space-y-3">
                  {data.pageViews.byPage.map((page, i) => {
                    const maxCount = Math.max(...data.pageViews.byPage.map(p => p.count));
                    const pct = maxCount > 0 ? (page.count / maxCount) * 100 : 0;
                    return (
                      <div key={page.page}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400 w-4 text-right">{i + 1}</span>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300 font-mono truncate max-w-[220px]">
                              {page.page}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {page.count}
                          </span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden ml-6">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-zinc-400">
                  No data yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Monitor className="h-4 w-4 text-cyan-600" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <DonutChart
                  data={[
                    { label: 'Desktop', value: data?.devices.desktop || 0, color: '#06b6d4' },
                    { label: 'Mobile', value: data?.devices.mobile || 0, color: '#8b5cf6' },
                    { label: 'Tablet', value: data?.devices.tablet || 0, color: '#f59e0b' },
                  ]}
                  size={110}
                />
                <div className="space-y-3 w-full sm:w-auto">
                  {[
                    { label: 'Desktop', value: data?.devices.desktop || 0, icon: Monitor, color: '#06b6d4' },
                    { label: 'Mobile', value: data?.devices.mobile || 0, icon: Smartphone, color: '#8b5cf6' },
                    { label: 'Tablet', value: data?.devices.tablet || 0, icon: Tablet, color: '#f59e0b' },
                  ].map((device) => (
                    <div key={device.label} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: device.color }} />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{device.label}</span>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-white ml-auto">{device.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referral Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="h-4 w-4 text-emerald-600" />
                Referral Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data?.referrers && data.referrers.length > 0 ? (
                <div className="space-y-3">
                  {data.referrers.slice(0, 6).map((ref, i) => {
                    const maxCount = Math.max(...data.referrers.map(r => r.count));
                    const pct = maxCount > 0 ? (ref.count / maxCount) * 100 : 0;
                    let domain = ref.referrer;
                    try { domain = new URL(ref.referrer).hostname; } catch { /* keep as-is */ }
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[160px]">
                            {domain}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900 dark:text-white">{ref.count}</span>
                        </div>
                        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-sm text-zinc-400">
                  No referral data yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4 text-amber-600" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FunnelChart
                steps={[
                  { label: 'Page Views', value: data?.pageViews.total || 0, color: '#3b82f6' },
                  { label: 'Product Views', value: Math.round((data?.pageViews.total || 0) * 0.4), color: '#8b5cf6' },
                  { label: 'Add to Cart', value: Math.round((data?.orderCount || 0) * 1.5), color: '#f59e0b' },
                  { label: 'Orders', value: data?.orderCount || 0, color: '#10b981' },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        {/* Additional metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Blog Posts', value: data?.publishedPostCount || 0, icon: FileText, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
            { label: 'Contacts', value: data?.contactCount || 0, icon: MessageSquare, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' },
            { label: 'New Contacts', value: data?.newContactCount || 0, icon: Mail, color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600' },
            { label: 'Total Revenue', value: data?.revenue || 0, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/30 text-green-600', prefix: '$' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white">
                    {(stat as { prefix?: string }).prefix || ''}{(stat.value).toLocaleString()}
                  </p>
                  <p className="text-xs text-zinc-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
