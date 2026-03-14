'use client';

import { motion } from 'framer-motion';
import { type LucideIcon, Plus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from './button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-5">
        <Icon className="h-7 w-7 text-zinc-400 dark:text-zinc-500" />
      </div>
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
