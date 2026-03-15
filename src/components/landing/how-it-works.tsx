"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Zap } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Sparkles,
    title: "Tell us about your brand",
    description:
      "Answer a few questions about your business — industry, vibe, products. Our wizard guides you through it.",
    badge: "2 min",
    iconColor: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950/40",
    badgeBg: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    lineColor: "from-violet-500 to-blue-500",
  },
  {
    number: "02",
    icon: Bot,
    title: "AI builds your ecosystem",
    description:
      "AI generates your brand identity, designs your website, sets up your shop, blog, chatbot, and analytics.",
    badge: "Instant",
    iconColor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/40",
    badgeBg: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
    lineColor: "from-blue-500 to-emerald-500",
  },
  {
    number: "03",
    icon: Zap,
    title: "Launch & grow",
    description:
      "Your brand is live with a website, shop, blog, and support system. Customize anything, add products, write content.",
    badge: "Live",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
    badgeBg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    lineColor: "",
  },
];

export function HowItWorks() {
  return (
    <section
      className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950/50"
      id="how-it-works"
    >
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
            How it works
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            From idea to live brand in three steps.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute left-1/2 top-16 bottom-16 w-px bg-gradient-to-b from-violet-300 via-blue-300 to-emerald-300 dark:from-violet-600 dark:via-blue-600 dark:to-emerald-600 -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className={`flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 text-center ${
                    i % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                >
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-3 ${step.badgeBg}`}
                  >
                    {step.badge}
                  </span>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto md:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Icon circle */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.bg} flex items-center justify-center shadow-sm border border-zinc-200/50 dark:border-zinc-700/50`}
                  >
                    <step.icon className={`h-7 w-7 ${step.iconColor}`} />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 dark:bg-zinc-50 text-xs font-bold text-white dark:text-zinc-900">
                    {step.number}
                  </span>
                </div>

                {/* Spacer for layout symmetry */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
