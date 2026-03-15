/**
 * Design Studio CSS variable generation.
 * Used identically in Design Studio preview and consumer site layout.
 * This guarantees preview = reality (Constitution Principle III).
 */

import { getTextOnColor } from "./font-utils";

export interface DesignSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor?: string;
  mutedColor?: string;
  surfaceColor?: string;
  borderColor?: string;
  borderRadius?: string;
  buttonShape?: "sharp" | "soft" | "rounded" | "pill";
  buttonSize?: "small" | "medium" | "large";
  buttonVariant?: "solid" | "outline" | "ghost";
  spacingDensity?: "compact" | "normal" | "generous" | "spacious";
}

const SPACING_MAP: Record<string, { section: string; gap: string }> = {
  compact: { section: "32px", gap: "12px" },
  normal: { section: "48px", gap: "16px" },
  generous: { section: "64px", gap: "20px" },
  spacious: { section: "96px", gap: "24px" },
};

const BUTTON_SHAPE_MAP: Record<string, string> = {
  sharp: "0px",
  soft: "4px",
  rounded: "8px",
  pill: "9999px",
};

const BUTTON_SIZE_MAP: Record<
  string,
  { px: string; py: string; fontSize: string }
> = {
  small: { px: "16px", py: "8px", fontSize: "13px" },
  medium: { px: "24px", py: "12px", fontSize: "14px" },
  large: { px: "28px", py: "14px", fontSize: "15px" },
};

/**
 * Convert design settings into CSS custom properties.
 * Used by both preview component and consumer site layout.
 */
export function designSettingsToCSSVars(
  settings: DesignSettings
): Record<string, string> {
  const spacing = SPACING_MAP[settings.spacingDensity || "normal"];
  const buttonShape = BUTTON_SHAPE_MAP[settings.buttonShape || "rounded"];
  const buttonSize = BUTTON_SIZE_MAP[settings.buttonSize || "medium"];
  const accentText = getTextOnColor(settings.accentColor || "#5B21B6");

  return {
    "--brand-primary": settings.primaryColor,
    "--brand-secondary": settings.secondaryColor,
    "--brand-accent": settings.accentColor,
    "--brand-accent-text": accentText,
    "--brand-text": settings.textColor || settings.primaryColor,
    "--brand-muted": settings.mutedColor || `${settings.primaryColor}99`,
    "--brand-surface": settings.surfaceColor || settings.secondaryColor,
    "--brand-border": settings.borderColor || `${settings.primaryColor}20`,
    "--brand-radius": settings.borderRadius || "8px",
    "--brand-button-radius": buttonShape,
    "--brand-button-px": buttonSize.px,
    "--brand-button-py": buttonSize.py,
    "--brand-button-font-size": buttonSize.fontSize,
    "--brand-section-padding": spacing.section,
    "--brand-card-gap": spacing.gap,
  };
}

/** Preset color palettes for the Design Studio */
export const COLOR_PALETTES = [
  {
    name: "Midnight Indigo",
    primary: "#1E1B4B",
    secondary: "#312E81",
    accent: "#6366F1",
  },
  {
    name: "Warm Terra",
    primary: "#431407",
    secondary: "#7C2D12",
    accent: "#EA580C",
  },
  {
    name: "Ocean Breeze",
    primary: "#0C4A6E",
    secondary: "#0369A1",
    accent: "#38BDF8",
  },
  {
    name: "Forest Sage",
    primary: "#14532D",
    secondary: "#166534",
    accent: "#22C55E",
  },
  {
    name: "Rose Gold",
    primary: "#4C1D95",
    secondary: "#831843",
    accent: "#F472B6",
  },
  {
    name: "Charcoal Amber",
    primary: "#1C1917",
    secondary: "#292524",
    accent: "#F59E0B",
  },
  {
    name: "Nordic Frost",
    primary: "#1E293B",
    secondary: "#334155",
    accent: "#94A3B8",
  },
  {
    name: "Sunset Coral",
    primary: "#7C2D12",
    secondary: "#9A3412",
    accent: "#FB923C",
  },
  {
    name: "Deep Violet",
    primary: "#18181B",
    secondary: "#FAFAF9",
    accent: "#7C3AED",
  },
  {
    name: "Emerald Night",
    primary: "#064E3B",
    secondary: "#065F46",
    accent: "#34D399",
  },
  {
    name: "Crimson Edge",
    primary: "#1C1917",
    secondary: "#292524",
    accent: "#EF4444",
  },
  {
    name: "Sky Canvas",
    primary: "#0F172A",
    secondary: "#F8FAFC",
    accent: "#3B82F6",
  },
  {
    name: "Honey Butter",
    primary: "#451A03",
    secondary: "#FEF3C7",
    accent: "#D97706",
  },
  {
    name: "Slate Minimal",
    primary: "#18181B",
    secondary: "#FAFAFA",
    accent: "#18181B",
  },
  {
    name: "Teal Depths",
    primary: "#134E4A",
    secondary: "#0F766E",
    accent: "#2DD4BF",
  },
  {
    name: "Plum Velvet",
    primary: "#581C87",
    secondary: "#701A75",
    accent: "#D946EF",
  },
];
