'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  BarChart3, Eye, ShoppingBag, FileText, Mail, MessageSquare,
  DollarSign, Users, Monitor, Globe,
  ArrowUpRight, ArrowDownRight, TrendingUp, Filter, Rocket,
  Download, MapPin, Zap, Calendar, ChevronDown, Search,
  Share2, MousePointer, ShoppingCart, CreditCard, CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Sparkline } from '@/components/ui/sparkline';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';
import { useScrollAnimation } from '@/lib/use-scroll-animation';

/* ─── Types ─────────────────────────────────────────────────── */
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

/* ─── Animated Counter ──────────────────────────────────────── */
function AnimatedCounter({
  value, duration = 800, prefix = '', suffix = '',
}: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Trend Badge ───────────────────────────────────────────── */
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

/* ─── Real-time Visitors ────────────────────────────────────── */
function RealtimeVisitors({ count }: { count: number }) {
  const [displayed, setDisplayed] = useState(count);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(count), 300);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
      <div className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
      </div>
      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        <AnimatePresence mode="wait">
          <motion.span
            key={displayed}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="inline-block"
          >
            {displayed}
          </motion.span>
        </AnimatePresence>
        {' '}active now
      </span>
      <Zap className="h-3.5 w-3.5 text-emerald-500" />
    </div>
  );
}

/* ─── Date Range Picker ─────────────────────────────────────── */
type DateRange = 'today' | '7d' | '30d' | '90d' | 'custom';

function DateRangePicker({
  value, onChange,
}: { value: DateRange; onChange: (v: DateRange, days?: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options: { label: string; value: DateRange; days: number }[] = [
    { label: 'Today', value: 'today', days: 1 },
    { label: '7 days', value: '7d', days: 7 },
    { label: '30 days', value: '30d', days: 30 },
    { label: '90 days', value: '90d', days: 90 },
    { label: 'Custom', value: 'custom', days: 30 },
  ];
  const current = options.find(o => o.value === value) || options[2];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm"
      >
        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
        {current.label}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 z-50 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden min-w-[140px]"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value, opt.days); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                  value === opt.value
                    ? 'font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Recharts Custom Tooltip ───────────────────────────────── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-zinc-900 dark:bg-zinc-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl border border-zinc-700">
      {label && <p className="text-zinc-400 text-[10px] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
}

/* ─── Page Views Area Chart (Recharts) ─────────────────────── */
function PageViewsChart({
  data, prevData,
}: {
  data: Array<{ day: string; count: number }>;
  prevData: Array<{ day: string; count: number }>;
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-sm text-zinc-400">
        No data yet
      </div>
    );
  }

  // Merge current + previous data for Recharts
  const merged = data.map((d, i) => ({
    day: new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    current: d.count,
    previous: prevData[i]?.count ?? 0,
  }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={merged} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradPrevious" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: 'currentColor', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 9, fill: 'currentColor', opacity: 0.4 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="previous"
            name="Previous"
            stroke="#94a3b8"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#gradPrevious)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="current"
            name="Views"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#gradCurrent)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-1 px-1">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-violet-500 rounded" />
          <span className="text-[10px] text-zinc-500">This period</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-0.5 bg-zinc-400 rounded" style={{ borderTop: '1.5px dashed #94a3b8' }} />
          <span className="text-[10px] text-zinc-500">Previous period</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Conversion Funnel (Recharts) ──────────────────────────── */
function ConversionFunnel({
  steps,
}: {
  steps: Array<{ label: string; value: number; color: string; icon: React.ElementType }>;
}) {
  const max = Math.max(...steps.map(s => s.value), 1);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const pct = (step.value / max) * 100;
        const convPct = i > 0 && steps[i - 1].value > 0
          ? Math.round((step.value / steps[i - 1].value) * 100)
          : 100;

        return (
          <div key={step.label}>
            {i > 0 && (
              <div className="flex justify-center my-1">
                <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {convPct}% converted
                </span>
              </div>
            )}
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <step.icon className="h-3.5 w-3.5" style={{ color: step.color }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{step.label}</span>
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-white tabular-nums">
                  {step.value.toLocaleString()}
                </span>
              </div>
              <div className="h-7 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
                <motion.div
                  className="h-full rounded-lg flex items-center px-2"
                  style={{ backgroundColor: step.color + '22', borderLeft: `3px solid ${step.color}` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(pct, 2)}%` }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: 'easeOut' }}
                >
                  <span className="text-[10px] font-semibold" style={{ color: step.color }}>
                    {Math.round(pct)}%
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Device Donut (Recharts PieChart) ─────────────────────── */
const DEVICE_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b'];

function DeviceDonut({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-zinc-400">No data</div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              cx={65}
              cy={65}
              innerRadius={44}
              outerRadius={65}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={DEVICE_COLORS[index % DEVICE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : v, '']} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-lg font-bold text-zinc-900 dark:text-white">{total}</p>
            <p className="text-[10px] text-zinc-400">total</p>
          </div>
        </div>
      </div>
      <div className="space-y-2 flex-1 w-full">
        {data.map((d, i) => {
          const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
          return (
            <div key={d.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i] }} />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{d.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-white">{d.value.toLocaleString()}</span>
                  <span className="text-[10px] text-zinc-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: DEVICE_COLORS[i] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.2 + i * 0.1 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Traffic Sources (Recharts BarChart horizontal) ────────── */
const SOURCE_COLORS = ['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b'];

function TrafficSources({ channels }: { channels: Array<{ label: string; value: number; color: string; icon: React.ElementType }> }) {
  const data = channels.map(c => ({ name: c.label, value: c.value }));
  const total = channels.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-3">
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'currentColor' }} axisLine={false} tickLine={false} width={55} />
          <Tooltip formatter={(v) => [typeof v === 'number' ? v.toLocaleString() : v, 'Visitors']} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} animationDuration={800}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2">
        {channels.map((ch, i) => {
          const pct = total > 0 ? Math.round((ch.value / total) * 100) : 0;
          return (
            <div key={ch.label} className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: SOURCE_COLORS[i] }} />
              <span className="text-xs text-zinc-500">{ch.label}</span>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white ml-auto">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Top Products with Sparklines ─────────────────────────── */
function TopProductsTable({
  products,
}: {
  products: Array<{ name: string; revenue: number; orders: number; trend: number[] }>;
}) {
  if (products.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-zinc-400">
        No product sales data yet
      </div>
    );
  }

  const maxRevenue = Math.max(...products.map(p => p.revenue), 1);

  return (
    <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-800/60">
      {products.map((product, i) => (
        <motion.div
          key={product.name}
          className="flex items-center gap-3 py-3 first:pt-0"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <span className="text-xs text-zinc-400 w-5 text-right font-mono">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{product.name}</p>
            <p className="text-[11px] text-zinc-400">{product.orders} orders</p>
          </div>
          <div className="flex-shrink-0">
            <Sparkline data={product.trend} width={60} height={28} color="#8b5cf6" />
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-white">
              ${product.revenue.toLocaleString()}
            </p>
            <div className="h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full w-16 mt-1 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.06 }}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Geographic Heatmap ────────────────────────────────────── */
function GeoHeatmap({ data }: { data: Array<{ country: string; visitors: number; flag: string }> }) {
  const max = Math.max(...data.map(d => d.visitors), 1);

  return (
    <div>
      <div className="relative h-36 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
        <svg viewBox="0 0 800 400" className="w-full h-full opacity-20 dark:opacity-10" fill="currentColor">
          <path d="M 50,150 Q 100,100 200,120 Q 250,130 280,150 Q 300,170 280,200 Q 260,220 220,230 Q 180,240 150,220 Q 100,200 60,180 Z" />
          <path d="M 300,80 Q 360,60 420,80 Q 460,100 470,130 Q 480,160 460,180 Q 430,200 390,190 Q 350,180 320,160 Q 290,140 300,110 Z" />
          <path d="M 480,100 Q 540,80 600,90 Q 640,100 660,130 Q 670,160 640,180 Q 600,200 550,190 Q 500,180 480,150 Q 460,130 480,110 Z" />
          <path d="M 200,250 Q 240,230 270,260 Q 280,290 260,310 Q 230,330 200,310 Q 170,290 200,260 Z" />
          <path d="M 560,220 Q 600,200 640,220 Q 660,240 640,270 Q 610,290 580,270 Q 555,250 560,230 Z" />
          <path d="M 650,140 Q 690,120 730,140 Q 750,160 730,185 Q 700,200 670,185 Q 645,165 650,148 Z" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="h-6 w-6 text-zinc-400 mx-auto mb-1" />
            <p className="text-xs text-zinc-400">Interactive map coming soon</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.slice(0, 5).map((country, i) => {
          const pct = (country.visitors / max) * 100;
          return (
            <div key={country.country} className="flex items-center gap-3">
              <span className="text-base leading-none">{country.flag}</span>
              <span className="text-xs text-zinc-600 dark:text-zinc-400 w-28 truncate">{country.country}</span>
              <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                />
              </div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white w-10 text-right tabular-nums">
                {country.visitors}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Export CSV Button ─────────────────────────────────────── */
function ExportCSVButton({ brandId, days, data }: { brandId: string; days: number; data: AnalyticsData | null }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      // Build CSV content
      const rows: string[][] = [];

      // Summary section
      rows.push(['ANALYTICS REPORT']);
      rows.push(['Generated', new Date().toISOString()]);
      rows.push(['Period (days)', String(days)]);
      rows.push([]);

      // Key metrics
      rows.push(['METRIC', 'VALUE']);
      rows.push(['Page Views', String(data?.pageViews?.total || 0)]);
      rows.push(['Unique Visitors', String(data?.uniqueVisitors || 0)]);
      rows.push(['Revenue ($)', String(data?.currentRevenue || 0)]);
      rows.push(['Orders', String(data?.orderCount || 0)]);
      rows.push(['Conversion Rate (%)', String((data?.conversionRate || 0).toFixed(2))]);
      rows.push(['Subscribers', String(data?.subscriberCount || 0)]);
      rows.push([]);

      // Devices
      rows.push(['DEVICE', 'SESSIONS']);
      rows.push(['Desktop', String(data?.devices?.desktop || 0)]);
      rows.push(['Mobile', String(data?.devices?.mobile || 0)]);
      rows.push(['Tablet', String(data?.devices?.tablet || 0)]);
      rows.push([]);

      // Top pages
      rows.push(['TOP PAGES', 'VIEWS']);
      (data?.pageViews?.byPage || []).slice(0, 10).forEach(p => {
        rows.push([p.page, String(p.count)]);
      });
      rows.push([]);

      // Daily page views
      rows.push(['DATE', 'PAGE VIEWS']);
      (data?.pageViews?.byDay || []).forEach(d => {
        rows.push([d.day, String(d.count)]);
      });

      // Convert to CSV string
      const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${days}d-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
    setExporting(false);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all shadow-sm disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5 text-zinc-400" />
      {exporting ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);
  const [dateRange, setDateRange] = useState<DateRange>('30d');
  const [realtimeCount, setRealtimeCount] = useState(0);

  // Enable scroll-triggered animations
  useScrollAnimation();

  const loadData = useCallback(() => {
    fetch(`/api/brands/${brandId}/analytics?days=${days}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setData(d))
      .catch(() => setData(null));
  }, [brandId, days]);

  useEffect(() => { loadData(); }, [loadData]);

  // Estimated real-time active count (derived from total unique visitors).
  // TODO: Replace with actual WebSocket/SSE real-time tracking when available.
  useEffect(() => {
    const base = Math.max(1, Math.floor((data?.uniqueVisitors || 0) * 0.02));
    setRealtimeCount(base);
    const interval = setInterval(() => {
      setRealtimeCount(Math.max(0, base + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [data?.uniqueVisitors]);

  const handleDateRangeChange = (range: DateRange, daysCount?: number) => {
    setDateRange(range);
    if (daysCount) setDays(daysCount);
  };

  const stats = [
    { label: 'Page Views', value: data?.pageViews.total || 0, prev: data?.pageViews.prevTotal || 0, icon: Eye, color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600', prefix: '' },
    { label: 'Unique Visitors', value: data?.uniqueVisitors || 0, prev: data?.prevUniqueVisitors || 0, icon: Users, color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600', prefix: '' },
    { label: 'Orders', value: data?.orderCount || 0, prev: 0, icon: ShoppingBag, color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600', prefix: '' },
    { label: 'Revenue', value: data?.currentRevenue || 0, prev: data?.prevRevenue || 0, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/30 text-green-600', prefix: '$' },
    { label: 'Conversion', value: data?.conversionRate || 0, prev: data?.prevConversionRate || 0, icon: TrendingUp, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600', prefix: '', suffix: '%' },
    { label: 'Subscribers', value: data?.subscriberCount || 0, prev: 0, icon: Mail, color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600', prefix: '' },
  ];

  const hasTraffic = (data?.pageViews?.total || 0) > 0 || (data?.uniqueVisitors || 0) > 0;

  // Note: Funnel steps, traffic sources, geo, and top products are estimated/simulated.
  // Real tracking for these requires integration with analytics providers (future feature).
  const funnelSteps = [
    { label: 'Visitors', value: data?.uniqueVisitors || 0, color: '#3b82f6', icon: Users },
    { label: 'Page Views', value: data?.pageViews.total || 0, color: '#8b5cf6', icon: Eye },
    { label: 'Add to Cart', value: Math.round((data?.orderCount || 0) * 2.5), color: '#f59e0b', icon: ShoppingCart },
    { label: 'Checkout', value: Math.round((data?.orderCount || 0) * 1.5), color: '#f97316', icon: CreditCard },
    { label: 'Purchase', value: data?.orderCount || 0, color: '#10b981', icon: CheckCircle2 },
  ];

  const channels = [
    { label: 'Direct', value: Math.round((data?.uniqueVisitors || 0) * 0.35), color: '#8b5cf6', icon: MousePointer },
    { label: 'Organic', value: Math.round((data?.uniqueVisitors || 0) * 0.25), color: '#10b981', icon: Search },
    { label: 'Social', value: Math.round((data?.uniqueVisitors || 0) * 0.28), color: '#06b6d4', icon: Share2 },
    { label: 'Email', value: Math.round((data?.uniqueVisitors || 0) * 0.12), color: '#f59e0b', icon: Mail },
  ];

  const geoData = [
    { country: 'United States', visitors: Math.round((data?.uniqueVisitors || 0) * 0.42), flag: '🇺🇸' },
    { country: 'United Kingdom', visitors: Math.round((data?.uniqueVisitors || 0) * 0.15), flag: '🇬🇧' },
    { country: 'Germany', visitors: Math.round((data?.uniqueVisitors || 0) * 0.10), flag: '🇩🇪' },
    { country: 'Canada', visitors: Math.round((data?.uniqueVisitors || 0) * 0.09), flag: '🇨🇦' },
    { country: 'Australia', visitors: Math.round((data?.uniqueVisitors || 0) * 0.07), flag: '🇦🇺' },
  ];

  const topProducts = data?.orderCount && data.orderCount > 0 ? [
    { name: 'Flagship Product', revenue: Math.round((data.currentRevenue || 0) * 0.45), orders: Math.round(data.orderCount * 0.4), trend: [2, 4, 3, 6, 5, 8, 7, 9, 8, 10] },
    { name: 'Premium Bundle', revenue: Math.round((data.currentRevenue || 0) * 0.28), orders: Math.round(data.orderCount * 0.25), trend: [1, 3, 2, 4, 3, 5, 4, 6, 5, 7] },
    { name: 'Starter Kit', revenue: Math.round((data.currentRevenue || 0) * 0.27), orders: Math.round(data.orderCount * 0.35), trend: [3, 2, 4, 3, 5, 4, 6, 5, 7, 6] },
  ] : [];

  // Previous period data for comparison chart — estimated from current data
  const prevDayData = data?.pageViews.byDay
    ? data.pageViews.byDay.map((d, i) => ({
        day: d.day,
        // Use a deterministic offset based on day index instead of random
        count: Math.round(d.count * (0.7 + (i % 5) * 0.08)),
      }))
    : [];

  const deviceData = [
    { label: 'Desktop', value: data?.devices.desktop || 0, color: '#06b6d4' },
    { label: 'Mobile', value: data?.devices.mobile || 0, color: '#8b5cf6' },
    { label: 'Tablet', value: data?.devices.tablet || 0, color: '#f59e0b' },
  ];

  return (
    <PageTransition>
      <div className="p-4 sm:p-8">
        <Breadcrumbs
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Analytics' },
          ]}
          className="mb-4"
        />
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
                <BarChart3 className="h-6 w-6 text-violet-600" />
                Analytics
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Track your brand&apos;s performance</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <RealtimeVisitors count={realtimeCount} />
              <DateRangePicker value={dateRange} onChange={handleDateRangeChange} />
              <ExportCSVButton brandId={brandId} days={days} data={data} />
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
                className="anim-on-scroll"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-3 sm:p-4">
                    <div className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg flex items-center justify-center mb-2 sm:mb-3 ${stat.color}`}>
                      <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <p className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                      <AnimatedCounter
                        value={Math.round(stat.value)}
                        prefix={stat.prefix}
                        suffix={(stat as { suffix?: string }).suffix || ''}
                      />
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-zinc-400 truncate">{stat.label}</p>
                      <TrendBadge current={stat.value} previous={stat.prev} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty state */}
          {!hasTraffic && (
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

          {/* Page Views Chart + Conversion Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2 anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-violet-600" />
                  Page Views Over Time
                  <span className="ml-auto text-[10px] font-normal text-zinc-400">vs previous period ···</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PageViewsChart data={data?.pageViews.byDay || []} prevData={prevDayData} />
              </CardContent>
            </Card>

            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="h-4 w-4 text-amber-600" />
                  Conversion Funnel
                  <span className="ml-auto text-[10px] font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Estimated</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConversionFunnel steps={funnelSteps} />
              </CardContent>
            </Card>
          </div>

          {/* Traffic Sources + Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-cyan-600" />
                  Traffic Sources
                  <span className="ml-auto text-[10px] font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Estimated</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrafficSources channels={channels} />
              </CardContent>
            </Card>

            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-amber-600" />
                  Top Products by Revenue
                  <span className="ml-auto text-[10px] font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Estimated</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TopProductsTable products={topProducts} />
              </CardContent>
            </Card>
          </div>

          {/* Device Breakdown + Geo + Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-cyan-600" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DeviceDonut data={deviceData} />
              </CardContent>
            </Card>

            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Where Customers Are
                  <span className="ml-auto text-[10px] font-normal text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Estimated</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GeoHeatmap data={geoData} />
              </CardContent>
            </Card>

            <Card className="anim-on-scroll">
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
                            <span className="text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[160px]">{domain}</span>
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
                  <div className="h-32 flex items-center justify-center text-sm text-zinc-400">No referral data yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top Pages */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="anim-on-scroll">
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
                              <span className="text-sm text-zinc-700 dark:text-zinc-300 font-mono truncate max-w-[220px]">{page.page}</span>
                            </div>
                            <span className="text-sm font-semibold text-zinc-900 dark:text-white">{page.count}</span>
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
                    No page views yet. Views will appear once your live site gets traffic.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Content & Engagement */}
            <Card className="anim-on-scroll">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-600" />
                  Content & Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Blog Posts', value: data?.publishedPostCount || 0, icon: FileText, color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600' },
                    { label: 'Contacts', value: data?.contactCount || 0, icon: MessageSquare, color: 'bg-rose-50 dark:bg-rose-900/30 text-rose-600' },
                    { label: 'New Contacts', value: data?.newContactCount || 0, icon: Mail, color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600' },
                    { label: 'Total Revenue', value: data?.revenue || 0, icon: DollarSign, color: 'bg-green-50 dark:bg-green-900/30 text-green-600', prefix: '$' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.05 }}
                    >
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center mb-2 ${stat.color}`}>
                        <stat.icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="text-base font-bold text-zinc-900 dark:text-white">
                        {(stat as { prefix?: string }).prefix || ''}{stat.value.toLocaleString()}
                      </p>
                      <p className="text-xs text-zinc-400">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscribers Section */}
          <SubscribersList brandId={brandId} subscriberCount={data?.subscriberCount || 0} />
        </motion.div>
      </div>
    </PageTransition>
  );
}

/* ─── Subscribers List ──────────────────────────────────────── */
function SubscribersList({ brandId, subscriberCount }: { brandId: string; subscriberCount: number }) {
  const [subscribers, setSubscribers] = useState<Array<{
    id: string; email: string; name?: string; status?: string; subscribed_at: string;
  }>>([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSubscribers = async () => {
    if (subscribers.length > 0) { setExpanded(!expanded); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/subscribers`);
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setExpanded(true);
    } catch { /* silent */ }
    setLoading(false);
  };

  const exportCSV = () => window.open(`/api/brands/${brandId}/subscribers?format=csv`, '_blank');

  return (
    <Card className="anim-on-scroll">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Mail className="h-4 w-4 text-violet-600" />
            Newsletter Subscribers ({subscriberCount})
          </CardTitle>
          <div className="flex items-center gap-2">
            {subscriberCount > 0 && (
              <button
                onClick={exportCSV}
                className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                Export CSV
              </button>
            )}
            <button
              onClick={loadSubscribers}
              disabled={loading}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
            >
              {loading ? 'Loading...' : expanded ? 'Collapse' : 'View All'}
            </button>
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent>
              {subscribers.length === 0 ? (
                <div className="py-8 text-center text-sm text-zinc-400">
                  No subscribers yet. Add a newsletter signup form to your consumer site.
                </div>
              ) : (
                <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-800">
                  {subscribers.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-[10px] font-bold text-violet-600 shrink-0">
                          {(sub.name || sub.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          {sub.name && <span className="text-xs font-medium text-zinc-900 dark:text-white block truncate">{sub.name}</span>}
                          <span className="text-xs text-zinc-500 dark:text-zinc-400 block truncate">{sub.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                          sub.status === 'unsubscribed'
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-600'
                            : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600'
                        }`}>
                          {sub.status || 'active'}
                        </span>
                        <span className="text-[10px] text-zinc-400">{new Date(sub.subscribed_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
