'use client';

import { useState, useEffect, useRef, Suspense, lazy } from 'react';
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight, Globe, MessageSquare, ShoppingBag, BarChart3, Layers, FileText,
  Sparkles, Code2, Puzzle, Check, ChevronDown, Star, Zap, Shield, Palette,
  MousePointerClick, Bot, Building2, ShoppingCart, Utensils, Briefcase,
  Stethoscope, GraduationCap, Camera, Music, Dumbbell, Leaf, Heart,
  Github, Twitter, Linkedin, ExternalLink, Play, Monitor, X, Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/user-nav";
// Eagerly load lightweight CTA components
import { FloatingCTA, ScrollCTAModal } from "@/components/landing";
// Lazy-load heavy below-fold sections
const SocialProof = lazy(() => import("@/components/landing/social-proof").then(m => ({ default: m.SocialProof })));
const LiveDemo = lazy(() => import("@/components/landing/live-demo").then(m => ({ default: m.LiveDemo })));
const ComparisonTable = lazy(() => import("@/components/landing/comparison-table").then(m => ({ default: m.ComparisonTable })));
const BeforeAfter = lazy(() => import("@/components/landing/before-after").then(m => ({ default: m.BeforeAfter })));
const LogoCloud = lazy(() => import("@/components/landing/logo-cloud").then(m => ({ default: m.LogoCloud })));

function SectionSkeleton({ height = 300 }: { height?: number }) {
  return <div className="w-full animate-pulse bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl" style={{ height }} />;
}

// ─── Animated Counter ────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Typing Effect ──────────────────────────────────────────────
const brandTypes = ['Restaurant', 'Boutique', 'Agency', 'Studio', 'Clinic', 'Startup', 'Portfolio', 'Brand'];

function TypingEffect() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    const word = brandTypes[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 1800);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 200);
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      } else {
        setIndex((i) => (i + 1) % brandTypes.length);
        setPhase('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, phase, index]);

  return (
    <span className="gradient-text inline-flex items-baseline">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
        className="ml-0.5 inline-block w-[3px] h-[0.85em] bg-violet-500 rounded-sm align-baseline"
        aria-hidden="true"
      />
    </span>
  );
}

// ─── Urgency Banner ──────────────────────────────────────────────
function UrgencyBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -48 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -48 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white px-4 py-2.5 flex items-center justify-center gap-3"
    >
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
      </span>
      <p className="text-xs sm:text-sm font-medium text-center">
        <span className="font-semibold">Limited time:</span> Free tier includes premium AI features — no credit card needed
      </p>
      <Link href="/create" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2 whitespace-nowrap hover:opacity-80 transition-opacity">
        Claim now <ArrowRight className="h-3 w-3" />
      </Link>
      <button
        onClick={onDismiss}
        aria-label="Dismiss banner"
        className="ml-2 flex-shrink-0 h-5 w-5 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
      >
        <X className="h-3 w-3" aria-hidden="true" />
      </button>
    </motion.div>
  );
}

// ─── Video Section ───────────────────────────────────────────────
function VideoPlaceholder() {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
      className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl shadow-violet-500/10"
      onClick={() => setPlaying(true)}
      role="button"
      aria-label="Watch Mayasura demo video"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setPlaying(true)}
    >
      {/* Gradient video thumbnail */}
      <div className="aspect-video w-full bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative flex items-center justify-center">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Animated orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[15%] left-[10%] w-40 h-40 bg-violet-500/30 rounded-full blur-[60px]" />
        <motion.div animate={{ scale: [1, 0.9, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[15%] right-[10%] w-48 h-48 bg-indigo-500/30 rounded-full blur-[60px]" />
        {/* Mockup elements */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[55%] bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <div className="flex-1 bg-white/10 rounded h-4 mx-2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-white/20 rounded w-3/4" />
              <div className="h-3 bg-white/15 rounded w-full" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
              <div className="flex gap-2 mt-3">
                <div className="h-6 w-20 bg-violet-500/50 rounded" />
                <div className="h-6 w-16 bg-white/10 rounded" />
              </div>
            </div>
          </div>
        </div>
        {/* Play button */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-4"
          animate={playing ? {} : { scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="h-20 w-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:bg-white/25 transition-colors shadow-2xl shadow-black/30">
            <Play className="h-8 w-8 text-white fill-white ml-1" />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base">Watch the 90-second demo</p>
            <p className="text-white/60 text-sm mt-1">See how a brand goes from zero to live</p>
          </div>
        </motion.div>
        {/* Duration badge */}
        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
          <Volume2 className="h-3 w-3 text-white/70" />
          <span className="text-white/90 text-xs font-medium">1:32</span>
        </div>
      </div>
      {/* "Coming soon" modal overlay when clicked */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setPlaying(false); }}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center max-w-sm mx-4 shadow-2xl">
              <div className="h-14 w-14 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-violet-600" />
              </div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-white mb-2">Demo coming soon</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">In the meantime, try the live demo — create a brand in 5 minutes.</p>
              <Link href="/create" onClick={(e) => e.stopPropagation()}>
                <button className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold text-sm transition-colors">
                  Try Live Demo
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Animation Variants ─────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const;

// ─── Data ────────────────────────────────────────────────────────
const features = [
  { icon: Sparkles, title: "AI-Powered Branding", desc: "Generate brand names, taglines, color palettes, and content with Claude AI. Your brand identity, crafted in seconds.", color: "from-violet-500 to-purple-600" },
  { icon: Palette, title: "Visual Design Studio", desc: "12+ templates, 34 fonts, 16 color systems. Full control over typography, spacing, borders — no code required.", color: "from-blue-500 to-cyan-600" },
  { icon: ShoppingBag, title: "E-Commerce Built-In", desc: "Product catalog, shopping cart, checkout flow — everything you need to start selling from day one.", color: "from-amber-500 to-orange-600" },
  { icon: FileText, title: "Blog & Content", desc: "AI-generated blog posts, SEO optimization, social media content. Keep your audience engaged effortlessly.", color: "from-emerald-500 to-teal-600" },
  { icon: MessageSquare, title: "Customer Support Suite", desc: "AI chatbot trained on your brand. Handles FAQs, product questions, and support — in your brand voice.", color: "from-pink-500 to-rose-600" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Track page views, orders, subscribers, and engagement. All metrics in one beautiful, actionable dashboard.", color: "from-indigo-500 to-blue-600" },
];

const steps = [
  { number: "01", title: "Describe your brand", desc: "Tell us your brand name, industry, and vision. Our AI suggests the perfect colors, fonts, and template.", icon: Palette, color: "from-violet-500 to-purple-500" },
  { number: "02", title: "Customize the design", desc: "Fine-tune every detail in the Design Studio. Preview your site in real-time across all templates.", icon: Layers, color: "from-blue-500 to-indigo-500" },
  { number: "03", title: "Launch instantly", desc: "One click deploys your complete digital presence — website, shop, blog, chatbot, and more.", icon: Zap, color: "from-emerald-500 to-teal-500" },
];

const testimonials = [
  { quote: "Mayasura transformed how we think about brand presence online. What used to take weeks now takes minutes. The AI understands our vision perfectly.", author: "Sarah Chen", role: "Founder, Bloom Studios", initials: "SC" },
  { quote: "The AI-powered content generation is incredible. Our chatbot sounds exactly like our brand voice. Customers can't tell the difference.", author: "Marcus Rivera", role: "CEO, TechVault", initials: "MR" },
  { quote: "12 templates, each with a completely different vibe. We found the perfect one for our restaurant instantly. Setup to launch in under 5 minutes.", author: "Priya Sharma", role: "Owner, Spice Route", initials: "PS" },
];

const faqs = [
  { q: "What is Mayasura?", a: "Mayasura is an open-source framework that lets any brand create their complete digital presence — website, chatbot, e-commerce store, blog, and more — all powered by AI. Think of it as your brand's digital palace, built in minutes." },
  { q: "Is it really free?", a: "Yes! Mayasura is open-source under the MIT License. You can self-host it for free. We also offer a hosted version with a generous free tier that includes one brand with all core features." },
  { q: "How does the AI work?", a: "Mayasura uses Claude AI to generate brand names, taglines, product descriptions, blog posts, chatbot responses, color palettes, and SEO content. AI features are available across all tiers." },
  { q: "Can I use my own domain?", a: "On the Pro plan, you can connect your own custom domain. The free tier gives you a branded subdomain that works perfectly for getting started." },
  { q: "Can I customize the templates?", a: "Absolutely. Each of our 12+ templates is fully customizable. The Design Studio gives you control over fonts, colors, spacing, button styles, animations, and you can even add custom CSS." },
  { q: "Do I need technical knowledge?", a: "Not at all. The guided wizard walks you through everything step by step. If you can fill out a form, you can build a complete brand ecosystem." },
  { q: "Can I export my data?", a: "Yes. You own all your data. Export everything as JSON at any time. Since it's open source, you can also self-host and have complete control over your data." },
  { q: "What channels are supported?", a: "Website, AI Chatbot, E-Commerce, Blog, Newsletter, Contact Forms, Analytics Dashboard, and CRM. More channels including social media and push notifications are coming soon." },
  { q: "How is this different from Shopify or Squarespace?", a: "Mayasura is AI-native — it generates your entire brand, content, and chatbot automatically. It's also open-source and free. Other platforms charge $16-39+/month, require hours of manual setup, and don't include AI content generation or chatbots." },
  { q: "Can I migrate from another platform?", a: "Yes. Import your products, content, and blog posts from other platforms. We support CSV imports and are building integrations with Shopify, WooCommerce, and more." },
  { q: "How does the AI chatbot work?", a: "The chatbot is trained on your brand voice, products, and content. It answers customer questions, recommends products, and provides support — all sounding like your brand, not a generic bot." },
  { q: "Is there an API?", a: "Yes — our Pro plan includes full API access for custom integrations. You can manage products, content, analytics, and more programmatically. The API follows RESTful conventions with comprehensive documentation." },
];

const templatePreviews = [
  { id: 'minimal', name: 'Minimal', desc: 'Ultra-clean whitespace with light typography', bg: '#FFFFFF', accent: '#6366F1', text: '#18181B', fontLabel: 'Plus Jakarta Sans' },
  { id: 'bold', name: 'Bold', desc: 'High contrast statement design that commands attention', bg: '#000000', accent: '#EF4444', text: '#FFFFFF', fontLabel: 'Space Grotesk' },
  { id: 'editorial', name: 'Editorial', desc: 'Magazine-style with strong typography', bg: '#F5F5F0', accent: '#C2410C', text: '#1A1A1A', fontLabel: 'Playfair Display' },
  { id: 'boutique', name: 'Boutique', desc: 'Luxury elegance with gold accents', bg: '#FAF9F7', accent: '#B8860B', text: '#1A1A1A', fontLabel: 'Cormorant Garamond' },
];

const industries = [
  { icon: ShoppingCart, label: "Retail" },
  { icon: Utensils, label: "Food" },
  { icon: Briefcase, label: "SaaS" },
  { icon: Stethoscope, label: "Health" },
  { icon: GraduationCap, label: "Education" },
  { icon: Camera, label: "Creative" },
  { icon: Music, label: "Music" },
  { icon: Dumbbell, label: "Fitness" },
  { icon: Leaf, label: "Wellness" },
  { icon: Heart, label: "Beauty" },
];

// ─── FAQ Accordion ───────────────────────────────────────────────
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="border-b border-zinc-200 dark:border-zinc-800 group/faq"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left group min-h-[44px]"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
        id={`faq-question-${index}`}
      >
        <span className="font-medium text-[15px] text-[var(--text-primary)] group-hover:text-violet-600 transition-colors pr-4">{q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-zinc-100 dark:bg-zinc-800'}`}
          aria-hidden="true"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-colors ${isOpen ? 'text-violet-600 dark:text-violet-400' : 'text-[var(--text-tertiary)]'}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${index}`}
            role="region"
            aria-labelledby={`faq-question-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-[var(--text-secondary)] pb-5 leading-relaxed pl-0.5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Template Preview Card ───────────────────────────────────────
function TemplateCard({ t, isActive, onClick }: { t: typeof templatePreviews[0]; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl border-2 transition-all duration-300 p-4 ${isActive ? 'border-violet-500 shadow-lg shadow-violet-500/10' : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: t.accent, color: t.bg === '#000000' ? '#FFFFFF' : '#FFFFFF' }}>
          {t.name[0]}
        </div>
        <div>
          <p className="font-semibold text-sm text-[var(--text-primary)]">{t.name}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{t.fontLabel}</p>
        </div>
      </div>
    </button>
  );
}

// ─── Browser Mockup ──────────────────────────────────────────────
function BrowserMockup({ template }: { template: typeof templatePreviews[0] }) {
  return (
    <motion.div
      key={template.id}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/10"
    >
      {/* Browser chrome */}
      <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-3 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1.5" aria-hidden="true">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-md px-4 py-1 text-xs text-zinc-400 flex items-center gap-1.5 min-w-[200px]">
            <Globe className="h-3 w-3" />
            yourbrand.mayasura.com
          </div>
        </div>
      </div>
      {/* Site preview */}
      <div className="relative" style={{ backgroundColor: template.bg, color: template.text }}>
        <div className="px-8 py-10">
          {/* Nav mockup */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded" style={{ backgroundColor: template.accent }} />
              <div className="h-3 w-16 rounded" style={{ backgroundColor: `${template.text}20` }} />
            </div>
            <div className="flex gap-4">
              {[1,2,3].map(i => <div key={i} className="h-2 w-10 rounded" style={{ backgroundColor: `${template.text}12` }} />)}
              <div className="h-6 w-14 rounded-sm" style={{ backgroundColor: template.accent }} />
            </div>
          </div>
          {/* Hero mockup */}
          <div className="max-w-[70%] mb-8">
            <div className="h-2 w-20 rounded mb-4" style={{ backgroundColor: `${template.accent}40` }} />
            <div className="h-5 w-full rounded mb-2" style={{ backgroundColor: `${template.text}15` }} />
            <div className="h-5 w-3/4 rounded mb-4" style={{ backgroundColor: `${template.text}15` }} />
            <div className="h-3 w-full rounded mb-1" style={{ backgroundColor: `${template.text}08` }} />
            <div className="h-3 w-2/3 rounded mb-6" style={{ backgroundColor: `${template.text}08` }} />
            <div className="flex gap-3">
              <div className="h-8 w-24 rounded-sm" style={{ backgroundColor: template.accent }} />
              <div className="h-8 w-20 rounded-sm border" style={{ borderColor: `${template.text}15` }} />
            </div>
          </div>
          {/* Products mockup */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[1,2,3].map(i => (
              <div key={i}>
                <div className="aspect-square rounded-sm mb-2" style={{ backgroundColor: `${template.text}06` }} />
                <div className="h-2 w-16 rounded mb-1" style={{ backgroundColor: `${template.text}12` }} />
                <div className="h-2 w-10 rounded" style={{ backgroundColor: `${template.text}08` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function Home() {
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [showBanner, setShowBanner] = useState(true);
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:text-sm focus:font-medium"
      >
        Skip to content
      </a>
      <AnimatePresence>
        {showBanner && <UrgencyBanner onDismiss={() => setShowBanner(false)} />}
      </AnimatePresence>
      <FloatingCTA />
      <ScrollCTAModal />
      {/* Nav */}
      <nav
        className={`fixed left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-primary)] transition-[top] duration-300 ${showBanner ? 'top-[42px]' : 'top-0'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="Mayasura home">
            <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center" aria-hidden="true">
              <span className="text-white text-xs font-bold" aria-hidden="true">M</span>
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
            <Link href="#faq" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hidden sm:inline transition-colors">
              FAQ
            </Link>
            <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Dashboard
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="main-content" className={`relative pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden transition-[padding-top] duration-300 ${showBanner ? 'pt-36 sm:pt-44' : 'pt-28 sm:pt-36'}`} aria-label="Hero">
        {/* Animated gradient mesh background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-violet-500/12 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-5%] right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[30%] right-[5%] w-[300px] h-[300px] bg-purple-500/8 rounded-full blur-[80px]"
          />
          <motion.div
            animate={{ x: [0, -10, 0], y: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-[50%] left-[30%] w-[350px] h-[350px] bg-fuchsia-500/6 rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Open-source · AI-powered · MIT License</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.08] mb-5 text-[var(--text-primary)]"
              >
                Launch your{' '}
                <span className="whitespace-nowrap"><TypingEffect /></span>
                <br />
                <span className="gradient-text">digital empire</span>
                <br />
                in minutes
              </motion.h1>
              {/* Trusted by counter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="flex items-center gap-2 mb-5"
              >
                <div className="flex -space-x-2">
                  {['SC', 'MR', 'PS', 'JK', 'AL'].map((initials, i) => (
                    <div key={initials} className="h-7 w-7 rounded-full border-2 border-[var(--bg-primary)] bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[9px] font-bold text-white" style={{ zIndex: 5 - i }}>
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">
                    <AnimatedCounter end={10000} suffix="+" duration={2000} />
                  </span>{' '}
                  brands already building
                </p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-base sm:text-lg text-[var(--text-secondary)] max-w-lg mb-8 leading-relaxed"
              >
                Go from zero to a complete digital presence — website, shop, blog, AI chatbot — all generated and customized by AI in under 5 minutes.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex flex-col sm:flex-row items-start gap-3"
              >
                <Link href="/create" className="w-full sm:w-auto">
                  <Button size="xl" variant="brand" className="w-full sm:w-auto text-base btn-shimmer">
                    Start Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/templates" className="w-full sm:w-auto">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto text-base gap-2">
                    <Play className="h-3.5 w-3.5" />
                    See Demo
                  </Button>
                </Link>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-[var(--text-tertiary)] mt-5"
              >
                No credit card required · Deploy in under 5 minutes
              </motion.p>
            </div>

            {/* Right: Browser Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="hidden lg:block"
            >
              <BrowserMockup template={templatePreviews[activeTemplate]} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ LOGO / INDUSTRY BAR ═══════════ */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 border-y border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-6">
            Powering brands in 10+ industries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {industries.map((ind) => (
              <div key={ind.label} className="flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors">
                <ind.icon className="h-4 w-4" />
                <span className="text-xs font-medium">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ LOGO CLOUD — Scrolling Brand Logos ═══════════ */}
      <Suspense fallback={<SectionSkeleton height={160} />}>
        <LogoCloud />
      </Suspense>

      {/* ═══════════ SOCIAL PROOF NUMBERS ═══════════ */}
      <Suspense fallback={<SectionSkeleton height={260} />}>
        <SocialProof />
      </Suspense>

      {/* ═══════════ VIDEO DEMO ═══════════ */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200 dark:border-violet-800 text-xs font-medium text-violet-600 dark:text-violet-400 mb-4">
              <Play className="h-3 w-3 fill-current" />
              See it in action
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
              Zero to launched in 90 seconds
            </h2>
          </motion.div>
          <VideoPlaceholder />
        </div>
      </section>

      {/* ═══════════ FEATURE GRID (3×2) ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Everything your brand needs
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              Six powerful tools in one platform. Build, sell, engage, and grow — all AI-powered.
            </p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                className="group bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] p-7 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 cursor-default"
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 text-[var(--text-primary)]">{f.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ LIVE DEMO — Interactive Brand Morphing ═══════════ */}
      <Suspense fallback={<div className="py-20 bg-[var(--bg-secondary)]"><SectionSkeleton height={400} /></div>}>
        <LiveDemo />
      </Suspense>

      {/* ═══════════ TEMPLATE SHOWCASE ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              12+ templates, each a masterpiece
            </h2>
            <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
              From minimal elegance to bold statements. Click to preview — this is what your visitors will see.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Template selector — horizontal scroll on mobile, vertical on desktop */}
            <div className="lg:col-span-4">
              <div className="flex lg:flex-col gap-3 overflow-x-auto pb-2 lg:pb-0 lg:overflow-x-visible snap-x snap-mandatory lg:snap-none">
                {templatePreviews.map((t, i) => (
                  <div key={t.id} className="snap-start shrink-0 w-[200px] lg:w-auto">
                    <TemplateCard t={t} isActive={activeTemplate === i} onClick={() => setActiveTemplate(i)} />
                  </div>
                ))}
              </div>
              <div className="pt-3">
                <Link href="/templates">
                  <Button variant="outline" size="lg" className="w-full">
                    View All 12+ Templates
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Large preview */}
            <div className="lg:col-span-8">
              <BrowserMockup template={templatePreviews[activeTemplate]} />
              <div className="mt-4 text-center">
                <p className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{templatePreviews[activeTemplate].name}</span>
                  {' — '}{templatePreviews[activeTemplate].desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Three steps to launch
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              From idea to live brand in under 5 minutes. Our AI does the heavy lifting.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[3.5rem] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200 dark:from-violet-800 dark:via-blue-800 dark:to-emerald-800" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="text-center relative"
                >
                  <div className={`relative z-10 h-14 w-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-violet-500 mb-2 block">{step.number}</span>
                  <h3 className="font-display text-lg font-semibold mb-2 text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-xs mx-auto">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-y border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { end: 12, suffix: '+', label: 'Templates' },
              { end: 34, suffix: '', label: 'Fonts' },
              { end: 16, suffix: '', label: 'Color Palettes' },
              { end: 6, suffix: '', label: 'AI Channels' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl sm:text-4xl font-bold font-display text-[var(--text-primary)]">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-[var(--text-secondary)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ COMPARISON TABLE ═══════════ */}
      <Suspense fallback={<SectionSkeleton height={400} />}>
        <ComparisonTable />
      </Suspense>

      {/* ═══════════ BEFORE / AFTER COMPARISON ═══════════ */}
      <Suspense fallback={<SectionSkeleton height={500} />}>
        <BeforeAfter />
      </Suspense>

      {/* ═══════════ PRICING ═══════════ */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Simple, transparent pricing
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Start free. Scale as you grow. No hidden fees, ever.
            </p>
          </motion.div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className={`text-sm font-medium transition-colors ${!billingAnnual ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>Monthly</span>
            <button
              onClick={() => setBillingAnnual(!billingAnnual)}
              role="switch"
              aria-checked={billingAnnual}
              aria-label="Toggle annual billing"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${billingAnnual ? 'bg-violet-600' : 'bg-zinc-200 dark:bg-zinc-700'}`}
            >
              <motion.span
                layout
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md"
                animate={{ x: billingAnnual ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${billingAnnual ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
              Annual
            </span>
            <AnimatePresence>
              {billingAnnual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -8 }}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold"
                >
                  Save 20%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] p-6 sm:p-7 cursor-default"
            >
              <h3 className="font-display font-semibold text-lg mb-1 text-[var(--text-primary)]">Free</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">$0</span>
                <span className="text-sm text-[var(--text-tertiary)]">/month</span>
              </div>
              {billingAnnual && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 -mt-4 mb-3 font-medium">Always free</p>
              )}
              <ul className="space-y-3 mb-8">
                {['1 brand', '5 products', 'All 12+ templates', 'AI brand generation', 'Website & chatbot', 'Community support'].map(f => (
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
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.04, y: -6 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[var(--bg-surface)] rounded-2xl border-2 border-violet-600 p-6 sm:p-7 relative shadow-xl shadow-violet-500/10 sm:col-span-2 lg:col-span-1 cursor-default"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-medium shadow-lg">
                  Most Popular
                </span>
              </div>
              <h3 className="font-display font-semibold text-lg mb-1 text-[var(--text-primary)]">Pro</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">For growing brands</p>
              <div className="mb-1">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={billingAnnual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-bold text-[var(--text-primary)]"
                  >
                    {billingAnnual ? '$15' : '$19'}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-[var(--text-tertiary)]">/month</span>
              </div>
              {billingAnnual ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-5 font-medium">Billed $182/yr · save $46</p>
              ) : (
                <div className="mb-5" />
              )}
              <ul className="space-y-3 mb-8">
                {['Unlimited brands', 'Unlimited products', 'Custom domain', 'Priority AI generation', 'Full e-commerce suite', 'Advanced analytics', 'Priority support', 'Custom CSS'].map(f => (
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
            </motion.div>

            {/* Enterprise Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -4 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] p-6 sm:p-7 cursor-default"
            >
              <h3 className="font-display font-semibold text-lg mb-1 text-[var(--text-primary)]">Enterprise</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-5">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--text-primary)]">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['White-label solution', 'API access', 'Custom SLA', 'Dedicated support', 'SSO & SAML', 'Custom integrations', 'Volume discounts', 'On-premise option'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]">
                    <Check className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Loved by brand builders
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Hear from the founders and creators who built their brands with Mayasura.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Customer testimonials">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                role="listitem"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-primary)] p-6 sm:p-7 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-0.5 mb-5" aria-label="5 out of 5 stars" role="img">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{t.author}</p>
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
              Built for the modern brand
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Architecture decisions that scale with your ambition.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { icon: Bot, title: 'AI-Powered', desc: 'Claude AI generates content, product descriptions, chatbot responses, and brand strategy — all in your unique voice.' },
              { icon: Code2, title: 'Open Source', desc: 'Fully open-source under MIT License. Own your data, customize everything, deploy on any platform.' },
              { icon: Puzzle, title: 'Composable', desc: 'Every component is modular. Swap, extend, or replace any piece. Build palaces, not huts.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-5">
                  <f.icon className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section id="faq" className="py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
              Frequently asked questions
            </h2>
            <p className="text-[var(--text-secondary)] max-w-md mx-auto">
              Everything you need to know about building your digital palace.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              {faqs.filter((_, i) => i % 2 === 0).map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800">
              {faqs.filter((_, i) => i % 2 === 1).map((faq, i) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700" />
        {/* Animated floating orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-[15%] w-[300px] h-[300px] bg-white/5 rounded-full blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-white/5 rounded-full blur-[60px]"
        />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs font-medium text-white/90">
              <AnimatedCounter end={10000} suffix="+" duration={2500} /> brands already building
            </span>
          </motion.div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-white">
            Ready to build your
            <br />digital palace?
          </h2>
          <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg mx-auto">
            Join thousands of brands who launched their complete digital presence with Mayasura. Zero code, zero hassle.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/create">
              <Button size="xl" className="bg-white text-violet-700 hover:bg-white/90 font-semibold text-base shadow-xl btn-shimmer">
                Create Your Brand — Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8" role="list" aria-label="Trust indicators">
            {[
              { icon: Shield, label: 'MIT Licensed' },
              { icon: Github, label: 'Open Source' },
              { icon: Zap, label: '< 5 min setup' },
              { icon: Star, label: '99% satisfaction' },
            ].map((signal) => (
              <div key={signal.label} className="flex items-center gap-1.5 text-white/50" role="listitem">
                <signal.icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-xs font-medium">{signal.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/40 mt-5">
            No credit card required · Self-hostable · Your data, your control
          </p>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="border-t border-[var(--border-primary)] py-16 px-4 sm:px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded bg-violet-700 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">M</span>
                </div>
                <span className="font-display font-semibold text-sm text-[var(--text-primary)]">Mayasura</span>
              </div>
              <p className="text-xs text-[var(--text-tertiary)] leading-relaxed mb-4">
                The divine architect of digital ecosystems. Build palaces, not huts.
              </p>
              <div className="flex items-center gap-3">
                <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Mayasura on GitHub (opens in new tab)">
                  <Github className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Mayasura on Twitter">
                  <Twitter className="h-4 w-4" aria-hidden="true" />
                </a>
                <a href="#" className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Mayasura on LinkedIn">
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

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

            {/* Resources */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] mb-4">Resources</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Documentation', href: '#' },
                  { label: 'API Reference', href: '#' },
                  { label: 'Community', href: '#' },
                  { label: 'Changelog', href: '#' },
                ].map(l => (
                  <li key={l.label}>
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
                  { label: 'Contact', href: '#' },
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
                  { label: 'Security', href: '#' },
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
            <div className="flex items-center gap-3">
              <span className="text-xs text-[var(--text-tertiary)]">
                © {new Date().getFullYear()} Mayasura — The divine architect of digital ecosystems
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                v3.3
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)]">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium">
                Open Source
              </span>
              <a href="https://github.com/vikramgorla/mayasura" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1" aria-label="Star Mayasura on GitHub (opens in new tab)">
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
