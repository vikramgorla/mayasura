'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';

// SVG illustrations for various empty states
function EmptyIllustration({ type, accentColor = '#7C3AED' }: { type?: string; accentColor?: string }) {
  const base = accentColor;
  const light = `${base}20`;
  const mid = `${base}40`;

  switch (type) {
    case 'products':
      return (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mb-2" aria-hidden="true">
          <rect x="20" y="30" width="80" height="55" rx="8" fill={light} />
          <rect x="30" y="10" width="60" height="45" rx="6" fill={mid} />
          <rect x="40" y="20" width="40" height="25" rx="4" fill={base} fillOpacity="0.3" />
          <circle cx="60" cy="32" r="8" fill={base} fillOpacity="0.5" />
          <rect x="35" y="65" width="50" height="4" rx="2" fill={base} fillOpacity="0.15" />
          <rect x="45" y="73" width="30" height="3" rx="1.5" fill={base} fillOpacity="0.1" />
        </svg>
      );
    case 'blog':
      return (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mb-2" aria-hidden="true">
          <rect x="15" y="15" width="90" height="70" rx="8" fill={light} />
          <rect x="25" y="25" width="40" height="5" rx="2.5" fill={base} fillOpacity="0.4" />
          <rect x="25" y="35" width="70" height="3" rx="1.5" fill={base} fillOpacity="0.15" />
          <rect x="25" y="42" width="60" height="3" rx="1.5" fill={base} fillOpacity="0.12" />
          <rect x="25" y="49" width="65" height="3" rx="1.5" fill={base} fillOpacity="0.1" />
          <rect x="25" y="60" width="35" height="4" rx="2" fill={base} fillOpacity="0.3" />
          <rect x="65" y="60" width="25" height="4" rx="2" fill={base} fillOpacity="0.2" />
        </svg>
      );
    case 'orders':
      return (
        <svg width="120" height="100" viewBox="0 0 120 100" fill="none" className="mb-2" aria-hidden="true">
          <rect x="25" y="20" width="70" height="60" rx="8" fill={light} />
          <path d="M45 35 L60 25 L75 35 L75 55 L45 55 Z" fill={mid} />
          <rect x="50" y="45" width="20" height="10" rx="2" fill={base} fillOpacity="0.3" />
          <circle cx="60" cy="68" r="3" fill={base} fillOpacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  illustration?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, illustration, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      {illustration ? (
        <EmptyIllustration type={illustration} />
      ) : (
        <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
          <Icon className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
        </div>
      )}
      <h3 className="font-display font-semibold text-base text-zinc-900 dark:text-white mb-1.5">{title}</h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-sm mb-6">{description}</p>
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button size="sm" variant="brand">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button size="sm" variant="brand" onClick={action.onClick}>
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {action.label}
          </Button>
        )
      )}
    </motion.div>
  );
}
