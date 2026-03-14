'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus, Sparkles } from 'lucide-react';

const features = [
  { name: 'AI Brand Generation', mayasura: 'full', shopify: 'none', squarespace: 'partial', wordpress: 'none' },
  { name: 'AI Content Writing', mayasura: 'full', shopify: 'partial', squarespace: 'partial', wordpress: 'none' },
  { name: 'AI Chatbot (brand voice)', mayasura: 'full', shopify: 'none', squarespace: 'none', wordpress: 'none' },
  { name: 'E-Commerce Built-in', mayasura: 'full', shopify: 'full', squarespace: 'full', wordpress: 'partial' },
  { name: 'Blog & Content', mayasura: 'full', shopify: 'partial', squarespace: 'full', wordpress: 'full' },
  { name: 'Time to Launch', mayasura: '< 5 min', shopify: '2-4 hrs', squarespace: '1-3 hrs', wordpress: '1-2 days' },
  { name: 'Open Source', mayasura: 'full', shopify: 'none', squarespace: 'none', wordpress: 'full' },
  { name: 'Self-Hostable', mayasura: 'full', shopify: 'none', squarespace: 'none', wordpress: 'full' },
  { name: 'Free Tier', mayasura: 'full', shopify: 'none', squarespace: 'none', wordpress: 'partial' },
  { name: 'Starting Price', mayasura: '$0/mo', shopify: '$39/mo', squarespace: '$16/mo', wordpress: '$25/mo' },
];

function StatusIcon({ status }: { status: string }) {
  if (status === 'full') return <Check className="h-4 w-4 text-emerald-500" />;
  if (status === 'partial') return <Minus className="h-4 w-4 text-amber-500" />;
  if (status === 'none') return <X className="h-4 w-4 text-zinc-300 dark:text-zinc-600" />;
  return <span className="text-xs font-semibold text-[var(--text-primary)]">{status}</span>;
}

export function ComparisonTable() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
            Why Mayasura?
          </h2>
          <p className="text-[var(--text-secondary)] max-w-md mx-auto">
            See how we compare to other platforms. Spoiler: we&apos;re the only one that&apos;s free, open-source, and AI-native.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto -mx-4 sm:mx-0"
        >
          <div className="min-w-[640px] px-4 sm:px-0">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-4 pr-4 text-sm font-medium text-[var(--text-tertiary)]">Feature</th>
                  <th className="text-center py-4 px-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30">
                      <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                      <span className="text-xs font-bold text-violet-700 dark:text-violet-300">Mayasura</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-3 text-xs font-medium text-[var(--text-tertiary)]">Shopify</th>
                  <th className="text-center py-4 px-3 text-xs font-medium text-[var(--text-tertiary)]">Squarespace</th>
                  <th className="text-center py-4 px-3 text-xs font-medium text-[var(--text-tertiary)]">WordPress</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-[var(--border-primary)]"
                  >
                    <td className="py-3.5 pr-4 text-sm font-medium text-[var(--text-primary)]">{feature.name}</td>
                    <td className="py-3.5 px-3 text-center bg-violet-50/50 dark:bg-violet-950/10">
                      <div className="flex justify-center"><StatusIcon status={feature.mayasura} /></div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center"><StatusIcon status={feature.shopify} /></div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center"><StatusIcon status={feature.squarespace} /></div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex justify-center"><StatusIcon status={feature.wordpress} /></div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-[var(--text-tertiary)] mt-6"
        >
          <Check className="h-3 w-3 inline text-emerald-500 mr-1" /> Full support
          <Minus className="h-3 w-3 inline text-amber-500 ml-3 mr-1" /> Partial / Plugin required
          <X className="h-3 w-3 inline text-zinc-300 dark:text-zinc-600 ml-3 mr-1" /> Not available
        </motion.p>
      </div>
    </section>
  );
}
