'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Globe, MessageSquare, ShoppingBag, Mail, BarChart3, Layers, Zap, Shield, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STARTER_TEMPLATES } from "@/lib/templates";

const channels = [
  { icon: Globe, name: "Website", desc: "Landing pages, product pages, about & contact" },
  { icon: MessageSquare, name: "AI Chatbot", desc: "Intelligent customer support that knows your brand" },
  { icon: ShoppingBag, name: "E-Commerce", desc: "Product catalog and storefront ready to sell" },
  { icon: Mail, name: "Email", desc: "Welcome sequences, newsletters, templates" },
  { icon: BarChart3, name: "Analytics", desc: "Dashboard to track engagement and growth" },
  { icon: Layers, name: "Content Hub", desc: "Blog posts, social media, all AI-generated" },
];

const steps = [
  { number: "01", title: "Define Your Brand", desc: "Tell us your brand name, industry, and vision. Our AI suggests names, taglines, and identity." },
  { number: "02", title: "Build Your Ecosystem", desc: "Configure products, content, and channels through a guided wizard with AI assistance at every step." },
  { number: "03", title: "Launch Everything", desc: "One click deploys your complete digital presence — website, chatbot, content, and more." },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-slate-900 text-sm font-bold">M</span>
            </div>
            <span className="font-semibold text-lg tracking-tight hidden sm:inline">Mayasura</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/templates" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hidden sm:inline">
              Templates
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
              Dashboard
            </Link>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white hidden sm:inline">
              Sign In
            </Link>
            <Link href="/create">
              <Button size="sm" variant="brand">
                <span className="hidden sm:inline">Create Brand</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 text-sm text-slate-600 dark:text-slate-400 mb-6 sm:mb-8"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Open-source brand ecosystem builder
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            Build your brand&apos;s
            <br />
            <span className="text-blue-600">digital palace</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-base sm:text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed"
          >
            Go from zero to a complete digital presence in minutes. 
            Website, chatbot, e-commerce, content — all AI-powered, 
            all in one click.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="xl" variant="brand" className="w-full sm:w-auto">
                Start Building
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                <Palette className="h-5 w-5" />
                Browse Templates
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Template Preview Strip */}
      <section className="py-12 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              10 industry templates
            </h2>
            <p className="text-slate-500">Pick a template, customize with AI, launch in minutes</p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
          >
            {STARTER_TEMPLATES.slice(0, 5).map((t) => (
              <motion.div key={t.id} variants={item} className="snap-center">
                <Link href={`/create?template=${t.id}`}>
                  <div className="w-36 sm:w-40 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all flex-shrink-0">
                    <div className="h-12 p-3 flex items-center gap-2" style={{ backgroundColor: t.primaryColor }}>
                      <span className="text-lg">{t.emoji}</span>
                      <span className="text-xs font-medium truncate" style={{ color: t.secondaryColor }}>{t.name}</span>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-slate-400 truncate">{t.category}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            <motion.div variants={item} className="snap-center">
              <Link href="/templates">
                <div className="w-36 sm:w-40 h-full bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all flex-shrink-0 min-h-[88px]">
                  View all →
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Channels Grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Every channel. One click.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
              Your brand gets a complete digital ecosystem, not just a website.
            </p>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {channels.map((channel) => (
              <motion.div key={channel.name} variants={item}>
                <div className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                    <channel.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{channel.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{channel.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Three steps to launch
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
              Our AI-guided wizard makes brand creation effortless.
            </p>
          </div>
          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 sm:gap-8 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {step.number}
                </div>
                <div className="pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm sm:text-base">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Built for the modern brand
            </h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Architecture decisions that scale with your ambition.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Zap, title: 'AI-Powered', desc: 'Claude AI generates your brand content, product descriptions, and chatbot responses.' },
              { icon: Shield, title: 'Open Source', desc: 'Fully open-source. Own your data, customize everything, deploy anywhere.' },
              { icon: Layers, title: 'Composable', desc: 'Every component is modular. Swap, extend, or replace any piece of the stack.' },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Ready to build your palace?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mb-6 sm:mb-8">
            Start creating your brand ecosystem in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="xl" variant="brand" className="w-full sm:w-auto">
                Create Your Brand
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
              <span className="text-white dark:text-slate-900 text-xs font-bold">M</span>
            </div>
            <span className="text-sm text-slate-500">
              Mayasura — The divine architect of digital ecosystems
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 dark:hover:text-white">
              GitHub
            </a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
