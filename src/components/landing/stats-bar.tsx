"use client";

import { motion } from "framer-motion";
import { Layout, Type, Palette, Share2 } from "lucide-react";

const STATS = [
  { label: "Templates", value: "16", icon: Layout },
  { label: "Fonts", value: "34", icon: Type },
  { label: "Color Palettes", value: "16", icon: Palette },
  { label: "Channels", value: "7", icon: Share2 },
];

export function StatsBar() {
  return (
    <section className="border-y border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 dark:divide-zinc-800">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center justify-center gap-3 py-6 sm:py-8"
            >
              <stat.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
