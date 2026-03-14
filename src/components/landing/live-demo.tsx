'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const demoBrands = [
  {
    name: 'Bloom Studios',
    industry: 'Creative Agency',
    bg: '#FAFAF9', accent: '#6366F1', text: '#18181B',
    navItems: ['Work', 'Services', 'About'],
    headline: 'We craft digital experiences that grow brands.',
    tagline: 'Award-winning creative studio based in Berlin.',
    cta: 'View Our Work',
    products: ['Brand Identity', 'Web Design', 'Motion Graphics'],
  },
  {
    name: 'Spice Route',
    industry: 'Restaurant',
    bg: '#FAF5EF', accent: '#C2410C', text: '#1A1A1A',
    navItems: ['Menu', 'Reserve', 'About'],
    headline: 'Authentic flavors, modern dining experience.',
    tagline: 'Farm-to-table cuisine inspired by global spice traditions.',
    cta: 'Reserve a Table',
    products: ['Seasonal Tasting', 'Wine Pairing', 'Private Events'],
  },
  {
    name: 'TechVault',
    industry: 'SaaS Platform',
    bg: '#0A0A0B', accent: '#3B82F6', text: '#F4F4F5',
    navItems: ['Features', 'Pricing', 'Docs'],
    headline: 'Secure your infrastructure. Scale with confidence.',
    tagline: 'Enterprise-grade security for modern dev teams.',
    cta: 'Start Free Trial',
    products: ['Cloud Security', 'API Gateway', 'Team Dashboard'],
  },
  {
    name: 'Verdant Wellness',
    industry: 'Health & Beauty',
    bg: '#F0FDF4', accent: '#16A34A', text: '#14532D',
    navItems: ['Shop', 'Ingredients', 'Blog'],
    headline: 'Nature-powered skincare that actually works.',
    tagline: 'Clean ingredients. Real results. Zero compromise.',
    cta: 'Shop Now',
    products: ['Hydra Serum', 'Glow Cream', 'Detox Mask'],
  },
];

function DemoBrowser({ brand }: { brand: typeof demoBrands[0] }) {
  return (
    <motion.div
      key={brand.name}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl shadow-black/10"
    >
      {/* Browser chrome */}
      <div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2.5 flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-white dark:bg-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-400 flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            {brand.name.toLowerCase().replace(/\s/g, '')}.mayasura.com
          </div>
        </div>
      </div>

      {/* Site preview */}
      <div style={{ backgroundColor: brand.bg, color: brand.text }} className="transition-colors duration-500">
        <div className="px-6 sm:px-8 py-6 sm:py-8">
          {/* Nav */}
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: brand.accent }}>
                {brand.name[0]}
              </div>
              <span className="font-semibold text-sm" style={{ color: brand.text }}>{brand.name}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              {brand.navItems.map(item => (
                <span key={item} className="text-xs opacity-50">{item}</span>
              ))}
              <div className="h-6 w-16 rounded text-[10px] font-medium flex items-center justify-center text-white" style={{ backgroundColor: brand.accent }}>
                {brand.cta.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Hero */}
          <div className="max-w-[85%] mb-6 sm:mb-8">
            <motion.p
              key={brand.name + '-headline'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-lg sm:text-xl font-bold leading-tight mb-2"
            >
              {brand.headline}
            </motion.p>
            <motion.p
              key={brand.name + '-tagline'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-xs sm:text-sm opacity-60 mb-4"
            >
              {brand.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex gap-2"
            >
              <div className="h-7 px-3 rounded text-[10px] font-medium flex items-center text-white" style={{ backgroundColor: brand.accent }}>
                {brand.cta}
              </div>
              <div className="h-7 px-3 rounded text-[10px] font-medium flex items-center border" style={{ borderColor: `${brand.text}20` }}>
                Learn More
              </div>
            </motion.div>
          </div>

          {/* Product cards */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="grid grid-cols-3 gap-2 sm:gap-3"
          >
            {brand.products.map((product) => (
              <div key={product} className="rounded-lg overflow-hidden">
                <div className="aspect-[4/3] rounded-md mb-1.5" style={{ backgroundColor: `${brand.text}08` }} />
                <p className="text-[10px] sm:text-xs font-medium truncate">{product}</p>
                <div className="h-1.5 w-12 rounded mt-1" style={{ backgroundColor: `${brand.text}10` }} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export function LiveDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % demoBrands.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/50 mb-4">
            <Sparkles className="h-3 w-3 text-violet-600 dark:text-violet-400" />
            <span className="text-xs font-medium text-violet-600 dark:text-violet-400">Live Preview</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-[var(--text-primary)]">
            One platform, infinite brands
          </h2>
          <p className="text-[var(--text-secondary)] max-w-lg mx-auto">
            Watch the same platform transform into completely different brand experiences.
            Each one built in under 5 minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Brand selector */}
          <div className="lg:col-span-4 order-2 lg:order-1">
            <div className="space-y-2">
              {demoBrands.map((brand, i) => (
                <button
                  key={brand.name}
                  onClick={() => { setActiveIndex(i); setIsAutoPlaying(false); }}
                  className={`w-full text-left rounded-xl border-2 transition-all duration-300 p-4 ${activeIndex === i
                    ? 'border-violet-500 shadow-lg shadow-violet-500/10 bg-[var(--bg-surface)]'
                    : 'border-[var(--border-primary)] hover:border-zinc-300 dark:hover:border-zinc-700 bg-[var(--bg-surface)]/50'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: brand.accent }}
                    >
                      {brand.name[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[var(--text-primary)]">{brand.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)]">{brand.industry}</p>
                    </div>
                  </div>
                  {/* Progress bar for auto-play */}
                  {activeIndex === i && isAutoPlaying && (
                    <div className="mt-3 h-0.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-violet-500 rounded-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 4, ease: 'linear' }}
                        key={`progress-${i}-${activeIndex}`}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <RotateCcw className={`h-3 w-3 ${isAutoPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                {isAutoPlaying ? 'Auto-playing' : 'Paused'}
              </button>
            </div>

            <div className="mt-4">
              <Link href="/create">
                <Button variant="brand" size="lg" className="w-full">
                  Build Yours Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <DemoBrowser brand={demoBrands[activeIndex]} />
            </AnimatePresence>
            <p className="text-center text-xs text-[var(--text-tertiary)] mt-3">
              ✨ All generated by AI · Each brand created in under 5 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
