"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Paintbrush,
  ShoppingBag,
  PenTool,
  HeadphonesIcon,
  BarChart3,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI-Powered Branding",
    description:
      "Generate brand names, taglines, color palettes, and content — all powered by AI that understands your vision.",
    iconColor: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950/40",
  },
  {
    icon: Paintbrush,
    title: "Visual Design Studio",
    description:
      "Choose from 16 templates, 34 fonts, and 16 color palettes. Customize every detail with a live preview.",
    iconColor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/40",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce Built-In",
    description:
      "Full product catalog, shopping cart, and checkout flow. Start selling from day one.",
    iconColor: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    icon: PenTool,
    title: "Blog & Content",
    description:
      "AI-powered blog writer with SEO optimization. Publish content that ranks and resonates.",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description:
      "AI chatbot that knows your brand, plus a ticket system for customer inquiries.",
    iconColor: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-100 dark:bg-pink-950/40",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track page views, unique visitors, top pages, devices, and referrers — all built in.",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-100 dark:bg-indigo-950/40",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Everything your brand needs
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A complete ecosystem generated in minutes — not months.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bg} mb-4`}
              >
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
