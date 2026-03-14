import { describe, it, expect } from 'vitest';
import { AVAILABLE_CHANNELS, TONE_OPTIONS, FONT_OPTIONS, INDUSTRY_CATEGORIES } from '@/lib/types';

describe('Type constants', () => {
  it('has 7 available channels', () => {
    expect(AVAILABLE_CHANNELS).toHaveLength(7);
  });

  it('includes website and chatbot channels', () => {
    const ids = AVAILABLE_CHANNELS.map(c => c.id);
    expect(ids).toContain('website');
    expect(ids).toContain('chatbot');
  });

  it('has 8 tone options', () => {
    expect(TONE_OPTIONS).toHaveLength(8);
  });

  it('has 34 font options', () => {
    expect(FONT_OPTIONS).toHaveLength(34);
  });

  it('has 10 industry categories', () => {
    expect(INDUSTRY_CATEGORIES).toHaveLength(10);
  });

  it('each channel has required fields', () => {
    AVAILABLE_CHANNELS.forEach(channel => {
      expect(channel).toHaveProperty('id');
      expect(channel).toHaveProperty('name');
      expect(channel).toHaveProperty('description');
      expect(channel).toHaveProperty('icon');
    });
  });

  it('each industry has id, name, and emoji', () => {
    INDUSTRY_CATEGORIES.forEach(cat => {
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('emoji');
      expect(cat.emoji.length).toBeGreaterThan(0);
    });
  });
});
