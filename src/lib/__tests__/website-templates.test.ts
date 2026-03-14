import { describe, it, expect } from 'vitest';
import {
  WEBSITE_TEMPLATES,
  getWebsiteTemplate,
  suggestTemplateForIndustry,
  type WebsiteTemplate,
} from '../website-templates';

describe('WEBSITE_TEMPLATES', () => {
  it('should have exactly 5 templates', () => {
    expect(WEBSITE_TEMPLATES).toHaveLength(5);
  });

  it('should have unique IDs', () => {
    const ids = WEBSITE_TEMPLATES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have all required fields on every template', () => {
    for (const template of WEBSITE_TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.bestFor).toBeInstanceOf(Array);
      expect(template.bestFor.length).toBeGreaterThan(0);
      expect(template.fonts.heading).toBeTruthy();
      expect(template.fonts.body).toBeTruthy();
      expect(template.fonts.headingWeight).toBeTruthy();
      expect(template.colors.light).toBeDefined();
      expect(template.colors.dark).toBeDefined();
      expect(template.preview).toBeDefined();
    }
  });

  it('should have valid color hex codes', () => {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    for (const template of WEBSITE_TEMPLATES) {
      for (const mode of ['light', 'dark'] as const) {
        const colors = template.colors[mode];
        expect(colors.text).toMatch(hexRegex);
        expect(colors.background).toMatch(hexRegex);
        expect(colors.accent).toMatch(hexRegex);
        expect(colors.surface).toMatch(hexRegex);
        expect(colors.muted).toMatch(hexRegex);
        expect(colors.border).toMatch(hexRegex);
      }
    }
  });

  it('should contain expected template IDs', () => {
    const ids = WEBSITE_TEMPLATES.map(t => t.id);
    expect(ids).toContain('minimal');
    expect(ids).toContain('editorial');
    expect(ids).toContain('bold');
    expect(ids).toContain('classic');
    expect(ids).toContain('playful');
  });

  it('should have valid preview configurations', () => {
    const heroStyles = ['centered', 'left-aligned', 'split', 'full-width', 'stacked'];
    const cardStyles = ['minimal', 'bordered', 'elevated', 'flat', 'rounded'];
    const navStyles = ['minimal', 'centered', 'spread', 'classic', 'playful'];
    const spacings = ['compact', 'normal', 'generous', 'spacious'];
    const accentUsages = ['minimal', 'moderate', 'bold'];

    for (const template of WEBSITE_TEMPLATES) {
      expect(heroStyles).toContain(template.preview.heroStyle);
      expect(cardStyles).toContain(template.preview.cardStyle);
      expect(navStyles).toContain(template.preview.navStyle);
      expect(spacings).toContain(template.preview.spacing);
      expect(accentUsages).toContain(template.preview.accentUsage);
    }
  });
});

describe('getWebsiteTemplate', () => {
  it('should return a template by ID', () => {
    const result = getWebsiteTemplate('minimal');
    expect(result).toBeDefined();
    expect(result!.id).toBe('minimal');
    expect(result!.name).toBe('Minimal');
  });

  it('should return undefined for non-existent ID', () => {
    const result = getWebsiteTemplate('non-existent');
    expect(result).toBeUndefined();
  });

  it('should return correct template for each known ID', () => {
    const ids = ['minimal', 'editorial', 'bold', 'classic', 'playful'];
    for (const id of ids) {
      const result = getWebsiteTemplate(id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(id);
    }
  });
});

describe('suggestTemplateForIndustry', () => {
  it('should return all template IDs', () => {
    const result = suggestTemplateForIndustry('tech');
    expect(result).toHaveLength(WEBSITE_TEMPLATES.length);
  });

  it('should prioritize templates matching the industry', () => {
    // 'tech' is in minimal and bold bestFor arrays
    const result = suggestTemplateForIndustry('tech');
    const topTwo = result.slice(0, 2);
    expect(topTwo).toContain('minimal');
    expect(topTwo).toContain('bold');
  });

  it('should prioritize editorial for food/restaurant', () => {
    const result = suggestTemplateForIndustry('restaurant');
    expect(result[0]).toBe('editorial');
  });

  it('should prioritize classic for healthcare', () => {
    const result = suggestTemplateForIndustry('healthcare');
    expect(result[0]).toBe('classic');
  });

  it('should prioritize playful for pets/kids', () => {
    const resultKids = suggestTemplateForIndustry('kids');
    expect(resultKids[0]).toBe('playful');

    const resultPets = suggestTemplateForIndustry('pets');
    expect(resultPets[0]).toBe('playful');
  });

  it('should handle case-insensitive input', () => {
    const lower = suggestTemplateForIndustry('tech');
    const upper = suggestTemplateForIndustry('TECH');
    const mixed = suggestTemplateForIndustry('Tech');
    expect(lower).toEqual(upper);
    expect(lower).toEqual(mixed);
  });

  it('should handle unknown industries by returning all templates', () => {
    const result = suggestTemplateForIndustry('unknown-industry-xyz');
    expect(result).toHaveLength(WEBSITE_TEMPLATES.length);
  });
});
