export interface TemplateColors {
  text: string;
  background: string;
  accent: string;
  surface: string;
  muted: string;
  border: string;
}

export interface TemplateFonts {
  heading: string;
  body: string;
  headingWeight: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  fonts: TemplateFonts;
  colors: {
    light: TemplateColors;
    dark: TemplateColors;
  };
  preview: {
    heroStyle: 'centered' | 'left-aligned' | 'split' | 'full-width' | 'stacked';
    cardStyle: 'minimal' | 'bordered' | 'elevated' | 'flat' | 'rounded';
    navStyle: 'minimal' | 'centered' | 'spread' | 'classic' | 'playful';
    typography: {
      headingWeight: string;
      headingTracking: string;
      headingCase: 'normal' | 'uppercase' | 'capitalize';
      bodySize: string;
    };
    spacing: 'compact' | 'normal' | 'generous' | 'spacious';
    borderRadius: string;
    accentUsage: 'minimal' | 'moderate' | 'bold';
  };
}

export const WEBSITE_TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, whitespace-heavy design. Let the content breathe.',
    bestFor: ['luxury', 'fashion', 'tech', 'design', 'architecture'],
    fonts: {
      heading: 'Plus Jakarta Sans',
      body: 'Inter',
      headingWeight: '500',
    },
    colors: {
      light: { text: '#18181B', background: '#FAFAFA', accent: '#6366F1', surface: '#FFFFFF', muted: '#71717A', border: '#E4E4E7' },
      dark: { text: '#FAFAFA', background: '#09090B', accent: '#818CF8', surface: '#18181B', muted: '#71717A', border: '#27272A' },
    },
    preview: {
      heroStyle: 'left-aligned',
      cardStyle: 'minimal',
      navStyle: 'minimal',
      typography: { headingWeight: '500', headingTracking: '-0.02em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'spacious',
      borderRadius: '8px',
      accentUsage: 'minimal',
    },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine-style with strong typography and asymmetric grids.',
    bestFor: ['media', 'food', 'lifestyle', 'restaurant', 'beauty'],
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#1A1A1A', background: '#F5F5F0', accent: '#C2410C', surface: '#FFFFFF', muted: '#737373', border: '#E5E5E5' },
      dark: { text: '#F5F5F0', background: '#1A1A1A', accent: '#EA580C', surface: '#262626', muted: '#737373', border: '#404040' },
    },
    preview: {
      heroStyle: 'split',
      cardStyle: 'flat',
      navStyle: 'spread',
      typography: { headingWeight: '700', headingTracking: '-0.03em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'generous',
      borderRadius: '0px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'bold',
    name: 'Bold',
    description: 'Big headings, high contrast, statement design that commands attention.',
    bestFor: ['startup', 'fitness', 'music', 'entertainment', 'tech'],
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#000000', background: '#FFFFFF', accent: '#EF4444', surface: '#FAFAFA', muted: '#6B7280', border: '#E5E7EB' },
      dark: { text: '#FFFFFF', background: '#000000', accent: '#F87171', surface: '#111111', muted: '#9CA3AF', border: '#1F1F1F' },
    },
    preview: {
      heroStyle: 'full-width',
      cardStyle: 'bordered',
      navStyle: 'minimal',
      typography: { headingWeight: '700', headingTracking: '-0.04em', headingCase: 'uppercase', bodySize: '15px' },
      spacing: 'normal',
      borderRadius: '0px',
      accentUsage: 'bold',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, trustworthy, and structured. Inspires confidence.',
    bestFor: ['healthcare', 'finance', 'realestate', 'education', 'legal'],
    fonts: {
      heading: 'Source Serif 4',
      body: 'Inter',
      headingWeight: '600',
    },
    colors: {
      light: { text: '#1E3A5F', background: '#F8F6F3', accent: '#B8860B', surface: '#FFFFFF', muted: '#6B7280', border: '#D1D5DB' },
      dark: { text: '#E2E8F0', background: '#1E293B', accent: '#D4A84B', surface: '#2D3748', muted: '#94A3B8', border: '#475569' },
    },
    preview: {
      heroStyle: 'centered',
      cardStyle: 'elevated',
      navStyle: 'classic',
      typography: { headingWeight: '600', headingTracking: '-0.01em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'normal',
      borderRadius: '8px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Rounded corners, warm colors, and friendly vibes.',
    bestFor: ['kids', 'pets', 'food', 'entertainment', 'retail', 'beauty'],
    fonts: {
      heading: 'DM Sans',
      body: 'Inter',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#1F2937', background: '#FFF7ED', accent: '#F97316', surface: '#FFFFFF', muted: '#6B7280', border: '#FDE68A' },
      dark: { text: '#FFF7ED', background: '#1F2937', accent: '#FB923C', surface: '#374151', muted: '#9CA3AF', border: '#4B5563' },
    },
    preview: {
      heroStyle: 'stacked',
      cardStyle: 'rounded',
      navStyle: 'playful',
      typography: { headingWeight: '700', headingTracking: '-0.01em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'generous',
      borderRadius: '16px',
      accentUsage: 'bold',
    },
  },
];

export function getWebsiteTemplate(id: string): WebsiteTemplate | undefined {
  return WEBSITE_TEMPLATES.find(t => t.id === id);
}

export function suggestTemplateForIndustry(industry: string): string[] {
  const normalized = industry.toLowerCase();

  const scored = WEBSITE_TEMPLATES.map(t => {
    let score = 0;
    for (const match of t.bestFor) {
      if (normalized.includes(match)) score += 10;
    }
    return { id: t.id, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.id);
}
