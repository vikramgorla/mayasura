'use client';

import { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
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

export default function StepBasics({ data, updateData, onNext }: Props) {
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingTaglines, setLoadingTaglines] = useState(false);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [suggestedTaglines, setSuggestedTaglines] = useState<string[]>([]);

  const suggestNames = async () => {
    if (!data.industry) return;
    setLoadingNames(true);
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
      const result = await res.json();
      setSuggestedNames(result.suggestions || []);
    } catch (e) {
      console.error('Name suggestion error:', e);
    }
    setLoadingNames(false);
  };

  const suggestTaglines = async () => {
    if (!data.name || !data.industry) return;
    setLoadingTaglines(true);
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
      const result = await res.json();
      setSuggestedTaglines(result.suggestions || []);
    } catch (e) {
      console.error('Tagline suggestion error:', e);
    }
    setLoadingTaglines(false);
  };

  const canProceed = data.name.trim().length > 0 && data.industry.trim().length > 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Brand Basics</h2>
        <p className="text-slate-500 dark:text-slate-400">Let&apos;s start with the foundation. What&apos;s your brand about?</p>
      </div>

      <div className="space-y-6">
        {/* Industry */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Industry / Category</label>
          <Input
            value={data.industry}
            onChange={(e) => updateData({ industry: e.target.value })}
            placeholder="e.g., Sustainable Fashion, Coffee Roasting, SaaS..."
          />
        </div>

        {/* Brand Name */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Brand Name</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={suggestNames}
              disabled={!data.industry || loadingNames}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {loadingNames ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>}
            </Button>
          </div>
          <Input
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            placeholder="Your brand name"
          />
          {suggestedNames.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedNames.map((name) => (
                <button
                  key={name}
                  onClick={() => { updateData({ name }); setSuggestedNames([]); }}
                  className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/50"
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tagline</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={suggestTaglines}
              disabled={!data.name || !data.industry || loadingTaglines}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              {loadingTaglines ? <Spinner className="h-4" /> : <><Sparkles className="h-3.5 w-3.5" /> AI Suggest</>}
            </Button>
          </div>
          <Input
            value={data.tagline}
            onChange={(e) => updateData({ tagline: e.target.value })}
            placeholder="A short, memorable tagline"
          />
          {suggestedTaglines.length > 0 && (
            <div className="mt-3 space-y-2">
              {suggestedTaglines.map((tagline) => (
                <button
                  key={tagline}
                  onClick={() => { updateData({ tagline }); setSuggestedTaglines([]); }}
                  className="block w-full text-left px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer border border-indigo-200/50 dark:border-indigo-800/50"
                >
                  &ldquo;{tagline}&rdquo;
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Description</label>
          <Textarea
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            placeholder="Tell us about your brand in a few sentences..."
            rows={4}
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-10">
        <Button onClick={onNext} disabled={!canProceed} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
