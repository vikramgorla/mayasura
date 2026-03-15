"use client";

import { motion } from "framer-motion";
import { Sparkles, Github, Blocks } from "lucide-react";

const PILLARS = [
  {
    icon: Sparkles,
    title: "AI-Powered",
    description:
      "Every aspect of your brand — from name to content to SEO — is enhanced by AI that understands your vision.",
  },
  {
    icon: Github,
    title: "Open Source",
    description:
      "MIT licensed, fully transparent. Fork it, customize it, contribute back. No vendor lock-in, ever.",
  },
  {
    icon: Blocks,
    title: "Composable",
    description:
      "Use the whole platform or just the pieces you need. Every module works independently.",
  },
];

export function BuiltForBrands() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-950 text-zinc-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Built for modern brands
          </h2>
          <p className="mt-4 text-lg text-zinc-400 max-w-2xl mx-auto">
            The foundation your digital presence deserves.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center hover:border-zinc-700 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-800 mb-5">
                <pillar.icon className="h-7 w-7 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{pillar.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
