/**
 * Font utilities for consumer sites.
 * Builds Google Fonts URLs and provides fallback stacks.
 */

const FONT_FALLBACKS: Record<string, string> = {
  "Plus Jakarta Sans": "Inter, system-ui, sans-serif",
  Inter: "system-ui, -apple-system, sans-serif",
  "Playfair Display": "Georgia, serif",
  "Space Grotesk": "Inter, system-ui, sans-serif",
  "Source Serif 4": "Georgia, serif",
  "DM Sans": "Inter, system-ui, sans-serif",
  Sora: "Inter, system-ui, sans-serif",
  Outfit: "Inter, system-ui, sans-serif",
  Lora: "Georgia, serif",
  "Cormorant Garamond": "Georgia, serif",
  "JetBrains Mono": "monospace",
  Raleway: "Inter, system-ui, sans-serif",
  Nunito: "Inter, system-ui, sans-serif",
  Lato: "Inter, system-ui, sans-serif",
  "Source Sans 3": "Inter, system-ui, sans-serif",
};

/** All available font options for the design studio */
export const AVAILABLE_FONTS = [
  // Sans-serif
  { name: "Inter", category: "Sans-serif" },
  { name: "Plus Jakarta Sans", category: "Sans-serif" },
  { name: "DM Sans", category: "Sans-serif" },
  { name: "Sora", category: "Sans-serif" },
  { name: "Outfit", category: "Sans-serif" },
  { name: "Raleway", category: "Sans-serif" },
  { name: "Nunito", category: "Sans-serif" },
  { name: "Lato", category: "Sans-serif" },
  { name: "Source Sans 3", category: "Sans-serif" },
  { name: "Space Grotesk", category: "Sans-serif" },
  { name: "Montserrat", category: "Sans-serif" },
  { name: "Poppins", category: "Sans-serif" },
  { name: "Work Sans", category: "Sans-serif" },
  { name: "Manrope", category: "Sans-serif" },
  { name: "Rubik", category: "Sans-serif" },
  { name: "Figtree", category: "Sans-serif" },
  { name: "Geist", category: "Sans-serif" },
  // Serif
  { name: "Playfair Display", category: "Serif" },
  { name: "Source Serif 4", category: "Serif" },
  { name: "Lora", category: "Serif" },
  { name: "Cormorant Garamond", category: "Serif" },
  { name: "Merriweather", category: "Serif" },
  { name: "Libre Baskerville", category: "Serif" },
  { name: "Bitter", category: "Serif" },
  { name: "Crimson Text", category: "Serif" },
  { name: "EB Garamond", category: "Serif" },
  { name: "Noto Serif", category: "Serif" },
  // Display
  { name: "Abril Fatface", category: "Display" },
  { name: "Righteous", category: "Display" },
  { name: "Passion One", category: "Display" },
  { name: "Titan One", category: "Display" },
  // Mono
  { name: "JetBrains Mono", category: "Mono" },
  { name: "Fira Code", category: "Mono" },
  { name: "IBM Plex Mono", category: "Mono" },
];

/**
 * Build a Google Fonts URL for a heading + body font pair.
 * Deduplicates if both are the same font.
 */
export function buildGoogleFontsUrl(
  headingFont: string,
  bodyFont: string,
  weights: string[] = ["300", "400", "500", "600", "700", "800"]
): string {
  const fonts = new Set([headingFont, bodyFont]);
  const families = Array.from(fonts)
    .map(
      (font) =>
        `family=${font.replace(/\s+/g, "+")}:wght@${weights.join(";")}`
    )
    .join("&");

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Get the full font-family CSS value with fallbacks.
 */
export function getFontFamily(fontName: string): string {
  const fallback = FONT_FALLBACKS[fontName] || "system-ui, sans-serif";
  return `"${fontName}", ${fallback}`;
}

/**
 * Get the text color that provides best contrast on a given background.
 */
export function getTextOnColor(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
