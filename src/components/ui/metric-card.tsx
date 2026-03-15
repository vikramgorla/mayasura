'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';

interface MetricCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  icon?: ReactNode;
  trend?: number; // percentage change, positive = good
  description?: string;
  className?: string;
  accentColor?: string;
}

/**
 * A metric card with:
 * - Count-up animation when value changes
 * - Spring-physics hover (from card.tsx base styles)
 * - Trend indicator with color
 *
 * Usage:
 *   <MetricCard label="Revenue" value={12400} prefix="$" decimals={2} trend={12} />
 */
export function MetricCard({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  icon,
  trend,
  description,
  className,
  accentColor,
}: MetricCardProps) {
  const displayValue = useCountUp(value, { decimals });
  const trendPositive = (trend ?? 0) >= 0;
  const trendColor = trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400';

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={cn(
        'rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-5',
        'shadow-sm will-change-transform',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wide">
            {label}
          </p>
          <p
            className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums"
            style={accentColor ? { color: accentColor } : undefined}
          >
            {prefix}{displayValue}{suffix}
          </p>
          {trend !== undefined && (
            <p className={cn('text-xs mt-1.5 font-medium', trendColor)}>
              {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% vs last period
            </p>
          )}
          {description && (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{description}</p>
          )}
        </div>
        {icon && (
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accentColor ? `${accentColor}15` : undefined }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
