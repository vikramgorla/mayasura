# Feature Specification: Website Channel

**Feature Branch**: `003-website-channel`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/site/[slug]/*.tsx, src/components/site/*.tsx, src/lib/website-templates.ts

## User Scenarios & Testing

### User Story 1 — Consumer Views Brand Homepage (Priority: P1)

A consumer visits /site/[slug] and sees a complete, template-driven brand website with hero, features, products, blog posts, testimonials, and CTA sections — all rendered from real brand data.

**Why this priority**: The consumer-facing website is the primary output of Mayasura. It must be polished, fast, and template-accurate.

**Independent Test**: Visit /site/[slug] for a launched brand, verify all sections render with real data, template styling matches specification, and responsive behavior is correct.

**Acceptance Scenarios**:

1. **Given** a launched brand with template "editorial", **When** consumer visits /site/[slug], **Then** page renders with Playfair Display headings, split hero layout, flat card style, and editorial nav
2. **Given** a brand with products, **When** homepage loads, **Then** products section shows up to 3 (or 4 for Bold) products with category labels, prices, and "View All" link
3. **Given** a brand with blog posts, **When** homepage loads, **Then** blog section shows latest 3 posts with category, title, and excerpt
4. **Given** a brand with testimonials, **When** homepage loads, **Then** testimonials render as grid (≤3) or auto-playing carousel (>3) with star ratings
5. **Given** any template, **When** homepage loads, **Then** hero section renders with brand tagline, description, and CTA buttons matching the template's hero style (centered/left-aligned/split/full-width/stacked)
6. **Given** the "bold" template, **When** page renders, **Then** all text is uppercase, borders are 2px, border-radius is 0, and background is black
7. **Given** the "playful" template, **When** page renders, **Then** cards have 20px radius, pastel backgrounds, and spring hover animations

---

### User Story 2 — Template-Accurate Navigation & Footer (Priority: P1)

Consumer site has sticky nav with template-specific styling, search overlay (⌘K), mobile hamburger menu, and footer with newsletter subscription.

**Why this priority**: Navigation is present on every page. It must be responsive, accessible, and template-accurate.

**Independent Test**: Verify nav renders correctly across all 16 templates, mobile menu works, search overlay opens, and footer newsletter form submits.

**Acceptance Scenarios**:

1. **Given** any template, **When** user scrolls down, **Then** nav transitions to frosted glass (backdrop-blur + saturate) with subtle border
2. **Given** desktop viewport, **When** nav renders, **Then** it shows Home, About, Products, Blog, Contact links + Search icon + Shop button
3. **Given** mobile viewport, **When** hamburger is tapped, **Then** animated slide-down menu appears with all links + Shop, 44px touch targets
4. **Given** any page, **When** user presses ⌘K or clicks search icon, **Then** search overlay opens with live search results from /api/public/brand/[slug]/search
5. **Given** footer, **When** user enters email and clicks Subscribe, **Then** POST /api/public/brand/[slug]/newsletter is called, success message appears
6. **Given** "bold" template, **When** nav renders, **Then** links are uppercase with 0.12em letter-spacing and 2px bottom border

---

### User Story 3 — About, Contact, and Products Pages (Priority: P2)

Consumer can navigate to /site/[slug]/about, /site/[slug]/contact, and /site/[slug]/products for detailed content.

**Why this priority**: Secondary pages complete the website experience and drive engagement.

**Independent Test**: Visit each subpage, verify content renders and forms work.

**Acceptance Scenarios**:

1. **Given** about page, **When** it loads, **Then** brand description, mission, and story are rendered in template-appropriate style
2. **Given** contact page, **When** user fills form and submits, **Then** POST /api/public/brand/[slug]/contact creates a support ticket
3. **Given** products page, **When** it loads, **Then** all products are displayed in a responsive grid with category filters

---

### User Story 4 — SEO, Accessibility & Consumer Experience (Priority: P2)

The consumer site includes proper SEO meta tags, JSON-LD structured data, cookie consent, newsletter popup, scroll-to-top, and accessibility features.

**Why this priority**: SEO and accessibility are essential for real-world deployment.

**Independent Test**: Inspect HTML head for meta tags, verify JSON-LD, test keyboard navigation, screen reader compatibility.

**Acceptance Scenarios**:

1. **Given** any page, **When** HTML head is inspected, **Then** title, description, canonical URL, and Open Graph tags are present
2. **Given** homepage, **When** structured data is checked, **Then** Organization JSON-LD is present with brand name, description, URL, logo
3. **Given** any page, **When** user presses Tab, **Then** "Skip to content" link appears and focus indicators are visible (2px accent outline)
4. **Given** first visit, **When** 30 seconds pass, **Then** newsletter popup appears (dismissible, brand-styled)
5. **Given** any page, **When** user scrolls down, **Then** scroll-to-top button appears with accent color
6. **Given** first visit, **When** page loads, **Then** cookie consent banner appears at bottom

---

### User Story 5 — Color Accessibility Safety Net (Priority: P2)

The consumer site automatically fixes color contrast issues to ensure readability.

**Why this priority**: Brands may choose problematic color combinations. The system must guarantee readability.

**Independent Test**: Create a brand with low-contrast colors, verify consumer site auto-fixes text/background contrast.

**Acceptance Scenarios**:

1. **Given** a brand with low-contrast text/background, **When** site layout loads, **Then** `validateColorSystem()` detects errors and `autoFixColorSystem()` adjusts text, muted, surface, and border colors
2. **Given** fixed colors, **When** page renders, **Then** all text meets WCAG AA contrast ratios (≥4.5:1 normal, ≥3:1 large)

---

### Edge Cases

- What happens when brand slug doesn't exist? → 404 page with SVG illustration, "Back to Mayasura" and "Go Back" buttons
- What happens when brand is not yet launched? → 404 page
- What happens when Google Fonts fail to load? → System falls back to Inter/system-ui
- What happens when brand has no products? → Products section is hidden from homepage
- What happens when brand has no blog posts? → Blog section is hidden from homepage

## Requirements

### Functional Requirements

- **FR-001**: System MUST render consumer sites at /site/[slug] using the brand's chosen template
- **FR-002**: System MUST support all 16 templates with distinct hero, card, nav, button, and section styles
- **FR-003**: System MUST apply Design Studio settings (spacing, border radius, button shape/size/variant) via CSS custom properties
- **FR-004**: Nav MUST be sticky with frosted-glass scroll effect, mobile hamburger, and ⌘K search
- **FR-005**: Footer MUST include newsletter subscription form and page links
- **FR-006**: System MUST include SEO meta tags, Open Graph, and JSON-LD structured data
- **FR-007**: System MUST track page views via POST /api/public/brand/[slug]/track on mount
- **FR-008**: System MUST auto-fix color accessibility issues using `autoFixColorSystem()`
- **FR-009**: System MUST load brand fonts dynamically via Google Fonts
- **FR-010**: System MUST show cookie consent, newsletter popup, and scroll-to-top
- **FR-011**: All interactive elements MUST have 44px minimum touch target on touch devices
- **FR-012**: System MUST respect `prefers-reduced-motion` and animation intensity setting

### Key Entities

- **Brand**: name, tagline, description, industry, primary_color, secondary_color, accent_color, font_heading, font_body, logo_url, slug, channels, status
- **WebsiteTemplate**: id, name, fonts, colors (light/dark), preview config (heroStyle, cardStyle, navStyle, typography, spacing, borderRadius, accentUsage)
- **ResolvedDesignSettings**: textColor, mutedColor, surfaceColor, borderColor, buttonShape, buttonSize, buttonVariant, spacingDensity, borderRadius

## Success Criteria

### Measurable Outcomes

- **SC-001**: Consumer homepage loads and renders in under 2 seconds on 3G
- **SC-002**: All 16 templates produce visually distinct sites with correct styling
- **SC-003**: WCAG AA contrast ratios are met on 100% of brand sites (auto-fix guarantees this)
- **SC-004**: Mobile viewport renders correctly with no horizontal overflow
- **SC-005**: All interactive elements pass 44px touch target requirement
