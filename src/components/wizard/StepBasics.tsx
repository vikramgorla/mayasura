'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/loading';
import { BrandData } from '@/lib/types';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
}

/* ─── Industry options with icons ─────────────────────────────── */
const INDUSTRY_OPTIONS = [
  { value: 'Restaurant & Food', icon: '🍽️', keywords: ['restaurant', 'food', 'dining', 'cafe', 'cuisine'] },
  { value: 'Fashion & Apparel', icon: '👗', keywords: ['fashion', 'apparel', 'clothing', 'wear', 'style'] },
  { value: 'Technology & SaaS', icon: '💻', keywords: ['tech', 'saas', 'software', 'app', 'digital'] },
  { value: 'Health & Wellness', icon: '🏥', keywords: ['health', 'wellness', 'fitness', 'medical', 'care'] },
  { value: 'Beauty & Cosmetics', icon: '💄', keywords: ['beauty', 'cosmetics', 'skincare', 'makeup', 'salon'] },
  { value: 'Home & Furniture', icon: '🏠', keywords: ['home', 'furniture', 'decor', 'interior', 'living'] },
  { value: 'Sports & Outdoors', icon: '⚽', keywords: ['sports', 'outdoor', 'fitness', 'gym', 'athletic'] },
  { value: 'Education & E-Learning', icon: '📚', keywords: ['education', 'learning', 'course', 'training', 'school'] },
  { value: 'Travel & Hospitality', icon: '✈️', keywords: ['travel', 'hotel', 'hospitality', 'tourism', 'booking'] },
  { value: 'Finance & Banking', icon: '💰', keywords: ['finance', 'banking', 'investment', 'insurance', 'fintech'] },
  { value: 'Real Estate', icon: '🏢', keywords: ['real estate', 'property', 'realty', 'housing', 'land'] },
  { value: 'Entertainment & Media', icon: '🎬', keywords: ['entertainment', 'media', 'music', 'film', 'streaming'] },
  { value: 'E-commerce & Retail', icon: '🛍️', keywords: ['ecommerce', 'retail', 'shop', 'store', 'marketplace'] },
  { value: 'Coffee & Beverages', icon: '☕', keywords: ['coffee', 'beverage', 'drinks', 'tea', 'juice'] },
  { value: 'Pet Care', icon: '🐾', keywords: ['pet', 'animal', 'dog', 'cat', 'veterinary'] },
  { value: 'Art & Creative', icon: '🎨', keywords: ['art', 'creative', 'design', 'photography', 'craft'] },
  { value: 'Consulting & Services', icon: '🤝', keywords: ['consulting', 'services', 'agency', 'advisory', 'professional'] },
  { value: 'Non-Profit & Social', icon: '🌍', keywords: ['nonprofit', 'charity', 'social', 'community', 'foundation'] },
  { value: 'Automotive', icon: '🚗', keywords: ['auto', 'car', 'vehicle', 'automotive', 'motor'] },
  { value: 'Agriculture & Farming', icon: '🌾', keywords: ['agriculture', 'farming', 'organic', 'garden', 'crop'] },
];

function filterIndustries(query: string) {
  if (!query.trim()) return INDUSTRY_OPTIONS.slice(0, 10);
  const q = query.toLowerCase();
  return INDUSTRY_OPTIONS.filter(
    (opt) =>
      opt.value.toLowerCase().includes(q) ||
      opt.keywords.some((k) => k.includes(q))
  ).slice(0, 8);
}

/* ─── Validation ────────────────────────────────────────────── */
interface FieldErrors {
  name?: string;
  industry?: string;
  tagline?: string;
  description?: string;
}

function validateStep(data: BrandData): FieldErrors {
  const errors: FieldErrors = {};
  if (!data.name.trim()) {
    errors.name = 'Brand name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Must be at least 2 characters';
  } else if (data.name.trim().length > 60) {
    errors.name = 'Must be under 60 characters';
  }
  if (!data.industry.trim()) {
    errors.industry = 'Industry is required';
  } else if (data.industry.trim().length > 80) {
    errors.industry = 'Must be under 80 characters';
  }
  if (data.tagline && data.tagline.length > 120) {
    errors.tagline = 'Must be under 120 characters';
  }
  if (data.description && data.description.length > 1000) {
    errors.description = 'Must be under 1000 characters';
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500 dark:text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}

function CharCount({ value, max, warn = 0.8 }: { value: string; max: number; warn?: number }) {
  const pct = value.length / max;
  if (value.length === 0 || pct < 0.6) return null;
  return (
    <span className={`text-xs ${pct >= 1 ? 'text-red-500' : pct >= warn ? 'text-amber-500' : 'text-zinc-400'}`}>
      {value.length}/{max}
    </span>
  );
}

/* ─── Field entrance animation — inline per-element with delay ── */
function getFieldAnim(i: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08, duration: 0.35, ease: 'easeOut' as const },
  };
}

export default function StepBasics({ data, updateData, onNext }: Props) {
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingTaglines, setLoadingTaglines] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [suggestedTaglines, setSuggestedTaglines] = useState<string[]>([]);
  const [nameRateLimit, setNameRateLimit] = useState(false);
  const [taglineRateLimit, setTaglineRateLimit] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  // Autocomplete state
  const [industryQuery, setIndustryQuery] = useState(data.industry || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const industryInputRef = useRef<HTMLInputElement>(null);

  const filteredIndustries = filterIndustries(industryQuery);

  // Sync query with data.industry on mount
  useEffect(() => {
    setIndustryQuery(data.industry || '');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectIndustry = (value: string) => {
    setIndustryQuery(value);
    updateData({ industry: value });
    setShowDropdown(false);
    setHighlightedIdx(-1);
    if (touched.industry) {
      const updated = { ...data, industry: value };
      const fieldErrors = validateStep(updated);
      setErrors((prev) => ({ ...prev, industry: fieldErrors.industry }));
    }
  };

  const handleIndustryKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setShowDropdown(true);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIdx((i) => Math.min(i + 1, filteredIndustries.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIdx >= 0 && filteredIndustries[highlightedIdx]) {
        selectIndustry(filteredIndustries[highlightedIdx].value);
      } else if (industryQuery.trim()) {
        updateData({ industry: industryQuery.trim() });
        setShowDropdown(false);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    } else if (e.key === 'Tab') {
      setShowDropdown(false);
    }
  };

  const handleBlur = (field: string) => {
    if (field === 'industry') {
      // Allow selection before blur fires
      setTimeout(() => {
        setTouched((t) => ({ ...t, [field]: true }));
        const fieldErrors = validateStep({ ...data, industry: industryQuery });
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FieldErrors] }));
      }, 200);
    } else {
      setTouched((t) => ({ ...t, [field]: true }));
      const fieldErrors = validateStep(data);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FieldErrors] }));
    }
  };

  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value } as Partial<BrandData>);
    if (touched[field]) {
      const updated = { ...data, [field]: value };
      const fieldErrors = validateStep(updated);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FieldErrors] }));
    }
  };

  const suggestNames = async () => {
    if (!data.industry || loadingNames || nameRateLimit) return;
    setLoadingNames(true);
    setSuggestedNames([]);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'brand-names',
          industry: data.industry,
          keywords: data.description ? data.description.split(' ').slice(0, 5) : [],
        }),
      });
      if (res.status === 429) {
        setNameRateLimit(true);
        setTimeout(() => setNameRateLimit(false), 30000);
        return;
      }
      const result = await res.json();
      setSuggestedNames(result.suggestions || []);
    } catch { /* handled by toast */ }
    setLoadingNames(false);
  };

  const suggestTaglines = async () => {
    if (!data.name || !data.industry || loadingTaglines || taglineRateLimit) return;
    setLoadingTaglines(true);
    setSuggestedTaglines([]);
    try {
      const res = await fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'taglines', brandName: data.name, industry: data.industry }),
      });
      if (res.status === 429) {
        setTaglineRateLimit(true);
        setTimeout(() => setTaglineRateLimit(false), 30000);
        return;
      }
      const result = await res.json();
      setSuggestedTaglines(result.suggestions || []);
    } catch { /* handled by toast */ }
    setLoadingTaglines(false);
  };

  const handleNext = () => {
    const allTouched = { name: true, industry: true, tagline: true, description: true };
    setTouched(allTouched);
    const fieldErrors = validateStep({ ...data, industry: industryQuery });
    setErrors(fieldErrors);
    if (fieldErrors.name || fieldErrors.industry) return;
    onNext();
  };

  const canProceed = data.name.trim().length >= 2 && (data.industry || industryQuery).trim().length > 0;

  return (
    <div>
      <motion.div
        {...getFieldAnim(0)}
        className="mb-8"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Brand Basics</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Let&apos;s start with the foundation. What&apos;s your brand about?</p>
      </motion.div>

      <div className="space-y-6">
        {/* ── Industry with autocomplete ───────────────────────── */}
        <motion.div {...getFieldAnim(1)}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="industry-input">
              Industry / Category <span className="text-red-400">*</span>
            </label>
            <CharCount value={industryQuery} max={80} />
          </div>

          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <Input
                id="industry-input"
                ref={industryInputRef}
                value={industryQuery}
                autoComplete="off"
                onChange={(e) => {
                  const val = e.target.value;
                  setIndustryQuery(val);
                  updateData({ industry: val });
                  setShowDropdown(true);
                  setHighlightedIdx(-1);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => handleBlur('industry')}
                onKeyDown={handleIndustryKeyDown}
                placeholder="e.g., Restaurant, Fashion, SaaS..."
                className={`pr-9 ${touched.industry && errors.industry ? 'border-red-400 focus:border-red-400' : ''}`}
                maxLength={80}
                role="combobox"
                aria-expanded={showDropdown}
                aria-autocomplete="list"
                aria-controls="industry-listbox"
                aria-activedescendant={highlightedIdx >= 0 ? `industry-opt-${highlightedIdx}` : undefined}
              />
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
              />
            </div>

            <AnimatePresence>
              {showDropdown && filteredIndustries.length > 0 && (
                <motion.div
                  id="industry-listbox"
                  role="listbox"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-50 mt-1 w-full bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl overflow-hidden"
                >
                  <div className="max-h-56 overflow-y-auto py-1">
                    {filteredIndustries.map((opt, idx) => (
                      <motion.button
                        key={opt.value}
                        id={`industry-opt-${idx}`}
                        role="option"
                        aria-selected={data.industry === opt.value}
                        type="button"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        onMouseDown={(e) => { e.preventDefault(); selectIndustry(opt.value); }}
                        onMouseEnter={() => setHighlightedIdx(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                          idx === highlightedIdx || data.industry === opt.value
                            ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                        }`}
                      >
                        <span className="text-base leading-none">{opt.icon}</span>
                        <span>{opt.value}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <FieldError message={touched.industry ? errors.industry : undefined} />
        </motion.div>

        {/* ── Brand Name ───────────────────────────────────────── */}
        <motion.div {...getFieldAnim(2)}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="brand-name-input">
              Brand Name <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-3">
              <CharCount value={data.name} max={60} />
              <Button
                variant="ghost"
                size="sm"
                onClick={suggestNames}
                disabled={!data.industry || loadingNames || nameRateLimit}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                title={nameRateLimit ? 'Rate limit reached. Please wait 30s.' : 'AI suggest brand names'}
                aria-label="AI suggest brand names"
              >
                {loadingNames
                  ? <><Spinner className="h-3.5 w-3.5" /> Generating...</>
                  : nameRateLimit
                  ? '⏳ Rate limited'
                  : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>}
              </Button>
            </div>
          </div>
          <Input
            id="brand-name-input"
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Your brand name"
            className={touched.name && errors.name ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={60}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <FieldError message={touched.name ? errors.name : undefined} />
          <AnimatePresence>
            {suggestedNames.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {suggestedNames.map((name, i) => (
                  <motion.button
                    key={name}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { updateData({ name }); setSuggestedNames([]); }}
                    className="px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-violet-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-violet-200/50 dark:border-violet-800/50"
                  >
                    {name}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Tagline ──────────────────────────────────────────── */}
        <motion.div {...getFieldAnim(3)}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="tagline-input">
              Tagline
            </label>
            <div className="flex items-center gap-3">
              <CharCount value={data.tagline} max={120} />
              <Button
                variant="ghost"
                size="sm"
                onClick={suggestTaglines}
                disabled={!data.name || !data.industry || loadingTaglines || taglineRateLimit}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                title={taglineRateLimit ? 'Rate limit reached. Please wait 30s.' : 'AI suggest taglines'}
                aria-label="AI suggest taglines"
              >
                {loadingTaglines
                  ? <><Spinner className="h-3.5 w-3.5" /> Generating...</>
                  : taglineRateLimit
                  ? '⏳ Rate limited'
                  : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>}
              </Button>
            </div>
          </div>
          <Input
            id="tagline-input"
            value={data.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            onBlur={() => handleBlur('tagline')}
            placeholder="A short, memorable tagline"
            className={touched.tagline && errors.tagline ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={120}
          />
          <FieldError message={touched.tagline ? errors.tagline : undefined} />
          <AnimatePresence>
            {suggestedTaglines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
              >
                {suggestedTaglines.map((tagline, i) => (
                  <motion.button
                    key={tagline}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { updateData({ tagline }); setSuggestedTaglines([]); }}
                    className="block w-full text-left px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-violet-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-violet-200/50 dark:border-violet-800/50"
                  >
                    &ldquo;{tagline}&rdquo;
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Description ──────────────────────────────────────── */}
        <motion.div {...getFieldAnim(4)}>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300" htmlFor="description-input">
              Description
            </label>
            <CharCount value={data.description} max={1000} />
          </div>
          <Textarea
            id="description-input"
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Tell us about your brand in a few sentences..."
            rows={4}
            className={touched.description && errors.description ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={1000}
          />
          <FieldError message={touched.description ? errors.description : undefined} />
        </motion.div>
      </div>

      {/* Navigation */}
      <motion.div {...getFieldAnim(5)} className="flex justify-end mt-10">
        <Button onClick={handleNext} disabled={!canProceed} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
