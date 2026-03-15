"use client";

import { useState, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, MessageSquare } from "lucide-react";
import type { WizardData } from "@/lib/types/wizard";
import { TONE_KEYWORDS } from "@/lib/types/wizard";

interface VoiceAnalysis {
  tone: string;
  personality: string;
  sampleGreeting: string;
}

interface StepContentProps {
  data: WizardData;
  onChange: (updates: Partial<WizardData>) => void;
}

export function StepContent({ data, onChange }: StepContentProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);

  const toggleToneKeyword = useCallback(
    (keyword: string) => {
      const current = data.toneKeywords;
      if (current.includes(keyword)) {
        onChange({ toneKeywords: current.filter((k) => k !== keyword) });
      } else {
        onChange({ toneKeywords: [...current, keyword] });
      }
    },
    [data.toneKeywords, onChange]
  );

  const handleAnalyzeVoice = useCallback(async () => {
    const description =
      data.brandVoice ||
      (data.toneKeywords.length > 0
        ? `Brand tone: ${data.toneKeywords.join(", ")}`
        : "");
    if (!description) return;

    setAnalyzing(true);
    try {
      const res = await fetch("/api/v1/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "analyze-voice",
          description,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        setAnalysis(json.data?.analysis || null);
      }
    } catch {
      // silent
    } finally {
      setAnalyzing(false);
    }
  }, [data.brandVoice, data.toneKeywords]);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div>
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Content & Tone
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Define your brand&apos;s personality. This shapes all AI-generated
          content.
        </p>
      </div>

      {/* Tone Keywords */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Brand Tone
        </label>
        <p className="text-xs text-[var(--text-tertiary)]">
          Select keywords that best describe how your brand communicates.
        </p>
        <div className="flex flex-wrap gap-2">
          {TONE_KEYWORDS.map((keyword) => {
            const isActive = data.toneKeywords.includes(keyword);
            return (
              <button
                key={keyword}
                type="button"
                onClick={() => toggleToneKeyword(keyword)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                }`}
              >
                {keyword}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Voice */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--text-primary)]">
          Brand Voice Description
        </label>
        <Textarea
          value={data.brandVoice}
          onChange={(e) => onChange({ brandVoice: e.target.value })}
          placeholder="Describe your brand's personality in your own words. How do you want to sound to your customers? What makes your voice unique?"
          rows={4}
          maxLength={2000}
        />
        <p className="text-xs text-[var(--text-tertiary)]">
          {data.brandVoice.length}/2000
        </p>
      </div>

      {/* AI Analyze */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleAnalyzeVoice}
          disabled={
            analyzing || (!data.brandVoice && data.toneKeywords.length === 0)
          }
        >
          {analyzing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Analyze Voice
        </Button>
      </div>

      {/* Analysis Result */}
      {analysis && (
        <div className="rounded-xl border border-[var(--accent)] bg-[var(--accent-light)] p-5 space-y-3">
          <h4 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Voice Analysis
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-[var(--text-secondary)]">Tone</span>
              <p className="font-medium text-[var(--text-primary)]">
                {analysis.tone}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs text-[var(--text-secondary)]">
              Personality
            </span>
            <p className="text-sm text-[var(--text-primary)] mt-1">
              {analysis.personality}
            </p>
          </div>

          <div className="border-t border-[var(--border-primary)] pt-3">
            <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Sample Customer Greeting
            </span>
            <p className="text-sm text-[var(--text-primary)] mt-1 italic">
              &ldquo;{analysis.sampleGreeting}&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
