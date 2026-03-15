"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, Check, Circle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ScoreItem {
  key: string;
  label: string;
  completed: boolean;
  points: number;
  href: string;
}

interface ScoreData {
  score: number;
  maxScore: number;
  items: ScoreItem[];
  completedCount: number;
  totalCount: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#7C3AED";
  if (score >= 40) return "#CA8A04";
  return "#DC2626";
}

function ScoreRing({ score, maxScore }: { score: number; maxScore: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / maxScore) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative w-36 h-36">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--border-primary)"
          strokeWidth="8"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-xs text-[var(--text-tertiary)]">
          / {maxScore}
        </span>
      </div>
    </div>
  );
}

export function BrandScore() {
  const { brandId } = useParams<{ brandId: string }>();
  const [data, setData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function fetchScore() {
      try {
        const res = await fetch(`/api/v1/brands/${brandId}/brand-score`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchScore();
  }, [brandId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-36 w-36 rounded-full" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const incomplete = data.items.filter((i) => !i.completed);
  const complete = data.items.filter((i) => i.completed);

  return (
    <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Brand Score
        </h3>
        <span className="text-xs text-[var(--text-tertiary)]">
          {data.completedCount}/{data.totalCount} complete
        </span>
      </div>

      <div className="flex items-center justify-center mb-4">
        <ScoreRing score={data.score} maxScore={data.maxScore} />
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-[var(--accent)] hover:underline mx-auto"
      >
        {expanded ? "Hide" : "Show"} checklist
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          {complete.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
            >
              <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
              <span className="line-through opacity-60">{item.label}</span>
            </div>
          ))}
          {incomplete.map((item) => (
            <Link
              key={item.key}
              href={`/dashboard/${brandId}${item.href}`}
              className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
            >
              <Circle className="h-3.5 w-3.5 text-[var(--text-tertiary)] shrink-0" />
              <span>{item.label}</span>
              <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                +{item.points}pts
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
