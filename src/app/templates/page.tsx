"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { WEBSITE_TEMPLATES } from "@/lib/templates/website-templates";
import { LandingNav, Footer } from "@/components/landing";

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      <LandingNav />

      <section className="pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
              style={{ fontFamily: "var(--font-display)" }}
            >
              16 Templates
            </h1>
            <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Each template is a complete design system — typography, colors,
              spacing, and animations. Choose one and customize everything in the
              Design Studio.
            </p>
          </div>

          {/* Template grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {WEBSITE_TEMPLATES.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Accent bar */}
                <div
                  className="h-1.5"
                  style={{
                    backgroundColor: template.colors.light.accent,
                  }}
                />

                {/* Content */}
                <div className="p-5">
                  {/* Template preview mini */}
                  <div className="mb-4 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 aspect-[4/3] flex flex-col justify-between">
                    {/* Mini nav */}
                    <div className="flex items-center justify-between">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: template.colors.light.accent,
                        }}
                      />
                      <div className="flex gap-2">
                        <div className="w-6 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded" />
                        <div className="w-6 h-1.5 bg-zinc-300 dark:bg-zinc-700 rounded" />
                      </div>
                    </div>
                    {/* Mini hero */}
                    <div className="space-y-1.5">
                      <div
                        className="h-2.5 w-3/4 rounded"
                        style={{
                          backgroundColor: `${template.colors.light.accent}30`,
                        }}
                      />
                      <div
                        className="h-2.5 w-1/2 rounded"
                        style={{
                          backgroundColor: `${template.colors.light.accent}20`,
                        }}
                      />
                      <div className="h-1.5 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    </div>
                    {/* Mini cards */}
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((j) => (
                        <div
                          key={j}
                          className="flex-1 h-6 rounded bg-zinc-200 dark:bg-zinc-800"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Name & description */}
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                    {template.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                    {template.description}
                  </p>

                  {/* Best for tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.bestFor.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/create?template=${template.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors group-hover:gap-2.5"
                  >
                    Start with this template
                    <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
