/**
 * Page Layout System — Section-based layout for brand consumer sites.
 * Layout is stored as JSON in brand_settings with key 'page_layout'.
 */

// ─── Section Types ───────────────────────────────────────────────
export type SectionType =
  | 'hero'
  | 'features'
  | 'products'
  | 'blog'
  | 'testimonials'
  | 'newsletter'
  | 'contact-cta'
  | 'stats'
  | 'faq'
  | 'gallery';

// ─── Section Configs ─────────────────────────────────────────────
export interface HeroConfig {
  heading?: string;
  subheading?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  layout: 'centered' | 'left-aligned' | 'split';
}

export interface FeaturesConfig {
  columns: 2 | 3 | 4;
  items: Array<{ title: string; description: string; icon?: string }>;
}

export interface ProductsConfig {
  count: 3 | 4 | 6;
  layout: 'grid' | 'carousel';
  showViewAll: boolean;
}

export interface BlogConfig {
  count: 3 | 4 | 6;
  layout: 'cards' | 'list' | 'magazine';
}

export interface TestimonialsConfig {
  items: Array<{ quote: string; author: string; role?: string }>;
}

export interface NewsletterConfig {
  heading?: string;
  subheading?: string;
  buttonText?: string;
}

export interface ContactCtaConfig {
  heading?: string;
  subheading?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface StatsConfig {
  items: Array<{ number: string; label: string }>;
}

export interface FaqConfig {
  items: Array<{ question: string; answer: string }>;
}

export interface GalleryConfig {
  columns: 2 | 3 | 4;
  images: string[]; // URLs
}

export type SectionConfig =
  | HeroConfig
  | FeaturesConfig
  | ProductsConfig
  | BlogConfig
  | TestimonialsConfig
  | NewsletterConfig
  | ContactCtaConfig
  | StatsConfig
  | FaqConfig
  | GalleryConfig;

// ─── Page Section ────────────────────────────────────────────────
export interface PageSection {
  id: string;
  type: SectionType;
  visible: boolean;
  order: number;
  config: SectionConfig;
}

export interface PageLayout {
  sections: PageSection[];
}

// ─── Section Metadata ────────────────────────────────────────────
export interface SectionMeta {
  type: SectionType;
  label: string;
  description: string;
  icon: string;
}

export const SECTION_METADATA: SectionMeta[] = [
  { type: 'hero', label: 'Hero', description: 'Main heading, tagline, and CTA', icon: '🎯' },
  { type: 'features', label: 'Features', description: 'Key features or value propositions', icon: '✨' },
  { type: 'products', label: 'Products', description: 'Product showcase grid', icon: '🛍️' },
  { type: 'blog', label: 'Blog', description: 'Latest blog posts', icon: '📝' },
  { type: 'testimonials', label: 'Testimonials', description: 'Customer reviews and quotes', icon: '💬' },
  { type: 'newsletter', label: 'Newsletter', description: 'Email subscription form', icon: '📧' },
  { type: 'contact-cta', label: 'Contact CTA', description: 'Call-to-action for contact', icon: '📞' },
  { type: 'stats', label: 'Stats', description: 'Numbers that impress', icon: '📊' },
  { type: 'faq', label: 'FAQ', description: 'Frequently asked questions', icon: '❓' },
  { type: 'gallery', label: 'Gallery', description: 'Image showcase grid', icon: '🖼️' },
];

// ─── Default Layout ──────────────────────────────────────────────
export function getDefaultLayout(brandName?: string): PageLayout {
  return {
    sections: [
      {
        id: 'hero-default',
        type: 'hero',
        visible: true,
        order: 0,
        config: {
          heading: '',
          subheading: '',
          ctaText: 'Shop Now',
          ctaLink: '',
          secondaryCtaText: 'Learn More',
          secondaryCtaLink: '',
          layout: 'centered',
        } as HeroConfig,
      },
      {
        id: 'features-default',
        type: 'features',
        visible: true,
        order: 1,
        config: {
          columns: 3,
          items: [
            { title: 'Quality First', description: 'Every product crafted with meticulous attention to detail.', icon: '💎' },
            { title: 'Customer Focus', description: 'Your satisfaction drives everything we do.', icon: '🎯' },
            { title: 'Innovation', description: 'Constantly pushing boundaries for you.', icon: '💡' },
          ],
        } as FeaturesConfig,
      },
      {
        id: 'products-default',
        type: 'products',
        visible: true,
        order: 2,
        config: {
          count: 3,
          layout: 'grid',
          showViewAll: true,
        } as ProductsConfig,
      },
      {
        id: 'blog-default',
        type: 'blog',
        visible: true,
        order: 3,
        config: {
          count: 3,
          layout: 'cards',
        } as BlogConfig,
      },
      {
        id: 'testimonials-default',
        type: 'testimonials',
        visible: false,
        order: 4,
        config: {
          items: [
            { quote: 'Amazing product! Exceeded all expectations.', author: 'Happy Customer', role: 'Verified Buyer' },
            { quote: 'Best experience ever. Will definitely come back.', author: 'Loyal Fan', role: 'Repeat Customer' },
          ],
        } as TestimonialsConfig,
      },
      {
        id: 'stats-default',
        type: 'stats',
        visible: false,
        order: 5,
        config: {
          items: [
            { number: '10K+', label: 'Happy Customers' },
            { number: '50+', label: 'Products' },
            { number: '4.9', label: 'Average Rating' },
            { number: '99%', label: 'Satisfaction' },
          ],
        } as StatsConfig,
      },
      {
        id: 'newsletter-default',
        type: 'newsletter',
        visible: false,
        order: 6,
        config: {
          heading: 'Stay Updated',
          subheading: 'Subscribe to our newsletter for the latest updates.',
          buttonText: 'Subscribe',
        } as NewsletterConfig,
      },
      {
        id: 'faq-default',
        type: 'faq',
        visible: false,
        order: 7,
        config: {
          items: [
            { question: 'How do I place an order?', answer: 'Browse our products, add items to your cart, and proceed to checkout.' },
            { question: 'What is your return policy?', answer: 'We offer a 30-day money-back guarantee on all products.' },
            { question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days. Express shipping is available.' },
          ],
        } as FaqConfig,
      },
      {
        id: 'contact-cta-default',
        type: 'contact-cta',
        visible: true,
        order: 8,
        config: {
          heading: 'Ready to get started?',
          subheading: 'Get in touch with us today.',
          buttonText: 'Contact Us',
          buttonLink: '',
        } as ContactCtaConfig,
      },
    ],
  };
}

/** Create a new section with defaults */
export function createSection(type: SectionType): PageSection {
  const id = `${type}-${Date.now()}`;

  const configDefaults: Record<SectionType, SectionConfig> = {
    hero: { heading: '', subheading: '', ctaText: 'Get Started', ctaLink: '', secondaryCtaText: '', secondaryCtaLink: '', layout: 'centered' } as HeroConfig,
    features: { columns: 3, items: [{ title: 'Feature', description: 'Description', icon: '✦' }] } as FeaturesConfig,
    products: { count: 3, layout: 'grid', showViewAll: true } as ProductsConfig,
    blog: { count: 3, layout: 'cards' } as BlogConfig,
    testimonials: { items: [{ quote: 'Great product!', author: 'Customer', role: '' }] } as TestimonialsConfig,
    newsletter: { heading: 'Stay Updated', subheading: 'Get the latest news.', buttonText: 'Subscribe' } as NewsletterConfig,
    'contact-cta': { heading: 'Get in Touch', subheading: 'We would love to hear from you.', buttonText: 'Contact Us', buttonLink: '' } as ContactCtaConfig,
    stats: { items: [{ number: '100+', label: 'Customers' }] } as StatsConfig,
    faq: { items: [{ question: 'Question?', answer: 'Answer.' }] } as FaqConfig,
    gallery: { columns: 3, images: [] } as GalleryConfig,
  };

  return {
    id,
    type,
    visible: true,
    order: 0,
    config: configDefaults[type],
  };
}
