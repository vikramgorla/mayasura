"use client";

import { motion } from "framer-motion";
import { Cloud, Container, Server, Terminal } from "lucide-react";

const DEPLOY_OPTIONS = [
  {
    name: "Railway",
    description: "One-click deploy to Railway with automatic builds",
    icon: Cloud,
    iconColor: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-100 dark:bg-purple-950/40",
  },
  {
    name: "Vercel",
    description: "Deploy to Vercel with zero configuration",
    icon: Cloud,
    iconColor: "text-zinc-900 dark:text-zinc-100",
    bg: "bg-zinc-100 dark:bg-zinc-800",
  },
  {
    name: "Docker",
    description: "Multi-stage Dockerfile included and ready to go",
    icon: Container,
    iconColor: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/40",
  },
  {
    name: "Self-Host",
    description: "Clone, build, and run on any Node.js server",
    icon: Server,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/40",
  },
];

const TERMINAL_LINES = [
  { prompt: true, text: "git clone https://github.com/vikramgorla/mayasura.git" },
  { prompt: true, text: "cd mayasura && cp .env.example .env" },
  { prompt: true, text: "npm install" },
  { prompt: true, text: "npm run dev" },
  { prompt: false, text: "" },
  { prompt: false, text: "  ▲ Next.js 15.3" },
  { prompt: false, text: "  - Local:   http://localhost:3000" },
  { prompt: false, text: "" },
  { prompt: false, text: "  ✓ Ready in 2.1s" },
];

export function DeploySection() {
  return (
    <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950/50">
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
            Deploy anywhere
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Self-host on your infrastructure or deploy to the cloud in minutes.
          </p>
        </motion.div>

        {/* Deploy cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {DEPLOY_OPTIONS.map((option, i) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${option.bg} mb-3`}
              >
                <option.icon className={`h-5 w-5 ${option.iconColor}`} />
              </div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {option.name}
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {option.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Terminal block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex items-center gap-1.5 ml-3 text-zinc-500 text-xs">
                <Terminal className="h-3.5 w-3.5" />
                <span>Quick Start</span>
              </div>
            </div>
            {/* Terminal body */}
            <div className="p-4 sm:p-6 font-mono text-sm leading-relaxed overflow-x-auto">
              {TERMINAL_LINES.map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {line.prompt ? (
                    <>
                      <span className="text-emerald-400">$</span>{" "}
                      <span className="text-zinc-300">{line.text}</span>
                    </>
                  ) : (
                    <span className="text-zinc-500">{line.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
