'use client';

import { useState } from 'react';
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Globe, MessageSquare, ShoppingBag, BarChart3, Layers, FileText,
  Sparkles, Code2, Puzzle, Check, ChevronDown, Star, Zap, Shield, Palette,
  MousePointerClick, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";

// ─── Animation Variants ─────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

// ─── Data ────────────────────────────────────────────────────────
const features = [
  { icon: Globe, title: "Website", desc: "Landing pages, product pages, about & contact — all styled to your brand.", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50" },
  { icon: MessageSquare, title: "AI Chatbot", desc: "Customer support that knows your brand voice, products, and FAQs.", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50" },
  { icon: ShoppingBag, title: "E-Commerce", desc: "Product catalog, shopping cart, checkout — ready to sell from day one.", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50" },
  { icon: FileText, title: "Blog & Content", desc: "AI-generated blog posts, social media content, email campaigns.", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50" },
  { icon: BarChart3, title: "Analytics", desc: "Track page views, orders, subscribers, and engagement in one dashboard.", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50" },
  { icon: Layers, title: "Design Studio", desc: "12+ templates, custom fonts, color systems, and layout control.", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50" },
];

const steps = [
  { number: "01", title: "Define Your Brand", desc: "Tell us your brand name, industry, and vision. AI suggests colors, fonts, and templates.", icon: Palette },
  { number: "02", title: "Build Your Ecosystem", desc: "Configure products, content, and channels through a guided wizard with AI at every step.", icon: Sparkles },
  { number: "03", title: "Launch Everything", desc: "One click deploys your complete digital presence — website, shop, blog, chatbot, and more.", icon: Zap },
];

const testimonials = [
  { quote: "Mayasura transformed how we think about brand presence online. What used to take weeks now takes minutes.", author: "Sarah Chen", role: "Founder, Bloom Studios", rating: 5 },
  { quote: "The AI-powered content generation is incredible. Our chatbot sounds exactly like our brand voice.", author: "Marcus Rivera", role: "CEO, TechVault", rating: 5 },
  { quote: "12 templates, each with a completely different vibe. We found the perfect one for our restaurant instantly.", author: "Priya Sharma", role: "Owner, Spice Route", rating: 5 },
];

const faqs = [
  { q: "What is Mayasura?", a: "Mayasura is an open-source framework that lets any brand create their complete digital presence — website, chatbot, e-commerce store, blog, and more — all powered by AI. Think of it as your brand's digital palace." },
  { q: "Is it really free?", a: "Yes! Mayasura is open-source under the MIT License. You can self-host it for free. We also offer a hosted version with a free tier that includes one brand with all core features." },
  { q: "How does the AI work?", a: "Mayasura uses Claude AI to generate brand names, taglines, product descriptions, blog posts, chatbot responses, color palettes, and more. All AI features are available in both free and pro tiers." },
  { q: "Can I customize the templates?", a: "Absolutely. Each of our 12+ templates is fully customizable. The Design Studio gives you control over fonts, colors, spacing, button styles, and you can even add custom CSS." },
  { q: "Do I need technical knowledge?", a: "Not at all. The guided wizard walks you through everything step by step. If you can fill out a form, you can build a complete brand ecosystem." },
  { q: "Can I export my data?", a: "Yes. You own all your data. Export everything as JSON at any time. Since it's open source, you can also self-host and have complete control." },
  { q: "What channels are supported?", a: "Website, AI Chatbot, E-Commerce, Blog, Email Marketing, Social Media suggestions, Push Notifications, and CRM Dashboard. More channels are coming." },
  { q: "How do I deploy my brand?", a: "Click 'Launch' in your dashboard. Your brand gets a unique URL with all channels live. For self-hosting, deploy to any Node.js-compatible platform." },
];

const templatePreviews = [
  { id: 'minimal', name: 'Minimal', bg: '#FFFFFF', accent: '#6366F1', text: '#18181B', desc: 'Ultra-clean whitespace' },
  { id: 'bold', name: 'Bold', bg: '#000000', accent: '#EF4444', text: '#FFFFFF', desc: 'High contrast statement' },
  { id: 'startup', name: 'Startup', bg: '#FFFFFF', accent: '#6366F1', text: '#0F172A', desc: 'Modern SaaS aesthetic' },
  { id: 'boutique', name: 'Boutique', bg: '#FAF9F7', accent: '#B8860B', text: '#1A1A1A', desc: 'Luxury elegance' },
];

// ─── FAQ Accordion ───────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[var(--border-primary)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-sm text-[var(--text-primary)] group-hover:text-violet-600 transition-colors">{q}</span>
        <ChevronDown className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <p className="text-sm text-[var(--text-secondary)] pb-5 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-display font-semibold text-base tracking-tight hidden sm:inline text-[var(--text-primary)]">
              Mayasura
            </span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/templates" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hidden sm:inline transition-colors">
              Templates
            </Link>
            <Link href="#pricing" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hidden sm:inline transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Dashboard
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Open-source brand ecosystem builder</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] font-bold tracking-tight leading-[1.08] mb-5 text-[var(--text-primary)]"
          >
            Build your brand&apos;s
            <br />
            <span className="gradient-text">digital palace</span>
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
                Start Building — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                Browse Templates
              </Button>
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-[var(--text-tertiary)] mt-5"
          >
            No credit card required · MIT License · Self-hostable
          </motion.p>
        </div>
      </section>

      {/* ═══════════ SOCIAL PROOF BAR ═══════════ */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-y border-[var(--border-primary)]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm text-[var(--text-secondary)] ml-2">4.9/5 rating</span>
            </div>
            <div className="h-4 w-px bg-[var(--border-primary)] hidden sm:block" />
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">12+ templates</span> for every industry
            </p>
            <div className="h-4 w-px bg-[var(--border-primary)] hidden sm:block" />
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">AI-powered</span> brand generation
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURE SHOWCASE ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
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
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="group bg-[var(--bg-surface)] rounded-xl border border-[var(--border-primary)] p-6 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-md transition-all"
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${f.color} transition-colors`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-semibold text-base mb-1.5 text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TEMPLATE GALLERY ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Templates for every vision
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              12+ professionally designed templates. Each with a completely unique identity.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templatePreviews.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -4 }}
                className="group rounded-xl overflow-hidden border border-[var(--border-primary)] hover:shadow-lg transition-all cursor-pointer"
              >
                <div
                  className="h-40 p-6 flex flex-col justify-between"
                  style={{ backgroundColor: t.bg, color: t.text }}
                >
                  <div>
                    <div className="h-1.5 w-12 rounded mb-3" style={{ backgroundColor: t.accent }} />
                    <div className="h-3 w-24 rounded" style={{ backgroundColor: `${t.text}18` }} />
                    <div className="h-2 w-16 rounded mt-2" style={{ backgroundColor: `${t.text}10` }} />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-6 w-16 rounded-sm" style={{ backgroundColor: t.accent }} />
                    <div className="h-6 w-12 rounded-sm border" style={{ borderColor: `${t.text}15` }} />
                  </div>
                </div>
                <div className="p-4 bg-[var(--bg-surface)]">
                  <p className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/templates">
              <Button variant="outline" size="lg">
                View All 12+ Templates
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
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
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 items-start bg-[var(--bg-surface)] rounded-xl border border-[var(--border-primary)] p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-violet-600 text-white flex items-center justify-center font-display">
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-xs font-bold text-violet-600">{step.number}</span>
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)]">{step.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Simple, transparent pricing
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Tier */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] p-8">
              <h3 className="font-display font-semibold text-lg mb-1 text-[var(--text-primary)]">Free</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">$0</span>
                <span className="text-sm text-[var(--text-tertiary)]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['1 brand', 'All 12+ templates', 'AI brand generation', 'Website & chatbot', 'Up to 10 products', 'Community support'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/create">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-[var(--bg-surface)] rounded-2xl border-2 border-violet-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium">
                  Most Popular
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 text-[var(--text-primary)]">Pro</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">For growing brands</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">$19</span>
                <span className="text-sm text-[var(--text-tertiary)]">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited brands', 'All 12+ templates', 'AI brand generation', 'Full e-commerce suite', 'Unlimited products', 'Priority support', 'Custom domain', 'Advanced analytics'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-violet-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/create">
                <Button variant="brand" className="w-full">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Loved by brand builders
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              See what our users have to say about their experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border-primary)] p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center text-xs font-bold text-violet-600">
                    {t.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{t.author}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ BUILT FOR MODERN BRANDS ═══════════ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden bg-zinc-950">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
              Built for the modern brand
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Architecture decisions that scale with your ambition.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: 'AI-Powered', desc: 'Claude AI generates content, product descriptions, chatbot responses, and brand strategy.' },
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

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Frequently asked questions
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Everything you need to know about Mayasura.
            </p>
          </div>
          <div className="border-t border-[var(--border-primary)]">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to build your palace?
          </h2>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Go from idea to a complete digital presence in under 5 minutes. No credit card, no code.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button size="xl" className="bg-white text-violet-700 hover:bg-white/90 font-semibold">
                Create Your Brand — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-white/50 mt-5">
            Open source · MIT License · Self-hostable
          </p>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-[var(--border-primary)] py-16 px-4 sm:px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            {/* Product */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Product</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Templates', href: '/templates' },
                  { label: 'Create Brand', href: '/create' },
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Pricing', href: '#pricing' },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'About', href: '#' },
                  { label: 'Blog', href: '#' },
                  { label: 'Careers', href: '#' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Documentation', href: '#' },
                  { label: 'API Reference', href: '#' },
                  { label: 'Community', href: '#' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                  { label: 'MIT License', href: 'https://github.com/vikramgorla/mayasura' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-primary)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-violet-700 flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">M</span>
              </div>
              <span className="text-sm text-[var(--text-tertiary)]">
                © {new Date().getFullYear()} Mayasura — The divine architect of digital ecosystems
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-[var(--text-tertiary)]">
              <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
