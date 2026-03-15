'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Sparkles, Package, Palette, MessageSquare,
  Search, Star, Eye, X, Check, Globe, ShoppingBag,
  FileText, Bot, Zap, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserNav } from '@/components/user-nav';
import { STARTER_TEMPLATES, StarterTemplate } from '@/lib/templates';

/* ─── Category definitions ──────────────────────────────────── */
const CATEGORIES = [
  { id: 'all', label: 'All Templates', emoji: '✨' },
  { id: 'restaurant', label: 'Restaurant', emoji: '🍕' },
  { id: 'fashion', label: 'Fashion', emoji: '👗' },
  { id: 'tech', label: 'SaaS / Tech', emoji: '💻' },
  { id: 'fitness', label: 'Fitness', emoji: '🏋️' },
  { id: 'education', label: 'Education', emoji: '📚' },
  { id: 'realestate', label: 'Real Estate', emoji: '🏠' },
  { id: 'beauty', label: 'Beauty', emoji: '✂️' },
  { id: 'music', label: 'Music', emoji: '🎵' },
  { id: 'retail', label: 'E-Commerce', emoji: '🛒' },
  { id: 'healthcare', label: 'Healthcare', emoji: '🏥' },
] as const;

/* ─── Feature icons for detail modal ────────────────────────── */
const FEATURE_MAP: Record<string, { icon: React.ElementType; label: string }> = {
  website: { icon: Globe, label: 'Website' },
  chatbot: { icon: Bot, label: 'AI Chatbot' },
  ecommerce: { icon: ShoppingBag, label: 'E-Commerce' },
  email: { icon: FileText, label: 'Email Marketing' },
  social: { icon: Sparkles, label: 'Social Media' },
  push: { icon: Zap, label: 'Push Notifications' },
  crm: { icon: Package, label: 'CRM Dashboard' },
};

/* ─── Popularity data (simulated) ───────────────────────────── */
const POPULARITY: Record<string, { rating: number; popular: boolean }> = {
  restaurant: { rating: 4.8, popular: true },
  fashion: { rating: 4.9, popular: true },
  tech: { rating: 4.7, popular: true },
  fitness: { rating: 4.6, popular: false },
  education: { rating: 4.5, popular: false },
  realestate: { rating: 4.7, popular: true },
  beauty: { rating: 4.4, popular: false },
  music: { rating: 4.3, popular: false },
  retail: { rating: 4.8, popular: true },
  healthcare: { rating: 4.5, popular: false },
};

/* ─── Star Rating Component ─────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : star - 0.5 <= rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-zinc-300 dark:text-zinc-600'
          }`}
        />
      ))}
      <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1">{rating}</span>
    </div>
  );
}

/* ─── Mini Preview Mockup ───────────────────────────────────── */
function TemplateMockup({ template }: { template: StarterTemplate }) {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden" style={{ backgroundColor: template.secondaryColor }}>
      {/* Browser chrome bar */}
      <div className="h-5 flex items-center gap-1 px-2" style={{ backgroundColor: template.primaryColor }}>
        <div className="flex gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        </div>
        <div className="flex-1 mx-2">
          <div className="h-2 rounded-full bg-white/15 max-w-[60%] mx-auto" />
        </div>
      </div>
      {/* Nav bar mockup */}
      <div className="h-6 flex items-center justify-between px-3" style={{ backgroundColor: template.primaryColor + '15' }}>
        <div className="h-2 w-10 rounded-full" style={{ backgroundColor: template.accentColor }} />
        <div className="flex gap-2">
          <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: template.primaryColor + '30' }} />
          <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: template.primaryColor + '30' }} />
          <div className="h-1.5 w-6 rounded-full" style={{ backgroundColor: template.primaryColor + '30' }} />
        </div>
      </div>
      {/* Hero section mockup */}
      <div className="px-3 py-3">
        <div className="h-2.5 w-[75%] rounded-full mb-1.5" style={{ backgroundColor: template.primaryColor }} />
        <div className="h-2 w-[55%] rounded-full mb-2" style={{ backgroundColor: template.primaryColor + '60' }} />
        <div className="h-1.5 w-[85%] rounded-full mb-1" style={{ backgroundColor: template.primaryColor + '20' }} />
        <div className="h-1.5 w-[70%] rounded-full mb-3" style={{ backgroundColor: template.primaryColor + '20' }} />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-md" style={{ backgroundColor: template.accentColor }} />
          <div className="h-5 w-14 rounded-md border" style={{ borderColor: template.primaryColor + '30' }} />
        </div>
      </div>
      {/* Cards mockup */}
      <div className="px-3 pb-2">
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex-1 rounded-md p-1.5" style={{ backgroundColor: template.primaryColor + '08' }}>
              <div className="h-6 rounded-sm mb-1" style={{ backgroundColor: template.accentColor + '20' }} />
              <div className="h-1.5 w-full rounded-full mb-0.5" style={{ backgroundColor: template.primaryColor + '15' }} />
              <div className="h-1.5 w-[60%] rounded-full" style={{ backgroundColor: template.primaryColor + '15' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Full Preview Mockup (for detail modal) ────────────────── */
function TemplateFullPreview({ template }: { template: StarterTemplate }) {
  return (
    <div className="w-full rounded-xl overflow-hidden shadow-inner border border-zinc-200 dark:border-zinc-700" style={{ backgroundColor: template.secondaryColor }}>
      {/* Browser chrome */}
      <div className="h-7 flex items-center gap-1.5 px-3" style={{ backgroundColor: template.primaryColor }}>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        </div>
        <div className="flex-1 mx-4">
          <div className="h-3.5 rounded-md bg-white/10 max-w-[50%] mx-auto flex items-center justify-center">
            <span className="text-[8px] text-white/50">{template.name.toLowerCase().replace(/\s+/g, '')}.com</span>
          </div>
        </div>
      </div>
      {/* Nav */}
      <div className="h-10 flex items-center justify-between px-5 border-b" style={{ borderColor: template.primaryColor + '15', backgroundColor: template.secondaryColor }}>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded" style={{ backgroundColor: template.accentColor }} />
          <div className="h-2.5 w-16 rounded-full" style={{ backgroundColor: template.primaryColor + '80' }} />
        </div>
        <div className="flex gap-4">
          {['Home', 'Shop', 'About', 'Blog'].map(l => (
            <div key={l} className="h-2 w-8 rounded-full" style={{ backgroundColor: template.primaryColor + '30' }} />
          ))}
        </div>
        <div className="h-6 w-16 rounded-md" style={{ backgroundColor: template.accentColor }} />
      </div>
      {/* Hero */}
      <div className="px-8 py-8 text-center">
        <div className="h-4 w-[60%] rounded-full mx-auto mb-2.5" style={{ backgroundColor: template.primaryColor }} />
        <div className="h-3 w-[40%] rounded-full mx-auto mb-4" style={{ backgroundColor: template.primaryColor + '50' }} />
        <div className="h-2 w-[80%] rounded-full mx-auto mb-1.5" style={{ backgroundColor: template.primaryColor + '15' }} />
        <div className="h-2 w-[65%] rounded-full mx-auto mb-5" style={{ backgroundColor: template.primaryColor + '15' }} />
        <div className="flex gap-3 justify-center">
          <div className="h-8 w-28 rounded-lg" style={{ backgroundColor: template.accentColor }} />
          <div className="h-8 w-24 rounded-lg border-2" style={{ borderColor: template.primaryColor + '30' }} />
        </div>
      </div>
      {/* Product cards */}
      <div className="px-6 pb-6">
        <div className="h-3 w-32 rounded-full mx-auto mb-4" style={{ backgroundColor: template.primaryColor + '60' }} />
        <div className="grid grid-cols-3 gap-3">
          {template.products.slice(0, 3).map((p, i) => (
            <div key={i} className="rounded-lg overflow-hidden" style={{ backgroundColor: template.primaryColor + '06' }}>
              <div className="h-16 w-full" style={{ backgroundColor: template.accentColor + '15' }} />
              <div className="p-2.5">
                <div className="h-2 w-full rounded-full mb-1" style={{ backgroundColor: template.primaryColor + '20' }} />
                <div className="h-1.5 w-[60%] rounded-full mb-2" style={{ backgroundColor: template.primaryColor + '10' }} />
                <div className="flex justify-between items-center">
                  <div className="h-2 w-8 rounded-full" style={{ backgroundColor: template.accentColor + '60' }} />
                  <div className="h-4 w-10 rounded" style={{ backgroundColor: template.accentColor }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTemplate, setDetailTemplate] = useState<StarterTemplate | null>(null);

  // Filtered templates
  const filtered = useMemo(() => {
    let results = STARTER_TEMPLATES;
    if (selectedCategory !== 'all') {
      results = results.filter(t => t.id === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.industry.toLowerCase().includes(q) ||
        t.toneKeywords.some(kw => kw.toLowerCase().includes(q))
      );
    }
    return results;
  }, [selectedCategory, searchQuery]);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSearchQuery('');
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Nav */}
      <nav className="bg-white/80 dark:bg-[#09090B]/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-violet-700 flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <span className="font-display font-semibold text-base tracking-tight">Mayasura</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/create">
              <Button variant="brand" size="sm">
                Start from Scratch
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Hero section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-950/50 border border-violet-200/50 dark:border-violet-800/50 px-4 py-1.5 text-sm text-violet-600 dark:text-violet-400 mb-5">
            <Sparkles className="h-3.5 w-3.5" />
            {STARTER_TEMPLATES.length} Premium Templates
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
            Choose Your <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Digital Palace</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Pre-built brand ecosystems for every industry. Pick a template, customize with AI, and launch in minutes.
          </p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          className="mb-8 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search templates by name, industry, or keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-zinc-400" />
              </button>
            )}
          </div>

          {/* Category filter tabs */}
          <div className="flex items-center justify-center">
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="text-xs">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {filtered.length === STARTER_TEMPLATES.length
              ? `Showing all ${filtered.length} templates`
              : `${filtered.length} template${filtered.length !== 1 ? 's' : ''} found`}
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={clearFilters}
              className="text-sm text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
            >
              <Filter className="h-3.5 w-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Template grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20"
            >
              <Search className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-2">No templates found</h3>
              <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-4">Try a different search term or category</p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${selectedCategory}-${searchQuery}`}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.06 } },
              }}
            >
              {filtered.map(template => (
                <motion.div
                  key={template.id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
                  }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                >
                  <TemplateCard
                    template={template}
                    onPreview={() => setDetailTemplate(template)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Template Detail Modal */}
      <AnimatePresence>
        {detailTemplate && (
          <TemplateDetailModal
            template={detailTemplate}
            onClose={() => setDetailTemplate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE CARD
   ═══════════════════════════════════════════════════════════════ */
function TemplateCard({
  template,
  onPreview,
}: {
  template: StarterTemplate;
  onPreview: () => void;
}) {
  const pop = POPULARITY[template.id] || { rating: 4.5, popular: false };

  return (
    <motion.div
      className="group relative bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden transition-shadow duration-300 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Popular badge */}
      {pop.popular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-amber-400/90 text-amber-900 border-0 text-[10px] font-semibold shadow-sm">
            <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
            Popular
          </Badge>
        </div>
      )}

      {/* Mini preview mockup */}
      <div className="relative h-44 p-3 overflow-hidden" style={{ backgroundColor: template.primaryColor + '08' }}>
        <div className="w-full h-full">
          <TemplateMockup template={template} />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <motion.button
              onClick={e => { e.stopPropagation(); onPreview(); }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/95 text-zinc-900 text-sm font-medium shadow-lg hover:bg-white transition-colors cursor-pointer"
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </motion.button>
            <Link href={`/create?template=${template.id}`}>
              <motion.span
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium shadow-lg hover:bg-violet-700 transition-colors cursor-pointer"
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Use Template
              </motion.span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
              style={{ backgroundColor: template.accentColor + '20' }}
            >
              {template.emoji}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-white">{template.name}</h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">{template.category}</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {template.toneKeywords.slice(0, 2).map(kw => (
            <span key={kw} className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
              {kw}
            </span>
          ))}
          {template.channels.slice(0, 2).map(ch => (
            <span key={ch} className="inline-flex items-center px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950/40 text-[10px] font-medium text-violet-600 dark:text-violet-400 capitalize">
              {ch}
            </span>
          ))}
        </div>

        {/* Footer: colors + rating */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-700/50">
          <div className="flex items-center gap-1.5">
            <div className="flex gap-1">
              <div className="h-4 w-4 rounded-full border border-white dark:border-zinc-700 shadow-sm" style={{ backgroundColor: template.primaryColor }} />
              <div className="h-4 w-4 rounded-full border border-white dark:border-zinc-700 shadow-sm -ml-1" style={{ backgroundColor: template.secondaryColor }} />
              <div className="h-4 w-4 rounded-full border border-white dark:border-zinc-700 shadow-sm -ml-1" style={{ backgroundColor: template.accentColor }} />
            </div>
            <span className="text-[10px] text-zinc-400 ml-1">{template.fontHeading}</span>
          </div>
          <StarRating rating={pop.rating} />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TEMPLATE DETAIL MODAL
   ═══════════════════════════════════════════════════════════════ */
function TemplateDetailModal({
  template,
  onClose,
}: {
  template: StarterTemplate;
  onClose: () => void;
}) {
  const pop = POPULARITY[template.id] || { rating: 4.5, popular: false };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-4 sm:inset-8 md:inset-x-[10%] md:inset-y-8 z-50 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-lg"
              style={{ backgroundColor: template.accentColor + '20' }}
            >
              {template.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-white">{template.name}</h2>
                {pop.popular && (
                  <Badge className="bg-amber-400/90 text-amber-900 border-0 text-[10px]">
                    <Star className="h-2.5 w-2.5 fill-current mr-0.5" />
                    Popular
                  </Badge>
                )}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{template.tagline}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
          </button>
        </div>

        {/* Modal body — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
            {/* Left: Full preview */}
            <div className="lg:col-span-3">
              <TemplateFullPreview template={template} />
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">About this template</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{template.brandDescription}</p>
              </div>

              {/* Rating */}
              <div>
                <StarRating rating={pop.rating} />
              </div>

              {/* Features included */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2.5">Features included</h3>
                <div className="space-y-2">
                  {template.channels.map(ch => {
                    const feat = FEATURE_MAP[ch];
                    if (!feat) return null;
                    const Icon = feat.icon;
                    return (
                      <div key={ch} className="flex items-center gap-2.5 text-sm">
                        <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-zinc-700 dark:text-zinc-300">{feat.label}</span>
                        <Check className="h-3.5 w-3.5 text-emerald-500 ml-auto" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Color scheme */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2.5">
                  <Palette className="h-3.5 w-3.5 inline mr-1.5" />
                  Color scheme
                </h3>
                <div className="flex gap-3">
                  {[
                    { label: 'Primary', color: template.primaryColor },
                    { label: 'Secondary', color: template.secondaryColor },
                    { label: 'Accent', color: template.accentColor },
                  ].map(c => (
                    <div key={c.label} className="text-center">
                      <div className="h-10 w-10 rounded-xl border-2 border-white dark:border-zinc-700 shadow-sm mx-auto mb-1" style={{ backgroundColor: c.color }} />
                      <span className="text-[10px] text-zinc-400">{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Font pairing */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2.5">Font pairing</h3>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Headings</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-white">{template.fontHeading}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Body</span>
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{template.fontBody}</span>
                  </div>
                </div>
              </div>

              {/* Products preview */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2.5">
                  <Package className="h-3.5 w-3.5 inline mr-1.5" />
                  Sample products ({template.products.length})
                </h3>
                <div className="space-y-2">
                  {template.products.map((p, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-zinc-50 dark:bg-zinc-800/50 rounded-lg px-3 py-2">
                      <span className="text-zinc-700 dark:text-zinc-300 truncate flex-1 mr-2">{p.name}</span>
                      <span className="text-zinc-400 font-medium flex-shrink-0">${p.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chatbot persona */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2.5">
                  <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
                  Chatbot persona
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  &ldquo;{template.chatbotPersona}&rdquo;
                </p>
              </div>

              {/* Tone keywords */}
              <div className="flex flex-wrap gap-1.5">
                {template.toneKeywords.map(kw => (
                  <Badge key={kw} variant="secondary">{kw}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex-shrink-0">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Link href={`/create?template=${template.id}`}>
            <Button variant="brand" size="lg">
              <Sparkles className="h-4 w-4" />
              Customize & Create
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}
