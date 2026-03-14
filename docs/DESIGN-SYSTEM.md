# Design System

> Design tokens, component library, and template CSS system in Mayasura

---

## Design Tokens

### Colors

Brand colors are stored in the `brands` table and injected as CSS custom properties at runtime.

| Token | DB Column | Default | Usage |
|-------|-----------|---------|-------|
| `--brand-primary` | `primary_color` | `#0f172a` | Text, headings, dark backgrounds |
| `--brand-secondary` | `secondary_color` | `#f8fafc` | Background, light surfaces |
| `--brand-accent` | `accent_color` | `#3b82f6` | CTAs, links, interactive elements |

Template colors extend these with:
| Token | Source | Usage |
|-------|--------|-------|
| Text | `template.colors.light.text` | Body text color |
| Background | `template.colors.light.background` | Page background |
| Surface | `template.colors.light.surface` | Card backgrounds |
| Muted | `template.colors.light.muted` | Secondary text |
| Border | `template.colors.light.border` | Borders, dividers |

### Color Palettes

16+ preset color palettes are available in the Design Studio. Each palette defines primary, secondary, and accent colors that work together:

- Ocean, Forest, Sunset, Lavender
- Coral, Midnight, Emerald, Rose
- Slate, Amber, Indigo, Sage
- Berry, Sand, Steel, Wine

### Fonts

**34+ fonts** organized into 4 categories:

| Category | Fonts | Typical Usage |
|----------|-------|---------------|
| **Sans-serif** (15) | Inter, Plus Jakarta Sans, DM Sans, Outfit, Space Grotesk, Manrope, Sora, Poppins, Nunito, Lato, Raleway, Work Sans, Rubik, Figtree, Albert Sans | Modern brands, tech, clean design |
| **Serif** (10) | Playfair Display, Source Serif 4, Lora, Merriweather, Crimson Pro, EB Garamond, Libre Baskerville, Cormorant Garamond, Spectral, Noto Serif | Editorial, luxury, traditional |
| **Display** (6) | Archivo Black, Bebas Neue, Oswald, Anton, Montserrat, Righteous | Headlines, bold statements |
| **Monospace** (3) | JetBrains Mono, Fira Code, Source Code Pro | Tech brands, code display |

Font loading is handled dynamically via Google Fonts:
```typescript
buildGoogleFontsUrl(['Plus Jakarta Sans', 'Inter'], 'minimal')
// → https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500&family=Inter:wght@300;400;500&display=swap
```

Weight configurations vary by template to optimize loading:
| Template | Weights Loaded |
|----------|---------------|
| Default | 300, 400, 500, 600, 700, 800 |
| Minimal | 300, 400, 500 |
| Editorial | 400, 500, 600, 700 |
| Bold | 400, 500, 700 |
| Classic | 400, 500, 600 |
| Playful | 400, 500, 600, 700 |

### Spacing

| Level | CSS Value | Templates Using |
|-------|-----------|----------------|
| `compact` | Tighter padding/margins | — |
| `normal` | Standard spacing | Bold, Classic |
| `generous` | Increased breathing room | Editorial, Playful |
| `spacious` | Maximum whitespace | Minimal |

### Border Radius

| Value | Visual | Templates Using |
|-------|--------|----------------|
| `0px` | Sharp, geometric | Minimal, Editorial, Bold |
| `8px` | Slightly rounded | Classic |
| `24px` | Fully rounded | Playful |

### Button Styles

Controlled via the `style-controls.tsx` component:

| Style | Border Radius | Character |
|-------|--------------|-----------|
| Rounded | `8px` | Modern, balanced |
| Sharp | `0px` | Geometric, editorial |
| Pill | `999px` | Friendly, playful |

---

## Component Library

All UI components are in `src/components/ui/` and follow these conventions:

### Design Principles

1. **Variant-based** — Components use CVA (Class Variance Authority) for type-safe variants
2. **Composable** — Small, focused components that compose together
3. **Forwarded refs** — All components forward refs for parent control
4. **Dark mode aware** — All components support `dark:` Tailwind variants
5. **Accessible** — Focus rings, ARIA attributes, keyboard navigation

### Button (`button.tsx`)

The foundational interactive element.

**Variants:**

| Variant | Description |
|---------|-------------|
| `default` | Dark bg, white text (primary action) |
| `destructive` | Red bg (dangerous actions) |
| `outline` | Bordered, transparent bg |
| `secondary` | Light gray bg |
| `ghost` | No bg, hover state only |
| `link` | Underline on hover |
| `brand` | Violet bg (brand-specific CTA) |

**Sizes:**

| Size | Height | Padding |
|------|--------|---------|
| `sm` | 32px | px-3 |
| `default` | 36px | px-4 |
| `lg` | 44px | px-6 |
| `xl` | 48px | px-8 |
| `icon` | 36×36px | — |

**Usage:**
```tsx
<Button variant="brand" size="lg">Get Started</Button>
<Button variant="ghost" size="icon"><Settings /></Button>
<Button variant="destructive" disabled>Delete</Button>
```

### Tabs (`tabs.tsx`)

Animated tab system with Framer Motion.

**Components:**
- `Tabs` — Container (controlled or uncontrolled)
- `TabsList` — Tab button group
- `TabsTrigger` — Individual tab button (animated active state)
- `TabsContent` — Tab panel (fade-in animation)

**Usage:**
```tsx
<Tabs defaultValue="colors">
  <TabsList>
    <TabsTrigger value="colors">Colors</TabsTrigger>
    <TabsTrigger value="fonts">Fonts</TabsTrigger>
  </TabsList>
  <TabsContent value="colors">...</TabsContent>
  <TabsContent value="fonts">...</TabsContent>
</Tabs>
```

### Toast (`toast.tsx`)

Notification system with auto-dismiss.

**Types:** `success`, `error`, `info`, `warning`

**Features:**
- AnimatePresence for enter/exit animations
- Auto-dismiss after 4 seconds (configurable)
- Bottom-right positioned
- Backdrop blur effect
- Manual dismiss button

**Usage:**
```tsx
// Wrap app in ToastProvider
<ToastProvider>{children}</ToastProvider>

// Use the hook
const { success, error, info, warning } = useToast();
success('Saved!', 'Your changes have been applied');
error('Failed', 'Something went wrong');
```

### Other UI Components

| Component | File | Purpose |
|-----------|------|---------|
| **Input** | `input.tsx` | Text input with focus styles |
| **Textarea** | `textarea.tsx` | Multi-line text input |
| **Select** | `select.tsx` | Dropdown selection |
| **Switch** | `switch.tsx` | Toggle switch |
| **Dialog** | `dialog.tsx` | Modal dialog with overlay |
| **Card** | `card.tsx` | Content container |
| **Badge** | `badge.tsx` | Status/label badges |
| **Accordion** | `accordion.tsx` | Expandable sections |
| **Avatar** | `avatar.tsx` | User avatar with fallback |
| **Loading** | `loading.tsx` | Spinner components |
| **Progress** | `progress.tsx` | Progress bar |
| **Skeleton** | `skeleton.tsx` | Loading placeholder |
| **Tooltip** | `tooltip.tsx` | Hover tooltips |

---

## Design Studio Components

Components in `src/components/design/`:

### ColorSystem (`color-system.tsx`)

Full color customization interface:
- Color input (hex) for primary, secondary, accent
- 16+ preset color palettes
- Live preview of selected colors
- Dark mode color variants

### FontPicker (`font-picker.tsx`)

Font selection with live previews:
- 34+ Google Fonts
- Categorized (sans-serif, serif, display, monospace)
- Live font preview in actual typeface
- Separate heading and body font pickers

### StyleControls (`style-controls.tsx`)

Fine-grained style adjustments:
- Button style (rounded, sharp, pill)
- Spacing (compact, normal, generous, spacious)
- Border radius (slider or presets)

### TemplatePreview (`template-preview.tsx`)

Live preview of the consumer site:
- Full page preview with current design settings
- Responsive toggle (desktop/mobile)
- Real-time updates as settings change
- Shows hero, features, products, CTA sections

### LayoutEditor (`layout-editor.tsx`)

Section-based page builder:
- 10 section types available
- Drag-and-drop reordering (@dnd-kit)
- Section visibility toggle
- Per-section configuration
- Add/remove sections

---

## Template CSS System

### How It Works

1. **Template defines tokens** → `WEBSITE_TEMPLATES` in `website-templates.ts`
2. **Brand stores overrides** → `brands` table (colors, fonts, template choice)
3. **Consumer site loads** → CSS custom properties set from merged config
4. **Components read tokens** → `var(--brand-primary)`, `var(--brand-accent)`, etc.

### Token Resolution Order

```
Template Default → Brand Override → Custom CSS
(website-templates.ts) → (brands table)  → (brand custom_css)
```

For example:
- Minimal template sets `accent: #6366F1` (indigo)
- Brand creator changes accent to `#EF4444` (red)
- Brand override wins
- If custom CSS is set, it can further override

### Adding Template-Aware Styles

When building consumer site sections, use the CSS custom properties:

```css
/* In consumer site components */
.hero-heading {
  font-family: var(--brand-font-heading);
  color: var(--brand-primary);
}

.cta-button {
  background: var(--brand-accent);
  border-radius: var(--brand-radius);
}

.page-bg {
  background: var(--brand-secondary);
}
```

### Dark Mode

Each template defines both `light` and `dark` color schemes. The consumer site respects the system preference via `prefers-color-scheme` media query, swapping the CSS custom property values.
