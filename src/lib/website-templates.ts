export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
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
    preview: {
      heroStyle: 'left-aligned',
      cardStyle: 'minimal',
      navStyle: 'minimal',
      typography: {
        headingWeight: '500',
        headingTracking: '-0.02em',
        headingCase: 'normal',
        bodySize: '15px',
      },
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
    preview: {
      heroStyle: 'split',
      cardStyle: 'flat',
      navStyle: 'spread',
      typography: {
        headingWeight: '600',
        headingTracking: '-0.03em',
        headingCase: 'normal',
        bodySize: '16px',
      },
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
    preview: {
      heroStyle: 'full-width',
      cardStyle: 'bordered',
      navStyle: 'minimal',
      typography: {
        headingWeight: '800',
        headingTracking: '-0.04em',
        headingCase: 'uppercase',
        bodySize: '15px',
      },
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
    preview: {
      heroStyle: 'centered',
      cardStyle: 'elevated',
      navStyle: 'classic',
      typography: {
        headingWeight: '600',
        headingTracking: '-0.01em',
        headingCase: 'normal',
        bodySize: '16px',
      },
      spacing: 'normal',
      borderRadius: '8px',
      accentUsage: 'moderate',
    },
  },
  {
    id: 'playful',
    name: 'Playful',
    description: 'Rounded corners, soft colors, and friendly vibes.',
    bestFor: ['kids', 'pets', 'food', 'entertainment', 'retail', 'beauty'],
    preview: {
      heroStyle: 'stacked',
      cardStyle: 'rounded',
      navStyle: 'playful',
      typography: {
        headingWeight: '700',
        headingTracking: '-0.01em',
        headingCase: 'normal',
        bodySize: '16px',
      },
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

  // Score each template based on industry match
  const scored = WEBSITE_TEMPLATES.map(t => {
    let score = 0;
    for (const match of t.bestFor) {
      if (normalized.includes(match)) score += 10;
    }
    return { id: t.id, score };
  });

  // Sort by score descending, return all
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.id);
}
