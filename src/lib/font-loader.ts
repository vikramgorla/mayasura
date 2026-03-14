/**
 * Build a Google Fonts URL for the given font families.
 * Consumer sites load fonts dynamically based on brand settings,
 * so we can't use next/font here.
 */
export function buildGoogleFontsUrl(fonts: string[]): string {
  const families = fonts
    .filter(Boolean)
    .map(font => {
      const family = font.replace(/\s+/g, '+');
      // Load common weights for each font
      return `family=${family}:wght@400;500;600;700;800`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

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
