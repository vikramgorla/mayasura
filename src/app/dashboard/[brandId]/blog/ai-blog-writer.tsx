"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Loader2,
  Check,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiStepIndicator } from "./ai-step-indicator";

interface AiBlogWriterProps {
  brandId: string;
  onComplete: (content: string, seoData?: Record<string, string>) => void;
  onCancel: () => void;
}

// Step definitions moved to ai-step-indicator.tsx

export function AiBlogWriter({
  brandId,
  onComplete,
  onCancel,
}: AiBlogWriterProps) {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [article, setArticle] = useState("");
  const [seoData, setSeoData] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  async function callAI(
    aiStep: "outline" | "article" | "improve" | "seo"
  ) {
    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/v1/ai/blog-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandId,
          topic,
          step: aiStep,
          outline: outline || undefined,
          content: article || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "AI generation failed");
      }

      const json = await res.json();
      return json.data?.result;
    } catch (err) {
      setGenError(
        err instanceof Error ? err.message : "Failed to generate content"
      );
      return null;
    } finally {
      setGenerating(false);
    }
  }

  async function handleGenerateOutline() {
    const result = await callAI("outline");
    if (result?.content) {
      setOutline(result.content);
      setStep(2);
    }
  }

  async function handleGenerateArticle() {
    const result = await callAI("article");
    if (result?.content) {
      setArticle(result.content);
      setStep(3);
    }
  }

  async function handleImproveArticle() {
    const result = await callAI("improve");
    if (result?.content) {
      setArticle(result.content);
    }
  }

  async function handleGenerateSeo() {
    const result = await callAI("seo");
    if (result) {
      const data = result.raw ? {} : result;
      setSeoData(data);
      setStep(4);
    }
  }

  function handleFinish() {
    onComplete(article, seoData);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
        <div className="flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            AI Blog Writer
          </span>
        </div>
      </div>

      <AiStepIndicator currentStep={step} />

      {/* Error */}
      {genError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
          {genError}
        </div>
      )}

      {/* Step 1: Topic */}
      {step === 1 && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            What do you want to write about?
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Enter a topic or idea. The AI will create a structured outline.
          </p>
          <textarea
            placeholder="e.g. 5 Tips for Building a Strong Brand Identity"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] resize-none mb-4"
          />
          <Button
            onClick={handleGenerateOutline}
            disabled={generating || !topic.trim()}
            variant="brand"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {generating ? "Generating Outline..." : "Generate Outline"}
          </Button>
        </div>
      )}

      {/* Step 2: Outline */}
      {step === 2 && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Review the Outline
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Edit the outline if needed, then generate the full article.
          </p>
          <textarea
            value={outline}
            onChange={(e) => setOutline(e.target.value)}
            rows={16}
            className="w-full px-4 py-3 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono resize-none mb-4"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setStep(1)}
              variant="ghost"
            >
              Back
            </Button>
            <Button
              onClick={handleGenerateArticle}
              disabled={generating}
              variant="brand"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              {generating ? "Writing Article..." : "Generate Article"}
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Article */}
      {step === 3 && (
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            Your Article
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Review and edit your article, then optimize for SEO.
          </p>
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            rows={20}
            className="w-full px-4 py-3 border border-[var(--border-primary)] rounded-lg text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] font-mono resize-none mb-4"
          />
          <div className="flex gap-2">
            <Button
              onClick={() => setStep(2)}
              variant="ghost"
            >
              Back
            </Button>
            <Button
              onClick={handleImproveArticle}
              disabled={generating}
              variant="outline"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Improve
            </Button>
            <Button
              onClick={handleGenerateSeo}
              disabled={generating}
              variant="brand"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              Optimize SEO
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: SEO */}
      {step === 4 && (
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
            SEO Optimization
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Review your SEO metadata, then create the post.
          </p>

          <div className="space-y-4 mb-6">
            {seoData.seoTitle && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  SEO Title
                </label>
                <p className="text-sm text-[var(--text-primary)] p-3 bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-lg">
                  {seoData.seoTitle}
                </p>
              </div>
            )}
            {seoData.seoDescription && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Meta Description
                </label>
                <p className="text-sm text-[var(--text-primary)] p-3 bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-lg">
                  {seoData.seoDescription}
                </p>
              </div>
            )}
            {seoData.excerpt && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Excerpt
                </label>
                <p className="text-sm text-[var(--text-primary)] p-3 bg-[var(--bg-surface)] border border-[var(--border-primary)] rounded-lg">
                  {seoData.excerpt}
                </p>
              </div>
            )}
            {Array.isArray(seoData.tags) && seoData.tags.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {(seoData.tags as unknown as string[]).map(
                    (tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setStep(3)}
              variant="ghost"
            >
              Back
            </Button>
            <Button onClick={handleFinish} variant="brand">
              <Check className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
