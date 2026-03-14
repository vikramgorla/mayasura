'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandData, FONT_OPTIONS } from '@/lib/types';
import { WEBSITE_TEMPLATES } from '@/lib/website-templates';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface TemplateRecommendation {
  templateId: string;
  name: string;
  description: string;
  reason: string;
  rank: number;
}

const TEMPLATE_PREVIEWS: Record<string, { icon: string; accent: string }> = {
  minimal: { icon: '◻', accent: 'Whitespace-heavy, sharp edges' },
  editorial: { icon: '◧', accent: 'Asymmetric grids, strong type' },
  bold: { icon: '■', accent: 'High contrast, big statements' },
  classic: { icon: '▣', accent: 'Structured, trustworthy' },
  playful: { icon: '●', accent: 'Rounded, soft, friendly' },
};

const COLOR_PRESETS = [
  { name: 'Indigo Night', primary: '#1E1B4B', secondary: '#EEF2FF', accent: '#6366F1' },
  { name: 'Deep Forest', primary: '#14532D', secondary: '#FFFBEB', accent: '#D97706' },
  { name: 'Rich Navy', primary: '#0F172A', secondary: '#FEF9EF', accent: '#B45309' },
  { name: 'Terracotta', primary: '#7C2D12', secondary: '#FEF3C7', accent: '#C2410C' },
  { name: 'Deep Plum', primary: '#581C87', secondary: '#FFF1F2', accent: '#DB2777' },
  { name: 'True Black', primary: '#0A0A0A', secondary: '#F0FDF4', accent: '#22C55E' },
  { name: 'Charcoal Gold', primary: '#1C1917', secondary: '#FAFAF9', accent: '#A16207' },
  { name: 'Teal Coral', primary: '#134E4A', secondary: '#FFF7ED', accent: '#F97316' },
  { name: 'Deep Teal', primary: '#0F4C5C', secondary: '#F0FDFA', accent: '#0D9488' },
];

export default function StepIdentity({ data, updateData, onNext, onBack }: Props) {
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const selectedTemplate = (data as BrandData & { websiteTemplate?: string }).websiteTemplate || 'minimal';

  useEffect(() => {
    if (data.industry) {
      setLoadingRecs(true);
      fetch('/api/ai/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'website-template',
          industry: data.industry,
          brandVoice: data.brandVoice,
        }),
      })
        .then(r => r.json())
        .then(d => {
          if (d.recommendations) setRecommendations(d.recommendations);
        })
        .catch(() => {})
        .finally(() => setLoadingRecs(false));
    }
  }, [data.industry, data.brandVoice]);

  const handleSelectTemplate = (templateId: string) => {
    updateData({ websiteTemplate: templateId } as Partial<BrandData>);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Visual Identity</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Define your brand&apos;s visual language — template, colors, and typography.</p>
      </div>

      <div className="space-y-8">
        {/* Website Template Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Website Template</label>
            {recommendations.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                <Sparkles className="h-3 w-3" />
                AI recommended
              </span>
            )}
          </div>
          {loadingRecs && (
            <div className="mb-3 text-xs text-zinc-400 animate-pulse">Analyzing best template for your industry...</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WEBSITE_TEMPLATES.map((template) => {
              const rec = recommendations.find(r => r.templateId === template.id);
              const isSelected = selectedTemplate === template.id;
              const preview = TEMPLATE_PREVIEWS[template.id];
              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 dark:border-indigo-400 shadow-md shadow-violet-500/10'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {rec && rec.rank === 1 && (
                    <span className="absolute -top-2 -right-2 bg-violet-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      Best fit
                    </span>
                  )}
                  <div className="text-2xl mb-2">{preview?.icon || '□'}</div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                    {template.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-2">
                    {template.description}
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    {preview?.accent}
                  </p>
                </button>
              );
            })}
          </div>
          {recommendations.length > 0 && recommendations[0] && (
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              💡 {recommendations[0].reason}
            </p>
          )}
        </div>

        {/* Color Presets */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Color Palette</label>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateData({
                  primaryColor: preset.primary,
                  secondaryColor: preset.secondary,
                  accentColor: preset.accent,
                })}
                className={`p-3 sm:p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  data.primaryColor === preset.primary
                    ? 'border-indigo-500 dark:border-indigo-400 shadow-md shadow-violet-500/10'
                    : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex gap-1.5 mb-2">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full shadow-inner" style={{ backgroundColor: preset.primary }} />
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-zinc-200 dark:border-zinc-600" style={{ backgroundColor: preset.secondary }} />
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-zinc-700 dark:text-zinc-300">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Custom Colors</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => updateData({ primaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{data.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.secondaryColor}
                  onChange={(e) => updateData({ secondaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{data.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) => updateData({ accentColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">{data.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Preview</label>
          <div
            className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
            style={{ backgroundColor: data.secondaryColor }}
          >
            <div className="p-4" style={{ backgroundColor: data.primaryColor }}>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded" style={{ backgroundColor: data.accentColor }} />
                <span className="text-sm font-semibold" style={{ color: data.secondaryColor }}>
                  {data.name || 'Your Brand'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-1" style={{ color: data.primaryColor }}>
                Welcome to {data.name || 'Your Brand'}
              </h3>
              <p className="text-sm mb-3" style={{ color: data.primaryColor, opacity: 0.6 }}>
                {data.tagline || 'Your tagline goes here'}
              </p>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: data.accentColor }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Typography</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Heading Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`h-${font}`}
                    onClick={() => updateData({ fontHeading: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontHeading === font
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">Body Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`b-${font}`}
                    onClick={() => updateData({ fontBody: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontBody === font
                        ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                        : 'bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">Logo</label>
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
                {data.name ? data.name[0].toUpperCase() : 'M'}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Logo upload coming soon</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">For now, we&apos;ll use your brand initial</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-10">
        <Button onClick={onBack} variant="ghost" size="lg">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} variant="brand" size="lg">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
