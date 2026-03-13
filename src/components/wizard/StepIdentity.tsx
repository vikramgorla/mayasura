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
  { name: 'Midnight', primary: '#0f172a', secondary: '#f8fafc', accent: '#3b82f6' },
  { name: 'Forest', primary: '#14532d', secondary: '#f0fdf4', accent: '#22c55e' },
  { name: 'Ocean', primary: '#0c4a6e', secondary: '#f0f9ff', accent: '#0ea5e9' },
  { name: 'Wine', primary: '#4c0519', secondary: '#fff1f2', accent: '#e11d48' },
  { name: 'Amber', primary: '#451a03', secondary: '#fffbeb', accent: '#f59e0b' },
  { name: 'Purple', primary: '#3b0764', secondary: '#faf5ff', accent: '#a855f7' },
];

export default function StepIdentity({ data, updateData, onNext, onBack }: Props) {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Visual Identity</h2>
        <p className="text-slate-500">Define your brand&apos;s visual language — colors and typography.</p>
      </div>

      <div className="space-y-8">
        {/* Color Presets */}
        <div>
          <label className="block text-sm font-medium mb-3">Color Palette</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateData({
                  primaryColor: preset.primary,
                  secondaryColor: preset.secondary,
                  accentColor: preset.accent,
                })}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  data.primaryColor === preset.primary
                    ? 'border-slate-900 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-1.5 mb-2">
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.primary }} />
                  <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: preset.secondary }} />
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: preset.accent }} />
                </div>
                <p className="text-xs font-medium">{preset.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div>
          <label className="block text-sm font-medium mb-3">Custom Colors</label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => updateData({ primaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-mono">{data.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.secondaryColor}
                  onChange={(e) => updateData({ secondaryColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-mono">{data.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.accentColor}
                  onChange={(e) => updateData({ accentColor: e.target.value })}
                  className="h-10 w-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <span className="text-xs text-slate-500 font-mono">{data.accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <label className="block text-sm font-medium mb-3">Preview</label>
          <div
            className="rounded-xl overflow-hidden border border-slate-200"
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
          <label className="block text-sm font-medium mb-3">Typography</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Heading Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`h-${font}`}
                    onClick={() => updateData({ fontHeading: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontHeading === font
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1.5">Body Font</label>
              <div className="grid grid-cols-2 gap-2">
                {FONT_OPTIONS.map((font) => (
                  <button
                    key={`b-${font}`}
                    onClick={() => updateData({ fontBody: font })}
                    className={`px-3 py-2 rounded-lg text-xs text-center transition-all cursor-pointer ${
                      data.fontBody === font
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
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
          <label className="block text-sm font-medium mb-3">Logo</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-slate-400">
                {data.name ? data.name[0].toUpperCase() : 'M'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mb-1">Logo upload coming soon</p>
            <p className="text-xs text-slate-400">For now, we&apos;ll use your brand initial</p>
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
