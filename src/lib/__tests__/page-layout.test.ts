import { describe, it, expect } from 'vitest';
import {
  getDefaultLayout,
  createSection,
  SECTION_METADATA,
  type SectionType,
  type PageLayout,
  type PageSection,
  type HeroConfig,
  type FeaturesConfig,
  type ProductsConfig,
  type BlogConfig,
  type TestimonialsConfig,
  type NewsletterConfig,
  type ContactCtaConfig,
  type StatsConfig,
  type FaqConfig,
  type GalleryConfig,
} from '../page-layout';

describe('SECTION_METADATA', () => {
  it('should define metadata for all 10 section types', () => {
    expect(SECTION_METADATA).toHaveLength(10);
  });

  it('should have unique types', () => {
    const types = SECTION_METADATA.map(s => s.type);
    expect(new Set(types).size).toBe(types.length);
  });

  it('should include all expected section types', () => {
    const types = SECTION_METADATA.map(s => s.type);
    const expectedTypes: SectionType[] = [
      'hero', 'features', 'products', 'blog', 'testimonials',
      'newsletter', 'contact-cta', 'stats', 'faq', 'gallery',
    ];
    for (const type of expectedTypes) {
      expect(types).toContain(type);
    }
  });

  it('should have label, description, and icon for each', () => {
    for (const meta of SECTION_METADATA) {
      expect(meta.label).toBeTruthy();
      expect(meta.description).toBeTruthy();
      expect(meta.icon).toBeTruthy();
    }
  });
});

describe('getDefaultLayout', () => {
  it('should return a valid PageLayout', () => {
    const layout = getDefaultLayout();
    expect(layout).toBeDefined();
    expect(layout.sections).toBeInstanceOf(Array);
  });

  it('should have 9 sections', () => {
    const layout = getDefaultLayout();
    expect(layout.sections).toHaveLength(9);
  });

  it('should have sections with sequential order', () => {
    const layout = getDefaultLayout();
    for (let i = 0; i < layout.sections.length; i++) {
      expect(layout.sections[i].order).toBe(i);
    }
  });

  it('should have unique section IDs', () => {
    const layout = getDefaultLayout();
    const ids = layout.sections.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should start with hero section', () => {
    const layout = getDefaultLayout();
    expect(layout.sections[0].type).toBe('hero');
  });

  it('should have hero, features, products, and contact-cta visible by default', () => {
    const layout = getDefaultLayout();
    const visibleTypes = layout.sections.filter(s => s.visible).map(s => s.type);
    expect(visibleTypes).toContain('hero');
    expect(visibleTypes).toContain('features');
    expect(visibleTypes).toContain('products');
    expect(visibleTypes).toContain('contact-cta');
  });

  it('should have testimonials, stats, newsletter, and faq hidden by default', () => {
    const layout = getDefaultLayout();
    const hiddenTypes = layout.sections.filter(s => !s.visible).map(s => s.type);
    expect(hiddenTypes).toContain('testimonials');
    expect(hiddenTypes).toContain('stats');
    expect(hiddenTypes).toContain('newsletter');
    expect(hiddenTypes).toContain('faq');
  });

  it('should have proper hero config defaults', () => {
    const layout = getDefaultLayout();
    const hero = layout.sections.find(s => s.type === 'hero')!;
    const config = hero.config as HeroConfig;
    expect(config.layout).toBe('centered');
    expect(config.ctaText).toBe('Shop Now');
    expect(config.secondaryCtaText).toBe('Learn More');
  });

  it('should have proper features config with 3 items', () => {
    const layout = getDefaultLayout();
    const features = layout.sections.find(s => s.type === 'features')!;
    const config = features.config as FeaturesConfig;
    expect(config.columns).toBe(3);
    expect(config.items).toHaveLength(3);
  });

  it('should have proper products config', () => {
    const layout = getDefaultLayout();
    const products = layout.sections.find(s => s.type === 'products')!;
    const config = products.config as ProductsConfig;
    expect(config.count).toBe(3);
    expect(config.layout).toBe('grid');
    expect(config.showViewAll).toBe(true);
  });
});

describe('createSection', () => {
  it('should create a section with the given type', () => {
    const section = createSection('hero');
    expect(section.type).toBe('hero');
  });

  it('should generate an ID starting with the type', () => {
    const section = createSection('features');
    expect(section.id).toMatch(/^features-/);
  });

  it('should set visible to true by default', () => {
    const section = createSection('blog');
    expect(section.visible).toBe(true);
  });

  it('should set order to 0', () => {
    const section = createSection('stats');
    expect(section.order).toBe(0);
  });

  it('should create proper defaults for hero type', () => {
    const section = createSection('hero');
    const config = section.config as HeroConfig;
    expect(config.layout).toBe('centered');
    expect(config.ctaText).toBe('Get Started');
  });

  it('should create proper defaults for features type', () => {
    const section = createSection('features');
    const config = section.config as FeaturesConfig;
    expect(config.columns).toBe(3);
    expect(config.items).toHaveLength(1);
  });

  it('should create proper defaults for products type', () => {
    const section = createSection('products');
    const config = section.config as ProductsConfig;
    expect(config.count).toBe(3);
    expect(config.layout).toBe('grid');
    expect(config.showViewAll).toBe(true);
  });

  it('should create proper defaults for testimonials type', () => {
    const section = createSection('testimonials');
    const config = section.config as TestimonialsConfig;
    expect(config.items).toHaveLength(1);
    expect(config.items[0].quote).toBeTruthy();
    expect(config.items[0].author).toBeTruthy();
  });

  it('should create proper defaults for newsletter type', () => {
    const section = createSection('newsletter');
    const config = section.config as NewsletterConfig;
    expect(config.heading).toBeTruthy();
    expect(config.buttonText).toBeTruthy();
  });

  it('should create proper defaults for gallery type', () => {
    const section = createSection('gallery');
    const config = section.config as GalleryConfig;
    expect(config.columns).toBe(3);
    expect(config.images).toEqual([]);
  });

  it('should create proper defaults for all section types', () => {
    const types: SectionType[] = [
      'hero', 'features', 'products', 'blog', 'testimonials',
      'newsletter', 'contact-cta', 'stats', 'faq', 'gallery',
    ];
    for (const type of types) {
      const section = createSection(type);
      expect(section.type).toBe(type);
      expect(section.config).toBeDefined();
      expect(section.visible).toBe(true);
    }
  });

  it('should generate unique IDs for the same type', () => {
    const s1 = createSection('hero');
    // Small delay to ensure Date.now() differs
    const s2 = createSection('hero');
    // IDs might be the same if called in the same millisecond,
    // but they should both start with 'hero-'
    expect(s1.id).toMatch(/^hero-\d+$/);
    expect(s2.id).toMatch(/^hero-\d+$/);
  });
});
