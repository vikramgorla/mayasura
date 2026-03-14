import { describe, it, expect } from 'vitest';
import { STARTER_TEMPLATES, getTemplate, templateToBrandData } from '@/lib/templates';

describe('Starter Templates', () => {
  it('has 10 templates', () => {
    expect(STARTER_TEMPLATES).toHaveLength(10);
  });

  it('each template has required fields', () => {
    STARTER_TEMPLATES.forEach(template => {
      expect(template.id).toBeTruthy();
      expect(template.name).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.emoji).toBeTruthy();
      expect(template.industry).toBeTruthy();
      expect(template.products.length).toBeGreaterThan(0);
      expect(template.channels.length).toBeGreaterThan(0);
      expect(template.toneKeywords.length).toBeGreaterThan(0);
    });
  });

  it('each template has valid color codes', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    STARTER_TEMPLATES.forEach(template => {
      expect(template.primaryColor).toMatch(hexRegex);
      expect(template.secondaryColor).toMatch(hexRegex);
      expect(template.accentColor).toMatch(hexRegex);
    });
  });

  it('getTemplate returns correct template', () => {
    const template = getTemplate('restaurant');
    expect(template).toBeDefined();
    expect(template?.name).toBe('Artisan Kitchen');
  });

  it('getTemplate returns undefined for invalid id', () => {
    expect(getTemplate('nonexistent')).toBeUndefined();
  });

  it('templateToBrandData converts correctly', () => {
    const template = STARTER_TEMPLATES[0];
    const brandData = templateToBrandData(template);
    
    expect(brandData.name).toBe(template.name);
    expect(brandData.tagline).toBe(template.tagline);
    expect(brandData.industry).toBe(template.industry);
    expect(brandData.primaryColor).toBe(template.primaryColor);
    expect(brandData.products).toEqual(template.products);
    expect(brandData.channels).toEqual(template.channels);
    expect(brandData.templateId).toBe(template.id);
    expect(brandData.status).toBe('draft');
  });

  it('each template has unique id', () => {
    const ids = STARTER_TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all template channels are valid', () => {
    const validChannels = ['website', 'chatbot', 'ecommerce', 'email', 'social', 'push', 'crm'];
    STARTER_TEMPLATES.forEach(template => {
      template.channels.forEach(ch => {
        expect(validChannels).toContain(ch);
      });
    });
  });
});
