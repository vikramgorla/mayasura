"use client";

import { COLOR_PALETTES } from "@/lib/templates/design-utils";
import { Check, Sparkles } from "lucide-react";

interface ColorControlsProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  onAccentChange: (color: string) => void;
  onGeneratePalette?: () => void;
  generating?: boolean;
}

function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className="h-9 w-9 rounded-lg border border-[var(--border-primary)] cursor-pointer"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
          aria-label={`${label} color picker`}
        />
      </div>
      <div className="flex-1">
        <label className="text-xs font-medium text-[var(--text-secondary)] block">
          {label}
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
          }}
          className="text-xs font-mono text-[var(--text-primary)] bg-transparent w-20 outline-none"
          maxLength={7}
        />
      </div>
    </div>
  );
}

export function ColorControls({
  primaryColor,
  secondaryColor,
  accentColor,
  onPrimaryChange,
  onSecondaryChange,
  onAccentChange,
  onGeneratePalette,
  generating,
}: ColorControlsProps) {
  const handlePaletteSelect = (palette: (typeof COLOR_PALETTES)[0]) => {
    onPrimaryChange(palette.primary);
    onSecondaryChange(palette.secondary);
    onAccentChange(palette.accent);
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
        Colors
      </h3>

      {/* Color pickers */}
      <div className="space-y-3 mb-4">
        <ColorPicker
          label="Primary"
          value={primaryColor}
          onChange={onPrimaryChange}
        />
        <ColorPicker
          label="Secondary"
          value={secondaryColor}
          onChange={onSecondaryChange}
        />
        <ColorPicker
          label="Accent"
          value={accentColor}
          onChange={onAccentChange}
        />
      </div>

      {/* AI Generate */}
      {onGeneratePalette && (
        <button
          onClick={onGeneratePalette}
          disabled={generating}
          className="w-full mb-4 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {generating ? "Generating..." : "AI Generate Palette"}
        </button>
      )}

      {/* Presets */}
      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
          Presets
        </p>
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PALETTES.map((p) => {
            const isSelected =
              p.primary === primaryColor &&
              p.secondary === secondaryColor &&
              p.accent === accentColor;

            return (
              <button
                key={p.name}
                onClick={() => handlePaletteSelect(p)}
                className="relative group"
                title={p.name}
              >
                <div className="flex h-7 rounded-md overflow-hidden border border-[var(--border-primary)]">
                  <div className="flex-1" style={{ backgroundColor: p.primary }} />
                  <div className="flex-1" style={{ backgroundColor: p.secondary }} />
                  <div className="flex-1" style={{ backgroundColor: p.accent }} />
                </div>
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-white drop-shadow" />
                  </div>
                )}
                <p className="text-[9px] text-[var(--text-tertiary)] mt-0.5 truncate">
                  {p.name}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
