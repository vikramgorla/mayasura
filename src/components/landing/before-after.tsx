'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X, Check, AlertTriangle, Sparkles, ArrowRight,
  Globe, MessageSquare, ShoppingBag, BarChart3, FileText, Palette,
  Mail, Database, Settings, Plug, CreditCard, Headphones,
} from 'lucide-react';

const beforeTools = [
  { icon: Globe, label: 'Website Builder', cost: '$16/mo', name: 'Squarespace' },
  { icon: ShoppingBag, label: 'E-Commerce', cost: '$39/mo', name: 'Shopify' },
  { icon: MessageSquare, label: 'Chatbot', cost: '$49/mo', name: 'Intercom' },
  { icon: FileText, label: 'Blog/CMS', cost: '$25/mo', name: 'WordPress' },
  { icon: Mail, label: 'Newsletter', cost: '$20/mo', name: 'Mailchimp' },
  { icon: BarChart3, label: 'Analytics', cost: '$50/mo', name: 'Mixpanel' },
  { icon: Palette, label: 'Design', cost: '$22/mo', name: 'Canva Pro' },
  { icon: Database, label: 'CRM', cost: '$30/mo', name: 'HubSpot' },
];

const afterFeatures = [
  { icon: Globe, label: 'Website + 12 Templates' },
  { icon: ShoppingBag, label: 'Full E-Commerce' },
  { icon: MessageSquare, label: 'AI Chatbot' },
  { icon: FileText, label: 'Blog & Content' },
  { icon: BarChart3, label: 'Analytics Dashboard' },
  { icon: Palette, label: 'Design Studio' },
  { icon: Sparkles, label: 'AI Strategy Advisor' },
  { icon: Headphones, label: 'Support Suite' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

export function BeforeAfter() {
  const [hoveredBefore, setHoveredBefore] = useState<number | null>(null);
  const totalCost = beforeTools.reduce((sum, t) => sum + parseInt(t.cost.replace(/[^0-9]/g, '')), 0);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeInUp}
          className="text-center mb-14"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
            Stop juggling tools
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            Replace 8+ scattered subscriptions with one unified platform. Save time, save money, ship faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* BEFORE */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -top-3 left-4">
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold">
                Before Mayasura
              </span>
            </div>
            <div className="bg-[var(--bg-surface)] rounded-2xl border-2 border-red-200 dark:border-red-900/50 p-6 pt-8">
              <div className="space-y-3 mb-6">
                {beforeTools.map((tool, i) => (
                  <motion.div
                    key={tool.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredBefore(i)}
                    onMouseLeave={() => setHoveredBefore(null)}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      hoveredBefore === i
                        ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
                        : 'border-zinc-100 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <tool.icon className="h-4 w-4 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[var(--text-primary)]">{tool.name}</p>
                        <p className="text-xs text-[var(--text-tertiary)]">{tool.label}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-red-500">{tool.cost}</span>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-secondary)]">Monthly total</span>
                  <span className="text-xl font-bold text-red-500">${totalCost}/mo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-red-500/80">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>8 logins · No integration · Hours of setup</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AFTER */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -top-3 left-4">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                After Mayasura
              </span>
            </div>
            <div className="bg-[var(--bg-surface)] rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 p-6 pt-8">
              <div className="grid grid-cols-2 gap-3 mb-6">
                {afterFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10"
                  >
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <feature.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-primary)]">{feature.label}</span>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[var(--text-secondary)]">Monthly total</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-[var(--text-tertiary)] line-through">${totalCost}/mo</span>
                    <span className="text-xl font-bold text-emerald-500">$0/mo</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" />
                  <span>1 login · Fully integrated · Live in 5 minutes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Savings callout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
            <span className="text-sm text-[var(--text-secondary)]">You save</span>
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalCost}/mo</span>
            <span className="text-sm text-[var(--text-secondary)]">·</span>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">${totalCost * 12}/year</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
