'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandData, FONT_OPTIONS } from '@/lib/types';

interface Props {
  data: BrandData;
  updateData: (updates: Partial<BrandData>) => void;
  onNext: () => void;
  onBack: () => void;
}

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
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-900 dark:text-white">Visual Identity</h2>
        <p className="text-slate-500 dark:text-slate-400">Define your brand&apos;s visual language — colors and typography.</p>
      </div>

      <div className="space-y-8">
        {/* Color Presets */}
        <div>
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Color Palette</label>
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
                    ? 'border-indigo-500 dark:border-indigo-400 shadow-md shadow-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex gap-1.5 mb-2">
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full shadow-inner" style={{ backgroundColor: preset.primary }} />
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full border border-slate-200 dark:border-slate-600" style={{ backgroundColor: preset.secondary }} />
                  <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Custom Colors</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => updateData({ primaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{data.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.secondaryColor}
                  onChange={(e) => updateData({ secondaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{data.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) => updateData({ accentColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{data.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Preview</label>
          <div
            className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700"
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
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Typography</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Heading Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`h-${font}`}
                    onClick={() => updateData({ fontHeading: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontHeading === font
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">Body Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`b-${font}`}
                    onClick={() => updateData({ fontBody: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontBody === font
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
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
          <label className="block text-sm font-medium mb-3 text-slate-700 dark:text-slate-300">Logo</label>
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
            <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-slate-400 dark:text-slate-500">
                {data.name ? data.name[0].toUpperCase() : 'M'}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Logo upload coming soon</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">For now, we&apos;ll use your brand initial</p>
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
