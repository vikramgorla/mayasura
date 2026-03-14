# Design Research 2026 — Comprehensive Design System Guide

> **Purpose:** Reference guide for Mayasura's brand ecosystem builder design system. Based on deep research of leading SaaS sites, UI trends, and design conventions as of March 2026.
>
> **Last updated:** 2026-03-14

---

## Table of Contents

1. [Typography](#1-typography)
2. [Color Systems](#2-color-systems)
3. [UI Components](#3-ui-components)
4. [Layout & Composition](#4-layout--composition)
5. [Motion & Animation](#5-motion--animation)
6. [Site-by-Site Analysis](#6-site-by-site-analysis)
7. [Industry-Specific Templates](#7-industry-specific-templates)
8. [Dated vs Modern: What to Avoid](#8-dated-vs-modern)
9. [Recommended Mayasura Design Tokens](#9-recommended-mayasura-design-tokens)

---

## 1. Typography

### 1.1 What Top SaaS Companies Use (March 2026)

| Company | Primary Font | Type | Notes |
|---------|-------------|------|-------|
| **Linear** | Inter | Sans-serif (variable) | Dark mode optimized, tight tracking |
| **Vercel** | Geist | Sans-serif (variable) | Custom-built by Vercel, Swiss-inspired. Includes Geist Mono |
| **Stripe** | Söhne (Klim Type Foundry) | Sans-serif | Geometric, premium feel. Since 2020 redesign |
| **Notion** | Inter (UI) + Lyon Display (marketing) | Sans + Serif | Serif for editorial warmth, sans for product UI |
| **Framer** | Inter / custom | Sans-serif | Clean, motion-friendly |
| **Raycast** | Inter | Sans-serif | Monospace for code contexts |
| **Supabase** | Inter | Sans-serif | Developer-first, dark mode default |
| **Resend** | Inter | Sans-serif | Minimal, code-forward |
| **Cal.com** | Inter / Cal Sans (custom) | Sans-serif | Cal Sans for branding, Inter for UI |
| **Clerk** | Inter | Sans-serif | Clean, approachable |

**Key insight:** Inter is the _de facto_ standard for SaaS product UI in 2026. Geist is the emerging challenger for tech-forward brands.

### 1.2 Recommended Google Fonts (Free Alternatives)

#### Tier 1: Primary Recommendations for Mayasura

| Font | Style | Best For | Google Fonts Link |
|------|-------|---------|-------------------|
| **Inter** | Sans-serif, variable | Body text, UI elements | [fonts.google.com/specimen/Inter](https://fonts.google.com/specimen/Inter) |
| **Geist** | Sans-serif, variable | Headlines, tech brands | Available via Vercel's package or `next/font` |
| **DM Sans** | Sans-serif | Friendly SaaS UI | [fonts.google.com/specimen/DM+Sans](https://fonts.google.com/specimen/DM+Sans) |
| **Plus Jakarta Sans** | Sans-serif | Modern SaaS, dashboards | [fonts.google.com/specimen/Plus+Jakarta+Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Space Grotesk** | Sans-serif | Tech/dev tools | [fonts.google.com/specimen/Space+Grotesk](https://fonts.google.com/specimen/Space+Grotesk) |

#### Tier 2: Serif & Display (for editorial/premium feel)

| Font | Style | Best For | Google Fonts Link |
|------|-------|---------|-------------------|
| **Playfair Display** | Serif, display | Fashion, editorial, luxury | [fonts.google.com/specimen/Playfair+Display](https://fonts.google.com/specimen/Playfair+Display) |
| **Fraunces** | Serif, variable | Warm brands, food/lifestyle | [fonts.google.com/specimen/Fraunces](https://fonts.google.com/specimen/Fraunces) |
| **Lora** | Serif | Long-form, editorial | [fonts.google.com/specimen/Lora](https://fonts.google.com/specimen/Lora) |
| **Source Serif 4** | Serif, variable | Professional editorial | [fonts.google.com/specimen/Source+Serif+4](https://fonts.google.com/specimen/Source+Serif+4) |

#### Tier 3: Monospace (for code/technical contexts)

| Font | Style | Google Fonts Link |
|------|-------|-------------------|
| **JetBrains Mono** | Monospace | [fonts.google.com/specimen/JetBrains+Mono](https://fonts.google.com/specimen/JetBrains+Mono) |
| **Fira Code** | Monospace | [fonts.google.com/specimen/Fira+Code](https://fonts.google.com/specimen/Fira+Code) |
| **IBM Plex Mono** | Monospace | [fonts.google.com/specimen/IBM+Plex+Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) |

### 1.3 Serif Revival: Status in 2026

**Verdict: Still happening, but evolved.**

- Serifs are NOT replacing sans-serifs for product UI
- Serifs are being used strategically for:
  - Marketing/landing pages (headlines)
  - Editorial content (blog posts, long-form)
  - Premium/luxury brand templates (fashion, hospitality)
  - Creating "warmth" contrast against technical UI
- Modern serifs trending: Fraunces, Playfair Display, Source Serif 4, Lyon Display
- The "serif for trust, sans for clarity" pattern is well-established

### 1.4 Variable Fonts

**Status: Standard practice in 2026.**

Variable fonts reduce HTTP requests and file size while enabling responsive typography.

```css
/* Variable font setup — Inter */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
}
```

Benefits:
- Single file replaces 6-8 static weight files
- Enables fluid `font-weight` transitions
- Optical sizing adjusts letterspacing at small/large sizes
- `font-variation-settings` for fine-tuned control

### 1.5 Font Pairing Strategies That Work in 2026

#### Pairing 1: The SaaS Standard
- **Headlines:** Inter Bold (700) or Geist Bold
- **Body:** Inter Regular (400)
- **Code:** JetBrains Mono or Geist Mono
- **Feel:** Professional, developer-focused, trustworthy

#### Pairing 2: The Warm SaaS
- **Headlines:** Plus Jakarta Sans Bold (700)
- **Body:** DM Sans Regular (400)
- **Accent:** Fraunces for pull quotes
- **Feel:** Approachable, friendly, modern

#### Pairing 3: The Premium Brand
- **Headlines:** Playfair Display Bold (700)
- **Body:** Inter Regular (400)
- **Feel:** Editorial, luxury, sophisticated

#### Pairing 4: The Tech-Forward
- **Headlines:** Space Grotesk Bold (700)
- **Body:** Inter Regular (400)
- **Code:** Fira Code
- **Feel:** Technical, cutting-edge, dev-oriented

#### Pairing 5: The Editorial
- **Headlines:** Fraunces Semi-Bold (600)
- **Body:** Source Serif 4 Regular (400)
- **Feel:** Warm, human, content-first

### 1.6 Type Scale & Conventions

#### Modern Heading Scale (Desktop)

```css
/* Modular scale based on 1.250 (Major Third) */
:root {
  --text-xs: 0.75rem;     /* 12px */
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-3xl: 1.875rem;   /* 30px */
  --text-4xl: 2.25rem;    /* 36px */
  --text-5xl: 3rem;       /* 48px */
  --text-6xl: 3.75rem;    /* 60px */
  --text-7xl: 4.5rem;     /* 72px */
  --text-8xl: 6rem;       /* 96px — hero headlines */
}
```

#### Letter-spacing Conventions

```css
/* Modern letter-spacing — tighter for headings, looser for small text */
h1, h2 { letter-spacing: -0.025em; }  /* -0.5px at 20px */
h3, h4 { letter-spacing: -0.015em; }
body    { letter-spacing: 0; }         /* Normal for body */
.label  { letter-spacing: 0.05em; }    /* Slightly loose for labels/captions */
.caps   { letter-spacing: 0.1em; }     /* Wide for uppercase text */
```

#### Line-height Conventions

```css
/* Modern line-height */
h1, h2          { line-height: 1.1; }   /* Tight for large headings */
h3, h4          { line-height: 1.2; }   /* Slightly more for sub-headings */
p, body         { line-height: 1.5; }   /* Comfortable reading */
.caption, .meta { line-height: 1.4; }   /* Slightly tighter for small text */
```

#### What Modern Sites Actually Use

| Site | Hero Heading Size | Body Size | Line Height |
|------|------------------|-----------|-------------|
| Linear | ~56-72px | 16px | 1.5 |
| Vercel | ~48-64px | 16px | 1.6 |
| Stripe | ~48-56px | 17px | 1.6 |
| Notion | ~56-80px | 16px | 1.5 |

---

## 2. Color Systems

### 2.1 SaaS Brand Colors (Verified March 2026)

#### Linear
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| 🟦 | Brand Blue (desaturated) | `#5E6AD2` | Primary accent, links |
| ⬛ | Nordic Gray | `#222326` | Dark mode text, wordmark |
| ⬜ | Mercury White | `#F4F5F8` | Light mode text, wordmark |
| ⬛ | Dark BG (slate-900) | `#030404` | Dark mode background |
| ⬛ | Dark BG alt | `#0F1117` | Dark mode surface |

#### Stripe
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| 🟣 | Cornflower Blue | `#635BFF` | Primary brand, CTAs |
| 🔵 | Downriver | `#0A2540` | Dark text, headers |
| ⬜ | Black Squeeze | `#F6F9FC` | Light backgrounds |
| 🟡 | Accent Gold | `#FFD700` | Highlight |
| 🟢 | Success | `#00D924` | Success states |

#### Vercel
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Black | `#000000` | Primary dark mode BG |
| ⬜ | White | `#FFFFFF` | Light mode BG |
| 🔵 | Blue | `#0070F3` | Primary accent |
| 🟣 | Purple | `#7928CA` | Gradient accent |
| 🔴 | Error | `#EE0000` | Error states |
| ⬛ | Gray 900 | `#111111` | Dark surfaces |

#### Notion
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬜ | Background | `#FFFFFF` | Light mode default |
| ⬛ | Dark BG | `#191919` | Dark mode |
| ⬛ | Text | `#37352F` | Default text (warm black) |
| 🟤 | Brown | `#64473A` | Tag/label |
| 🔴 | Red | `#E03E3E` | Highlight |
| 🔵 | Blue | `#2F80ED` | Links |
| 🟢 | Green | `#0F7B6C` | Success |
| 🟣 | Purple | `#6940A5` | Tags |
| 🟡 | Yellow | `#DFAB01` | Highlight |

#### Supabase
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| 🟢 | Brand Green | `#3ECF8E` | Primary brand |
| ⬛ | Dark BG | `#1C1C1C` | Dark mode background |
| ⬛ | Dark Surface | `#2A2A2A` | Cards, elevated surfaces |
| ⬜ | Light BG | `#F8F9FA` | Light mode |

#### Resend
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Black | `#000000` | Background |
| ⬜ | White | `#FFFFFF` | Text on dark |
| 🔵 | Brand Blue | `#3B82F6` | Accent |
| ⬛ | Surface | `#111111` | Cards |

#### Cal.com
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Dark BG | `#111827` | Dark mode |
| ⬜ | Light BG | `#F9FAFB` | Light mode |
| 🟤 | Brand Orange | `#F97316` | Primary accent |
| ⬛ | Text | `#1F2937` | Body text |

### 2.2 Color Trends 2026

#### Trend 1: Elevated Neutrals
Replacing harsh white (`#FFFFFF`) and pure black (`#000000`) backgrounds:

```css
/* Light mode elevated neutrals */
--bg-primary: #FAFAF9;    /* Warm off-white */
--bg-secondary: #F5F5F0;  /* Soft cream */
--bg-tertiary: #EDEDE8;   /* Warm gray */

/* Dark mode elevated neutrals */
--bg-dark-primary: #0A0A0B;   /* Near-black, slightly warm */
--bg-dark-secondary: #141415; /* Dark surface */
--bg-dark-tertiary: #1E1E20;  /* Elevated dark surface */
```

#### Trend 2: Hyper-Saturated Accents on Muted Backgrounds
```css
/* The pattern: muted base + one vibrant accent */
--accent-electric-blue: #3B82F6;
--accent-neon-green: #22C55E;
--accent-coral: #F97316;
--accent-violet: #8B5CF6;
--accent-rose: #F43F5E;
```

#### Trend 3: The Shift from Blue-Dominant
- 2020-2023: Blue was default (`#2563EB`, `#3B82F6`)
- 2024-2026: Brands differentiating with:
  - **Purple/Violet:** Stripe (`#635BFF`), Clerk
  - **Green:** Supabase (`#3ECF8E`), Vercel (deployment success)
  - **Orange:** Cal.com (`#F97316`)
  - **Teal:** Emerging trend for fintech/premium SaaS
  - **Coral/Pink:** Wellness, consumer apps

#### Trend 4: Dark Mode Done Right
**NOT just inverting colors.** Modern dark mode conventions:

```css
/* ❌ Dated dark mode */
background: #000000;
color: #FFFFFF;

/* ✅ Modern dark mode */
--dark-bg-base: #09090B;       /* Zinc-950 — slightly warm */
--dark-bg-surface: #18181B;    /* Zinc-900 — cards/panels */
--dark-bg-elevated: #27272A;   /* Zinc-800 — hover/active */
--dark-border: #3F3F46;        /* Zinc-700 — subtle borders */
--dark-text-primary: #FAFAFA;  /* Zinc-50 — high contrast */
--dark-text-secondary: #A1A1AA; /* Zinc-400 — muted text */
--dark-text-tertiary: #71717A; /* Zinc-500 — very muted */
```

Key principles:
- Background: `#09090B` to `#18181B` range (NOT pure `#000000`)
- Text: `#FAFAFA` or `#E4E4E7` (NOT pure `#FFFFFF`)
- Reduce contrast ratio slightly for comfort (still meeting WCAG AA)
- Use warm undertones in dark grays to feel less sterile
- Accent colors may need saturation adjustment for dark backgrounds

#### Trend 5: Color as Brand Differentiator
With standardized layouts (Bento grids, etc.), color is THE primary differentiator. Mayasura templates should offer distinct palettes per industry.

### 2.3 Warm vs Cool Neutrals

| Type | Light Mode | Dark Mode | Best For |
|------|-----------|-----------|----------|
| **Cool** | `#F8FAFC` / `#F1F5F9` | `#0F172A` / `#1E293B` | Tech, SaaS, developer tools |
| **Warm** | `#FAFAF9` / `#F5F5F0` | `#1C1917` / `#292524` | Lifestyle, food, fashion |
| **Neutral** | `#FAFAFA` / `#F4F4F5` | `#18181B` / `#27272A` | Universal, product UI |

---

## 3. UI Components

### 3.1 Buttons

#### Modern Button Styles (2026)

```css
/* Primary Button — "The Linear" */
.btn-primary {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  border-radius: 8px;
  background: #5E6AD2;
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-primary:hover {
  background: #4F5BC0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(94, 106, 210, 0.3);
}

/* Primary Button — "The Vercel" */
.btn-primary-vercel {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  background: #FFFFFF;
  color: #000000;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}
.btn-primary-vercel:hover {
  background: #F5F5F5;
  border-color: rgba(0, 0, 0, 0.15);
}

/* Secondary/Ghost Button */
.btn-ghost {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  background: transparent;
  color: #A1A1AA;
  border: 1px solid #27272A;
  transition: all 0.15s ease;
}
.btn-ghost:hover {
  background: #27272A;
  color: #FAFAFA;
  border-color: #3F3F46;
}

/* Pill Button (trending in 2026) */
.btn-pill {
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  color: #E4E4E7;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.15s ease;
}
.btn-pill:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}
```

#### Border Radius Scale

| Value | Name | Usage | Example |
|-------|------|-------|---------|
| `4px` | subtle | Inputs, small elements | Stripe inputs |
| `6px` | small | Buttons (Vercel style) | Most CTAs |
| `8px` | medium | Buttons, cards | Linear, most SaaS |
| `12px` | large | Cards, modals | Notion cards |
| `16px` | xl | Feature cards | Marketing sections |
| `9999px` | full/pill | Tags, badges, pill buttons | Status badges |

**2026 consensus:** `8px` is the sweet spot for buttons. `12px` for cards.

### 3.2 Cards

```css
/* Modern Card — Glass on Dark */
.card-glass {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 24px;
  backdrop-filter: blur(12px);
  transition: all 0.2s ease;
}
.card-glass:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

/* Modern Card — Solid Light */
.card-solid {
  background: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}
.card-solid:hover {
  border-color: #D4D4D8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Feature Card — Gradient Border */
.card-gradient-border {
  position: relative;
  background: #09090B;
  border-radius: 16px;
  padding: 32px;
  overflow: hidden;
}
.card-gradient-border::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(99, 91, 255, 0.4), rgba(59, 130, 246, 0.1));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

### 3.3 Navigation Patterns

#### 2026 Navigation Hierarchy

1. **Top Navigation Bar** — Still dominant for marketing sites
   - Fixed/sticky, blurs on scroll (`backdrop-filter: blur(12px)`)
   - Minimal items (4-6 links max)
   - Logo left, CTA right
   - Ghost nav on dark hero, solidifies on scroll

2. **Sidebar Navigation** — Standard for dashboards/apps
   - Collapsible, 240px-280px wide
   - Grouped sections with icons
   - Current item highlighted with subtle background

3. **Command Palette** — Expected in 2026 for power users
   - `Cmd+K` / `Ctrl+K` trigger
   - Full-text search across all features
   - Keyboard-navigable results
   - Linear, Raycast, Vercel all have this

```css
/* Modern Nav Bar */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(9, 9, 11, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 50;
}

/* Command Palette Overlay */
.command-palette {
  position: fixed;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 560px;
  max-height: 400px;
  background: #1C1C1E;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
```

### 3.4 Form Inputs

```css
/* Modern Input — 2026 Style */
.input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 20px;
  color: #FAFAFA;
  background: #09090B;
  border: 1px solid #27272A;
  border-radius: 8px;
  outline: none;
  transition: all 0.15s ease;
}
.input::placeholder {
  color: #52525B;
}
.input:focus {
  border-color: #5E6AD2;
  box-shadow: 0 0 0 3px rgba(94, 106, 210, 0.15);
}

/* Input with Label */
.input-group label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #A1A1AA;
  margin-bottom: 6px;
}
```

### 3.5 Glassmorphism & Neumorphism Status

#### Glassmorphism: **Alive but evolved**
- Apple's "Liquid Glass" design system validates it
- Used strategically: nav bars, modals, overlays
- NOT for primary content surfaces
- Best on dark backgrounds with subtle blur
- `backdrop-filter: blur(12px)` + semi-transparent backgrounds

```css
/* Modern glassmorphism — subtle, not overdone */
.glass-panel {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}
```

#### Neumorphism: **Mostly dead for production**
- Original form (monochromatic soft shadows) has significant accessibility issues
- Evolved into "Neumorphism 2.0" — used only for specific toggles/sliders
- NOT recommended for Mayasura's default templates
- Too low-contrast for real productivity UIs

#### What Replaced Them: **Subtle Depth**
The 2026 aesthetic combines:
- Very subtle borders (`1px solid rgba(...)`)
- Minimal shadows (`0 1px 3px rgba(0,0,0,0.04)`)
- Slight elevation on hover
- No heavy effects — restraint is key

### 3.6 Spacing System

```css
/* 4px base spacing scale */
:root {
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
}

/* Section padding */
.section { padding: 80px 0; }         /* Standard section */
.section-lg { padding: 120px 0; }     /* Hero-level spacing */

/* Container max-widths */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.container-sm { max-width: 768px; }   /* Content/blog */
.container-lg { max-width: 1400px; }  /* Dashboard/wide layouts */
```

---

## 4. Layout & Composition

### 4.1 Bento Grid Layouts

The dominant layout pattern for feature sections in 2026:

```css
/* Bento Grid — Feature Section */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Large feature card spans 2 columns */
.bento-grid .card-lg {
  grid-column: span 2;
  grid-row: span 1;
  min-height: 320px;
}

/* Small feature card */
.bento-grid .card-sm {
  grid-column: span 1;
  grid-row: span 1;
  min-height: 280px;
}

/* Full-width card */
.bento-grid .card-full {
  grid-column: span 3;
  min-height: 240px;
}

/* Responsive */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
  .bento-grid .card-lg,
  .bento-grid .card-full {
    grid-column: span 1;
  }
}
```

**Key evolution in 2026:**
- Variable aspect ratios (not just squares)
- Video tiles replacing static images
- Hover micro-interactions within each card
- Subtle gradient borders distinguishing cards

### 4.2 Hero Section Patterns

#### Pattern 1: Centered Text Hero (Most Common)
```
┌─────────────────────────────────────────────┐
│              [tag/badge pill]                │
│                                             │
│     The product development system          │
│        for teams and agents                 │
│                                             │
│  A brief supporting description goes here   │
│  explaining the value proposition.          │
│                                             │
│      [Get Started]  [Learn More →]          │
│                                             │
│    ┌─────────────────────────────┐          │
│    │      Product Screenshot      │         │
│    │      or Interactive Demo     │         │
│    └─────────────────────────────┘          │
└─────────────────────────────────────────────┘
```

#### Pattern 2: Split Hero (Gaining Popularity)
```
┌─────────────────────┬───────────────────────┐
│                     │                        │
│  Headline text      │   Product visual /     │
│  goes here          │   3D illustration /    │
│                     │   Interactive demo     │
│  Description        │                        │
│                     │                        │
│  [CTA] [Link →]     │                        │
│                     │                        │
└─────────────────────┴───────────────────────┘
```

#### Pattern 3: Full-Screen Ambient Hero (Premium)
```
┌─────────────────────────────────────────────┐
│                                             │
│  ░░░ Animated gradient or particle bg ░░░   │
│                                             │
│         Build something beautiful           │
│                                             │
│          [Get Started Free →]               │
│                                             │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │
└─────────────────────────────────────────────┘
```

### 4.3 Full-Bleed vs Contained Content

**2026 pattern:** Alternating.

- **Hero:** Full-bleed with contained text
- **Features:** Contained within `max-width: 1200px`
- **Social proof / logos:** Full-bleed background, contained content
- **Bento grid:** Contained
- **CTA section:** Full-bleed gradient/color background
- **Footer:** Full-bleed dark, contained content

### 4.4 What Makes a Site Feel "2026" vs "2023"

| 2023 (Dated) | 2026 (Modern) |
|--------------|---------------|
| Pure white `#FFFFFF` background | Elevated neutrals `#FAFAF9` |
| Pure black `#000000` dark mode | Warm near-black `#09090B` |
| `border-radius: 4px` everywhere | `8px` buttons, `12px` cards |
| Heavy box shadows | 1px borders, minimal shadow |
| Gradient mesh backgrounds | Subtle, directional gradients |
| Stock photography | Custom 3D, product screenshots |
| Auto-playing carousels | Scroll-driven animations |
| Everything centered | Bento grids, asymmetric layouts |
| Blue-only accent color | Industry-appropriate accent |
| Static hover states | Purposeful micro-interactions |
| Cookie-cutter nav | Translucent sticky nav + command palette |
| "Sign Up Free" button | "Get Started →" with motion |
| Testimonial carousel | Social proof grid/logo bar |
| Heavy font weights (800-900) | Medium-Bold (500-700) |
| 12+ nav items | 4-6 items + mega menu |

---

## 5. Motion & Animation

### 5.1 What Feels Modern

```css
/* Scroll-triggered fade-up (modern standard) */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-on-scroll {
  animation: fade-up 0.6s ease-out forwards;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* Smooth hover transitions */
.interactive {
  transition: all 0.15s ease;
}

/* Button press feedback */
.btn:active {
  transform: scale(0.98);
}
```

### 5.2 What Feels Dated
- Parallax that hijacks scroll
- Page-load animations that delay content
- Bouncy/elastic spring animations (overused)
- Auto-playing carousels
- Animated counters/statistics
- Heavy particle.js backgrounds

### 5.3 Modern Animation Principles
1. **Purpose > Decoration** — Every animation should serve a function
2. **Subtle > Dramatic** — 20px translate, not 100px
3. **Fast > Slow** — 150-300ms transitions, not 500ms+
4. **CSS > JavaScript** — Use `animation-timeline: scroll()` over scroll listeners
5. **Respect `prefers-reduced-motion`** — Always provide fallback

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. Site-by-Site Analysis

### Linear (linear.app)
- **Feel:** Premium dark, professional, developer-focused
- **Font:** Inter (variable)
- **Colors:** Dark mode default (`#030404` bg), desaturated blue accent (`#5E6AD2`)
- **Standout:** Ultra-refined dark mode, product-as-hero approach
- **Nav:** Minimal top nav, blur on scroll, Cmd+K command palette
- **Cards:** Glass-like with subtle borders
- **Insight for Mayasura:** Their restraint is the lesson — fewer colors, less decoration, more product

### Vercel (vercel.com)
- **Feel:** Stark, technical, black-and-white with blue accent
- **Font:** Geist (custom variable)
- **Colors:** Pure black/white with `#0070F3` blue accent
- **Standout:** Extreme minimalism, code-focused design, gradient-border cards
- **Nav:** Clean top nav with translucent bg, smooth scroll
- **Insight for Mayasura:** Shows that black/white + one accent color can be powerful

### Stripe (stripe.com)
- **Feel:** Premium, vibrant, financial-grade trust
- **Font:** Söhne (Klim Type Foundry)
- **Colors:** `#0A2540` dark navy, `#635BFF` purple, `#F6F9FC` light bg
- **Standout:** Rich gradient backgrounds, animated mesh, sophisticated color usage
- **Nav:** Multi-tier with mega-menu, product navigation
- **Insight for Mayasura:** Color can be bold AND trustworthy. Purple ≠ playful

### Notion (notion.com)
- **Feel:** Warm, approachable, content-first
- **Font:** Inter (UI) + Lyon Display (marketing headlines)
- **Colors:** Warm neutrals, `#37352F` (warm black), multi-color tag system
- **Standout:** Serif + sans-serif pairing creates editorial warmth
- **Nav:** Clean, minimal, content-focused
- **Insight for Mayasura:** Best example of warm neutrals done right

### Framer (framer.com)
- **Feel:** Creative, bold, design-forward
- **Font:** Inter-based
- **Colors:** Dynamic, often dark mode with vibrant accents
- **Standout:** The site IS the demo — showing the product's capabilities through the site itself
- **Nav:** Minimal, lets product visuals take center stage
- **Insight for Mayasura:** Marketing site should demonstrate the product's capabilities

### Raycast (raycast.com)
- **Feel:** Polished, macOS-native, dark and refined
- **Font:** Inter
- **Colors:** Dark mode (`#000` base), vibrant gradients for feature sections
- **Standout:** Keyboard visuals, testimonial grid, social proof integration
- **Nav:** Simple top nav, download CTA prominent
- **Insight for Mayasura:** Power user appeal through design language

### Supabase (supabase.com)
- **Feel:** Developer-friendly, modern, dark-first
- **Font:** Inter
- **Colors:** Dark mode default, brand green `#3ECF8E`
- **Standout:** Open source positioning prominent, developer docs integration
- **Insight for Mayasura:** Green accent differentiates from blue-heavy competition

### Clerk (clerk.com)
- **Feel:** Clean, trustworthy, modern
- **Font:** Inter
- **Colors:** White primary with purple accents
- **Standout:** Authentication UI components showcased as product
- **Insight for Mayasura:** Embeddable components shown in-context build trust

### Resend (resend.com)
- **Feel:** Minimal, developer-focused, stark
- **Font:** Inter
- **Colors:** Black background, white text, blue accent
- **Standout:** Code-first design, developer DX emphasis
- **Insight for Mayasura:** When your product is technical, lean into it

### Cal.com (cal.com)
- **Feel:** Professional, open-source positioning
- **Font:** Cal Sans (custom) + Inter
- **Colors:** Dark with orange accent `#F97316`
- **Standout:** Custom brand font, open-source credibility
- **Insight for Mayasura:** A custom display font (even one) creates brand distinction

---

## 7. Industry-Specific Templates

### 7.1 Restaurant / Café

#### Color Palette
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| 🟤 | Espresso | `#3C2415` | Primary text, hero overlays |
| 🟠 | Terracotta | `#C4724A` | Accent, CTAs, highlights |
| 🟡 | Warm Cream | `#F5EDE3` | Background |
| ⬜ | Paper White | `#FAF8F5` | Card backgrounds |
| 🟢 | Herb Green | `#4A6741` | Secondary accent |
| 🟤 | Dark Walnut | `#2C1B0E` | Dark mode background |
| 🟠 | Burnt Orange | `#D4763C` | Dark mode accent |

#### Typography
- **Headlines:** Fraunces Semi-Bold (600) — warm, food-friendly serif
- **Body:** DM Sans Regular (400) — clean, readable
- **Menu items:** Fraunces Medium (500) at 18-20px
- **Prices:** DM Sans Medium (500), tabular nums

#### Layout
- Full-bleed food photography hero (parallax subtle)
- Menu as Bento grid (categories in large cards, items in list)
- Reservation CTA always visible (sticky or floating)
- Instagram feed integration in footer
- Mobile: Single column with large food images

```css
/* Restaurant theme tokens */
:root {
  --font-display: 'Fraunces', serif;
  --font-body: 'DM Sans', sans-serif;
  --color-primary: #C4724A;
  --color-bg: #F5EDE3;
  --color-text: #3C2415;
  --color-accent: #4A6741;
  --radius: 8px;
}
```

### 7.2 Fashion Brand

#### Color Palette
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Noir | `#1A1A1A` | Primary text, navigation |
| ⬜ | Bone | `#F2EDE8` | Background |
| 🟤 | Taupe | `#8A7B6B` | Secondary text, borders |
| 🟤 | Espresso | `#3D3228` | Dark mode background |
| ⬜ | Ivory | `#FFFDF9` | Card backgrounds |
| 🔴 | Rosewood | `#8B3A3A` | Accent, sale badges |

#### Typography
- **Headlines:** Playfair Display Bold (700) — luxury, editorial
- **Sub-headlines:** Inter Light (300) — clean contrast with serif
- **Body:** Inter Regular (400)
- **Uppercase labels:** Inter Medium (500), `letter-spacing: 0.15em`

#### Layout
- Large hero with single product image (full-bleed)
- Grid: 2-column or 3-column product grid with generous gap (24px)
- Product cards: No border, image-dominant, text below
- Editorial lookbook sections between products
- Lots of whitespace — luxury = space

```css
/* Fashion theme tokens */
:root {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --color-primary: #1A1A1A;
  --color-bg: #F2EDE8;
  --color-text: #1A1A1A;
  --color-muted: #8A7B6B;
  --color-accent: #8B3A3A;
  --radius: 0px; /* Sharp corners for fashion */
}
```

### 7.3 Tech / SaaS

#### Color Palette
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Void | `#09090B` | Dark mode background |
| ⬛ | Surface | `#18181B` | Cards, panels |
| 🔵 | Electric Blue | `#3B82F6` | Primary accent |
| 🟣 | Violet | `#8B5CF6` | Secondary accent, gradients |
| ⬜ | Zinc 50 | `#FAFAFA` | Light mode background |
| ⬛ | Zinc 200 | `#E4E4E7` | Light mode borders |
| 🟢 | Emerald | `#10B981` | Success states |
| 🔴 | Red | `#EF4444` | Error states |

#### Typography
- **Headlines:** Geist Bold or Inter Bold (700)
- **Body:** Inter Regular (400) at 16px
- **Code:** JetBrains Mono or Geist Mono at 14px
- **Labels:** Inter Medium (500), 13px

#### Layout
- Centered text hero with product screenshot below
- Bento grid for features
- Code snippets in cards with syntax highlighting
- Comparison/pricing table
- Social proof: logo bar + testimonial grid

```css
/* SaaS theme tokens */
:root {
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --color-primary: #3B82F6;
  --color-bg: #09090B;
  --color-surface: #18181B;
  --color-border: #27272A;
  --color-text: #FAFAFA;
  --color-text-muted: #A1A1AA;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### 7.4 Fitness / Wellness

#### Color Palette
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Charcoal | `#1E1E1E` | Dark mode / high-energy brand |
| 🟢 | Sage | `#7C9A72` | Wellness primary |
| 🟤 | Warm Sand | `#E8DFD1` | Background |
| 🟡 | Honey | `#D4A84B` | Accent, premium |
| ⬜ | Cloud | `#F7F5F2` | Light sections |
| 🟣 | Lavender | `#9B8EC4` | Mindfulness/yoga sub-brand |
| 🟠 | Energy Orange | `#E85D26` | Fitness/high-intensity CTAs |

#### Typography
- **Headlines:** Plus Jakarta Sans Bold (700) — modern, energetic
- **Body:** DM Sans Regular (400) — friendly, clean
- **Stats/numbers:** Space Grotesk Bold (700) — tech-sporty feel
- **Wellness variant:** Swap to Lora for serif warmth

#### Layout
- Large action imagery (people, movement)
- Schedule/class grid as interactive Bento
- Trainer profiles in card grid
- Progress/stats section with data visualization
- Mobile: Bottom tab navigation for app-like feel

```css
/* Fitness theme tokens */
:root {
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-data: 'Space Grotesk', sans-serif;
  --color-primary: #E85D26;
  --color-bg: #F7F5F2;
  --color-text: #1E1E1E;
  --color-accent: #7C9A72;
  --color-secondary: #D4A84B;
  --radius: 12px;
}

/* Wellness variant */
:root[data-theme="wellness"] {
  --color-primary: #7C9A72;
  --color-bg: #E8DFD1;
  --color-accent: #9B8EC4;
}
```

### 7.5 E-Commerce / Retail

#### Color Palette
| Swatch | Name | Hex | Usage |
|--------|------|-----|-------|
| ⬛ | Rich Black | `#141414` | Dark mode, premium |
| ⬜ | Warm White | `#FAFAF8` | Background |
| 🔵 | Ocean | `#1E5799` | Trust, links |
| 🟢 | Success Green | `#16A34A` | Add to cart, in stock |
| 🔴 | Sale Red | `#DC2626` | Discounts, urgency |
| 🟡 | Gold | `#CA8A04` | Premium/VIP |
| ⬛ | Slate | `#475569` | Secondary text |
| ⬜ | Light Gray | `#F1F5F9` | Section alternation |

#### Typography
- **Headlines:** Inter Bold (700) or Plus Jakarta Sans Bold — universal commerce
- **Product titles:** Inter Semi-Bold (600) at 18-20px
- **Prices:** Inter Bold (700), tabular figures
- **Original price (strikethrough):** Inter Regular, `#94A3B8`, `text-decoration: line-through`
- **Body/descriptions:** Inter Regular (400), 15-16px

#### Layout
- Category navigation prominent
- Product grid: 3-4 columns desktop, 2 columns mobile
- Product cards: Image → Name → Price → Rating stars
- Quick-view modal on hover/click
- Persistent cart indicator in header
- Sticky "Add to Cart" on product pages (mobile)

```css
/* E-Commerce theme tokens */
:root {
  --font-sans: 'Inter', sans-serif;
  --color-primary: #1E5799;
  --color-bg: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-text: #141414;
  --color-text-muted: #475569;
  --color-success: #16A34A;
  --color-sale: #DC2626;
  --color-gold: #CA8A04;
  --radius: 8px;
}

/* Product card */
.product-card {
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}
.product-card:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.product-card img {
  aspect-ratio: 1;
  object-fit: cover;
  width: 100%;
}
```

---

## 8. Dated vs Modern

### Quick Reference: Before → After

#### Colors
```css
/* ❌ 2023 */
background: #FFFFFF;              /* Pure white — harsh */
color: #333333;                   /* Generic dark gray */
accent: #2563EB;                  /* Generic blue */

/* ✅ 2026 */
background: #FAFAF9;              /* Elevated neutral */
color: #18181B;                   /* Warm near-black */
accent: var(--brand-primary);     /* Industry-specific */
```

#### Shadows
```css
/* ❌ 2023 */
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);  /* Heavy, floating */

/* ✅ 2026 */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);   /* Barely there */
border: 1px solid rgba(0, 0, 0, 0.06);        /* Border > shadow */
```

#### Buttons
```css
/* ❌ 2023 */
border-radius: 4px;
padding: 12px 32px;
font-weight: 700;
text-transform: uppercase;
box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);

/* ✅ 2026 */
border-radius: 8px;
padding: 8px 16px;
font-weight: 500;
text-transform: none;
box-shadow: none; /* or very subtle */
```

#### Typography
```css
/* ❌ 2023 */
font-family: 'Poppins', sans-serif;  /* Overused */
h1 { font-size: 48px; font-weight: 800; }
letter-spacing: 0;

/* ✅ 2026 */
font-family: 'Inter Variable', sans-serif;
h1 { font-size: 56px; font-weight: 600; letter-spacing: -0.025em; }
```

#### Cards
```css
/* ❌ 2023 */
border-radius: 8px;
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
background: white;

/* ✅ 2026 */
border-radius: 12px;
border: 1px solid rgba(0, 0, 0, 0.06);
background: rgba(255, 255, 255, 0.03);  /* Dark mode glass */
backdrop-filter: blur(8px);
```

---

## 9. Recommended Mayasura Design Tokens

Based on all research, here's the recommended design token system for Mayasura's platform and default templates:

### 9.1 Platform UI (Mayasura Dashboard/Builder)

```css
:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  --font-display: 'Inter', sans-serif; /* Or Geist for tech-forward */

  /* Type Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12);
  --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);

  /* Transitions */
  --duration-fast: 0.1s;
  --duration-normal: 0.15s;
  --duration-slow: 0.3s;
  --ease: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light Mode */
[data-theme="light"] {
  --bg-primary: #FAFAF9;
  --bg-secondary: #F5F5F0;
  --bg-surface: #FFFFFF;
  --bg-elevated: #FFFFFF;
  --border-default: #E4E4E7;
  --border-subtle: #F4F4F5;
  --text-primary: #18181B;
  --text-secondary: #52525B;
  --text-tertiary: #A1A1AA;
  --accent-primary: #5E6AD2;   /* Mayasura brand */
  --accent-hover: #4F5BC0;
  --success: #16A34A;
  --warning: #CA8A04;
  --error: #DC2626;
  --info: #2563EB;
}

/* Dark Mode */
[data-theme="dark"] {
  --bg-primary: #09090B;
  --bg-secondary: #18181B;
  --bg-surface: #1C1C1E;
  --bg-elevated: #27272A;
  --border-default: #27272A;
  --border-subtle: #3F3F46;
  --text-primary: #FAFAFA;
  --text-secondary: #A1A1AA;
  --text-tertiary: #71717A;
  --accent-primary: #7C86E2;   /* Lighter for dark bg */
  --accent-hover: #8B94EB;
  --success: #22C55E;
  --warning: #EAB308;
  --error: #EF4444;
  --info: #3B82F6;
}
```

### 9.2 Mayasura Brand Color Suggestion

For a brand ecosystem builder inspired by the divine architect, consider:

| Color | Hex | Semantic |
|-------|-----|----------|
| **Indigo** (primary) | `#5E6AD2` | Trust, creation, depth |
| **Amber** (accent) | `#D4A84B` | Warmth, premium, divine |
| **Near-Black** | `#09090B` | Sophistication, dark mode |
| **Warm White** | `#FAFAF9` | Clean, modern, approachable |
| **Success** | `#22C55E` | Positive actions |
| **Error** | `#EF4444` | Destructive actions |

This palette bridges technical sophistication (like Linear/Vercel) with the warmth and artisanship that Mayasura's architect metaphor demands.

---

## Appendix: Key Resources

- [Inter Variable Font](https://rsms.me/inter/)
- [Geist Font by Vercel](https://vercel.com/font)
- [Google Fonts](https://fonts.google.com/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Radix UI Colors](https://www.radix-ui.com/colors)
- [Open Props (Design Tokens)](https://open-props.style/)
- [Linear Brand Guidelines](https://linear.app/brand)
- [Stripe Brand Colors (Mobbin)](https://mobbin.com/colors/brand/stripe)
- [UI Color Trends 2026 (Updivision)](https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026)
- [Bento Grid Examples (Mockuuups)](https://mockuuups.studio/blog/post/best-bento-grid-design-examples/)

---

*This research document should be treated as a living reference. Update as Mayasura's brand identity solidifies and as trends continue to evolve.*
