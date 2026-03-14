'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrandData } from '@/lib/types';
import { WEBSITE_TEMPLATES } from '@/lib/website-templates';
import { TemplatePreviewCard } from '@/components/design/template-preview';
import {
  ColorPalettePresets,
  COLOR_PALETTES,
  type ColorPalette,
  type ColorSystem,
} from '@/components/design/color-system';
import { FontPicker, FontPreview } from '@/components/design/font-picker';

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

export default function StepIdentity({ data, updateData, onNext, onBack }: Props) {
  const [recommendations, setRecommendations] = useState<TemplateRecommendation[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [activePaletteId, setActivePaletteId] = useState<string | undefined>();
  const selectedTemplate = (data as BrandData & { websiteTemplate?: string }).websiteTemplate || 'minimal';

  // Fetch AI template recommendations
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
    // Apply template default fonts
    const template = WEBSITE_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      updateData({
        websiteTemplate: templateId,
        fontHeading: template.fonts.heading,
        fontBody: template.fonts.body,
      } as Partial<BrandData>);
    }
  };

  const handlePaletteSelect = (palette: ColorPalette) => {
    setActivePaletteId(palette.id);
    updateData({
      primaryColor: palette.colors.primary,
      secondaryColor: palette.colors.secondary,
      accentColor: palette.colors.accent,
    });
  };

  // Build preview colors from current state
  const previewColors: ColorSystem = useMemo(() => {
    // If a palette is active, use its full 7 colors; otherwise derive from selected colors
    if (activePaletteId) {
      const palette = COLOR_PALETTES.find(p => p.id === activePaletteId);
      if (palette) return palette.colors;
    }
    return {
      primary: data.primaryColor,
      secondary: data.secondaryColor,
      accent: data.accentColor,
      text: data.primaryColor,
      muted: '#64748b',
      surface: '#ffffff',
      border: '#e2e8f0',
    };
  }, [data.primaryColor, data.secondaryColor, data.accentColor, activePaletteId]);

  const selectedTemplateObj = WEBSITE_TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Visual Identity</h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          Define your brand&apos;s visual language — template, colors, and typography.
        </p>
      </div>

      <div className="space-y-10">

        {/* ── 1. Website Template Selection ──────────── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Website Template
            </label>
            {recommendations.length > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400">
                <Sparkles className="h-3 w-3" />
                AI recommended
              </span>
            )}
          </div>
          {loadingRecs && (
            <div className="mb-3 text-xs text-zinc-400 animate-pulse">
              Analyzing best template for your industry...
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {WEBSITE_TEMPLATES.map((template) => {
              const rec = recommendations.find(r => r.templateId === template.id);
              return (
                <div key={template.id} className="relative">
                  {rec && rec.rank === 1 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 z-10 bg-violet-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-lg"
                    >
                      Best fit
                    </motion.span>
                  )}
                  <TemplatePreviewCard
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    brandName={data.name}
                    onClick={() => handleSelectTemplate(template.id)}
                  />
                </div>
              );
            })}
          </div>
          {recommendations.length > 0 && recommendations[0] && (
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
              💡 {recommendations[0].reason}
            </p>
          )}
        </section>

        {/* ── 2. Color Palette Selection ─────────────── */}
        <section>
          <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
            Color Palette
          </label>
          <ColorPalettePresets
            activeId={activePaletteId}
            onSelect={handlePaletteSelect}
            compact
          />

          {/* Custom color pickers (primary, secondary, accent only) */}
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
              Custom Colors
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: 'primaryColor' as const, label: 'Primary' },
                { key: 'secondaryColor' as const, label: 'Background' },
                { key: 'accentColor' as const, label: 'Accent' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data[key]}
                      onChange={(e) => {
                        updateData({ [key]: e.target.value });
                        setActivePaletteId(undefined);
                      }}
                      className="h-9 w-9 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                      {data[key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-start gap-1.5">
              <Info className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                Customize all 7 colors (text, muted, surface, border) in the Design Studio after creation.
              </p>
            </div>
          </div>
        </section>

        {/* ── 3. Typography ─────────────────────────── */}
        <section>
          <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
            Typography
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <FontPicker
              label="Heading Font"
              value={data.fontHeading}
              onChange={(f) => updateData({ fontHeading: f })}
            />
            <FontPicker
              label="Body Font"
              value={data.fontBody}
              onChange={(f) => updateData({ fontBody: f })}
            />
          </div>
          <FontPreview
            headingFont={data.fontHeading}
            bodyFont={data.fontBody}
            brandName={data.name}
          />
        </section>

        {/* ── 4. Live Preview ───────────────────────── */}
        <section>
          <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
            Preview
          </label>
          <div
            className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
            style={{ backgroundColor: previewColors.secondary }}
          >
            {/* Nav */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ backgroundColor: previewColors.primary }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded flex items-center justify-center text-[8px] font-bold"
                  style={{ backgroundColor: previewColors.accent, color: '#FFFFFF' }}
                >
                  {data.name ? data.name[0].toUpperCase() : 'B'}
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: previewColors.secondary, fontFamily: data.fontHeading }}
                >
                  {data.name || 'Your Brand'}
                </span>
              </div>
              <div className="flex gap-3 items-center">
                {['Home', 'Shop', 'About'].map(t => (
                  <span key={t} className="text-[8px]" style={{ color: `${previewColors.secondary}66` }}>{t}</span>
                ))}
                <span
                  className="text-[8px] px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: previewColors.accent, color: '#FFFFFF' }}
                >
                  Shop
                </span>
              </div>
            </div>

            {/* Hero */}
            <div className="px-5 py-6 text-center" style={{ backgroundColor: previewColors.secondary }}>
              <h3
                className="text-base font-bold mb-1"
                style={{ color: previewColors.text, fontFamily: data.fontHeading }}
              >
                Welcome to {data.name || 'Your Brand'}
              </h3>
              <p
                className="text-[10px] mb-3"
                style={{ color: previewColors.muted, fontFamily: data.fontBody }}
              >
                {data.tagline || 'Your tagline goes here'}
              </p>
              <button
                className="px-3 py-1.5 rounded text-[9px] font-medium"
                style={{ backgroundColor: previewColors.accent, color: '#FFFFFF' }}
              >
                Get Started
              </button>
            </div>

            {/* Cards */}
            <div className="px-4 pb-4 grid grid-cols-3 gap-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: previewColors.surface,
                    border: `1px solid ${previewColors.border}`,
                  }}
                >
                  <div
                    className="h-8 rounded mb-1.5"
                    style={{ backgroundColor: `${previewColors.muted}15` }}
                  />
                  <div
                    className="h-1.5 w-3/4 rounded"
                    style={{ backgroundColor: previewColors.text, opacity: 0.15 }}
                  />
                  <div
                    className="h-1 w-1/2 rounded mt-1"
                    style={{ backgroundColor: previewColors.muted, opacity: 0.2 }}
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2 text-center"
              style={{ backgroundColor: previewColors.primary }}
            >
              <span className="text-[8px]" style={{ color: `${previewColors.secondary}55` }}>
                © 2026 {data.name || 'Brand'} · Powered by Mayasura
              </span>
            </div>
          </div>
        </section>

        {/* ── Logo Upload Placeholder ───────────────── */}
        <section>
          <label className="block text-sm font-semibold mb-3 text-zinc-700 dark:text-zinc-300">
            Logo
          </label>
          <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl p-8 text-center">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-zinc-400 dark:text-zinc-500">
                {data.name ? data.name[0].toUpperCase() : 'M'}
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Logo upload coming soon</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              For now, we&apos;ll use your brand initial
            </p>
          </div>
        </section>
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
