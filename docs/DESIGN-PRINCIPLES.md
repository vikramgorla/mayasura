# Mayasura Design Principles

> The visual language and design system that powers every surface of Mayasura — from the dashboard admin UI to the 16 consumer-facing website templates.

---

## 1. Typography System

### Font Families

| Role | Font | Fallbacks | Usage |
|------|------|-----------|-------|
| **Display** | Plus Jakarta Sans | Inter, system-ui, -apple-system, sans-serif | Hero headings, landing page titles |
| **Body** | Inter | system-ui, -apple-system, sans-serif | All body text, UI labels, inputs |
| **Mono** | JetBrains Mono | monospace | Code snippets, terminal aesthetics (Tech template) |

### Heading Scale

All headings use negative letter-spacing for tighter optical alignment:

- `h1`, `h2`, `h3`: `letter-spacing: -0.025em`
- `h4`, `h5`, `h6`: `letter-spacing: -0.015em`

### Font Size Floor

Minimum body text size is enforced at **14px** globally:

```css
body, p, li, td, th, input, textarea, select, button, label, span {
  font-size: max(14px, 1em);
}
```

On mobile (< 640px), `text-sm` resolves to `0.875rem` (14px), and all paragraph text is clamped at `0.875rem`.

### Template-Specific Typography

Each of the 16 templates defines its own heading/body font pair:

| Template | Heading Font | Body Font | Heading Weight | Heading Case |
|----------|-------------|-----------|----------------|-------------|
| Minimal | Plus Jakarta Sans | Inter | 300 (light) | normal |
| Editorial | Playfair Display | Inter | 700 (bold) | normal |
| Bold | Space Grotesk | Inter | 700 (bold) | UPPERCASE |
| Classic | Source Serif 4 | Inter | 600 (semi) | normal |
| Playful | DM Sans | Inter | 700 (bold) | normal |
| Startup | Sora | Inter | 600 (semi) | normal |
| Portfolio | Outfit | Inter | 400 (regular) | normal |
| Magazine | Lora | Source Serif 4 | 700 (bold) | normal |
| Boutique | Cormorant Garamond | Inter | 500 (medium) | UPPERCASE |
| Tech | JetBrains Mono | Inter | 700 (bold) | normal |
| Wellness | Raleway | Nunito | 300 (light) | normal |
| Restaurant | Playfair Display | Lato | 700 (bold) | normal |
| Neon | Space Grotesk | Inter | 800 (extra-bold) | normal |
| Organic | Nunito | Nunito | 700 (bold) | normal |
| Artisan | Playfair Display | Source Sans Pro | 700 (bold) | normal |
| Corporate | Inter | Inter | 600 (semi) | normal |

Fonts are loaded dynamically via Google Fonts URL builder (`buildGoogleFontsUrl`) — only the fonts a brand actually uses are requested.

---

## 2. Color System

### Platform Colors (Light Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FAFAF9` | Page background |
| `--bg-secondary` | `#F4F4F5` | Secondary surfaces |
| `--bg-tertiary` | `#E4E4E7` | Tertiary backgrounds |
| `--bg-surface` | `#FFFFFF` | Cards, dialogs |
| `--bg-inverse` | `#09090B` | Inverted backgrounds |
| `--text-primary` | `#18181B` | Primary text |
| `--text-secondary` | `#52525B` | Secondary text |
| `--text-tertiary` | `#A1A1AA` | Placeholder, hints |
| `--text-inverse` | `#FAFAFA` | Text on dark surfaces |
| `--border-primary` | `#E4E4E7` | Default borders |
| `--border-secondary` | `#F4F4F5` | Subtle borders |

### Platform Colors (Dark Mode — zinc-based, NOT slate)

| Token | Hex |
|-------|-----|
| `--bg-primary` | `#09090B` |
| `--bg-secondary` | `#18181B` |
| `--bg-tertiary` | `#27272A` |
| `--bg-surface` | `#18181B` |
| `--text-primary` | `#FAFAFA` |
| `--text-secondary` | `#A1A1AA` |
| `--text-tertiary` | `#71717A` |
| `--border-primary` | `#27272A` |
| `--border-secondary` | `#3F3F46` |

### Brand Accent (Deep Violet)

| Token | Light | Dark |
|-------|-------|------|
| `--accent` | `#5B21B6` | `#7C3AED` |
| `--accent-hover` | `#4C1D95` | `#8B5CF6` |
| `--accent-light` | `#EDE9FE` | `rgba(124, 58, 237, 0.12)` |
| `--accent-glow` | `rgba(91, 33, 182, 0.12)` | `rgba(124, 58, 237, 0.15)` |

### Semantic Colors

| Token | Light | Dark |
|-------|-------|------|
| `--success` | `#16A34A` | `#22C55E` |
| `--warning` | `#CA8A04` | `#EAB308` |
| `--error` | `#DC2626` | `#EF4444` |
| `--info` | `#2563EB` | `#3B82F6` |

### Brand Gradient

```css
--gradient-brand: linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%); /* light */
--gradient-brand: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%); /* dark */
```

### WCAG Color Accessibility

All color combinations are enforced via `color-utils.ts`:

- **Text on background**: WCAG AA ≥ 4.5:1 for normal text
- **Muted text on background**: ≥ 3:1 (large text threshold)
- **Text on surface (cards)**: ≥ 4.5:1
- **Button text on accent**: automatic white/black selection via `getTextOnColor()`
- **Surface vs background**: ≥ 5% lightness difference
- **Border visibility**: ≥ 1.3:1 contrast against both surface and background

The `autoFixColorSystem()` function auto-repairs any palette that fails these checks, preserving the brand's visual intent while ensuring readability.

### Template Color Palettes

Each template ships with both light and dark color sets. Example (Boutique):

```
Light: text=#1A1A1A, bg=#FAF9F7, accent=#B8860B, surface=#FFFFFF, muted=#8C8C8C, border=#E8E6E1
Dark:  text=#F5F0E8, bg=#0F0F0F, accent=#D4A84B, surface=#1A1917, muted=#8C8C8C, border=#2A2825
```

Templates like **Bold**, **Tech**, and **Neon** are dark-first by default (`color-scheme: dark`).

---

## 3. Spacing System

### Base Unit: 4px

| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |
| `--space-16` | 4rem (64px) |
| `--space-20` | 5rem (80px) |
| `--space-24` | 6rem (96px) |

### Spacing Density (Design Studio Configurable)

Brands can choose their section spacing density:

| Density | Section Padding | Card Gap | 
|---------|----------------|----------|
| Compact | 32px | 12px |
| Normal (default) | 48px | 16px |
| Generous | 64px | 20px |
| Spacious | 96px | 24px |

Applied via CSS custom property `--brand-section-padding`.

---

## 4. Shadow System

| Token | Light Mode | Dark Mode |
|-------|-----------|-----------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.03)` | `0 1px 2px rgba(0,0,0,0.2)` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.04)` | `0 1px 3px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.06)` | `0 4px 12px rgba(0,0,0,0.4)` |
| `--shadow-lg` | `0 8px 24px rgba(0,0,0,0.08)` | `0 8px 24px rgba(0,0,0,0.4)` |
| `--shadow-xl` | `0 16px 48px rgba(0,0,0,0.1)` | `0 16px 48px rgba(0,0,0,0.5)` |

Dark mode uses significantly higher opacity shadows for depth on dark surfaces.

---

## 5. Border Radius System

### Platform Defaults

| Token | Value |
|-------|-------|
| `--radius-sm` | 4px |
| `--radius-md` | 8px (default) |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--radius-full` | 9999px |

### Design Studio Presets

Brands can choose their border radius preset:

| Preset | Value | Templates that use it |
|--------|-------|-----------------------|
| None | 0px | Minimal, Editorial, Bold, Portfolio, Boutique, Magazine |
| Subtle | 4px | Restaurant |
| Rounded | 8px | Classic, Tech, Artisan, Corporate |
| Extra-rounded | 16px | Wellness |
| Pill | 9999px | Playful, Organic |

### Button Shape (independent of border radius)

| Shape | Value |
|-------|-------|
| Sharp | 0px |
| Soft | 4px |
| Rounded | 8px (default) |
| Pill | 9999px |

---

## 6. Animation System

### Intensity Levels

Brands choose an animation intensity via `[data-animation]` attribute:

| Level | Behavior |
|-------|----------|
| **None** | All animations disabled, opacity forced to 1, transforms removed |
| **Subtle** | Reduced travel distances (12px vs 30px), faster durations (0.3s) |
| **Moderate** (default) | Standard distances, 0.6s duration |
| **Dynamic** | Enhanced travel (48px), longer durations (0.8s), larger hover effects |

### Scroll Reveal Keyframes

| Animation | From | To |
|-----------|------|----|
| `anim-fade-up` | opacity:0, translateY(30px) | opacity:1, translateY(0) |
| `anim-fade-in` | opacity:0 | opacity:1 |
| `anim-slide-left` | opacity:0, translateX(-40px) | opacity:1, translateX(0) |
| `anim-slide-right` | opacity:0, translateX(40px) | opacity:1, translateX(0) |
| `anim-zoom-in` | opacity:0, scale(0.92) | opacity:1, scale(1) |
| `anim-blur-in` | opacity:0, blur(8px) | opacity:1, blur(0) |

Stagger delays: `.anim-delay-1` through `.anim-delay-5` (0.1s–0.5s).

### Hover Effects

- **Card lift**: `translateY(-4px)` + shadow increase
- **Glow**: `box-shadow: 0 0 24px` with accent color
- **Image zoom**: `scale(1.05)` on container's img
- **Underline grow**: `scaleX(0) → scaleX(1)` pseudo-element

### Loading States

- **Shimmer**: Gradient sweep animation (1.5s infinite)
- **Dot pulse**: Three dots with staggered scale animation
- **Spinner**: 1s linear infinite rotation
- **Save pulse**: Opacity oscillation while saving

### Template-Specific Micro-Animations

| Template | Card Hover | Button Hover | Scroll Reveal |
|----------|-----------|--------------|---------------|
| Playful | `translateY(-6px) scale(1.02)` spring | `scale(1.05)` spring | Bouncy spring timing |
| Bold | `translateY(-2px) translateX(2px)` | `translateY(-1px)` | Sharp slide-in |
| Minimal | `opacity: 0.85` | `opacity: 0.7` | Long, slow fades |
| Editorial | `opacity: 0.85, translateY(-2px)` | Standard | Deliberate crossfades |
| Classic | Neumorphic shadow shift | Shadow shift | Gentle ease |

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 7. Component Patterns

### Button Variants (Dashboard UI)

| Variant | Style |
|---------|-------|
| `default` | `bg-zinc-900 text-white` (dark: inverted) |
| `brand` | `bg-violet-700 text-white` |
| `destructive` | `bg-red-600 text-white` |
| `outline` | `border border-zinc-200, bg-white` |
| `secondary` | `bg-zinc-100 text-zinc-900` |
| `ghost` | Transparent, hover: `bg-zinc-100` |
| `link` | Underline on hover |

### Button Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | px-3 | text-xs |
| `default` | 36px | px-4 py-2 | text-sm |
| `lg` | 44px | px-6 | text-base |
| `xl` | 48px | px-8 | text-base font-semibold |
| `icon` | 36px × 36px | — | — |

All buttons: `active:scale-[0.98]` press feedback, `rounded-lg`, `disabled:opacity-50`.

### Consumer Site Button Variants

Buttons on consumer sites are controlled by the Design Studio:

- **Solid**: Background = accent color, text = auto white/black
- **Outline**: Transparent background, 1.5px accent border
- **Ghost**: 12% accent opacity background, accent text

Button size (small/medium/large) and shape (sharp/soft/rounded/pill) are independently configurable.

### Cards

| Token | Value |
|-------|-------|
| `--card-bg` | `var(--bg-surface)` |
| `--card-border` | `var(--border-primary)` |
| `--card-radius` | `var(--radius-xl)` (16px) |
| `--card-shadow` | `var(--shadow-sm)` |
| `--card-shadow-hover` | `var(--shadow-md)` |

Micro-interaction: `.micro-card` uses spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for hover lift.

### Empty States

Centered layout with: muted icon/emoji, heading, description, primary action button. No fake data — constitution principle II.

### Loading States

- **Page loader**: Centered spinner with blur-in animation
- **Skeleton screens**: Rounded rectangles with `animate-pulse` (dashboard, nav, hero)
- **Inline shimmer**: For content areas awaiting data

### Error States

- **Error boundary**: Catches React errors, shows fallback UI with retry
- **API errors**: Toast notifications (success/error/info variants)
- **Not found**: SVG illustration + navigation options

### Inputs

| Token | Value |
|-------|-------|
| `--input-height` | 40px |
| `--input-border` | `var(--border-primary)` |
| `--input-bg` | `var(--bg-surface)` |
| `--input-focus-ring` | `var(--accent)` |

Focus: expanding ring animation (`focus-ring-expand`, 200ms).

---

## 8. Layout Patterns

### Dashboard Sidebar

- Width: 256px (`--sidebar-width`)
- Background: `sidebar-gradient` (surface → primary vertical gradient)
- Active indicator: Animated violet bar with `layoutId` spring animation
- Collapsed on mobile: Slide-in overlay (spring animation, backdrop blur)
- Mobile header: Fixed 56px with brand icon, hamburger, theme toggle

### Consumer Site Nav

- Height: 56px (`--nav-height`)
- Background: Transparent → frosted glass on scroll (`backdrop-blur(16px) saturate(180%)`)
- Sticky `top-0 z-50`
- Template-specific: Bold = uppercase wide-tracking, Playful = rounded links, Minimal = minimal weight
- Mobile: Hamburger → slide-down overlay with 44px touch targets
- Search: `⌘K` shortcut opens overlay (full-screen on mobile)

### Wizard Stepper

- 6 steps with connected progress line
- Active step: Gradient violet circle with glow, scale pulse
- Completed steps: Gradient emerald checkmark
- Progress bar: Animated gradient with glow on leading edge
- Step transitions: Framer Motion `AnimatePresence` with directional slide + blur

---

## 9. Template Design Tokens

Each template provides radically different visual treatment through:

### Hero Styles

| Template | Hero Layout | Min-Height | Alignment |
|----------|------------|------------|-----------|
| Minimal | Left-aligned | 70vh | flex-end |
| Editorial | Split (text + image) | 60vh | center |
| Bold | Full-width impact | 85vh | center |
| Classic | Centered neumorphic | 50vh | center |
| Playful | Stacked centered | 60vh | center |
| Startup | Centered + metrics | 70vh | center |
| Portfolio | Full-bleed | 90vh | flex-end |
| Magazine | Multi-column | 55vh | center |
| Boutique | Centered spacious | 70vh | center |
| Tech | Split + terminal | 70vh | center |
| Wellness | Centered + circle | 65vh | center |
| Restaurant | Centered + flourish | 65vh | center |
| Neon | Dark + glowing | 85vh | center |
| Organic | Blob shapes | 65vh | center |
| Artisan | Split + stamp | 65vh | center |
| Corporate | Split + stats grid | 60vh | center |

### Hero Heading Scale

Uses `clamp()` for fluid responsive sizing:

- **Minimal**: `clamp(2.5rem, 7vw, 5rem)` weight 300
- **Bold**: `clamp(2.8rem, 9vw, 7rem)` weight 700 uppercase
- **Portfolio**: `clamp(2.5rem, 7vw, 5rem)` weight 400
- **Neon**: `clamp(2.5rem, 7vw, 5rem)` weight 800

### Card Styles

| Template | Style |
|----------|-------|
| Minimal | Padding only, bottom border dividers |
| Editorial | Flat with bottom border dividers |
| Bold | Thick 2px borders, 0 radius |
| Classic | Neumorphic shadows |
| Playful | 20px radius, pastel backgrounds, spring hover |
| Tech | 8px radius, dark bg, accent border on hover |
| Neon | Glow shadow, gradient background |

### Nav Styles

| Template | Character |
|----------|-----------|
| Minimal | Light weight, wide tracking |
| Bold | Uppercase, heavy tracking (0.12em) |
| Playful | Rounded pill links |
| Boutique | Wide letter-spacing, uppercase |
| Tech | Monospace, minimal |

---

## 10. Mobile Responsiveness

### Breakpoints

| Name | Width | Behavior |
|------|-------|----------|
| xs | < 480px | Hero padding override, stack CTAs, minimum font 14px |
| sm | < 640px | Full-width modals, full-screen search, stack checkout fields |
| md | < 768px | Hero image aspect ratio change (16/10), 44px touch targets on nav |
| lg | < 1024px | Dashboard content padding-top for fixed mobile header |

### Product Grid

```
xs:   1 column
sm:   2 columns (≥ 480px)
md:   3 columns (≥ 768px)
lg:   4 columns (≥ 1024px)
```

### Touch Targets

All interactive elements on touch devices enforce 44px × 44px minimum (WCAG 2.5.5):

```css
@media (hover: none) and (pointer: coarse) {
  button, a, [role="button"] { min-height: 44px; min-width: 44px; }
}
```

### iOS-Specific

- Form inputs force `font-size: 16px` to prevent iOS auto-zoom
- Safe area insets for notch (`padding-bottom: env(safe-area-inset-bottom)`)
- Horizontal overflow prevention on all template containers

---

## 11. Dark Mode

### Approach

- Zinc-based palette (NOT slate) for a warmer dark experience
- Toggle via `useTheme()` hook and `.dark` class on root
- Dashboard: User-toggleable via sidebar or mobile header
- Consumer sites: Template-determined (Bold/Tech/Neon always dark, others follow brand colors)

### Key Differences

- Shadows use 3–5× higher opacity in dark mode
- Accent colors shift brighter (e.g., `#5B21B6` → `#7C3AED`)
- Gradient brand shifts to lighter violet range
- `color-scheme: dark` set on dark templates for native UI consistency

---

## 12. Accessibility Standards

### WCAG 2.1 AA Compliance

- **Focus indicators**: 2px solid accent outline with 2px offset on `:focus-visible`
- **Skip to content**: Hidden link, visible on focus, positioned at top-left
- **Screen reader only**: `.sr-only` utility for labels and context
- **Form labels**: Every input has an associated `<label>` (visible or sr-only)
- **ARIA attributes**: `aria-label`, `aria-expanded`, `aria-hidden` on interactive elements
- **Semantic HTML**: `<main>`, `<nav>`, `<header>`, `<footer>`, `role="main"`
- **Color contrast**: Enforced programmatically via `validateColorSystem()`
- **Reduced motion**: All animations disabled when preference is set
- **Touch targets**: 44px minimum on touch devices

### Content Visibility

Off-screen sections use `content-visibility: auto` with `contain-intrinsic-size` for performance without accessibility loss.

---

## 13. Performance Utilities

- `will-change-transform` / `will-change-opacity`: GPU hints for animated elements
- `.gpu-layer`: `transform: translateZ(0)` for compositing
- `content-visibility: auto`: For large off-screen sections
- Images: `max-width: 100%; height: auto` globally, lazy loading with `loading="lazy"` and `decoding="async"`
- Smooth scrolling: `scroll-behavior: smooth` with reduced-motion fallback to `auto`

### Transition Presets

| Preset | Value |
|--------|-------|
| `--transition-fast` | 100ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-base` | 150ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-slow` | 300ms cubic-bezier(0.4, 0, 0.2, 1) |
| `--transition-spring` | 400ms cubic-bezier(0.34, 1.56, 0.64, 1) |

---

## 14. Design Studio → Consumer Site Guarantee

The Design Studio generates CSS custom properties that are consumed identically by:
1. `template-preview.tsx` (admin preview)
2. `site/[slug]/layout.tsx` (live consumer site)

Both use the same `designSettingsToCSSVars()` function, ensuring **preview = reality** (Constitution Principle III).

Generated CSS vars:

```
--brand-primary, --brand-secondary, --brand-accent, --brand-accent-text
--brand-text, --brand-muted, --brand-surface, --brand-border
--brand-radius, --brand-button-radius, --brand-button-px, --brand-button-py
--brand-button-font-size, --brand-section-padding, --brand-card-gap
```
