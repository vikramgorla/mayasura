'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
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

/* ─── Inline error ──────────────────────────────────────────── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 mt-1.5 text-xs text-red-500 dark:text-red-400">
      <AlertCircle className="h-3 w-3 flex-shrink-0" />
      {message}
    </p>
  );
}

/* ─── Character count hint ─────────────────────────────────── */
function CharCount({ value, max, warn = 0.8 }: { value: string; max: number; warn?: number }) {
  const pct = value.length / max;
  if (value.length === 0 || pct < 0.6) return null;
  return (
    <span className={`text-xs ${pct >= 1 ? 'text-red-500' : pct >= warn ? 'text-amber-500' : 'text-zinc-400'}`}>
      {value.length}/{max}
    </span>
  );
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

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const fieldErrors = validateStep(data);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field as keyof FieldErrors] }));
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
    } catch (e) {
      // handled by toast
    }
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
        body: JSON.stringify({
          type: 'taglines',
          brandName: data.name,
          industry: data.industry,
        }),
      });
      if (res.status === 429) {
        setTaglineRateLimit(true);
        setTimeout(() => setTaglineRateLimit(false), 30000);
        return;
      }
      const result = await res.json();
      setSuggestedTaglines(result.suggestions || []);
    } catch (e) {
      // handled by toast
    }
    setLoadingTaglines(false);
  };

  const handleNext = () => {
    const allTouched = { name: true, industry: true, tagline: true, description: true };
    setTouched(allTouched);
    const fieldErrors = validateStep(data);
    setErrors(fieldErrors);
    if (fieldErrors.name || fieldErrors.industry) return;
    onNext();
  };

  const canProceed = data.name.trim().length >= 2 && data.industry.trim().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Brand Basics</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Let&apos;s start with the foundation. What&apos;s your brand about?</p>
      </div>

      <div className="space-y-6">
        {/* Industry */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Industry / Category <span className="text-red-400">*</span>
            </label>
            <CharCount value={data.industry} max={80} />
          </div>
          <Input
            value={data.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            onBlur={() => handleBlur('industry')}
            placeholder="e.g., Sustainable Fashion, Coffee Roasting, SaaS..."
            className={touched.industry && errors.industry ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={80}
          />
          <FieldError message={touched.industry ? errors.industry : undefined} />
        </div>

        {/* Brand Name */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
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
                title={nameRateLimit ? 'Rate limit reached. Please wait 30s.' : undefined}
              >
                {loadingNames
                  ? <><Spinner className="h-3.5 w-3.5" /> Generating...</>
                  : nameRateLimit
                  ? '⏳ Rate limited'
                  : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>
                }
              </Button>
            </div>
          </div>
          <Input
            value={data.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Your brand name"
            className={touched.name && errors.name ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={60}
          />
          <FieldError message={touched.name ? errors.name : undefined} />
          {suggestedNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => { updateData({ name }); setSuggestedNames([]); }}
                  className="px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-violet-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-violet-200/50 dark:border-violet-800/50"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tagline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tagline</label>
            <div className="flex items-center gap-3">
              <CharCount value={data.tagline} max={120} />
              <Button
                variant="ghost"
                size="sm"
                onClick={suggestTaglines}
                disabled={!data.name || !data.industry || loadingTaglines || taglineRateLimit}
                className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300"
                title={taglineRateLimit ? 'Rate limit reached. Please wait 30s.' : undefined}
              >
                {loadingTaglines
                  ? <><Spinner className="h-3.5 w-3.5" /> Generating...</>
                  : taglineRateLimit
                  ? '⏳ Rate limited'
                  : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>
                }
              </Button>
            </div>
          </div>
          <Input
            value={data.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            onBlur={() => handleBlur('tagline')}
            placeholder="A short, memorable tagline"
            className={touched.tagline && errors.tagline ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={120}
          />
          <FieldError message={touched.tagline ? errors.tagline : undefined} />
          {suggestedTaglines.length > 0 && (
            <div className="mt-3 space-y-2">
              {suggestedTaglines.map((tagline) => (
                <button
                  key={tagline}
                  onClick={() => { updateData({ tagline }); setSuggestedTaglines([]); }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-violet-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-violet-200/50 dark:border-violet-800/50"
                >
                  &ldquo;{tagline}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Description</label>
            <CharCount value={data.description} max={1000} />
          </div>
          <Textarea
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Tell us about your brand in a few sentences..."
            rows={4}
            className={touched.description && errors.description ? 'border-red-400 focus:border-red-400' : ''}
            maxLength={1000}
          />
          <FieldError message={touched.description ? errors.description : undefined} />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-10">
        <Button onClick={handleNext} disabled={!canProceed} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
