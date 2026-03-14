# Templates

> Website templates and industry starter templates in Mayasura

---

## Website Templates

Website templates define the **visual personality** of a brand's consumer site. They control colors, fonts, spacing, component styles, and typography treatment.

### Template Overview

| ID | Name | Hero Style | Card Style | Nav Style | Spacing | Radius | Best For |
|----|------|-----------|------------|-----------|---------|--------|----------|
| `minimal` | **Minimal** | Left-aligned | Minimal | Minimal | Spacious | 0px | Luxury, fashion, tech, design, architecture |
| `editorial` | **Editorial** | Split | Flat | Spread | Generous | 0px | Media, food, lifestyle, restaurant, beauty |
| `bold` | **Bold** | Full-width | Bordered | Minimal | Normal | 0px | Startup, fitness, music, entertainment, tech |
| `classic` | **Classic** | Centered | Elevated | Classic | Normal | 8px | Healthcare, finance, real estate, education, legal |
| `playful` | **Playful** | Stacked | Rounded | Playful | Generous | 24px | Kids, pets, food, entertainment, retail, beauty |

---

### Minimal

> Ultra-clean, whitespace-heavy design. Let the content breathe.

**Visual Character:**
- Extremely generous whitespace
- Light font weight (300) for headings
- No border radius — sharp, geometric
- Accent used sparingly
- Left-aligned hero with strong hierarchy

**Font Pairing:** Plus Jakarta Sans (heading) + Inter (body)

**Color Scheme (Light):**
| Token | Value | Usage |
|-------|-------|-------|
| Text | `#18181B` | Body text |
| Background | `#FFFFFF` | Page background |
| Accent | `#6366F1` | CTAs, links |
| Surface | `#FFFFFF` | Cards |
| Muted | `#71717A` | Secondary text |
| Border | `#E4E4E7` | Dividers |

**Typography:**
- Heading weight: 300 (light)
- Tracking: -0.03em
- Case: normal
- Body size: 15px

---

### Editorial

> Magazine-style with strong typography and asymmetric grids.

**Visual Character:**
- Serif headings create editorial gravitas
- Split hero layout (text + image)
- Warm, paper-like backgrounds
- Orange/amber accents
- Moderately used accent color

**Font Pairing:** Playfair Display (heading) + Inter (body)

**Color Scheme (Light):**
| Token | Value | Usage |
|-------|-------|-------|
| Text | `#1A1A1A` | Body text |
| Background | `#F5F5F0` | Warm paper-like bg |
| Accent | `#C2410C` | Deep orange CTAs |
| Surface | `#FFFFFF` | Cards |
| Muted | `#737373` | Secondary text |
| Border | `#E5E5E5` | Dividers |

**Typography:**
- Heading weight: 700 (bold)
- Tracking: -0.03em
- Case: normal
- Body size: 16px

---

### Bold

> Big headings, high contrast, statement design that commands attention.

**Visual Character:**
- Full-width hero with maximum impact
- Uppercase headings
- Black/white high contrast
- Red accent demands attention
- Bordered cards with definition

**Font Pairing:** Space Grotesk (heading) + Inter (body)

**Color Scheme (Light):**
| Token | Value | Usage |
|-------|-------|-------|
| Text | `#000000` | Pure black text |
| Background | `#FFFFFF` | Pure white bg |
| Accent | `#EF4444` | Red CTAs |
| Surface | `#FAFAFA` | Near-white cards |
| Muted | `#6B7280` | Secondary text |
| Border | `#E5E7EB` | Dividers |

**Typography:**
- Heading weight: 700 (bold)
- Tracking: -0.04em (tighter)
- Case: **UPPERCASE**
- Body size: 15px

---

### Classic

> Traditional, trustworthy, and structured. Inspires confidence.

**Visual Character:**
- Centered hero with balanced symmetry
- Elevated cards with subtle shadows
- Serif headings for authority
- Warm gold accents
- 8px border radius — refined but not sharp

**Font Pairing:** Source Serif 4 (heading) + Inter (body)

**Color Scheme (Light):**
| Token | Value | Usage |
|-------|-------|-------|
| Text | `#1E3A5F` | Deep navy text |
| Background | `#F8F6F3` | Warm off-white |
| Accent | `#B8860B` | Gold accent |
| Surface | `#FFFFFF` | White cards |
| Muted | `#6B7280` | Secondary text |
| Border | `#D1D5DB` | Dividers |

**Typography:**
- Heading weight: 600 (semi-bold)
- Tracking: -0.01em
- Case: normal
- Body size: 16px

---

### Playful

> Rounded corners, warm colors, and friendly vibes.

**Visual Character:**
- Stacked hero layout
- Heavily rounded components (24px radius)
- Warm peach/amber tones
- Orange accent used boldly
- Generous spacing for breathing room

**Font Pairing:** DM Sans (heading) + Inter (body)

**Color Scheme (Light):**
| Token | Value | Usage |
|-------|-------|-------|
| Text | `#1F2937` | Dark gray text |
| Background | `#FFF7ED` | Warm peach bg |
| Accent | `#F97316` | Orange CTAs |
| Surface | `#FFFFFF` | White cards |
| Muted | `#6B7280` | Secondary text |
| Border | `#FDE68A` | Warm yellow dividers |

**Typography:**
- Heading weight: 700 (bold)
- Tracking: -0.01em
- Case: normal
- Body size: 16px

---

## Industry Starter Templates

Starter templates provide **complete brand presets** for specific industries. They pre-fill the brand creation wizard with realistic data.

| ID | Category | Emoji | Brand Name | Colors | Fonts |
|----|----------|-------|------------|--------|-------|
| `restaurant` | Restaurant/Food & Beverage | 🍕 | Artisan Kitchen | Brown/Warm | DM Sans + Inter |
| `fashion` | Fashion/Clothing | 👗 | ATELIER | Black/Gold | Space Grotesk + Inter |
| `tech` | Tech/SaaS | 💻 | Nexus | Indigo/Violet | Geist + Inter |
| `fitness` | Fitness/Wellness | 🏋️ | CORE | Black/Green | Outfit + DM Sans |
| `education` | Education/Courses | 📚 | Lumina Academy | Green/Amber | Plus Jakarta Sans + Inter |
| `realestate` | Real Estate | 🏠 | Haven Properties | Navy/Gold | Manrope + Inter |
| `beauty` | Beauty/Salon | ✂️ | Glow Studio | Purple/Pink | Sora + DM Sans |
| `music` | Music/Entertainment | 🎵 | Soundwave | Black/Purple | Space Grotesk + Inter |
| `retail` | General Retail | 🛒 | Curate | Teal/Orange | Plus Jakarta Sans + DM Sans |
| `healthcare` | Healthcare | 🏥 | Vitalis Health | Teal/Mint | Manrope + Inter |

Each starter template includes:
- Pre-configured color palette (primary, secondary, accent)
- Font pairing (heading + body)
- Brand voice description
- Tone keywords (2 from the 8 available)
- 3 sample products with pricing
- Recommended channels
- Chatbot persona description

---

## How to Add a New Website Template

1. **Define the template** in `src/lib/website-templates.ts`:

```typescript
// Add to WEBSITE_TEMPLATES array
{
  id: 'your-template-id',
  name: 'Template Name',
  description: 'One-line description of the visual personality',
  bestFor: ['industry1', 'industry2'],  // For suggestTemplateForIndustry()
  fonts: {
    heading: 'Font Name',   // Must be in FONT_OPTIONS
    body: 'Font Name',
    headingWeight: '600',
  },
  colors: {
    light: { text: '#...', background: '#...', accent: '#...', surface: '#...', muted: '#...', border: '#...' },
    dark:  { text: '#...', background: '#...', accent: '#...', surface: '#...', muted: '#...', border: '#...' },
  },
  preview: {
    heroStyle: 'centered' | 'left-aligned' | 'split' | 'full-width' | 'stacked',
    cardStyle: 'minimal' | 'bordered' | 'elevated' | 'flat' | 'rounded',
    navStyle: 'minimal' | 'centered' | 'spread' | 'classic' | 'playful',
    typography: {
      headingWeight: '600',
      headingTracking: '-0.02em',
      headingCase: 'normal' | 'uppercase' | 'capitalize',
      bodySize: '16px',
    },
    spacing: 'compact' | 'normal' | 'generous' | 'spacious',
    borderRadius: '8px',
    accentUsage: 'minimal' | 'moderate' | 'bold',
  },
}
```

2. **Add font weights** in `src/lib/font-loader.ts`:

```typescript
// Add to FONT_WEIGHTS
'your-template-id': [400, 500, 600, 700],

// Add to TEMPLATE_FONTS
'your-template-id': ['Your Heading Font', 'Your Body Font'],
```

3. **Update the template preview** in `src/components/design/template-preview.tsx` if the template needs custom rendering logic.

4. **Test** by selecting the template in the Design Studio and verifying the consumer site renders correctly.

---

## How to Add a New Starter Template

1. **Define the template** in `src/lib/templates.ts`:

```typescript
// Add to STARTER_TEMPLATES array
{
  id: 'your-industry',
  category: 'Industry Category',
  emoji: '🎯',
  name: 'Brand Name',
  description: 'Short description of the template',
  industry: 'Full Industry Name',
  tagline: 'Catchy tagline',
  brandDescription: 'Multi-sentence brand story...',
  primaryColor: '#...',
  secondaryColor: '#...',
  accentColor: '#...',
  fontHeading: 'Font Name',
  fontBody: 'Font Name',
  brandVoice: 'Description of brand voice...',
  toneKeywords: ['Tone1', 'Tone2'],
  channels: ['website', 'chatbot', ...],
  products: [
    { name: 'Product 1', description: '...', price: 99, currency: 'USD', category: 'Category' },
    // 2-3 products recommended
  ],
  chatbotPersona: 'Description of chatbot personality...',
}
```

2. **Add the industry** to `INDUSTRY_CATEGORIES` in `src/lib/types.ts` if it's a new category:

```typescript
{ id: 'your-industry', name: 'Industry Name', emoji: '🎯' },
```

3. The starter template will automatically appear in the brand creation wizard.
