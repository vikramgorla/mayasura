import { describe, it, expect } from 'vitest';
import {
  STARTER_TEMPLATES,
  getTemplate,
  templateToBrandData,
  type StarterTemplate,
} from '../templates';
import { INDUSTRY_CATEGORIES, TONE_OPTIONS, FONT_OPTIONS } from '../types';

describe('STARTER_TEMPLATES', () => {
  it('should have 10 starter templates', () => {
    expect(STARTER_TEMPLATES).toHaveLength(10);
  });

  it('should have unique IDs', () => {
    const ids = STARTER_TEMPLATES.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have all required fields', () => {
    for (const template of STARTER_TEMPLATES) {
      expect(template.id).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.emoji).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.industry).toBeTruthy();
      expect(template.tagline).toBeTruthy();
      expect(template.brandDescription).toBeTruthy();
      expect(template.primaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(template.secondaryColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(template.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(template.fontHeading).toBeTruthy();
      expect(template.fontBody).toBeTruthy();
      expect(template.brandVoice).toBeTruthy();
      expect(template.toneKeywords).toBeInstanceOf(Array);
      expect(template.toneKeywords.length).toBeGreaterThan(0);
      expect(template.channels).toBeInstanceOf(Array);
      expect(template.channels.length).toBeGreaterThan(0);
      expect(template.products).toBeInstanceOf(Array);
      expect(template.products.length).toBeGreaterThanOrEqual(2);
      expect(template.chatbotPersona).toBeTruthy();
    }
  });

  it('should have products with required fields', () => {
    for (const template of STARTER_TEMPLATES) {
      for (const product of template.products) {
        expect(product.name).toBeTruthy();
        expect(product.description).toBeTruthy();
        expect(typeof product.price).toBe('number');
        expect(product.price).toBeGreaterThanOrEqual(0);
        expect(product.currency).toBe('USD');
        expect(product.category).toBeTruthy();
      }
    }
  });

  it('should use valid tone keywords', () => {
    const validTones = [...TONE_OPTIONS];
    for (const template of STARTER_TEMPLATES) {
      for (const keyword of template.toneKeywords) {
        expect(validTones).toContain(keyword);
      }
    }
  });

  it('should have channels from valid set', () => {
    const validChannels = ['website', 'chatbot', 'ecommerce', 'email', 'social', 'push', 'crm'];
    for (const template of STARTER_TEMPLATES) {
      for (const channel of template.channels) {
        expect(validChannels).toContain(channel);
      }
    }
  });
});

describe('getTemplate', () => {
  it('should return a template by ID', () => {
    const result = getTemplate('restaurant');
    expect(result).toBeDefined();
    expect(result!.id).toBe('restaurant');
    expect(result!.name).toBe('Artisan Kitchen');
  });

  it('should return undefined for non-existent ID', () => {
    expect(getTemplate('non-existent')).toBeUndefined();
  });

  it('should return correct template for each known ID', () => {
    const ids = ['restaurant', 'fashion', 'tech', 'fitness', 'education', 'realestate', 'beauty', 'music', 'retail', 'healthcare'];
    for (const id of ids) {
      const result = getTemplate(id);
      expect(result).toBeDefined();
      expect(result!.id).toBe(id);
    }
  });
});

describe('templateToBrandData', () => {
  it('should convert a starter template to BrandData', () => {
    const template = getTemplate('tech')!;
    const brandData = templateToBrandData(template);

    expect(brandData.name).toBe(template.name);
    expect(brandData.tagline).toBe(template.tagline);
    expect(brandData.industry).toBe(template.industry);
    expect(brandData.description).toBe(template.brandDescription);
    expect(brandData.primaryColor).toBe(template.primaryColor);
    expect(brandData.secondaryColor).toBe(template.secondaryColor);
    expect(brandData.accentColor).toBe(template.accentColor);
    expect(brandData.fontHeading).toBe(template.fontHeading);
    expect(brandData.fontBody).toBe(template.fontBody);
    expect(brandData.products).toEqual(template.products);
    expect(brandData.brandVoice).toBe(template.brandVoice);
    expect(brandData.toneKeywords).toEqual(template.toneKeywords);
    expect(brandData.channels).toEqual(template.channels);
    expect(brandData.status).toBe('draft');
    expect(brandData.templateId).toBe(template.id);
  });

  it('should always set status to draft', () => {
    for (const template of STARTER_TEMPLATES) {
      const brandData = templateToBrandData(template);
      expect(brandData.status).toBe('draft');
    }
  });

  it('should preserve all products', () => {
    const template = getTemplate('fashion')!;
    const brandData = templateToBrandData(template);
    expect(brandData.products).toHaveLength(template.products.length);
  });
});
