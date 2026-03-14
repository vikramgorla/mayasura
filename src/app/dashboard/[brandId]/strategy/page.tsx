'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, Users, Search, Calendar, Shield,
  ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';

type StrategyType = 'brand-strategy' | 'competitor-analysis' | 'seo-suggestions' | 'content-calendar' | 'brand-consistency';

const strategyOptions = [
  { type: 'brand-strategy' as const, icon: Target, label: 'Brand Strategy', desc: 'Analyze strengths, opportunities, and positioning', color: 'bg-blue-50 text-blue-600' },
  { type: 'competitor-analysis' as const, icon: Users, label: 'Competitor Analysis', desc: 'Identify competitors and differentiation strategies', color: 'bg-purple-50 text-purple-600' },
  { type: 'seo-suggestions' as const, icon: Search, label: 'SEO Optimization', desc: 'Keywords, content topics, and meta suggestions', color: 'bg-emerald-50 text-emerald-600' },
  { type: 'content-calendar' as const, icon: Calendar, label: 'Content Calendar', desc: 'AI-generated 2-week content plan', color: 'bg-amber-50 text-amber-600' },
  { type: 'brand-consistency' as const, icon: Shield, label: 'Brand Consistency', desc: 'Check if your messaging is consistent', color: 'bg-rose-50 text-rose-600' },
];

export default function StrategyPage() {
  const params = useParams();
  const brandId = params.brandId as string;
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, unknown>>({});

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
        toast.success('Analysis complete');
      }
    } catch {
      toast.error('Failed to generate strategy');
    }
    setLoading(null);
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
          <Sparkles className="h-6 w-6 text-blue-600" />
          AI Strategy Advisor
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Get AI-powered insights and recommendations for your brand</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {strategyOptions.map((option) => (
          <Card key={option.type} className="hover:shadow-md transition-all">
            <CardContent className="p-5">
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 ${option.color}`}>
                <option.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-white">{option.label}</h3>
              <p className="text-xs text-zinc-400 mb-4">{option.desc}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => runStrategy(option.type)}
                disabled={loading === option.type}
                className="w-full"
              >
                {loading === option.type ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Analyzing...</>
                ) : results[option.type] ? (
                  <><Sparkles className="h-3.5 w-3.5" /> Refresh</>
                ) : (
                  <><Sparkles className="h-3.5 w-3.5" /> Generate</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

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
            <StrategyResult type={type as StrategyType} result={result as Record<string, unknown>} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function StrategyResult({ type, result }: { type: StrategyType; result: Record<string, unknown> }) {
  if (!result || typeof result === 'string') {
    return (
      <Card>
        <CardContent className="p-6">
          <pre className="text-sm text-zinc-600 whitespace-pre-wrap">{String(result)}</pre>
        </CardContent>
      </Card>
    );
  }

  const option = strategyOptions.find(o => o.type === type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          {option && <option.icon className="h-4 w-4" />}
          {option?.label || type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'brand-strategy' && (
          <div className="space-y-4">
            {renderList('Strengths', result.strengths as string[], 'emerald')}
            {renderList('Opportunities', result.opportunities as string[], 'blue')}
            {result.positioning ? (
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Positioning</h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">{String(result.positioning)}</p>
              </div>
            ) : null}
            {renderList('Recommendations', result.recommendations as string[], 'amber')}
          </div>
        )}
        {type === 'competitor-analysis' && (
          <div className="space-y-4">
            {renderList('Likely Competitors', result.likelyCompetitors as string[], 'red')}
            {renderList('Differentiators', result.differentiators as string[], 'blue')}
            {renderList('Market Gaps', result.marketGaps as string[], 'emerald')}
            {result.positioningStatement ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-blue-600 mb-2">Positioning Statement</h4>
                <p className="text-sm text-blue-900 dark:text-blue-200 italic">&ldquo;{String(result.positioningStatement)}&rdquo;</p>
              </div>
            ) : null}
          </div>
        )}
        {type === 'seo-suggestions' && (
          <div className="space-y-4">
            {result.primaryKeywords ? (
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Primary Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {(result.primaryKeywords as string[]).map((kw, i) => (
                    <Badge key={i} variant="secondary">{kw}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {result.longTailKeywords ? (
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Long-Tail Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {(result.longTailKeywords as string[]).map((kw, i) => (
                    <Badge key={i} variant="outline">{kw}</Badge>
                  ))}
                </div>
              </div>
            ) : null}
            {renderList('Content Topics', result.contentTopics as string[], 'purple')}
            {result.metaDescription ? (
              <div>
                <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Meta Description</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-700 rounded-lg p-3">{String(result.metaDescription)}</p>
              </div>
            ) : null}
          </div>
        )}
        {type === 'content-calendar' && (
          <div className="space-y-4">
            {result.strategy ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{String(result.strategy)}</p>
            ) : null}
            {result.calendar ? (
              <div className="space-y-2">
                {(result.calendar as Array<{ day: number; type: string; title: string; description: string }>).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50">
                    <div className="h-8 w-8 rounded-lg bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      D{item.day}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.title}</span>
                        <Badge variant="secondary" className="text-[10px]">{item.type}</Badge>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
        {type === 'brand-consistency' && (
          <div className="space-y-4">
            {result.score !== undefined ? (
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-blue-600 mb-1">{String(result.score)}%</div>
                <p className="text-xs text-zinc-400">Consistency Score</p>
              </div>
            ) : null}
            {renderList('Strengths', result.strengths as string[], 'emerald')}
            {renderList('Issues', result.issues as string[], 'red')}
            {renderList('Suggestions', result.suggestions as string[], 'blue')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function renderList(title: string, items: string[] | undefined, color: string) {
  if (!items || !Array.isArray(items) || items.length === 0) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold text-zinc-500 uppercase mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <ChevronRight className={`h-4 w-4 text-${color}-500 flex-shrink-0 mt-0.5`} />
            <span className="text-zinc-700 dark:text-zinc-300">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
