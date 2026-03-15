"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Monitor, Tablet, Smartphone, Rocket } from "lucide-react";
import { SitePreview } from "@/components/site-preview";
import type { WizardData } from "@/lib/types/wizard";
import { CHANNELS } from "@/lib/types/wizard";
import { TEMPLATE_MAP } from "@/lib/templates/website-templates";

interface StepReviewProps {
  data: WizardData;
  onLaunch: () => Promise<void>;
  isLaunching: boolean;
}

export function StepReview({ data, onLaunch, isLaunching }: StepReviewProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );

  const template = TEMPLATE_MAP.get(data.websiteTemplate);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h2
          className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Review & Launch
        </h2>
        <p className="text-[var(--text-secondary)] mt-1">
          Everything looks good? Let&apos;s build your palace.
        </p>
      </div>

      {/* Device Toggle + Preview */}
      <div className="space-y-3">
        <div className="flex justify-center gap-1">
          {(
            [
              { mode: "desktop", icon: Monitor, label: "Desktop" },
              { mode: "tablet", icon: Tablet, label: "Tablet" },
              { mode: "mobile", icon: Smartphone, label: "Mobile" },
            ] as const
          ).map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === mode
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <SitePreview
            brandName={data.name}
            tagline={data.tagline}
            templateId={data.websiteTemplate}
            primaryColor={data.primaryColor}
            secondaryColor={data.secondaryColor}
            accentColor={data.accentColor}
            fontHeading={data.fontHeading}
            fontBody={data.fontBody}
            products={data.products}
            viewMode={viewMode}
          />
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Brand Info */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Brand
          </h4>
          <p className="font-medium text-[var(--text-primary)]">{data.name}</p>
          {data.tagline && (
            <p className="text-sm text-[var(--text-secondary)]">
              {data.tagline}
            </p>
          )}
          {data.industry && (
            <Badge variant="secondary">{data.industry}</Badge>
          )}
        </div>

        {/* Colors */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Colors
          </h4>
          <div className="flex gap-2">
            {[
              { label: "Primary", color: data.primaryColor },
              { label: "Secondary", color: data.secondaryColor },
              { label: "Accent", color: data.accentColor },
            ].map(({ label, color }) => (
              <div key={label} className="text-center">
                <div
                  className="h-8 w-8 rounded-lg border border-[var(--border-primary)]"
                  style={{ backgroundColor: color }}
                />
                <span className="text-[10px] text-[var(--text-tertiary)] mt-1 block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Typography
          </h4>
          <div className="space-y-1">
            <p className="text-sm text-[var(--text-primary)]">
              <span className="text-[var(--text-tertiary)]">Heading:</span>{" "}
              <span style={{ fontFamily: data.fontHeading }}>
                {data.fontHeading}
              </span>
            </p>
            <p className="text-sm text-[var(--text-primary)]">
              <span className="text-[var(--text-tertiary)]">Body:</span>{" "}
              <span style={{ fontFamily: data.fontBody }}>{data.fontBody}</span>
            </p>
          </div>
          {template && <Badge variant="outline">{template.name}</Badge>}
        </div>

        {/* Products */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Products
          </h4>
          {data.products.length > 0 ? (
            <div className="space-y-1">
              {data.products.slice(0, 3).map((p) => (
                <p
                  key={p.id}
                  className="text-sm text-[var(--text-primary)] truncate"
                >
                  {p.name}
                  {p.price !== undefined && (
                    <span className="text-[var(--text-tertiary)] ml-1">
                      ${p.price.toFixed(2)}
                    </span>
                  )}
                </p>
              ))}
              {data.products.length > 3 && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  +{data.products.length - 3} more
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">
              No products added
            </p>
          )}
        </div>

        {/* Tone */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Voice & Tone
          </h4>
          {data.toneKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {data.toneKeywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="text-[10px]">
                  {kw}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-tertiary)]">Not set</p>
          )}
        </div>

        {/* Channels */}
        <div className="rounded-xl border border-[var(--border-primary)] bg-[var(--bg-surface)] p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
            Channels
          </h4>
          <div className="flex flex-wrap gap-1">
            {data.channels.map((ch) => {
              const channel = CHANNELS.find((c) => c.id === ch);
              return (
                <Badge key={ch} variant="secondary" className="text-[10px]">
                  {channel?.name || ch}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>

      {/* Launch Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="brand"
          size="xl"
          onClick={onLaunch}
          disabled={isLaunching || !data.name}
          className="min-w-[200px]"
        >
          {isLaunching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Building your palace...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              Launch Brand
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
