"use client";

import { WEBSITE_TEMPLATES } from "@/lib/templates/website-templates";
import { Check } from "lucide-react";

interface TemplateGalleryProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function TemplateGallery({ selectedId, onSelect }: TemplateGalleryProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Template
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {WEBSITE_TEMPLATES.map((t) => {
          const isSelected = t.id === selectedId;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`relative text-left p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-[var(--accent)] bg-[var(--accent-light)]"
                  : "border-[var(--border-primary)] hover:border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              {/* Mini preview */}
              <div
                className="h-16 rounded mb-2 flex flex-col overflow-hidden"
                style={{
                  backgroundColor: t.colors.light.background,
                  border: `1px solid ${t.colors.light.border}`,
                }}
              >
                {/* Mini nav */}
                <div
                  className="h-3 flex items-center px-2 gap-1"
                  style={{
                    borderBottom: `1px solid ${t.colors.light.border}`,
                  }}
                >
                  <div
                    className="h-1 w-6 rounded-full"
                    style={{ backgroundColor: t.colors.light.text }}
                  />
                  <div className="flex-1" />
                  <div
                    className="h-1 w-3 rounded-full"
                    style={{ backgroundColor: t.colors.light.accent }}
                  />
                </div>
                {/* Mini hero */}
                <div className="flex-1 flex items-center justify-center px-2">
                  <div className="space-y-1 w-full">
                    <div
                      className="h-1.5 rounded-full w-3/4 mx-auto"
                      style={{ backgroundColor: t.colors.light.text }}
                    />
                    <div
                      className="h-1 rounded-full w-1/2 mx-auto"
                      style={{
                        backgroundColor: t.colors.light.muted,
                        opacity: 0.5,
                      }}
                    />
                  </div>
                </div>
                {/* Mini cards */}
                <div className="flex gap-1 px-2 pb-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-1 h-3 rounded-sm"
                      style={{
                        backgroundColor: t.colors.light.surface,
                        border: `1px solid ${t.colors.light.border}`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                {t.name}
              </p>
              <p className="text-[10px] text-[var(--text-tertiary)] truncate">
                {t.bestFor[0]}
              </p>

              {isSelected && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-[var(--accent)] flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
