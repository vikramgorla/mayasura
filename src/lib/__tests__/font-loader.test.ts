import { describe, it, expect } from 'vitest';
import { buildGoogleFontsUrl, TEMPLATE_FONTS } from '../font-loader';

describe('buildGoogleFontsUrl', () => {
  it('should build a valid Google Fonts URL for a single font', () => {
    const url = buildGoogleFontsUrl(['Inter']);
    expect(url).toContain('https://fonts.googleapis.com/css2');
    expect(url).toContain('family=Inter');
    expect(url).toContain('display=swap');
  });

  it('should build a URL for multiple fonts', () => {
    const url = buildGoogleFontsUrl(['Plus Jakarta Sans', 'Inter']);
    expect(url).toContain('family=Plus+Jakarta+Sans');
    expect(url).toContain('family=Inter');
  });

  it('should replace spaces with + in font names', () => {
    const url = buildGoogleFontsUrl(['Source Serif 4']);
    expect(url).toContain('family=Source+Serif+4');
    expect(url).not.toContain('Source Serif 4');
  });

  it('should include weight specifications', () => {
    const url = buildGoogleFontsUrl(['Inter']);
    expect(url).toMatch(/wght@[\d;]+/);
  });

  it('should use template-specific weights when templateId is provided', () => {
    const minimalUrl = buildGoogleFontsUrl(['Inter'], 'minimal');
    const boldUrl = buildGoogleFontsUrl(['Inter'], 'bold');
    // Minimal uses 300,400,500 — Bold uses 400,500,700
    expect(minimalUrl).toContain('300');
    expect(boldUrl).not.toContain('300');
    expect(boldUrl).toContain('700');
  });

  it('should filter out empty font names', () => {
    const url = buildGoogleFontsUrl(['Inter', '', 'DM Sans']);
    expect(url).toContain('family=Inter');
    expect(url).toContain('family=DM+Sans');
    // Should not have empty family= entries
    expect(url).not.toContain('family=&');
  });

  it('should use default weights for unknown template IDs', () => {
    const url = buildGoogleFontsUrl(['Inter'], 'unknown-template');
    // Default weights: 300, 400, 500, 600, 700, 800
    expect(url).toContain('300');
    expect(url).toContain('800');
  });
});

describe('TEMPLATE_FONTS', () => {
  it('should have font mappings for all 5 templates', () => {
    expect(TEMPLATE_FONTS.minimal).toBeDefined();
    expect(TEMPLATE_FONTS.editorial).toBeDefined();
    expect(TEMPLATE_FONTS.bold).toBeDefined();
    expect(TEMPLATE_FONTS.classic).toBeDefined();
    expect(TEMPLATE_FONTS.playful).toBeDefined();
  });

  it('should have 2 fonts per template (heading + body)', () => {
    for (const [, fonts] of Object.entries(TEMPLATE_FONTS)) {
      expect(fonts).toHaveLength(2);
    }
  });

  it('should match the fonts defined in website templates', () => {
    expect(TEMPLATE_FONTS.minimal).toContain('Plus Jakarta Sans');
    expect(TEMPLATE_FONTS.minimal).toContain('Inter');
    expect(TEMPLATE_FONTS.editorial).toContain('Playfair Display');
    expect(TEMPLATE_FONTS.bold).toContain('Space Grotesk');
    expect(TEMPLATE_FONTS.classic).toContain('Source Serif 4');
    expect(TEMPLATE_FONTS.playful).toContain('DM Sans');
  });
});
