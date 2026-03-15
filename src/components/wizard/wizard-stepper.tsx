"use client";

import { Check } from "lucide-react";
import { WIZARD_STEPS } from "@/lib/types/wizard";

interface WizardStepperProps {
  currentStep: number;
}

export function WizardStepper({ currentStep }: WizardStepperProps) {
  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-1 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-6">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100}%`,
            background: "var(--gradient-brand)",
            boxShadow: "0 0 8px var(--accent-glow)",
          }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex items-center justify-between">
        {WIZARD_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-white shadow-lg"
                    : isCompleted
                      ? "text-white"
                      : "border border-[var(--border-primary)] text-[var(--text-tertiary)] bg-[var(--bg-surface)]"
                }`}
                style={
                  isActive
                    ? {
                        background: "var(--gradient-brand)",
                        boxShadow: "0 0 16px var(--accent-glow)",
                        transform: "scale(1.1)",
                      }
                    : isCompleted
                      ? {
                          background:
                            "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
                        }
                      : undefined
                }
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isActive
                    ? "text-[var(--accent)]"
                    : isCompleted
                      ? "text-[var(--text-secondary)]"
                      : "text-[var(--text-tertiary)]"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
