'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Globe, MessageSquare, ShoppingBag, BarChart3, Layers, FileText, Sparkles, Code2, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

const features = [
  {
    icon: Globe,
    title: "Website",
    desc: "Landing pages, product pages, about & contact — all styled to your brand.",
    span: "col-span-1",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    desc: "Customer support that knows your brand voice, products, and FAQs.",
    span: "col-span-1",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce",
    desc: "Product catalog, shopping cart, checkout — ready to sell from day one.",
    span: "col-span-1 sm:col-span-2 lg:col-span-1",
  },
  {
    icon: FileText,
    title: "Blog & Content",
    desc: "AI-generated blog posts, social media content, email campaigns.",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    desc: "Track page views, orders, subscribers, and engagement in one dashboard.",
    span: "col-span-1",
  },
  {
    icon: Layers,
    title: "Composable Stack",
    desc: "Every piece is modular. Swap, extend, or deploy each component independently.",
    span: "col-span-1 sm:col-span-2 lg:col-span-1",
  },
];

const steps = [
  { number: "01", title: "Define Your Brand", desc: "Tell us your brand name, industry, and vision. AI suggests names, taglines, and identity." },
  { number: "02", title: "Build Your Ecosystem", desc: "Configure products, content, and channels through a guided wizard with AI at every step." },
  { number: "03", title: "Launch Everything", desc: "One click deploys your complete digital presence — website, chatbot, content, and more." },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-display font-semibold text-base tracking-tight hidden sm:inline text-[var(--text-primary)]">
              Mayasura
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/templates" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hidden sm:inline transition-colors">
              Templates
            </Link>
            <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Dashboard
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* Hero — clean, typography-driven */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm font-medium text-violet-600 dark:text-violet-400 mb-5"
          >
            Open-source brand ecosystem builder
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] mb-5 text-[var(--text-primary)]"
          >
            Build your brand&apos;s
            <br />
            digital palace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed"
          >
            Go from zero to a complete digital presence in minutes.
            Website, chatbot, e-commerce, content — all AI-powered.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="xl" variant="brand" className="w-full sm:w-auto">
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Browse Templates
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Every channel, one platform
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Your brand gets a complete digital ecosystem — not just a website.
            </p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className={`${f.span} group bg-[var(--bg-surface)] rounded-xl border border-[var(--border-primary)] p-6 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all`}
              >
                <div className="h-11 w-11 rounded-xl bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center mb-4 group-hover:bg-violet-200 dark:group-hover:bg-violet-900/40 transition-colors">
                  <f.icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1.5 text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Three steps to launch
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Our AI-guided wizard makes brand creation effortless.
            </p>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex gap-5 items-start bg-[var(--bg-surface)] rounded-xl border border-[var(--border-primary)] p-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-violet-600 text-white flex items-center justify-center text-lg font-bold font-display">
                  {step.number}
                </div>
                <div className="pt-0.5">
                  <h3 className="font-display text-lg font-semibold mb-1 text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for modern brands — dark section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden bg-zinc-950">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
              Built for the modern brand
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Architecture decisions that scale with your ambition.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'AI-Powered', desc: 'Claude AI generates content, product descriptions, chatbot responses, and brand strategy.' },
              { icon: Code2, title: 'Open Source', desc: 'Fully open-source. Own your data, customize everything, deploy anywhere you want.' },
              { icon: Puzzle, title: 'Composable', desc: 'Every component is modular. Swap, extend, or replace any piece of the stack.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
            Ready to build your palace?
          </h2>
          <p className="text-[var(--text-secondary)] mb-8">
            Go from idea to a complete digital presence in under 5 minutes. No credit card, no code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="xl" variant="brand" className="w-full sm:w-auto">
                Create Your Brand — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-4">
            Open source · MIT License · Self-hostable
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-primary)] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-violet-700 flex items-center justify-center">
              <span className="text-white text-[9px] font-bold">M</span>
            </div>
            <span className="text-sm text-[var(--text-tertiary)]">
              Mayasura — The divine architect of digital ecosystems
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
              GitHub
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
