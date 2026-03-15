'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, Users, Search, Calendar, Shield,
  ChevronRight, ChevronDown, Loader2, Clock, Save, RefreshCw,
  Activity, Download, Share2
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Sparkles className="h-6 w-6 text-blue-600" />
            AI Strategy Advisor
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Get AI-powered insights and recommendations for your brand</p>
        </div>
        <Button
          variant="brand"
          size="sm"
          onClick={generateHealthReport}
          disabled={loadingHealth}
        >
          {loadingHealth ? (
            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
          ) : (
            <><Activity className="h-3.5 w-3.5" /> Health Report</>
          )}
        </Button>
      </div>

      {/* Health Report */}
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
