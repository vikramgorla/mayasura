"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { WizardStepper } from "@/components/wizard/wizard-stepper";
import { StepBasics } from "@/components/wizard/step-basics";
import { StepIdentity } from "@/components/wizard/step-identity";
import { StepProducts } from "@/components/wizard/step-products";
import { StepContent } from "@/components/wizard/step-content";
import { StepChannels } from "@/components/wizard/step-channels";
import { StepReview } from "@/components/wizard/step-review";
import {
  INITIAL_WIZARD_DATA,
  WIZARD_STEPS,
  type WizardData,
} from "@/lib/types/wizard";
import { TEMPLATE_MAP } from "@/lib/templates/website-templates";

const DRAFT_KEY = "mayasura-wizard-draft";
const STEP_KEY = "mayasura-wizard-step";

export default function CreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const [data, setData] = useState<WizardData>(INITIAL_WIZARD_DATA);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const initialized = useRef(false);

  // Initialize: template param > draft > fresh
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const templateParam = searchParams.get("template");

    if (templateParam) {
      const template = TEMPLATE_MAP.get(templateParam);
      if (template) {
        setData({
          ...INITIAL_WIZARD_DATA,
          websiteTemplate: template.id,
          primaryColor: template.colors.light.text,
          secondaryColor: template.colors.light.background,
          accentColor: template.colors.light.accent,
          fontHeading: template.fonts.heading,
          fontBody: template.fonts.body,
        });
        addToast(`Template "${template.name}" loaded`, "info");
        return;
      }
    }

    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);
      const savedStep = localStorage.getItem(STEP_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as WizardData;
        setData(parsed);
        if (savedStep) setStep(parseInt(savedStep, 10) || 1);
        addToast("Draft restored", "info");
      }
    } catch {
      // ignore parse errors
    }
  }, [searchParams, addToast]);

  // Auto-save draft
  useEffect(() => {
    if (!initialized.current) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      localStorage.setItem(STEP_KEY, String(step));
    } catch {
      // localStorage quota exceeded — fail silently
    }
  }, [data, step]);

  const handleChange = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        return data.name.trim().length >= 1 && data.industry.trim().length >= 1;
      default:
        return true;
    }
  }, [step, data.name, data.industry]);

  const goNext = useCallback(() => {
    if (step >= WIZARD_STEPS.length) return;
    if (!canProceed()) {
      addToast("Please fill in the required fields", "warning");
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }, [step, canProceed, addToast]);

  const goBack = useCallback(() => {
    if (step <= 1) return;
    setDirection(-1);
    setStep((s) => s - 1);
  }, [step]);

  const clearDraft = useCallback(() => {
    if (!window.confirm("Clear all wizard data and start fresh?")) return;
    localStorage.removeItem(DRAFT_KEY);
    localStorage.removeItem(STEP_KEY);
    setData(INITIAL_WIZARD_DATA);
    setStep(1);
    addToast("Draft cleared", "info");
  }, [addToast]);

  const handleLaunch = useCallback(async () => {
    if (!data.name) return;
    setIsLaunching(true);

    try {
      const res = await fetch("/api/v1/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          tagline: data.tagline || undefined,
          description: data.description || undefined,
          industry: data.industry || undefined,
          primaryColor: data.primaryColor,
          secondaryColor: data.secondaryColor,
          accentColor: data.accentColor,
          fontHeading: data.fontHeading,
          fontBody: data.fontBody,
          brandVoice: data.brandVoice || undefined,
          toneKeywords: data.toneKeywords,
          channels: data.channels,
          websiteTemplate: data.websiteTemplate,
          products: data.products
            .filter((p) => p.name.trim())
            .map((p) => ({
              name: p.name,
              description: p.description,
              price: p.price,
              currency: p.currency,
              category: p.category,
            })),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to create brand");
      }

      const json = await res.json();
      const brandId = json.data?.id;

      // Clear draft
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(STEP_KEY);

      // Trigger AI content generation (non-blocking)
      if (brandId) {
        fetch(`/api/v1/brands/${brandId}/generate`, { method: "POST" }).catch(
          () => {
            /* non-blocking */
          }
        );
      }

      addToast("Your palace has been built! 🏛️", "success");
      router.push(`/dashboard/${brandId}`);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      addToast(message, "error");
    } finally {
      setIsLaunching(false);
    }
  }, [data, router, addToast]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: { x: 0, opacity: 1, filter: "blur(0px)" },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      filter: "blur(4px)",
    }),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="border-b border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              ← Back to Dashboard
            </button>
            <h1
              className="text-lg font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Create Brand
            </h1>
            <button
              onClick={clearDraft}
              className="flex items-center gap-1 text-sm text-[var(--text-tertiary)] hover:text-[var(--error)] transition-colors"
              title="Clear draft"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear
            </button>
          </div>
          <WizardStepper currentStep={step} />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {step === 1 && (
              <StepBasics data={data} onChange={handleChange} />
            )}
            {step === 2 && (
              <StepIdentity data={data} onChange={handleChange} />
            )}
            {step === 3 && (
              <StepProducts data={data} onChange={handleChange} />
            )}
            {step === 4 && (
              <StepContent data={data} onChange={handleChange} />
            )}
            {step === 5 && (
              <StepChannels data={data} onChange={handleChange} />
            )}
            {step === 6 && (
              <StepReview
                data={data}
                onLaunch={handleLaunch}
                isLaunching={isLaunching}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-[var(--border-primary)] bg-[var(--bg-surface)]">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <span className="text-sm text-[var(--text-tertiary)]">
            Step {step} of {WIZARD_STEPS.length}
          </span>

          {step < WIZARD_STEPS.length ? (
            <Button
              variant="brand"
              onClick={goNext}
              disabled={!canProceed()}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <div />
          )}
        </div>
      </footer>
    </div>
  );
}
