"use client";

import { useMemo } from "react";
import { AVAILABLE_FONTS } from "@/lib/templates/font-utils";

interface FontControlsProps {
  fontHeading: string;
  fontBody: string;
  brandName: string;
  onHeadingChange: (font: string) => void;
  onBodyChange: (font: string) => void;
}

const CATEGORIES = ["Sans-serif", "Serif", "Display", "Mono"] as const;

function FontSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (font: string) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, typeof AVAILABLE_FONTS>();
    for (const cat of CATEGORIES) {
      map.set(
        cat,
        AVAILABLE_FONTS.filter((f) => f.category === cat)
      );
    }
    return map;
  }, []);

  return (
    <div>
      <label className="text-xs font-medium text-[var(--text-secondary)] block mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded-lg border border-[var(--border-primary)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[var(--accent)]"
      >
        {CATEGORIES.map((cat) => (
          <optgroup key={cat} label={cat}>
            {grouped.get(cat)?.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

export function FontControls({
  fontHeading,
  fontBody,
  brandName,
  onHeadingChange,
  onBodyChange,
}: FontControlsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Typography
      </h3>

      <div className="space-y-3 mb-4">
        <FontSelect
          label="Heading Font"
          value={fontHeading}
          onChange={onHeadingChange}
        />
        <FontSelect
          label="Body Font"
          value={fontBody}
          onChange={onBodyChange}
        />
      </div>

      {/* Font preview */}
      <div className="p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <p className="text-xs text-[var(--text-tertiary)] mb-2">Preview</p>
        <p
          className="text-lg font-bold text-[var(--text-primary)] mb-1"
          style={{ fontFamily: `"${fontHeading}", system-ui, sans-serif` }}
        >
          {brandName || "Your Brand Name"}
        </p>
        <p
          className="text-sm text-[var(--text-secondary)]"
          style={{ fontFamily: `"${fontBody}", system-ui, sans-serif` }}
        >
          The quick brown fox jumps over the lazy dog. This is how your body
          text will look across your consumer website.
        </p>
      </div>
    </div>
  );
}
