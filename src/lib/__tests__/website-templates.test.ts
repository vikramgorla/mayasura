import { describe, it, expect } from 'vitest';
import {
  WEBSITE_TEMPLATES,
  getWebsiteTemplate,
  suggestTemplateForIndustry,
  type WebsiteTemplate,
} from '../website-templates';

describe('WEBSITE_TEMPLATES', () => {
  it('should have at least 5 templates', () => {
    expect(WEBSITE_TEMPLATES.length).toBeGreaterThanOrEqual(5);
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

  it('should contain the 5 core template IDs', () => {
    const ids = WEBSITE_TEMPLATES.map(t => t.id);
    // These 5 are the original core templates; more may exist
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
    for (const t of WEBSITE_TEMPLATES) {
      const result = getWebsiteTemplate(t.id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(t.id);
    }
  });
});

describe('suggestTemplateForIndustry', () => {
  it('should return all template IDs sorted by relevance', () => {
    const result = suggestTemplateForIndustry('tech');
    expect(result).toHaveLength(WEBSITE_TEMPLATES.length);
    // Every template ID should be in the results
    for (const t of WEBSITE_TEMPLATES) {
      expect(result).toContain(t.id);
    }
  });

  it('should prioritize templates matching the industry', () => {
    // 'tech' is in the bestFor arrays of multiple templates
    const result = suggestTemplateForIndustry('tech');
    // Templates with 'tech' in bestFor should appear near the top
    const techTemplates = WEBSITE_TEMPLATES
      .filter(t => t.bestFor.includes('tech'))
      .map(t => t.id);
    // At least one tech-matching template should be in the top results
    const topResults = result.slice(0, techTemplates.length + 1);
    for (const id of techTemplates) {
      expect(topResults).toContain(id);
    }
  });

  it('should rank restaurant-matching templates high for restaurant', () => {
    const result = suggestTemplateForIndustry('restaurant');
    const restaurantTemplates = WEBSITE_TEMPLATES
      .filter(t => t.bestFor.includes('restaurant'))
      .map(t => t.id);
    if (restaurantTemplates.length > 0) {
      // First result should match restaurant
      expect(restaurantTemplates).toContain(result[0]);
    }
  });

  it('should rank healthcare-matching templates high for healthcare', () => {
    const result = suggestTemplateForIndustry('healthcare');
    const healthTemplates = WEBSITE_TEMPLATES
      .filter(t => t.bestFor.includes('healthcare'))
      .map(t => t.id);
    if (healthTemplates.length > 0) {
      expect(healthTemplates).toContain(result[0]);
    }
  });

  it('should rank playful-matching templates high for kids/pets', () => {
    const resultKids = suggestTemplateForIndustry('kids');
    const kidsTemplates = WEBSITE_TEMPLATES
      .filter(t => t.bestFor.includes('kids'))
      .map(t => t.id);
    if (kidsTemplates.length > 0) {
      expect(kidsTemplates).toContain(resultKids[0]);
    }
  });

  it('should handle case-insensitive input', () => {
    const lower = suggestTemplateForIndustry('tech');
    const upper = suggestTemplateForIndustry('TECH');
    const mixed = suggestTemplateForIndustry('Tech');
    expect(lower).toEqual(upper);
    expect(lower).toEqual(mixed);
  });

  it('should return all templates even for unknown industries', () => {
    const result = suggestTemplateForIndustry('unknown-industry-xyz');
    expect(result).toHaveLength(WEBSITE_TEMPLATES.length);
  });
});
