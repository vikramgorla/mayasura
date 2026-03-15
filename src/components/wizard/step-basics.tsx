"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X, Loader2 } from "lucide-react";
import type { WizardData } from "@/lib/types/wizard";
import { INDUSTRIES } from "@/lib/types/wizard";

interface StepBasicsProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

export function StepBasics({ data, onChange }: StepBasicsProps) {
  const [slugInfo, setSlugInfo] = useState<{
    slug: string;
    available: boolean;
    suggested: string;
  } | null>(null);
  const [slugLoading, setSlugLoading] = useState(false);
  const [suggestingNames, setSuggestingNames] = useState(false);
  const [suggestingTaglines, setSuggestingTaglines] = useState(false);
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [taglineSuggestions, setTaglineSuggestions] = useState<string[]>([]);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [industryFilter, setIndustryFilter] = useState("");

  // Debounced slug check
  useEffect(() => {
    if (!data.name || data.name.length < 2) {
      setSlugInfo(null);
      return;
    }

    const timer = setTimeout(async () => {
      setSlugLoading(true);
      try {
        const res = await fetch(
          `/api/v1/brands/slug-check?name=${encodeURIComponent(data.name)}`
        );
        if (res.ok) {
          const json = await res.json();
          setSlugInfo(json.data);
        }
      } catch {
        // silent
      } finally {
        setSlugLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.name]);

  const handleSuggestNames = useCallback(async () => {
    if (!data.industry) return;
    setSuggestingNames(true);
    try {
      const res = await fetch("/api/v1/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "brand-names", industry: data.industry }),
      });
      if (res.ok) {
        const json = await res.json();
        setNameSuggestions(json.data?.suggestions || []);
      }
    } catch {
      // silent
    } finally {
      setSuggestingNames(false);
    }
  }, [data.industry]);

  const handleSuggestTaglines = useCallback(async () => {
    if (!data.name || !data.industry) return;
    setSuggestingTaglines(true);
    try {
      const res = await fetch("/api/v1/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "taglines",
          brandName: data.name,
          industry: data.industry,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setTaglineSuggestions(json.data?.suggestions || []);
      }
    } catch {
      // silent
    } finally {
      setSuggestingTaglines(false);
    }
  }, [data.name, data.industry]);

  const filteredIndustries = INDUSTRIES.filter((ind) =>
    ind.toLowerCase().includes(industryFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Brand Basics
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Tell us about your brand. We&apos;ll use this to build your digital
          palace.
        </p>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Industry <span className="text-[var(--error)]">*</span>
        </label>
        <div className="relative">
          <Input
            value={data.industry}
            onChange={(e) => {
              onChange({ industry: e.target.value });
              setIndustryFilter(e.target.value);
              setShowIndustryDropdown(true);
            }}
            onFocus={() => setShowIndustryDropdown(true)}
            onBlur={() => setTimeout(() => setShowIndustryDropdown(false), 200)}
            placeholder="e.g., Restaurant & Food"
          />
          {showIndustryDropdown && filteredIndustries.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] shadow-[var(--shadow-lg)] max-h-48 overflow-y-auto">
              {filteredIndustries.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors"
                  onMouseDown={() => {
                    onChange({ industry: ind });
                    setShowIndustryDropdown(false);
                  }}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Brand Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Brand Name <span className="text-[var(--error)]">*</span>
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Your brand name"
              maxLength={100}
            />
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={handleSuggestNames}
            disabled={!data.industry || suggestingNames}
            title={!data.industry ? "Select an industry first" : "AI suggest names"}
          >
            {suggestingNames ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Slug preview */}
        {data.name && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--text-tertiary)]">
              yourbrand.com/
            </span>
            <span className="font-mono text-[var(--text-secondary)]">
              {slugInfo?.slug || "..."}
            </span>
            {slugLoading && (
              <Loader2 className="h-3 w-3 animate-spin text-[var(--text-tertiary)]" />
            )}
            {!slugLoading && slugInfo && (
              <>
                {slugInfo.available ? (
                  <Check className="h-4 w-4 text-[var(--success)]" />
                ) : (
                  <>
                    <X className="h-4 w-4 text-[var(--error)]" />
                    <span className="text-xs text-[var(--text-tertiary)]">
                      Suggested: {slugInfo.suggested}
                    </span>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* Name suggestions */}
        {nameSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {nameSuggestions.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  onChange({ name });
                  setNameSuggestions([]);
                }}
                className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tagline */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Tagline
        </label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              value={data.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="A short, memorable phrase"
              maxLength={200}
            />
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={handleSuggestTaglines}
            disabled={!data.name || !data.industry || suggestingTaglines}
            title="AI suggest taglines"
          >
            {suggestingTaglines ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </Button>
        </div>

        {taglineSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {taglineSuggestions.map((tagline) => (
              <button
                key={tagline}
                type="button"
                onClick={() => {
                  onChange({ tagline });
                  setTaglineSuggestions([]);
                }}
                className="rounded-full border border-[var(--border-primary)] bg-[var(--bg-surface)] px-3 py-1 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {tagline}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Description
        </label>
        <Textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Tell us about your brand — what makes it unique?"
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-[var(--text-tertiary)]">
          {data.description.length}/2000
        </p>
      </div>
    </div>
  );
}
