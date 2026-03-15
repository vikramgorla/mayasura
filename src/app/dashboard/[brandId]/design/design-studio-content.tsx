"use client";

import { useState, useCallback } from "react";
import { Save, Check } from "lucide-react";
import { getTemplate } from "@/lib/templates/website-templates";
import { TemplateGallery } from "@/components/design/template-gallery";
import { ColorControls } from "@/components/design/color-controls";
import { FontControls } from "@/components/design/font-controls";
import { DeviceToggle } from "@/components/design/device-toggle";
import { SitePreview } from "@/components/site-preview";

interface BrandData {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  accentColor: string | null;
  fontHeading: string | null;
  fontBody: string | null;
  websiteTemplate: string | null;
}

type ViewMode = "desktop" | "tablet" | "mobile";
type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DesignStudioContent({ brand }: { brand: BrandData }) {
  // Get initial template
  const initialTemplate = getTemplate(brand.websiteTemplate || "minimal")!;

  // State
  const [templateId, setTemplateId] = useState(
    brand.websiteTemplate || "minimal"
  );
  const [primaryColor, setPrimaryColor] = useState(
    brand.primaryColor || initialTemplate.colors.light.text
  );
  const [secondaryColor, setSecondaryColor] = useState(
    brand.secondaryColor || initialTemplate.colors.light.background
  );
  const [accentColor, setAccentColor] = useState(
    brand.accentColor || initialTemplate.colors.light.accent
  );
  const [fontHeading, setFontHeading] = useState(
    brand.fontHeading || initialTemplate.fonts.heading
  );
  const [fontBody, setFontBody] = useState(
    brand.fontBody || initialTemplate.fonts.body
  );
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const handleTemplateSelect = useCallback(
    (id: string) => {
      setTemplateId(id);
      const t = getTemplate(id);
      if (t) {
        // Optionally update to template defaults
        setPrimaryColor(t.colors.light.text);
        setSecondaryColor(t.colors.light.background);
        setAccentColor(t.colors.light.accent);
        setFontHeading(t.fonts.heading);
        setFontBody(t.fonts.body);
      }
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/v1/brands/${brand.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteTemplate: templateId,
          primaryColor,
          secondaryColor,
          accentColor,
          fontHeading,
          fontBody,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, [
    brand.id,
    templateId,
    primaryColor,
    secondaryColor,
    accentColor,
    fontHeading,
    fontBody,
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Design Studio
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Customize your brand&apos;s look and feel
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DeviceToggle viewMode={viewMode} onChange={setViewMode} />

          <button
            onClick={handleSave}
            disabled={saveStatus === "saving"}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 ${
              saveStatus === "saved"
                ? "bg-green-600 text-white"
                : saveStatus === "error"
                  ? "bg-red-600 text-white"
                  : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
            }`}
          >
            {saveStatus === "saving" ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Saved
              </>
            ) : saveStatus === "error" ? (
              "Error — Try Again"
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main layout: controls + preview */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Controls sidebar */}
        <div className="space-y-6 order-2 lg:order-1">
          <TemplateGallery
            selectedId={templateId}
            onSelect={handleTemplateSelect}
          />

          <ColorControls
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            onPrimaryChange={setPrimaryColor}
            onSecondaryChange={setSecondaryColor}
            onAccentChange={setAccentColor}
          />

          <FontControls
            fontHeading={fontHeading}
            fontBody={fontBody}
            brandName={brand.name}
            onHeadingChange={setFontHeading}
            onBodyChange={setFontBody}
          />
        </div>

        {/* Live Preview */}
        <div className="order-1 lg:order-2">
          <div className="sticky top-6">
            <div className="flex items-center justify-center p-6 rounded-xl border border-[var(--border-primary)] bg-[var(--bg-secondary)] min-h-[400px]">
              <SitePreview
                brandName={brand.name}
                tagline={brand.tagline || ""}
                templateId={templateId}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
                accentColor={accentColor}
                fontHeading={fontHeading}
                fontBody={fontBody}
                products={[]}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
