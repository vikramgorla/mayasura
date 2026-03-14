import { describe, it, expect } from 'vitest';
import {
  AVAILABLE_CHANNELS,
  TONE_OPTIONS,
  FONT_OPTIONS,
  FONT_OPTIONS_GROUPED,
  INDUSTRY_CATEGORIES,
  type FontOption,
} from '../types';

describe('AVAILABLE_CHANNELS', () => {
  it('should have 7 channels', () => {
    expect(AVAILABLE_CHANNELS).toHaveLength(7);
  });

  it('should have unique IDs', () => {
    const ids = AVAILABLE_CHANNELS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should include expected channels', () => {
    const ids = AVAILABLE_CHANNELS.map(c => c.id);
    expect(ids).toContain('website');
    expect(ids).toContain('chatbot');
    expect(ids).toContain('ecommerce');
    expect(ids).toContain('email');
    expect(ids).toContain('social');
    expect(ids).toContain('push');
    expect(ids).toContain('crm');
  });

  it('should have name, description, and icon for each channel', () => {
    for (const channel of AVAILABLE_CHANNELS) {
      expect(channel.id).toBeTruthy();
      expect(channel.name).toBeTruthy();
      expect(channel.description).toBeTruthy();
      expect(channel.icon).toBeTruthy();
    }
  });
});

describe('TONE_OPTIONS', () => {
  it('should have 8 tone options', () => {
    expect(TONE_OPTIONS).toHaveLength(8);
  });

  it('should have unique values', () => {
    expect(new Set(TONE_OPTIONS).size).toBe(TONE_OPTIONS.length);
  });

  it('should include expected tones', () => {
    expect(TONE_OPTIONS).toContain('Professional');
    expect(TONE_OPTIONS).toContain('Casual & Friendly');
    expect(TONE_OPTIONS).toContain('Bold & Confident');
    expect(TONE_OPTIONS).toContain('Warm & Caring');
    expect(TONE_OPTIONS).toContain('Minimalist & Clean');
    expect(TONE_OPTIONS).toContain('Playful & Fun');
    expect(TONE_OPTIONS).toContain('Luxurious & Premium');
    expect(TONE_OPTIONS).toContain('Technical & Expert');
  });

  it('should not be empty strings', () => {
    for (const tone of TONE_OPTIONS) {
      expect(tone.trim()).toBeTruthy();
    }
  });
});

describe('FONT_OPTIONS_GROUPED', () => {
  it('should have 34 fonts', () => {
    expect(FONT_OPTIONS_GROUPED).toHaveLength(34);
  });

  it('should have unique font names', () => {
    const names = FONT_OPTIONS_GROUPED.map(f => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('should categorize fonts correctly', () => {
    const categories = new Set(FONT_OPTIONS_GROUPED.map(f => f.category));
    expect(categories).toContain('sans-serif');
    expect(categories).toContain('serif');
    expect(categories).toContain('display');
    expect(categories).toContain('monospace');
  });

  it('should have 15 sans-serif fonts', () => {
    const sansSerif = FONT_OPTIONS_GROUPED.filter(f => f.category === 'sans-serif');
    expect(sansSerif.length).toBe(15);
  });

  it('should have 10 serif fonts', () => {
    const serif = FONT_OPTIONS_GROUPED.filter(f => f.category === 'serif');
    expect(serif.length).toBe(10);
  });

  it('should have 6 display fonts', () => {
    const display = FONT_OPTIONS_GROUPED.filter(f => f.category === 'display');
    expect(display.length).toBe(6);
  });

  it('should have 3 monospace fonts', () => {
    const mono = FONT_OPTIONS_GROUPED.filter(f => f.category === 'monospace');
    expect(mono.length).toBe(3);
  });

  it('should include Inter as a sans-serif font', () => {
    const inter = FONT_OPTIONS_GROUPED.find(f => f.name === 'Inter');
    expect(inter).toBeDefined();
    expect(inter!.category).toBe('sans-serif');
  });

  it('should include Playfair Display as a serif font', () => {
    const playfair = FONT_OPTIONS_GROUPED.find(f => f.name === 'Playfair Display');
    expect(playfair).toBeDefined();
    expect(playfair!.category).toBe('serif');
  });

  it('should include JetBrains Mono as a monospace font', () => {
    const jetbrains = FONT_OPTIONS_GROUPED.find(f => f.name === 'JetBrains Mono');
    expect(jetbrains).toBeDefined();
    expect(jetbrains!.category).toBe('monospace');
  });
});

describe('FONT_OPTIONS (flat list)', () => {
  it('should be derived from FONT_OPTIONS_GROUPED', () => {
    expect(FONT_OPTIONS).toHaveLength(FONT_OPTIONS_GROUPED.length);
  });

  it('should contain only font names (strings)', () => {
    for (const name of FONT_OPTIONS) {
      expect(typeof name).toBe('string');
      expect(name.trim()).toBeTruthy();
    }
  });

  it('should match the names from FONT_OPTIONS_GROUPED', () => {
    const grouped = FONT_OPTIONS_GROUPED.map(f => f.name);
    expect(FONT_OPTIONS).toEqual(grouped);
  });
});

describe('INDUSTRY_CATEGORIES', () => {
  it('should have 10 industries', () => {
    expect(INDUSTRY_CATEGORIES).toHaveLength(10);
  });

  it('should have unique IDs', () => {
    const ids = INDUSTRY_CATEGORIES.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should have unique names', () => {
    const names = INDUSTRY_CATEGORIES.map(i => i.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('should include expected industries', () => {
    const ids = INDUSTRY_CATEGORIES.map(i => i.id);
    expect(ids).toContain('restaurant');
    expect(ids).toContain('fashion');
    expect(ids).toContain('tech');
    expect(ids).toContain('fitness');
    expect(ids).toContain('education');
    expect(ids).toContain('realestate');
    expect(ids).toContain('beauty');
    expect(ids).toContain('music');
    expect(ids).toContain('retail');
    expect(ids).toContain('healthcare');
  });

  it('should have an emoji for each industry', () => {
    for (const industry of INDUSTRY_CATEGORIES) {
      expect(industry.emoji).toBeTruthy();
      // Emoji should be at least 1 character
      expect(industry.emoji.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('should have a descriptive name for each industry', () => {
    for (const industry of INDUSTRY_CATEGORIES) {
      expect(industry.name).toBeTruthy();
      expect(industry.name.length).toBeGreaterThan(3);
    }
  });
});
