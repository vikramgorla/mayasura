"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Star } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your brand deserves
            <br />a digital palace
          </h2>
          <p className="mt-6 text-lg text-violet-100 max-w-xl mx-auto">
            Open source, AI-powered, and ready to launch. Start building your
            brand ecosystem today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-violet-700 hover:bg-violet-50 transition-colors active:scale-[0.98] w-full sm:w-auto"
            >
              Create Your Brand
            </Link>
            <a
              href="https://github.com/vikramgorla/mayasura"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 text-base font-medium text-white hover:bg-white/20 transition-colors active:scale-[0.98] gap-2 w-full sm:w-auto"
            >
              <Star className="h-5 w-5" />
              Star on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
