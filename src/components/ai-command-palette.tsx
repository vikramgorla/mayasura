'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Wand2, Palette, Type, FileText, Search,
  Loader2, Check, RefreshCw, ArrowRight, Lightbulb,
  PenTool, BarChart3, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AIAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  fields: Array<{ key: string; label: string; placeholder: string; type?: 'textarea' }>;
}

const AI_ACTIONS: AIAction[] = [
  {
    id: 'brand-name',
    label: 'Generate Brand Name',
    description: 'Get creative brand name suggestions',
    icon: Lightbulb,
    color: 'text-amber-500',
    fields: [
      { key: 'industry', label: 'Industry', placeholder: 'e.g., Fashion, Tech, Food...' },
      { key: 'keywords', label: 'Keywords', placeholder: 'e.g., modern, eco, luxury (comma separated)' },
    ],
  },
  {
    id: 'tagline',
    label: 'Generate Tagline',
    description: 'Compelling tagline options for your brand',
    icon: Type,
    color: 'text-blue-500',
    fields: [
      { key: 'brandName', label: 'Brand Name', placeholder: 'Your brand name' },
      { key: 'industry', label: 'Industry', placeholder: 'e.g., Fashion, Tech...' },
    ],
  },
  {
    id: 'color-palette',
    label: 'Generate Color Palette',
    description: 'AI-designed color systems for your brand',
    icon: Palette,
    color: 'text-purple-500',
    fields: [
      { key: 'industry', label: 'Industry', placeholder: 'e.g., Healthcare, Restaurant...' },
      { key: 'mood', label: 'Mood', placeholder: 'e.g., calm, energetic, luxurious' },
      { key: 'style', label: 'Style', placeholder: 'e.g., modern, vintage, minimal' },
    ],
  },
  {
    id: 'hero-copy',
    label: 'Write Hero Copy',
    description: 'Compelling hero heading + subheading',
    icon: PenTool,
    color: 'text-emerald-500',
    fields: [
      { key: 'brandName', label: 'Brand Name', placeholder: 'Your brand name' },
      { key: 'industry', label: 'Industry', placeholder: 'e.g., Tech, Fashion...' },
      { key: 'brandVoice', label: 'Brand Voice', placeholder: 'e.g., Professional, Playful...' },
    ],
  },
  {
    id: 'about-page',
    label: 'Write About Page',
    description: 'Full about page content from description',
    icon: FileText,
    color: 'text-rose-500',
    fields: [
      { key: 'brandName', label: 'Brand Name', placeholder: 'Your brand name' },
      { key: 'industry', label: 'Industry', placeholder: 'e.g., SaaS, Retail...' },
      { key: 'brandVoice', label: 'Brand Voice', placeholder: 'e.g., Warm & Caring...' },
    ],
  },
  {
    id: 'product-description',
    label: 'Write Product Description',
    description: 'Generate compelling product copy',
    icon: Wand2,
    color: 'text-violet-500',
    fields: [
      { key: 'productName', label: 'Product Name', placeholder: 'e.g., Organic Cotton Tee' },
      { key: 'brandName', label: 'Brand Name', placeholder: 'Your brand name' },
      { key: 'brandVoice', label: 'Brand Voice', placeholder: 'Optional...' },
    ],
  },
  {
    id: 'seo-analysis',
    label: 'SEO Analysis',
    description: 'Analyze & improve your page SEO',
    icon: BarChart3,
    color: 'text-cyan-500',
    fields: [
      { key: 'title', label: 'Page Title', placeholder: 'Current page title' },
      { key: 'description', label: 'Meta Description', placeholder: 'Current meta description...' },
      { key: 'content', label: 'Page Content', placeholder: 'Paste page content...', type: 'textarea' },
      { key: 'industry', label: 'Industry', placeholder: 'e.g., Tech, Fashion...' },
    ],
  },
  {
    id: 'competitor-research',
    label: 'Competitor Research',
    description: 'Analyze competitor brand positioning',
    icon: Globe,
    color: 'text-orange-500',
    fields: [
      { key: 'competitorUrl', label: 'Competitor URL', placeholder: 'https://competitor.com' },
      { key: 'industry', label: 'Your Industry', placeholder: 'e.g., E-commerce...' },
    ],
  },
];

interface AICommandPaletteProps {
  brandId: string;
  brand?: {
    name: string;
    industry: string | null;
    brand_voice: string | null;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
  };
  onApply?: (type: string, data: Record<string, unknown>) => void;
}

export function AICommandPalette({ brandId, brand, onApply }: AICommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, unknown> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Pre-fill brand data when action selected
  useEffect(() => {
    if (selectedAction && brand) {
      const prefill: Record<string, string> = {};
      if (selectedAction.fields.some(f => f.key === 'brandName')) {
        prefill.brandName = brand.name;
      }
      if (selectedAction.fields.some(f => f.key === 'industry') && brand.industry) {
        prefill.industry = brand.industry;
      }
      if (selectedAction.fields.some(f => f.key === 'brandVoice') && brand.brand_voice) {
        prefill.brandVoice = brand.brand_voice;
      }
      setFormData(prefill);
    }
  }, [selectedAction, brand]);

  const filteredActions = searchQuery
    ? AI_ACTIONS.filter(a =>
        a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : AI_ACTIONS;

  const executeAction = useCallback(async () => {
    if (!selectedAction) return;
    setLoading(true);
    setResults(null);

    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};

      switch (selectedAction.id) {
        case 'brand-name':
          endpoint = '/api/ai/suggest';
          body = {
            type: 'brand-names',
            industry: formData.industry,
            keywords: formData.keywords?.split(',').map(k => k.trim()).filter(Boolean) || [],
          };
          break;
        case 'tagline':
          endpoint = '/api/ai/suggest';
          body = { type: 'taglines', brandName: formData.brandName, industry: formData.industry };
          break;
        case 'color-palette':
          endpoint = '/api/ai/colors';
          body = { industry: formData.industry, mood: formData.mood, style: formData.style };
          break;
        case 'hero-copy':
          endpoint = '/api/ai/copy';
          body = { brandName: formData.brandName, industry: formData.industry, brandVoice: formData.brandVoice, type: 'hero' };
          break;
        case 'about-page':
          endpoint = '/api/ai/copy';
          body = { brandName: formData.brandName, industry: formData.industry, brandVoice: formData.brandVoice, type: 'about' };
          break;
        case 'product-description':
          endpoint = '/api/ai/suggest';
          body = { type: 'product-description', productName: formData.productName, brandName: formData.brandName, brandVoice: formData.brandVoice };
          break;
        case 'seo-analysis':
          endpoint = '/api/ai/seo';
          body = { title: formData.title, description: formData.description, content: formData.content, industry: formData.industry };
          break;
        case 'competitor-research':
          // Placeholder — returns mock analysis
          setResults({
            type: 'competitor',
            analysis: {
              url: formData.competitorUrl,
              strengths: ['Strong visual branding', 'Clear value proposition', 'Active social presence'],
              weaknesses: ['Limited SEO optimization', 'No blog content', 'Slow page load'],
              opportunities: ['Content marketing', 'Social media engagement', 'Email automation'],
              positioning: 'Premium positioning with focus on quality and craftsmanship',
            },
          });
          setLoading(false);
          return;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setResults({ type: selectedAction.id, ...data });
    } catch (err) {
      setResults({ error: 'Failed to generate. Please try again.' });
    }
    setLoading(false);
  }, [selectedAction, formData]);

  const handleApply = (type: string, value: unknown) => {
    onApply?.(type, value as Record<string, unknown>);
    setOpen(false);
    setSelectedAction(null);
    setResults(null);
    setFormData({});
  };

  const resetState = () => {
    setSelectedAction(null);
    setResults(null);
    setFormData({});
    setSearchQuery('');
  };

  return (
    <>
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-violet-500/40 transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      {/* Palette Modal */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => { setOpen(false); resetState(); }}
            />
            <div className="flex items-start justify-center pt-[10vh] px-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden max-h-[80vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm text-zinc-900 dark:text-white">
                        {selectedAction ? selectedAction.label : 'AI Assistant'}
                      </h2>
                      <p className="text-xs text-zinc-400">
                        {selectedAction ? selectedAction.description : 'Choose an action to get started'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedAction && (
                      <button onClick={resetState} className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                        ← Back
                      </button>
                    )}
                    <button onClick={() => { setOpen(false); resetState(); }} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <X className="h-4 w-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                  {!selectedAction ? (
                    /* Action Grid */
                    <div>
                      <div className="mb-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                            placeholder="Search AI actions..."
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {filteredActions.map((action) => (
                          <motion.button
                            key={action.id}
                            onClick={() => setSelectedAction(action)}
                            className="flex items-start gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors text-left group"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <div className={`h-9 w-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 transition-colors`}>
                              <action.icon className={`h-4 w-4 ${action.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-900 dark:text-white">{action.label}</p>
                              <p className="text-xs text-zinc-400 mt-0.5">{action.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : results ? (
                    /* Results */
                    <ResultsView
                      results={results}
                      actionId={selectedAction.id}
                      onApply={handleApply}
                      onRegenerate={executeAction}
                      loading={loading}
                    />
                  ) : (
                    /* Input Form */
                    <div className="space-y-4">
                      {selectedAction.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium mb-1.5 text-zinc-600 dark:text-zinc-300">
                            {field.label}
                          </label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={formData[field.key] || ''}
                              onChange={e => setFormData(d => ({ ...d, [field.key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none resize-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                              placeholder={field.placeholder}
                              rows={4}
                            />
                          ) : (
                            <input
                              type="text"
                              value={formData[field.key] || ''}
                              onChange={e => setFormData(d => ({ ...d, [field.key]: e.target.value }))}
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                              placeholder={field.placeholder}
                            />
                          )}
                        </div>
                      ))}
                      <Button
                        onClick={executeAction}
                        disabled={loading || !selectedAction.fields.every(f => formData[f.key]?.trim())}
                        className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ──── Results View ────────────────────────────────────────────── */

function ResultsView({
  results,
  actionId,
  onApply,
  onRegenerate,
  loading,
}: {
  results: Record<string, unknown>;
  actionId: string;
  onApply: (type: string, value: unknown) => void;
  onRegenerate: () => void;
  loading: boolean;
}) {
  if (results.error) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-red-500 mb-4">{results.error as string}</p>
        <Button variant="outline" onClick={onRegenerate} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Brand Names */}
      {actionId === 'brand-name' && (
        <div className="space-y-2">
          {((results.suggestions as string[]) || []).map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700"
            >
              <span className="text-sm font-medium text-zinc-900 dark:text-white">{name}</span>
              <Button size="sm" variant="ghost" onClick={() => onApply('brand-name', { name })}>
                <Check className="h-3.5 w-3.5 mr-1" /> Apply
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Taglines */}
      {actionId === 'tagline' && (
        <div className="space-y-2">
          {((results.suggestions as string[]) || []).map((tagline, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-violet-300 dark:hover:border-violet-700"
            >
              <span className="text-sm text-zinc-700 dark:text-zinc-300 italic">&ldquo;{tagline}&rdquo;</span>
              <Button size="sm" variant="ghost" onClick={() => onApply('tagline', { tagline })}>
                <Check className="h-3.5 w-3.5 mr-1" /> Apply
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Color Palettes */}
      {/* @ts-expect-error — results values are safely cast below */}
      {actionId === 'color-palette' ? (
        <div className="space-y-4">
          {((results.palettes as Array<{ name: string; colors: Record<string, string>; reasoning: string }>) || []).map((palette, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">{palette.name}</h4>
                    <Button size="sm" variant="ghost" onClick={() => onApply('colors', palette.colors)}>
                      <Check className="h-3.5 w-3.5 mr-1" /> Apply
                    </Button>
                  </div>
                  <div className="flex gap-2 mb-3">
                    {Object.entries(palette.colors).map(([key, color]) => (
                      <div key={key} className="text-center">
                        <div
                          className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700"
                          style={{ backgroundColor: color }}
                        />
                        <p className="text-[10px] text-zinc-400 mt-1">{key}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-400">{palette.reasoning}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : null}

      {/* Hero Copy / About Page / Product Description */}
      {(actionId === 'hero-copy' || actionId === 'about-page' || actionId === 'product-description') && (
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {(results.text || results.description) as string}
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => onApply(actionId, { text: results.text || results.description })}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Apply
                </Button>
              </div>
            </CardContent>
          </Card>
          {(results.alternatives as string[])?.map((alt, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{alt}</p>
                <Button size="sm" variant="ghost" className="mt-2" onClick={() => onApply(actionId, { text: alt })}>
                  <Check className="h-3.5 w-3.5 mr-1" /> Use This
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SEO Analysis */}
      {actionId === 'seo-analysis' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-3xl font-bold text-zinc-900 dark:text-white">{results.score as number}</div>
            <div className="text-xs text-zinc-400">/ 100 SEO Score</div>
          </div>
          <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                backgroundColor: (results.score as number) >= 80 ? '#10b981' : (results.score as number) >= 50 ? '#f59e0b' : '#ef4444',
              }}
              initial={{ width: 0 }}
              animate={{ width: `${results.score}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {((results.suggestions as Array<{ type: string; current: string; suggested: string; priority: string }>) || []).map((suggestion, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                  suggestion.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  suggestion.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {suggestion.priority}
                </span>
                <span className="text-xs text-zinc-400 capitalize">{suggestion.type}</span>
              </div>
              <div className="flex items-start gap-2 mt-2">
                <span className="text-xs text-zinc-400 line-through flex-1">{suggestion.current}</span>
                <ArrowRight className="h-3 w-3 text-zinc-300 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-emerald-600 dark:text-emerald-400 flex-1 font-medium">{suggestion.suggested}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Competitor Research */}
      {actionId === 'competitor-research' && results.analysis && (
        <div className="space-y-4">
          {(() => {
            const analysis = results.analysis as {
              url: string;
              strengths: string[];
              weaknesses: string[];
              opportunities: string[];
              positioning: string;
            };
            return (
              <>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <p className="text-xs text-zinc-400 mb-1">Analyzed</p>
                  <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{analysis.url}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800">
                  <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">Positioning</p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">{analysis.positioning}</p>
                </div>
                {[
                  { key: 'strengths', label: 'Strengths', color: 'text-emerald-600' },
                  { key: 'weaknesses', label: 'Weaknesses', color: 'text-red-500' },
                  { key: 'opportunities', label: 'Opportunities', color: 'text-blue-600' },
                ].map(({ key, label, color }) => (
                  <div key={key}>
                    <p className={`text-xs font-semibold ${color} mb-1`}>{label}</p>
                    <ul className="space-y-1">
                      {(analysis[key as keyof typeof analysis] as string[]).map((item, i) => (
                        <li key={i} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
                          <span className="text-zinc-300 mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}

      {/* Regenerate button */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Button variant="outline" onClick={onRegenerate} disabled={loading} className="w-full">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Regenerate
        </Button>
      </div>
    </div>
  );
}
