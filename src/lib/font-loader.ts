/**
 * Build a Google Fonts URL for the given font families.
 * Consumer sites load fonts dynamically based on brand settings,
 * so we can't use next/font here.
 */
export function buildGoogleFontsUrl(fonts: string[], templateId?: string): string {
  const families = fonts
    .filter(Boolean)
    .map(font => {
      const family = font.replace(/\s+/g, '+');
      // Load weights based on template needs
      const weights = FONT_WEIGHTS[templateId || 'default'] || FONT_WEIGHTS.default;
      return `family=${family}:wght@${weights.join(';')}`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Weight configurations per template
 */
const FONT_WEIGHTS: Record<string, number[]> = {
  default: [300, 400, 500, 600, 700, 800],
  minimal: [300, 400, 500],
  editorial: [400, 500, 600, 700],
  bold: [400, 500, 700],
  classic: [400, 500, 600],
  playful: [400, 500, 600, 700],
};

/**
 * Known template fonts that should be loaded
 */
export const TEMPLATE_FONTS: Record<string, string[]> = {
  minimal: ['Plus Jakarta Sans', 'Inter'],
  editorial: ['Playfair Display', 'Inter'],
  bold: ['Space Grotesk', 'Inter'],
  classic: ['Source Serif 4', 'Inter'],
  playful: ['DM Sans', 'Inter'],
};
