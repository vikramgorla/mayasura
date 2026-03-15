'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, Users, Search, Calendar, Shield,
  ChevronRight, ChevronDown, Loader2, Clock, Save, RefreshCw,
  Activity, Download, Share2, TrendingUp, AlertCircle, CheckSquare,
  Square, BarChart2, Eye, Megaphone, BookOpen, Zap, ArrowUpRight,
  FileText, ListChecks, ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PageTransition } from '@/components/ui/page-transition';

type StrategyType = 'brand-strategy' | 'competitor-analysis' | 'seo-suggestions' | 'content-calendar' | 'brand-consistency';

const strategyOptions = [
  { type: 'brand-strategy' as const, icon: Target, label: 'Brand Strategy', desc: 'Analyze strengths, opportunities, and positioning', color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' },
  { type: 'competitor-analysis' as const, icon: Users, label: 'Competitor Analysis', desc: 'Identify competitors and differentiation strategies', color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' },
  { type: 'seo-suggestions' as const, icon: Search, label: 'SEO Optimization', desc: 'Keywords, content topics, and meta suggestions', color: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400' },
  { type: 'content-calendar' as const, icon: Calendar, label: 'Content Calendar', desc: 'AI-generated 2-week content plan', color: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400' },
  { type: 'brand-consistency' as const, icon: Shield, label: 'Brand Consistency', desc: 'Check if your messaging is consistent', color: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400' },
];

interface SavedStrategy {
  id: string;
  type: string;
  result: Record<string, unknown>;
  created_at: string;
}

// ─── Loading Skeleton ────────────────────────────────────────────
function StrategySkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-6 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-6 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
            <div className="h-3 w-3/4 rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Health Report Types ─────────────────────────────────────────
interface HealthDimension {
  score: number;
  label: string;
  feedback: string;
  recommendations: string[];
}

interface HealthReport {
  overallScore: number;
  overallGrade: string;
  summary: string;
  dimensions: Record<string, HealthDimension>;
  topPriorities: string[];
  strengths: string[];
  quickWins: string[];
}

// ─── Radar Chart (CSS-based) ─────────────────────────────────────
function RadarChart({ dimensions }: { dimensions: Record<string, HealthDimension> }) {
  const entries = Object.values(dimensions);
  const count = entries.length;
  const size = 200;
  const center = size / 2;
  const radius = 80;

  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  };

  const dataPoints = entries.map((d, i) => getPoint(i, d.score));
  const gridPoints100 = entries.map((_, i) => getPoint(i, 100));
  const gridPoints75 = entries.map((_, i) => getPoint(i, 75));
  const gridPoints50 = entries.map((_, i) => getPoint(i, 50));
  const gridPoints25 = entries.map((_, i) => getPoint(i, 25));

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-48 h-48 sm:w-56 sm:h-56">
        {/* Grid lines */}
        {[gridPoints100, gridPoints75, gridPoints50, gridPoints25].map((pts, i) => (
          <polygon key={i} points={pts.map(p => `${p.x},${p.y}`).join(' ')} fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-700" strokeWidth="0.5" />
        ))}
        {/* Axis lines */}
        {entries.map((_, i) => {
          const p = getPoint(i, 100);
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="currentColor" className="text-zinc-200 dark:text-zinc-700" strokeWidth="0.5" />;
        })}
        {/* Data polygon */}
        <polygon points={dataPoints.map(p => `${p.x},${p.y}`).join(' ')} fill="rgba(124, 58, 237, 0.15)" stroke="#7C3AED" strokeWidth="2" />
        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#7C3AED" />
        ))}
      </svg>
      {/* Labels */}
      <div className="flex flex-wrap justify-center gap-3 mt-3">
        {entries.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{d.label}: {d.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Health Report Card ──────────────────────────────────────────
function HealthReportCard({ report }: { report: HealthReport }) {
  const gradeColors: Record<string, string> = {
    'A+': 'text-emerald-500', A: 'text-emerald-500', 'A-': 'text-emerald-500',
    'B+': 'text-blue-500', B: 'text-blue-500', 'B-': 'text-blue-500',
    'C+': 'text-amber-500', C: 'text-amber-500', 'C-': 'text-amber-500',
    D: 'text-red-500', F: 'text-red-500',
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-600 dark:text-violet-400" />
          Brand Health Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Top row: score + radar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Score */}
          <div className="text-center py-4">
            <div className="relative inline-block mb-3">
              <svg className="w-28 h-28" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="currentColor"
                  className={report.overallScore >= 80 ? 'text-emerald-500' : report.overallScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${report.overallScore * 2.51} 251`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-zinc-900 dark:text-white">{report.overallScore}</span>
                <span className={`text-sm font-bold ${gradeColors[report.overallGrade] || 'text-zinc-500'}`}>{report.overallGrade}</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Overall Health Score</p>
          </div>
          {/* Radar */}
          <RadarChart dimensions={report.dimensions} />
        </div>

        {/* Summary */}
        <div className="bg-violet-50 dark:bg-violet-950/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">{report.summary}</p>
        </div>

        {/* Dimension scores */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Dimension Scores</h4>
          {Object.values(report.dimensions).map((dim) => (
            <div key={dim.label} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">{dim.label}</span>
                <Badge variant={dim.score >= 80 ? 'default' : dim.score >= 60 ? 'secondary' : 'destructive'}>
                  {dim.score}%
                </Badge>
              </div>
              <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${dim.score >= 80 ? 'bg-emerald-500' : dim.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${dim.score}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">{dim.feedback}</p>
              <ul className="space-y-1">
                {dim.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <ChevronRight className="h-3 w-3 text-violet-500 flex-shrink-0 mt-0.5" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick wins & priorities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase mb-2">✅ Strengths</h4>
            <ul className="space-y-1.5">
              {report.strengths.map((s, i) => (
                <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase mb-2">⚡ Quick Wins</h4>
            <ul className="space-y-1.5">
              {report.quickWins.map((w, i) => (
                <li key={i} className="text-xs text-zinc-700 dark:text-zinc-300 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Monthly Content Calendar Grid ──────────────────────────────
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CONTENT_TYPES = ['Blog Post', 'Social', 'Email', 'Video', 'Product Feature', 'Promotion'];
const TYPE_COLORS: Record<string, string> = {
  'Blog Post': 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  'Social': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
  'Email': 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  'Video': 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  'Product Feature': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  'Promotion': 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
};

interface CalendarPost {
  day: number;
  type: string;
  title: string;
}

const MOCK_CALENDAR_POSTS: CalendarPost[] = [
  { day: 2, type: 'Blog Post', title: 'Industry trends 2026' },
  { day: 5, type: 'Social', title: 'Behind-the-scenes reel' },
  { day: 8, type: 'Email', title: 'Weekly newsletter' },
  { day: 10, type: 'Product Feature', title: 'New product spotlight' },
  { day: 12, type: 'Social', title: 'Customer testimonial' },
  { day: 15, type: 'Blog Post', title: 'How-to guide' },
  { day: 17, type: 'Promotion', title: 'Mid-month offer' },
  { day: 19, type: 'Video', title: 'Product demo walkthrough' },
  { day: 22, type: 'Email', title: 'Product launch announcement' },
  { day: 24, type: 'Social', title: 'Poll & engagement post' },
  { day: 26, type: 'Blog Post', title: 'Case study: customer win' },
  { day: 29, type: 'Social', title: 'Month wrap-up highlights' },
  { day: 30, type: 'Email', title: 'Month-end summary' },
];

function ContentCalendarGrid({ brandId }: { brandId: string }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  // Content calendar uses sample data — persistence requires a content_calendar table (future feature).
  const [posts] = useState<CalendarPost[]>(MOCK_CALENDAR_POSTS);
  const [selected, setSelected] = useState<number | null>(null);
  const isSampleData = true; // Will be false once we have real calendar persistence

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const postsByDay = posts.reduce<Record<number, CalendarPost[]>>((acc, p) => {
    if (!acc[p.day]) acc[p.day] = [];
    acc[p.day].push(p);
    return acc;
  }, {});

  const selectedPost = selected ? postsByDay[selected] : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            Content Calendar
            <Badge variant="secondary" className="text-[10px] ml-1">Sample Data</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <button onClick={goBack} className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <ChevronLeft className="h-3.5 w-3.5 text-zinc-500" />
            </button>
            <span className="text-sm font-medium text-zinc-900 dark:text-white min-w-[120px] text-center">
              {MONTH_NAMES[month]} {year}
            </span>
            <button onClick={goNext} className="h-7 w-7 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <ChevronRight className="h-3.5 w-3.5 text-zinc-500" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(TYPE_COLORS).map(([type, cls]) => (
            <span key={type} className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${cls}`}>{type}</span>
          ))}
        </div>

        {/* Grid header */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} className="text-center text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 py-1">{d}</div>
          ))}
        </div>

        {/* Grid days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells before first day */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayPosts = postsByDay[day] || [];
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();
            const isSelected = selected === day;
            return (
              <button
                key={day}
                onClick={() => setSelected(isSelected ? null : day)}
                className={`min-h-[52px] rounded-lg border transition-all text-left p-1 relative ${
                  isSelected ? 'border-violet-400 dark:border-violet-600 bg-violet-50 dark:bg-violet-950/30' :
                  isToday ? 'border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/10' :
                  'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <span className={`text-[11px] font-medium block mb-0.5 ${isToday ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-500 dark:text-zinc-400'}`}>{day}</span>
                <div className="space-y-0.5">
                  {dayPosts.slice(0, 2).map((p, pi) => (
                    <div key={pi} className={`text-[9px] truncate px-1 rounded ${TYPE_COLORS[p.type] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                      {p.type.slice(0, 3)}
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <div className="text-[9px] text-zinc-400 pl-1">+{dayPosts.length - 2}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected day detail */}
        <AnimatePresence>
          {selected && selectedPost && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/20"
            >
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">
                {MONTH_NAMES[month]} {selected} — {selectedPost.length} post{selectedPost.length > 1 ? 's' : ''} planned
              </p>
              {selectedPost.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-1 last:mb-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${TYPE_COLORS[p.type] || ''}`}>{p.type}</span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{p.title}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

// ─── Competitor Mention Tracker ──────────────────────────────────
const MOCK_MENTIONS = [
  { competitor: 'Shopify', platform: 'Twitter/X', snippet: 'Switched from Shopify to Mayasura — night and day difference in setup time', sentiment: 'positive', date: '2 hours ago' },
  { competitor: 'Squarespace', platform: 'Reddit', snippet: 'How does Squarespace compare to these AI-first brand builders?', sentiment: 'neutral', date: '5 hours ago' },
  { competitor: 'Webflow', platform: 'LinkedIn', snippet: 'Webflow is powerful but requires design skills, looking for alternatives', sentiment: 'negative', date: '1 day ago' },
  { competitor: 'Wix', platform: 'Twitter/X', snippet: 'Wix is too limiting for e-commerce — any open-source alternatives?', sentiment: 'negative', date: '1 day ago' },
  { competitor: 'Shopify', platform: 'HackerNews', snippet: 'Shopify pricing is getting out of hand for indie brands', sentiment: 'negative', date: '2 days ago' },
  { competitor: 'WordPress', platform: 'Reddit', snippet: 'WordPress setup takes days, AI builders are the future', sentiment: 'negative', date: '3 days ago' },
];

function CompetitorMentionTracker() {
  const sentimentBadge: Record<string, string> = {
    positive: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    neutral: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
    negative: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  };

  const platformBadge: Record<string, string> = {
    'Twitter/X': 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400',
    'Reddit': 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    'LinkedIn': 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    'HackerNews': 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };

  const stats = MOCK_MENTIONS.reduce<Record<string, number>>((acc, m) => {
    acc[m.competitor] = (acc[m.competitor] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Eye className="h-4 w-4 text-rose-500" />
          Competitor Mention Tracker
          <Badge variant="secondary" className="text-[10px] ml-1">UI Preview</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mb-4">
          {Object.entries(stats).map(([comp, count]) => (
            <div key={comp} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-semibold text-zinc-900 dark:text-white">{comp}</span>
              <span className="text-xs text-zinc-400">×{count}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5" />
          Showing mock data — real tracking connects to social listening APIs
        </p>

        <div className="space-y-3">
          {MOCK_MENTIONS.map((mention, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{mention.competitor}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${platformBadge[mention.platform] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                  {mention.platform}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sentimentBadge[mention.sentiment]}`}>
                  {mention.sentiment}
                </span>
                <span className="text-[10px] text-zinc-400 ml-auto flex-shrink-0">{mention.date}</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic leading-relaxed">&ldquo;{mention.snippet}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Brand Health Metrics Card ───────────────────────────────────
function BrandHealthMetricsCard({ brandId }: { brandId: string }) {
  // These metrics are hardcoded placeholder values showing the UI concept.
  // Real values will come from the AI Health Report (Run Health Report button).
  const metrics = [
    { label: 'Profile Completeness', value: 78, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', trend: '+5%' },
    { label: 'Content Consistency', value: 85, icon: BarChart2, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-950/30', trend: '+12%' },
    { label: 'SEO Readiness', value: 62, icon: Search, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', trend: '+3%' },
    { label: 'Engagement Score', value: 91, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', trend: '+18%' },
    { label: 'Brand Voice Score', value: 88, icon: Megaphone, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/30', trend: '+7%' },
    { label: 'Channel Coverage', value: 55, icon: Share2, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-950/30', trend: '+2%' },
  ];

  const overall = Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-violet-500" />
            Brand Health Dashboard
            <Badge variant="secondary" className="text-[10px] ml-1">UI Preview</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className={`text-2xl font-bold ${overall >= 80 ? 'text-emerald-500' : overall >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
              {overall}
            </div>
            <div>
              <div className="text-[10px] font-semibold text-zinc-400">HEALTH</div>
              <div className="text-[10px] font-semibold text-zinc-400">SCORE</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-xl ${m.bg} border border-transparent`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <m.icon className={`h-3.5 w-3.5 ${m.color}`} />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{m.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{m.trend}</span>
                  <span className={`text-sm font-bold ${m.color}`}>{m.value}%</span>
                </div>
              </div>
              <div className="h-1.5 bg-white/60 dark:bg-zinc-900/40 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${
                    m.value >= 80 ? 'from-emerald-400 to-emerald-500' :
                    m.value >= 60 ? 'from-amber-400 to-amber-500' :
                    'from-red-400 to-red-500'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-start gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <span>Boost your score by improving <strong className="text-zinc-700 dark:text-zinc-300">Channel Coverage</strong> (+45 pts potential) and <strong className="text-zinc-700 dark:text-zinc-300">SEO Readiness</strong> (+38 pts potential).</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Growth Playbook ─────────────────────────────────────────────
interface PlaybookStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
}

const GROWTH_PLAYBOOK: PlaybookStep[] = [
  { id: '1', phase: 'Foundation', title: 'Complete your brand profile', description: 'Fill in all brand details, upload logo, and set your brand voice to unlock better AI suggestions.', impact: 'high', effort: 'low', timeframe: 'This week' },
  { id: '2', phase: 'Foundation', title: 'Add 10+ products with AI descriptions', description: 'Use the AI product description generator to create compelling, SEO-optimized copy for each product.', impact: 'high', effort: 'low', timeframe: 'This week' },
  { id: '3', phase: 'Content', title: 'Publish your first 3 blog posts', description: 'Use AI Blog Generator to create industry-relevant content. Focus on how-to guides and industry insights.', impact: 'high', effort: 'medium', timeframe: 'Week 2' },
  { id: '4', phase: 'Content', title: 'Set up the AI chatbot', description: 'Configure your chatbot with FAQs, product knowledge, and brand voice for 24/7 customer support.', impact: 'high', effort: 'medium', timeframe: 'Week 2' },
  { id: '5', phase: 'Growth', title: 'Launch first email newsletter', description: 'Announce your brand to early subscribers. Use the social proof from your first sales as content.', impact: 'medium', effort: 'low', timeframe: 'Week 3' },
  { id: '6', phase: 'Growth', title: 'Run a 20% launch discount campaign', description: 'Create limited-time discount codes to drive first purchases and build social proof.', impact: 'high', effort: 'low', timeframe: 'Week 3' },
  { id: '7', phase: 'Scale', title: 'Collect and publish 5 testimonials', description: 'Reach out to early customers for reviews. Publish them on your website for social proof.', impact: 'medium', effort: 'medium', timeframe: 'Month 2' },
  { id: '8', phase: 'Scale', title: 'Run competitor analysis & differentiate', description: 'Use AI Competitor Analysis to identify gaps in the market and sharpen your positioning.', impact: 'high', effort: 'medium', timeframe: 'Month 2' },
  { id: '9', phase: 'Scale', title: 'Optimize SEO with keyword strategy', description: 'Run SEO Analysis and implement the top 5 keyword recommendations across your site and blog.', impact: 'high', effort: 'high', timeframe: 'Month 3' },
  { id: '10', phase: 'Scale', title: 'Connect custom domain', description: 'Upgrade to Pro and connect your custom domain for a professional brand presence.', impact: 'medium', effort: 'low', timeframe: 'Month 3' },
];

const PHASE_COLORS: Record<string, string> = {
  Foundation: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  Content: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  Growth: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
  Scale: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
};

const IMPACT_COLORS = {
  high: 'text-emerald-600 dark:text-emerald-400',
  medium: 'text-amber-600 dark:text-amber-400',
  low: 'text-zinc-400',
};

function GrowthPlaybook() {
  // Playbook checkmarks are session-only (in-memory). Persistence is a future feature.
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => setChecked(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });

  const progress = Math.round((checked.size / GROWTH_PLAYBOOK.length) * 100);
  const phases = [...new Set(GROWTH_PLAYBOOK.map(s => s.phase))];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-emerald-500" />
            Growth Playbook
            <span className="text-xs text-zinc-400 font-normal">AI-generated</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="text-xs text-zinc-500">{checked.size}/{GROWTH_PLAYBOOK.length} done</div>
            <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {phases.map(phase => (
            <div key={phase}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${PHASE_COLORS[phase]}`}>{phase}</span>
                <div className="flex-1 h-px bg-zinc-100 dark:bg-zinc-800" />
              </div>
              <div className="space-y-2.5">
                {GROWTH_PLAYBOOK.filter(s => s.phase === phase).map((step) => {
                  const done = checked.has(step.id);
                  return (
                    <motion.div
                      key={step.id}
                      layout
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        done
                          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 opacity-70'
                          : 'border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                      }`}
                      onClick={() => toggle(step.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {done ? (
                            <CheckSquare className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Square className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className={`text-sm font-medium ${done ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-white'}`}>
                              {step.title}
                            </span>
                            <span className="text-[10px] text-zinc-400">{step.timeframe}</span>
                          </div>
                          {!done && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">{step.description}</p>
                          )}
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-semibold flex items-center gap-1 ${IMPACT_COLORS[step.impact]}`}>
                              <ArrowUpRight className="h-3 w-3" />
                              {step.impact} impact
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              {step.effort} effort
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center"
          >
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">🎉 Playbook complete! Your brand is built for growth.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── PDF Export ──────────────────────────────────────────────────
function ExportStrategyButton({ results, brandId }: { results: Record<string, unknown>; brandId: string }) {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExport = useCallback(async () => {
    if (Object.keys(results).length === 0) {
      toast.warning('Generate at least one strategy analysis first');
      return;
    }
    setExporting(true);
    try {
      // Build a printable HTML document and open in new tab
      const content = Object.entries(results).map(([type, result]) => {
        const option = strategyOptions.find(o => o.type === type);
        const resultStr = JSON.stringify(result, null, 2)
          .replace(/[{}[\]"]/g, '')
          .replace(/,\n/g, '\n')
          .trim();
        return `<h2 style="color:#7c3aed;margin-top:2rem">${option?.label || type}</h2><pre style="white-space:pre-wrap;font-family:inherit;font-size:0.875rem;line-height:1.6;color:#374151">${resultStr}</pre>`;
      }).join('<hr style="border:1px solid #e5e7eb;margin:1.5rem 0">');

      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Brand Strategy Report — Mayasura</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; color: #111827; }
    h1 { color: #111827; font-size: 1.75rem; margin-bottom: 0.25rem; }
    .subtitle { color: #6b7280; font-size: 0.875rem; margin-bottom: 2rem; }
    h2 { font-size: 1.25rem; }
    @media print { body { max-width: none; padding: 1cm; } }
  </style>
</head>
<body>
  <h1>Brand Strategy Report</h1>
  <p class="subtitle">Generated by Mayasura · Brand ID: ${brandId} · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  ${content}
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        win.onload = () => {
          setTimeout(() => {
            win.print();
            URL.revokeObjectURL(url);
          }, 500);
        };
      }
      toast.success('Strategy report opened — use Print → Save as PDF');
    } catch {
      toast.error('Failed to generate export');
    }
    setExporting(false);
  }, [results, brandId, toast]);

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
      {exporting ? (
        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generating...</>
      ) : (
        <><Download className="h-3.5 w-3.5" /> Export PDF</>
      )}
    </Button>
  );
}

export default function StrategyPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [timestamps, setTimestamps] = useState<Record<string, string>>({});
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [healthReport, setHealthReport] = useState<HealthReport | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);

  // Load saved strategies on mount
  useEffect(() => {
    fetch(`/api/brands/${brandId}/strategy`)
      .then(r => r.json())
      .then(data => {
        if (data.strategies) {
          const resMap: Record<string, unknown> = {};
          const tsMap: Record<string, string> = {};
          for (const s of data.strategies as SavedStrategy[]) {
            resMap[s.type] = s.result;
            tsMap[s.type] = s.created_at;
          }
          setResults(resMap);
          setTimestamps(tsMap);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingSaved(false));
  }, [brandId]);

  const runStrategy = async (type: StrategyType) => {
    setLoading(type);
    try {
      const res = await fetch(`/api/brands/${brandId}/strategy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.error) {
        toast.error('Analysis failed', data.error);
      } else {
        setResults(prev => ({ ...prev, [type]: data.result }));
        setTimestamps(prev => ({ ...prev, [type]: new Date().toISOString() }));
        toast.success('Analysis complete — saved automatically');
      }
    } catch {
      toast.error('Failed to generate strategy');
    }
    setLoading(null);
  };

  const hasResults = Object.keys(results).length > 0;
  const [activeTab, setActiveTab] = useState<'advisor' | 'calendar' | 'competitors' | 'health' | 'playbook'>('advisor');

  const generateHealthReport = async () => {
    setLoadingHealth(true);
    try {
      const res = await fetch(`/api/brands/${brandId}/health-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.error) {
        toast.error('Health report failed', data.error);
      } else {
        setHealthReport(data.report);
        toast.success('Brand Health Report generated!');
      }
    } catch {
      toast.error('Failed to generate health report');
    }
    setLoadingHealth(false);
  };

  const tabs = [
    { id: 'advisor' as const, label: 'AI Advisor', icon: Sparkles },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'competitors' as const, label: 'Competitors', icon: Eye },
    { id: 'health' as const, label: 'Health', icon: Activity },
    { id: 'playbook' as const, label: 'Playbook', icon: ListChecks },
  ];

  return (
    <PageTransition>
    <div className="p-4 sm:p-8">
      <Breadcrumbs
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'AI Strategy' },
        ]}
        className="mb-4"
      />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Sparkles className="h-6 w-6 text-blue-600" />
            AI Strategy Advisor
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">AI-powered insights, calendar, growth playbook, and brand health</p>
        </div>
        <ExportStrategyButton results={results} brandId={brandId} />
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: AI Advisor */}
      {activeTab === 'advisor' && (
        <div>
          {/* Health Report at top */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-zinc-400 dark:text-zinc-500">Generate AI analysis for any aspect of your brand strategy</p>
            <Button
              variant="outline"
              size="sm"
              onClick={generateHealthReport}
              disabled={loadingHealth}
            >
              {loadingHealth ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
              ) : (
                <><Activity className="h-3.5 w-3.5" /> Run Health Report</>
              )}
            </Button>
          </div>

          {loadingHealth && !healthReport && <StrategySkeleton />}
          {healthReport && <HealthReportCard report={healthReport} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {strategyOptions.map((option) => {
              const hasResult = !!results[option.type];
              const ts = timestamps[option.type];
              return (
                <Card key={option.type} className="hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${option.color}`}>
                      <option.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">{option.label}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">{option.desc}</p>
                    {hasResult && ts && (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1 mb-3">
                        <Clock className="h-3 w-3" />
                        Last run: {new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => runStrategy(option.type)}
                      disabled={loading === option.type}
                      className="w-full"
                    >
                      {loading === option.type ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
                      ) : hasResult ? (
                        <><RefreshCw className="h-3.5 w-3.5" /> Refresh</>
                      ) : (
                        <><Sparkles className="h-3.5 w-3.5" /> Generate</>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Loading skeleton while generating */}
          {loading && !results[loading] && <StrategySkeleton />}

          {/* Loading saved strategies */}
          {loadingSaved && !hasResults && (
            <div className="space-y-4">
              <StrategySkeleton />
            </div>
          )}

          {/* Results */}
          <AnimatePresence mode="popLayout">
            {Object.entries(results).map(([type, result]) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6"
              >
                <StrategyResult
                  type={type as StrategyType}
                  result={result as Record<string, unknown>}
                  timestamp={timestamps[type]}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Tab: Content Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <ContentCalendarGrid brandId={brandId} />
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                AI Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                Based on your brand industry and voice — click any to add to calendar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { type: 'Blog Post', title: '5 ways AI is transforming your industry in 2026', reason: 'Trending topic in your sector' },
                  { type: 'Social', title: 'Behind-the-scenes: How we make [product]', reason: 'High engagement format' },
                  { type: 'Email', title: 'Exclusive launch: [Product] is here', reason: 'Drives conversions' },
                  { type: 'Blog Post', title: 'The definitive guide to [brand expertise]', reason: 'Long-tail SEO opportunity' },
                  { type: 'Video', title: 'Customer story: [Name]\'s transformation', reason: 'Social proof builder' },
                  { type: 'Promotion', title: 'Flash sale: 24 hours only', reason: 'Revenue driver' },
                ].map((suggestion, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="p-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/50 dark:hover:bg-violet-950/10 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${TYPE_COLORS[suggestion.type] || 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}>
                        {suggestion.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white mb-1">{suggestion.title}</p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <Zap className="h-3 w-3 text-amber-400" />
                      {suggestion.reason}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab: Competitors */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <CompetitorMentionTracker />
          {!!results['competitor-analysis'] && (
            <StrategyResult
              type="competitor-analysis"
              result={results['competitor-analysis'] as Record<string, unknown>}
              timestamp={timestamps['competitor-analysis'] as string | undefined}
            />
          )}
          {!results['competitor-analysis'] && (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">No competitor analysis yet</p>
                <p className="text-xs text-zinc-400 mb-4">Run AI competitor analysis to see your positioning</p>
                <Button variant="outline" size="sm" onClick={() => { setActiveTab('advisor'); setTimeout(() => runStrategy('competitor-analysis'), 100); }}>
                  <Sparkles className="h-3.5 w-3.5" /> Generate Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Health */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <BrandHealthMetricsCard brandId={brandId} />
          {healthReport && <HealthReportCard report={healthReport} />}
          {!healthReport && (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-10 w-10 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">No full health report yet</p>
                <p className="text-xs text-zinc-400 mb-4">Generate a comprehensive AI health report with recommendations</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateHealthReport}
                  disabled={loadingHealth}
                >
                  {loadingHealth ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</> : <><Activity className="h-3.5 w-3.5" /> Run Health Report</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Playbook */}
      {activeTab === 'playbook' && (
        <GrowthPlaybook />
      )}
    </div>
    </PageTransition>
  );
}

// ─── Expandable Section ──────────────────────────────────────────
function ExpandableSection({
  title,
  icon: Icon,
  color,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 text-${color}-500`} />
          <span className="text-sm font-medium text-zinc-900 dark:text-white">{title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StrategyResult({ type, result: rawResult, timestamp }: { type: StrategyType; result: Record<string, unknown>; timestamp?: string }) {
  // Cast to any for flexible property access — the API returns well-structured JSON
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = rawResult as Record<string, any>;
  if (!rawResult || typeof rawResult === 'string') {
    return (
      <Card>
        <CardContent className="p-6">
          <pre className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{String(rawResult)}</pre>
        </CardContent>
      </Card>
    );
  }

  const option = strategyOptions.find(o => o.type === type);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            {option && (
              <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${option.color}`}>
                <option.icon className="h-3.5 w-3.5" />
              </div>
            )}
            {option?.label || type}
          </CardTitle>
          {timestamp && (
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
              <Save className="h-3 w-3" />
              Saved {new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {type === 'brand-strategy' && (
          <div className="space-y-3">
            {result.strengths && (
              <ExpandableSection title="Strengths" icon={Target} color="emerald">
                {renderIconList(result.strengths as string[], 'emerald')}
              </ExpandableSection>
            )}
            {result.opportunities && (
              <ExpandableSection title="Opportunities" icon={Sparkles} color="blue">
                {renderIconList(result.opportunities as string[], 'blue')}
              </ExpandableSection>
            )}
            {result.positioning && (
              <ExpandableSection title="Positioning" icon={Target} color="violet">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{String(result.positioning)}</p>
              </ExpandableSection>
            )}
            {result.recommendations && (
              <ExpandableSection title="Recommendations" icon={ChevronRight} color="amber">
                {renderIconList(result.recommendations as string[], 'amber')}
              </ExpandableSection>
            )}
            {result.competitiveAdvantage && (
              <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/20 dark:to-violet-950/20 rounded-xl p-4 mt-2">
                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Competitive Advantage</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">{String(result.competitiveAdvantage)}</p>
              </div>
            )}
          </div>
        )}
        {type === 'competitor-analysis' && (
          <div className="space-y-3">
            {result.likelyCompetitors && (
              <ExpandableSection title="Likely Competitors" icon={Users} color="red">
                {renderIconList(result.likelyCompetitors as string[], 'red')}
              </ExpandableSection>
            )}
            {result.differentiators && (
              <ExpandableSection title="Differentiators" icon={Target} color="blue">
                {renderIconList(result.differentiators as string[], 'blue')}
              </ExpandableSection>
            )}
            {result.marketGaps && (
              <ExpandableSection title="Market Gaps" icon={Search} color="emerald">
                {renderIconList(result.marketGaps as string[], 'emerald')}
              </ExpandableSection>
            )}
            {result.positioningStatement && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Positioning Statement</h4>
                <p className="text-sm text-blue-900 dark:text-blue-200 italic">&ldquo;{String(result.positioningStatement)}&rdquo;</p>
              </div>
            )}
          </div>
        )}
        {type === 'seo-suggestions' && (
          <div className="space-y-3">
            {result.primaryKeywords && (
              <ExpandableSection title="Primary Keywords" icon={Search} color="violet">
                <div className="flex flex-wrap gap-2">
                  {(result.primaryKeywords as string[]).map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </ExpandableSection>
            )}
            {result.longTailKeywords && (
              <ExpandableSection title="Long-Tail Keywords" icon={Search} color="blue">
                <div className="flex flex-wrap gap-2">
                  {(result.longTailKeywords as string[]).map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </ExpandableSection>
            )}
            {result.contentTopics && (
              <ExpandableSection title="Content Topics" icon={Calendar} color="purple">
                {renderIconList(result.contentTopics as string[], 'purple')}
              </ExpandableSection>
            )}
            {result.metaDescription && (
              <div className="mt-2">
                <h4 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">Meta Description</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3">{String(result.metaDescription)}</p>
              </div>
            )}
          </div>
        )}
        {type === 'content-calendar' && (
          <div className="space-y-4">
            {result.strategy && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 leading-relaxed">{String(result.strategy)}</p>
            )}
            {result.calendar && (
              <ContentCalendarTimeline calendar={result.calendar as Array<{ day: number; type: string; title: string; description: string }>} />
            )}
          </div>
        )}
        {type === 'brand-consistency' && (
          <div className="space-y-3">
            {result.score !== undefined && (
              <div className="text-center py-4">
                <div className="relative inline-block">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-zinc-100 dark:text-zinc-800" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="currentColor"
                      className={Number(result.score) >= 80 ? 'text-emerald-500' : Number(result.score) >= 60 ? 'text-amber-500' : 'text-red-500'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${Number(result.score) * 2.51} 251`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">{String(result.score)}%</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">Consistency Score</p>
              </div>
            )}
            {result.strengths && (
              <ExpandableSection title="Strengths" icon={Target} color="emerald">
                {renderIconList(result.strengths as string[], 'emerald')}
              </ExpandableSection>
            )}
            {result.issues && (
              <ExpandableSection title="Issues" icon={Shield} color="red">
                {renderIconList(result.issues as string[], 'red')}
              </ExpandableSection>
            )}
            {result.suggestions && (
              <ExpandableSection title="Suggestions" icon={Sparkles} color="blue">
                {renderIconList(result.suggestions as string[], 'blue')}
              </ExpandableSection>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Content Calendar Timeline ───────────────────────────────────
function ContentCalendarTimeline({
  calendar,
}: {
  calendar: Array<{ day: number; type: string; title: string; description: string }>;
}) {
  const typeColors: Record<string, { bg: string; text: string; dot: string }> = {
    blog: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    social: { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
    email: { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

      <div className="space-y-3">
        {calendar.map((item, i) => {
          const colors = typeColors[item.type] || typeColors.blog;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 relative"
            >
              {/* Day marker */}
              <div className="flex flex-col items-center flex-shrink-0 w-10">
                <div className={`h-5 w-5 rounded-full border-2 border-white dark:border-zinc-900 ${colors.dot} z-10 flex items-center justify-center`}>
                  <span className="text-[8px] font-bold text-white">{item.day}</span>
                </div>
              </div>

              {/* Content card */}
              <div className={`flex-1 ${colors.bg} rounded-lg p-3 min-w-0`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">{item.title}</span>
                  <Badge variant="secondary" className={`text-[10px] ${colors.text}`}>{item.type}</Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function renderIconList(items: string[] | undefined, _color: string) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm">
          <ChevronRight className="h-4 w-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0 mt-0.5" />
          <span className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}
