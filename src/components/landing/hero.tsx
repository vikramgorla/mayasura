"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { motion } from "framer-motion";
import { useTypingEffect } from "./use-typing-effect";

const BRAND_TYPES = [
  "Restaurant",
  "Boutique",
  "Agency",
  "Studio",
  "Clinic",
  "Startup",
  "Portfolio",
  "Brand",
];

export function Hero() {
  const { currentText } = useTypingEffect({
    words: BRAND_TYPES,
    typeSpeed: 80,
    deleteSpeed: 45,
    pauseDuration: 1800,
  });

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 via-transparent to-transparent dark:from-violet-950/20 dark:via-transparent" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-200/30 dark:bg-violet-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 px-4 py-1.5 text-sm text-violet-700 dark:text-violet-300 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              Open Source · AI-Powered · MIT License
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Build your{" "}
              <span className="relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-violet-500 dark:from-violet-400 dark:to-violet-300">
                  {currentText}
                </span>
                <span className="animate-pulse text-violet-600 dark:text-violet-400">|</span>
              </span>
              <br />
              digital palace in minutes
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              An open-source framework that generates your complete brand
              ecosystem — website, shop, blog, chatbot, analytics — all from a
              single AI-powered wizard.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3">
              <Link
                href="/create"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-violet-700 px-6 text-base font-semibold text-white hover:bg-violet-800 transition-colors active:scale-[0.98] w-full sm:w-auto"
              >
                Create a Brand
              </Link>
              <a
                href="https://github.com/vikramgorla/mayasura"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98] gap-2 w-full sm:w-auto"
              >
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </div>

            {/* Tech stack note */}
            <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
              MIT Licensed · Self-hostable · Next.js + SQLite + AI
            </p>
          </motion.div>

          {/* Right — Browser Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-900/10 dark:shadow-black/30 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-md flex items-center px-3">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">yourbrand.com</span>
                  </div>
                </div>
              </div>
              {/* Preview content */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Mock nav */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700" />
                    <div className="w-20 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                  <div className="hidden sm:flex gap-4">
                    <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="w-12 h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded" />
                  </div>
                </div>
                {/* Mock hero */}
                <div className="space-y-3 pt-4">
                  <div className="w-3/4 h-5 bg-zinc-300 dark:bg-zinc-600 rounded" />
                  <div className="w-1/2 h-5 bg-zinc-300 dark:bg-zinc-600 rounded" />
                  <div className="w-2/3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded mt-3" />
                  <div className="w-1/2 h-3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
                {/* Mock CTA */}
                <div className="flex gap-3 pt-2">
                  <div className="h-9 w-24 rounded-lg bg-gradient-to-r from-violet-600 to-violet-500" />
                  <div className="h-9 w-24 rounded-lg border border-zinc-300 dark:border-zinc-600" />
                </div>
                {/* Mock cards */}
                <div className="grid grid-cols-3 gap-3 pt-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="aspect-[4/3] rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3"
                    >
                      <div className="w-full h-1/2 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                      <div className="w-3/4 h-2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      <div className="w-1/2 h-2 bg-zinc-200 dark:bg-zinc-700 rounded mt-1" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect behind mockup */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-violet-400/20 via-violet-300/10 to-transparent dark:from-violet-600/10 dark:via-violet-500/5 rounded-2xl blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
