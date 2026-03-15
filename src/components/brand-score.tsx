'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, CheckCircle2, Circle, Zap, ChevronDown, ChevronUp,
  Package, Newspaper, FileText, MessageSquareQuote, Mail,
  MessageSquare, Paintbrush, Share2, Search, BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';

interface ScoreItem {
  key: string;
  label: string;
  description: string;
  points: number;
  earned: boolean;
}

interface BrandScoreData {
  score: number;
  maxScore: number;
  items: ScoreItem[];
  completedCount: number;
  totalCount: number;
}

const ITEM_ICONS: Record<string, typeof Package> = {
  products: Package,
  blog: Newspaper,
  description: FileText,
  testimonials: MessageSquareQuote,
  subscribers: Mail,
  chatbot: MessageSquare,
  design: Paintbrush,
  social: Share2,
  seo: Search,
  analytics: BarChart3,
};

// ─── Animated Radial Score ────────────────────────────────────────
function RadialScore({ score, size = 140, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 80 ? '#10b981' : score >= 60 ? '#6366F1' : score >= 40 ? '#f59e0b' : '#ef4444';
  const bgGlow = score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 60 ? 'rgba(99,102,241,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  const emoji = score === 100 ? '🏆' : score >= 80 ? '🔥' : score >= 60 ? '💪' : score >= 40 ? '📈' : '🚀';
  const label = score === 100 ? 'Perfect!' : score >= 80 ? 'Excellent!' : score >= 60 ? 'Good progress' : score >= 40 ? 'Getting there' : "Let's go!";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: bgGlow }}
        />
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-zinc-100 dark:text-zinc-800"
            strokeWidth={strokeWidth}
          />
          {/* Score arc */}
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
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <motion.span
              className="text-3xl font-bold text-zinc-900 dark:text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, type: 'spring' }}
            >
              {score}
            </motion.span>
            <span className="text-sm text-zinc-400">/100</span>
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-3 text-center"
      >
        <span className="text-lg mr-1">{emoji}</span>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      </motion.div>
    </div>
  );
}

// ─── Brand Score Card ─────────────────────────────────────────────
export function BrandScoreCard({ brandId }: { brandId: string }) {
  const [data, setData] = useState<BrandScoreData | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const toast = useToast();

  const fetchScore = useCallback(async () => {
    try {
      const res = await fetch(`/api/brands/${brandId}/brand-score`);
      if (!res.ok) return;
      const result = await res.json();

      // Check for score increase
      if (prevScore !== null && result.score > prevScore) {
        const diff = result.score - prevScore;
        toast.success("You're on fire! 🔥", `Brand score increased by ${diff} points!`);
      }

      setPrevScore(data?.score ?? null);
      setData(result);
    } catch {
      // silent
    }
  }, [brandId, prevScore, data?.score]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchScore();
    // Refresh every 30 seconds to detect changes
    const interval = setInterval(fetchScore, 30000);
    return () => clearInterval(interval);
  }, [brandId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!data) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </CardContent>
      </Card>
    );
  }

  const incomplete = data.items.filter(i => !i.earned);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          Brand Score
          <span className="ml-auto text-xs text-zinc-400 font-normal">
            {data.completedCount}/{data.totalCount} complete
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center gap-6">
          <RadialScore score={data.score} size={120} strokeWidth={8} />
          <div className="flex-1 min-w-0">
            {incomplete.length > 0 ? (
              <>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Next steps:</p>
                <div className="space-y-1.5">
                  {incomplete.slice(0, 3).map(item => {
                    const Icon = ITEM_ICONS[item.key] || Zap;
                    return (
                      <div key={item.key} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <Icon className="h-3 w-3 text-amber-500 flex-shrink-0" />
                        <span>{item.description}</span>
                        <span className="text-[10px] text-zinc-300 dark:text-zinc-600 ml-auto flex-shrink-0">+{item.points}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center"
              >
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                  🏆 Perfect score! Your brand is complete.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Expandable breakdown */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 mt-4 transition-colors w-full justify-center"
        >
          {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          {expanded ? 'Hide details' : 'View all criteria'}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                {data.items.map(item => {
                  const Icon = ITEM_ICONS[item.key] || Zap;
                  return (
                    <div
                      key={item.key}
                      className={`flex items-center gap-2 text-xs p-2 rounded-lg transition-colors ${item.earned ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'}`}
                    >
                      {item.earned ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 flex-shrink-0" />
                      )}
                      <Icon className="h-3 w-3 flex-shrink-0" />
                      <span className={item.earned ? 'line-through' : 'font-medium'}>{item.label}</span>
                      <span className="ml-auto text-[10px]">{item.earned ? '✓' : `+${item.points}`}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
