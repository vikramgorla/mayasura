"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SHOWCASE_TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and understated with generous whitespace",
    accent: "#18181B",
    mockNav: "thin",
    mockHero: "left",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High-impact with thick borders and uppercase type",
    accent: "#DC2626",
    mockNav: "heavy",
    mockHero: "center",
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Serif elegance meets modern layout",
    accent: "#92400E",
    mockNav: "classic",
    mockHero: "split",
  },
  {
    id: "boutique",
    name: "Boutique",
    description: "Refined luxury with gold accents and serif type",
    accent: "#B8860B",
    mockNav: "spacious",
    mockHero: "center",
  },
];

function TemplateMockup({ template }: { template: (typeof SHOWCASE_TEMPLATES)[0] }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="flex-1 mx-3">
          <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded flex items-center px-2">
            <span className="text-[10px] text-zinc-400">mybrand.com</span>
          </div>
        </div>
      </div>
      {/* Template content */}
      <div className="p-5 sm:p-6 space-y-4 min-h-[260px]">
        {/* Nav mockup */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div
            className="w-6 h-6 rounded"
            style={{ backgroundColor: template.accent }}
          />
          <div className="flex gap-3">
            <div className="w-10 h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="w-10 h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="w-10 h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
          </div>
        </div>
        {/* Hero mockup */}
        <div
          className={`space-y-3 pt-2 ${
            template.mockHero === "center" ? "text-center" : ""
          }`}
        >
          <div
            className={`h-4 rounded ${
              template.mockHero === "center" ? "w-3/4 mx-auto" : "w-3/4"
            }`}
            style={{ backgroundColor: `${template.accent}30` }}
          />
          <div
            className={`h-4 rounded ${
              template.mockHero === "center" ? "w-1/2 mx-auto" : "w-1/2"
            }`}
            style={{ backgroundColor: `${template.accent}20` }}
          />
          <div
            className={`h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded mt-2 ${
              template.mockHero === "center" ? "w-2/3 mx-auto" : "w-2/3"
            }`}
          />
          <div
            className={`flex gap-2 pt-2 ${
              template.mockHero === "center" ? "justify-center" : ""
            }`}
          >
            <div
              className="h-7 w-20 rounded-md"
              style={{ backgroundColor: template.accent }}
            />
            <div className="h-7 w-20 rounded-md border border-zinc-300 dark:border-zinc-600" />
          </div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-3 gap-2 pt-3">
          {[0, 1, 2].map((j) => (
            <div
              key={j}
              className="aspect-[3/2] rounded bg-zinc-100 dark:bg-zinc-800 p-2"
            >
              <div
                className="w-full h-1/3 rounded-sm mb-1"
                style={{ backgroundColor: `${template.accent}15` }}
              />
              <div className="w-3/4 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TemplateShowcase() {
  const [selected, setSelected] = useState(0);
  const current = SHOWCASE_TEMPLATES[selected]!;

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            style={{ fontFamily: "var(--font-display)" }}
          >
            16 templates, infinite possibilities
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Each template is a complete design system — typography, colors,
            spacing, animations — all customizable.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Template selector */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {SHOWCASE_TEMPLATES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all flex-shrink-0 lg:flex-shrink min-w-[200px] lg:min-w-0 ${
                  selected === i
                    ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-950/30 shadow-sm"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700"
                }`}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: t.accent }}
                />
                <div>
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {t.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {t.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <TemplateMockup template={current} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
          >
            View All 16 Templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
