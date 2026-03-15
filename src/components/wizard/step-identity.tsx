"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Check } from "lucide-react";
import type { WizardData } from "@/lib/types/wizard";
import { COLOR_PRESETS, FONT_GROUPS } from "@/lib/types/wizard";
import { WEBSITE_TEMPLATES } from "@/lib/templates/website-templates";
import type { TemplateRecommendation } from "@/lib/ai/suggest";

interface StepIdentityProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

export function StepIdentity({ data, onChange }: StepIdentityProps) {
  const [recommendations, setRecommendations] = useState<
    TemplateRecommendation[]
  >([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState<
    "heading" | "body" | null
  >(null);

  const handleRecommendTemplates = useCallback(async () => {
    if (!data.industry) return;
    setLoadingRecs(true);
    try {
      const res = await fetch("/api/v1/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "website-template",
          industry: data.industry,
          brandVoice: data.brandVoice || undefined,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setRecommendations(json.data?.recommendations || []);
      }
    } catch {
      // silent
    } finally {
      setLoadingRecs(false);
    }
  }, [data.industry, data.brandVoice]);

  // Sort templates: recommended first
  const recIds = new Set(recommendations.map((r) => r.templateId));
  const sortedTemplates = [
    ...WEBSITE_TEMPLATES.filter((t) => recIds.has(t.id)),
    ...WEBSITE_TEMPLATES.filter((t) => !recIds.has(t.id)),
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Visual Identity
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Choose your template, colors, and fonts. This defines how your palace
          looks.
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--text-primary)]">
            Website Template
          </label>
          {data.industry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRecommendTemplates}
              disabled={loadingRecs}
            >
              {loadingRecs ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              AI Recommend
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedTemplates.map((template) => {
            const isSelected = data.websiteTemplate === template.id;
            const rec = recommendations.find(
              (r) => r.templateId === template.id
            );
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => {
                  onChange({
                    websiteTemplate: template.id,
                    primaryColor: template.colors.light.text,
                    secondaryColor: template.colors.light.background,
                    accentColor: template.colors.light.accent,
                    fontHeading: template.fonts.heading,
                    fontBody: template.fonts.body,
                  });
                }}
                className={`relative rounded-xl border p-3 text-left transition-all ${
                  isSelected
                    ? "border-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2"
                    : "border-[var(--border-primary)] hover:border-[var(--accent)] hover:shadow-[var(--shadow-md)]"
                }`}
              >
                {/* Accent bar */}
                <div
                  className="h-1.5 rounded-full mb-3"
                  style={{
                    backgroundColor: template.colors.light.accent,
                  }}
                />

                <h4 className="font-medium text-sm text-[var(--text-primary)]">
                  {template.name}
                </h4>
                <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {template.bestFor.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {rec && (
                  <div className="absolute -top-2 -right-2 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    AI Pick
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Color Palette
        </label>

        {/* Presets */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {COLOR_PRESETS.map((preset) => {
            const isActive =
              data.primaryColor === preset.primary &&
              data.secondaryColor === preset.secondary &&
              data.accentColor === preset.accent;
            return (
              <button
                key={preset.name}
                type="button"
                title={preset.name}
                onClick={() =>
                  onChange({
                    primaryColor: preset.primary,
                    secondaryColor: preset.secondary,
                    accentColor: preset.accent,
                  })
                }
                className={`relative flex items-center justify-center h-10 rounded-lg border transition-all ${
                  isActive
                    ? "ring-2 ring-[var(--accent)] ring-offset-2 border-[var(--accent)]"
                    : "border-[var(--border-primary)] hover:scale-105"
                }`}
              >
                <div className="flex w-full h-full rounded-lg overflow-hidden">
                  <div
                    className="flex-1"
                    style={{ backgroundColor: preset.primary }}
                  />
                  <div
                    className="flex-1"
                    style={{ backgroundColor: preset.secondary }}
                  />
                  <div
                    className="flex-1"
                    style={{ backgroundColor: preset.accent }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Manual color pickers */}
        <div className="grid grid-cols-3 gap-4">
          <ColorPicker
            label="Primary"
            value={data.primaryColor}
            onChange={(v) => onChange({ primaryColor: v })}
          />
          <ColorPicker
            label="Secondary"
            value={data.secondaryColor}
            onChange={(v) => onChange({ secondaryColor: v })}
          />
          <ColorPicker
            label="Accent"
            value={data.accentColor}
            onChange={(v) => onChange({ accentColor: v })}
          />
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Typography
        </label>
        <div className="grid grid-cols-2 gap-4">
          <FontSelector
            label="Heading Font"
            value={data.fontHeading}
            isOpen={showFontPicker === "heading"}
            onToggle={() =>
              setShowFontPicker(
                showFontPicker === "heading" ? null : "heading"
              )
            }
            onSelect={(font) => {
              onChange({ fontHeading: font });
              setShowFontPicker(null);
            }}
          />
          <FontSelector
            label="Body Font"
            value={data.fontBody}
            isOpen={showFontPicker === "body"}
            onToggle={() =>
              setShowFontPicker(showFontPicker === "body" ? null : "body")
            }
            onSelect={(font) => {
              onChange({ fontBody: font });
              setShowFontPicker(null);
            }}
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Preview
        </label>
        <div
          className="rounded-xl border border-[var(--border-primary)] p-6 space-y-3"
          style={{ backgroundColor: data.secondaryColor }}
        >
          <h3
            className="text-2xl font-semibold tracking-tight"
            style={{
              fontFamily: data.fontHeading,
              color: data.primaryColor,
            }}
          >
            {data.name || "Your Brand Name"}
          </h3>
          <p
            className="text-sm"
            style={{
              fontFamily: data.fontBody,
              color: data.primaryColor,
              opacity: 0.7,
            }}
          >
            {data.tagline || "Your tagline goes here"}
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
  );
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer border border-[var(--border-primary)]"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 text-xs font-mono"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function FontSelector({
  label,
  value,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  value: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (font: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs text-[var(--text-secondary)]">{label}</span>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <span style={{ fontFamily: value }}>{value}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute z-30 mt-1 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] max-h-60 overflow-y-auto">
            {FONT_GROUPS.map((group) => (
              <div key={group.label}>
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)] bg-[var(--bg-secondary)]">
                  {group.label}
                </div>
                {group.fonts.map((font) => (
                  <button
                    key={font}
                    type="button"
                    onClick={() => onSelect(font)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] transition-colors ${
                      value === font
                        ? "text-[var(--accent)] font-medium"
                        : "text-[var(--text-primary)]"
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
