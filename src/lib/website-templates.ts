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
      headingWeight: '300',
    },
    colors: {
      light: { text: '#18181B', background: '#FFFFFF', accent: '#6366F1', surface: '#FFFFFF', muted: '#71717A', border: '#E4E4E7' },
      dark: { text: '#FAFAFA', background: '#09090B', accent: '#818CF8', surface: '#18181B', muted: '#71717A', border: '#27272A' },
    },
    preview: {
      heroStyle: 'left-aligned',
      cardStyle: 'minimal',
      navStyle: 'minimal',
      typography: { headingWeight: '300', headingTracking: '-0.03em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'spacious',
      borderRadius: '0px',
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
      dark: { text: '#FFFFFF', background: '#000000', accent: '#EF4444', surface: '#111111', muted: '#9CA3AF', border: '#222222' },
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
      borderRadius: '24px',
      accentUsage: 'bold',
    },
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Y-Combinator/Product Hunt style. Gradient backgrounds, pill CTAs, metric counters.',
    bestFor: ['startup', 'tech', 'saas', 'finance', 'ai'],
    fonts: {
      heading: 'Sora',
      body: 'Inter',
      headingWeight: '600',
    },
    colors: {
      light: { text: '#0F172A', background: '#FFFFFF', accent: '#6366F1', surface: '#F8FAFC', muted: '#64748B', border: '#E2E8F0' },
      dark: { text: '#F1F5F9', background: '#0B1120', accent: '#818CF8', surface: '#1E293B', muted: '#94A3B8', border: '#334155' },
    },
    preview: {
      heroStyle: 'centered',
      cardStyle: 'elevated',
      navStyle: 'centered',
      typography: { headingWeight: '600', headingTracking: '-0.025em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'normal',
      borderRadius: '12px',
      accentUsage: 'bold',
    },
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Full-bleed images, minimal text, grid gallery. Photographer/designer vibe.',
    bestFor: ['design', 'photography', 'architecture', 'art', 'creative'],
    fonts: {
      heading: 'Outfit',
      body: 'Inter',
      headingWeight: '400',
    },
    colors: {
      light: { text: '#1A1A1A', background: '#FAFAFA', accent: '#0A0A0A', surface: '#FFFFFF', muted: '#8A8A8A', border: '#EBEBEB' },
      dark: { text: '#E8E8E8', background: '#0A0A0A', accent: '#FFFFFF', surface: '#1A1A1A', muted: '#6A6A6A', border: '#2A2A2A' },
    },
    preview: {
      heroStyle: 'full-width',
      cardStyle: 'minimal',
      navStyle: 'minimal',
      typography: { headingWeight: '400', headingTracking: '-0.02em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'spacious',
      borderRadius: '0px',
      accentUsage: 'minimal',
    },
  },
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Multi-column newspaper layout with pull quotes and article-style sections.',
    bestFor: ['media', 'news', 'publishing', 'lifestyle', 'culture'],
    fonts: {
      heading: 'Lora',
      body: 'Source Serif 4',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#1C1917', background: '#FFFBF5', accent: '#B91C1C', surface: '#FFFFFF', muted: '#78716C', border: '#E7E5E4' },
      dark: { text: '#FAFAF9', background: '#1C1917', accent: '#EF4444', surface: '#292524', muted: '#A8A29E', border: '#44403C' },
    },
    preview: {
      heroStyle: 'split',
      cardStyle: 'flat',
      navStyle: 'spread',
      typography: { headingWeight: '700', headingTracking: '-0.02em', headingCase: 'normal', bodySize: '17px' },
      spacing: 'generous',
      borderRadius: '0px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'boutique',
    name: 'Boutique',
    description: 'Luxury e-commerce with subtle gold accents, elegant serif, fashion brand feel.',
    bestFor: ['fashion', 'luxury', 'jewelry', 'beauty', 'perfume'],
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Inter',
      headingWeight: '500',
    },
    colors: {
      light: { text: '#1A1A1A', background: '#FAF9F7', accent: '#B8860B', surface: '#FFFFFF', muted: '#8C8C8C', border: '#E8E6E1' },
      dark: { text: '#F5F0E8', background: '#0F0F0F', accent: '#D4A84B', surface: '#1A1917', muted: '#8C8C8C', border: '#2A2825' },
    },
    preview: {
      heroStyle: 'centered',
      cardStyle: 'minimal',
      navStyle: 'spread',
      typography: { headingWeight: '500', headingTracking: '0.02em', headingCase: 'uppercase', bodySize: '14px' },
      spacing: 'spacious',
      borderRadius: '0px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Developer/SaaS dark theme with monospace accents and terminal aesthetics.',
    bestFor: ['tech', 'saas', 'developer', 'ai', 'crypto'],
    fonts: {
      heading: 'JetBrains Mono',
      body: 'Inter',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#1E293B', background: '#F8FAFC', accent: '#10B981', surface: '#FFFFFF', muted: '#64748B', border: '#E2E8F0' },
      dark: { text: '#E2E8F0', background: '#0A0F1A', accent: '#10B981', surface: '#111827', muted: '#64748B', border: '#1E293B' },
    },
    preview: {
      heroStyle: 'left-aligned',
      cardStyle: 'bordered',
      navStyle: 'minimal',
      typography: { headingWeight: '700', headingTracking: '-0.03em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'normal',
      borderRadius: '8px',
      accentUsage: 'bold',
    },
  },
  {
    id: 'wellness',
    name: 'Wellness',
    description: 'Calm, zen, lots of breathing room, nature-inspired colors. Yoga/spa/health.',
    bestFor: ['wellness', 'fitness', 'yoga', 'spa', 'healthcare', 'organic'],
    fonts: {
      heading: 'Raleway',
      body: 'Nunito',
      headingWeight: '300',
    },
    colors: {
      light: { text: '#2D3B2D', background: '#F5F7F2', accent: '#5B8A5B', surface: '#FFFFFF', muted: '#7A8C7A', border: '#DDE5D9' },
      dark: { text: '#D4E0D4', background: '#1A1F1A', accent: '#7BC67B', surface: '#242A24', muted: '#7A8C7A', border: '#2E362E' },
    },
    preview: {
      heroStyle: 'centered',
      cardStyle: 'rounded',
      navStyle: 'centered',
      typography: { headingWeight: '300', headingTracking: '0.03em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'spacious',
      borderRadius: '16px',
      accentUsage: 'minimal',
    },
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Menu-focused, food photography placeholders, reservation CTA, warm lighting.',
    bestFor: ['restaurant', 'food', 'cafe', 'bakery', 'bar', 'catering'],
    fonts: {
      heading: 'Playfair Display',
      body: 'Lato',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#2C1810', background: '#FBF7F4', accent: '#C2410C', surface: '#FFFFFF', muted: '#8B7355', border: '#E8DFD5' },
      dark: { text: '#F5E6D3', background: '#1A1210', accent: '#EA580C', surface: '#2C1E16', muted: '#A08060', border: '#3D2E22' },
    },
    preview: {
      heroStyle: 'split',
      cardStyle: 'elevated',
      navStyle: 'classic',
      typography: { headingWeight: '700', headingTracking: '-0.01em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'generous',
      borderRadius: '4px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Dark-first design with vibrant neon accent colors. Electrifying presence for tech and gaming brands.',
    bestFor: ['gaming', 'tech', 'music', 'entertainment', 'esports', 'crypto', 'ai', 'nightlife'],
    fonts: {
      heading: 'Space Grotesk',
      body: 'Inter',
      headingWeight: '800',
    },
    colors: {
      light: { text: '#0D0D1A', background: '#F0F0FF', accent: '#7C3AED', surface: '#FFFFFF', muted: '#6B7280', border: '#DDD6FE' },
      dark: { text: '#F0F0FF', background: '#050510', accent: '#A855F7', surface: '#0D0D1A', muted: '#6B7280', border: '#1E1B4B' },
    },
    preview: {
      heroStyle: 'centered',
      cardStyle: 'bordered',
      navStyle: 'minimal',
      typography: { headingWeight: '800', headingTracking: '-0.04em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'normal',
      borderRadius: '8px',
      accentUsage: 'bold',
    },
  },
  {
    id: 'organic',
    name: 'Organic',
    description: 'Earthy, warm tones with rounded shapes and natural textures. Perfect for wellness and food brands.',
    bestFor: ['wellness', 'food', 'organic', 'yoga', 'spa', 'beauty', 'health', 'nature', 'sustainability'],
    fonts: {
      heading: 'Nunito',
      body: 'Nunito',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#3D2B1F', background: '#FDFAF5', accent: '#8B6914', surface: '#FFFFFF', muted: '#8C7B6B', border: '#E8D5B7' },
      dark: { text: '#F5EDD8', background: '#1C150E', accent: '#D4A853', surface: '#2A1F14', muted: '#8C7B6B', border: '#3D2E1E' },
    },
    preview: {
      heroStyle: 'stacked',
      cardStyle: 'rounded',
      navStyle: 'centered',
      typography: { headingWeight: '700', headingTracking: '-0.01em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'generous',
      borderRadius: '24px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'artisan',
    name: 'Artisan',
    description: 'Warm, handcrafted aesthetic with generous spacing and serif typography. Breathes authenticity and craft.',
    bestFor: ['bakery', 'craftspeople', 'artisan', 'food', 'handmade', 'ceramics', 'woodwork', 'jewelry', 'vintage'],
    fonts: {
      heading: 'Playfair Display',
      body: 'Source Sans Pro',
      headingWeight: '700',
    },
    colors: {
      light: { text: '#2D2A26', background: '#FAF7F2', accent: '#C4704A', surface: '#FFFFFF', muted: '#7A6F64', border: '#E8DDD3' },
      dark: { text: '#F0EAE2', background: '#1E1A16', accent: '#D4845C', surface: '#2A2420', muted: '#9A8F84', border: '#3A3028' },
    },
    preview: {
      heroStyle: 'split',
      cardStyle: 'elevated',
      navStyle: 'classic',
      typography: { headingWeight: '700', headingTracking: '-0.02em', headingCase: 'normal', bodySize: '16px' },
      spacing: 'generous',
      borderRadius: '8px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Clean, professional, and trustworthy. Dense layout that means business. Perfect for B2B and consulting.',
    bestFor: ['consulting', 'b2b', 'professional services', 'finance', 'legal', 'enterprise', 'hr', 'accounting'],
    fonts: {
      heading: 'Inter',
      body: 'Inter',
      headingWeight: '600',
    },
    colors: {
      light: { text: '#1E293B', background: '#FFFFFF', accent: '#2563EB', surface: '#F8FAFC', muted: '#64748B', border: '#E2E8F0' },
      dark: { text: '#E2E8F0', background: '#0F172A', accent: '#3B82F6', surface: '#1E293B', muted: '#94A3B8', border: '#334155' },
    },
    preview: {
      heroStyle: 'left-aligned',
      cardStyle: 'bordered',
      navStyle: 'spread',
      typography: { headingWeight: '600', headingTracking: '-0.02em', headingCase: 'normal', bodySize: '15px' },
      spacing: 'compact',
      borderRadius: '6px',
      accentUsage: 'moderate',
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
