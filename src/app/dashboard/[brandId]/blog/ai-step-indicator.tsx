"use client";

import { Check } from "lucide-react";

const STEPS = [
  { num: 1, label: "Topic" },
  { num: 2, label: "Outline" },
  { num: 3, label: "Article" },
  { num: 4, label: "SEO" },
];

interface AiStepIndicatorProps {
  currentStep: number;
}

export function AiStepIndicator({ currentStep }: AiStepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              currentStep > s.num
                ? "bg-green-500 text-white"
                : currentStep === s.num
                  ? "bg-violet-600 text-white"
                  : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)]"
            }`}
          >
            {currentStep > s.num ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              s.num
            )}
          </div>
          <span
            className={`text-xs hidden sm:inline ${
              currentStep === s.num
                ? "font-medium text-[var(--text-primary)]"
                : "text-[var(--text-tertiary)]"
            }`}
          >
            {s.label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 h-px"
              style={{
                backgroundColor:
                  currentStep > s.num
                    ? "var(--accent)"
                    : "var(--border-primary)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
