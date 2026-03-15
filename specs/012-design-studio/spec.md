# Feature Specification: Design Studio

**Feature Branch**: `012-design-studio`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/dashboard/[brandId]/design/page.tsx, src/components/design/*.tsx

## User Scenarios & Testing

### User Story 1 — Template Selection with Live Preview (Priority: P1)

Brand owner selects from 16 website templates at /dashboard/[brandId]/design. Each template is previewed in real-time before applying, and the preview matches reality (Constitution Principle III).

**Why this priority**: Template is the foundation of the brand's visual identity. Getting it right is critical.

**Independent Test**: Switch between templates, verify preview updates, save, visit consumer site, confirm it matches.

**Acceptance Scenarios**:

1. **Given** design studio, **When** it loads, **Then** current template is highlighted with preview showing brand data
2. **Given** template gallery, **When** admin clicks a template, **Then** live preview updates instantly with the template's fonts, colors, layout, and card styles
3. **Given** template preview, **When** it renders, **Then** it uses the same `designSettingsToCSSVars()` function as the consumer site (preview = reality guarantee)
4. **Given** template selection, **When** admin saves, **Then** template ID is stored via PUT /api/brands/[id]/settings
5. **Given** 16 templates, **When** each is previewed, **Then** hero layout, card style, nav style, typography, and border radius match the template definition

---

### User Story 2 — Color System Customization (Priority: P1)

Brand owner customizes their color palette: text, muted, surface, border, plus primary/secondary/accent colors. WCAG contrast is validated in real-time.

**Why this priority**: Color is the most immediately visible brand differentiator.

**Independent Test**: Change colors, verify live preview updates, check WCAG validation, save, verify consumer site reflects changes.

**Acceptance Scenarios**:

1. **Given** color system panel, **When** it loads, **Then** current colors show for: primary, secondary, accent, text, muted, surface, border
2. **Given** a color picker, **When** admin changes accent color, **Then** preview updates immediately
3. **Given** color system, **When** contrast issues exist, **Then** warning/error indicators show with specific ratio (e.g., "Text on background: 3.2:1, need ≥4.5:1")
4. **Given** contrast errors, **When** admin clicks "Auto-fix", **Then** `autoFixColorSystem()` adjusts colors to meet WCAG AA while preserving palette vibe
5. **Given** predefined palettes, **When** admin selects one, **Then** all color fields update to that palette
6. **Given** template has built-in palette, **When** template changes, **Then** colors optionally update to template defaults

---

### User Story 3 — Font & Typography Selection (Priority: P2)

Brand owner selects heading and body font pairs from available Google Fonts, with live preview.

**Why this priority**: Typography significantly affects brand perception.

**Independent Test**: Change fonts, verify preview uses selected fonts, save, verify consumer site loads correct fonts.

**Acceptance Scenarios**:

1. **Given** font picker, **When** it loads, **Then** current heading and body fonts are shown with previews
2. **Given** font selection, **When** admin picks "Playfair Display" for headings, **Then** preview updates heading font immediately
3. **Given** template switch, **When** a template is selected, **Then** recommended font pair is pre-selected

---

### User Story 4 — Spacing, Borders & Button Customization (Priority: P2)

Brand owner customizes spacing density, border radius, and button appearance (shape, size, variant).

**Why this priority**: These micro-level controls let brands fine-tune their personality.

**Independent Test**: Change spacing to "spacious", button shape to "pill", verify preview reflects changes, save, verify consumer site.

**Acceptance Scenarios**:

1. **Given** spacing controls, **When** admin selects "Spacious", **Then** preview section padding increases to 96px and card gap to 24px
2. **Given** border radius presets, **When** admin selects "Extra-rounded" (16px), **Then** preview cards and inputs use 16px radius
3. **Given** button shape controls, **When** admin selects "Pill" (9999px), **Then** preview buttons become fully rounded
4. **Given** button size controls, **When** admin selects "Large", **Then** preview buttons use larger padding (28px/14px) and font (15px)
5. **Given** button variant controls, **When** admin selects "Outline", **Then** preview buttons show transparent background with accent border
6. **Given** all design changes, **When** admin saves, **Then** all settings are persisted via PUT /api/brands/[id]/settings (one setting per key)

---

### User Story 5 — Custom CSS (Priority: P3)

Brand owner adds custom CSS that is injected into the consumer site for advanced customization beyond the Design Studio controls.

**Why this priority**: Power users need escape hatches for custom styling.

**Independent Test**: Add custom CSS, verify it appears on consumer site, verify it doesn't break template styling.

**Acceptance Scenarios**:

1. **Given** custom CSS textarea, **When** admin enters CSS, **Then** preview applies it
2. **Given** custom CSS, **When** saved, **Then** it's injected as a `<style>` tag on the consumer site
3. **Given** custom CSS with errors, **When** it's applied, **Then** it doesn't break the page (browser ignores invalid CSS)

---

### Edge Cases

- What happens when colors fail WCAG after save? → Consumer site auto-fixes via `autoFixColorSystem()` safety net
- What happens when custom font fails to load? → Fallback to Inter/system-ui
- What happens when all design settings are reset? → Template defaults are applied
- What happens when template is changed after extensive customization? → Colors/fonts can optionally reset to template defaults

## Requirements

### Functional Requirements

- **FR-001**: Design Studio MUST offer 16 templates with real-time preview
- **FR-002**: Preview MUST use identical CSS variable generation as consumer site (`designSettingsToCSSVars()`)
- **FR-003**: Color system MUST support primary, secondary, accent, text, muted, surface, border colors
- **FR-004**: Color system MUST validate WCAG AA contrast in real-time with `validateColorSystem()`
- **FR-005**: Auto-fix MUST adjust colors to meet contrast requirements via `autoFixColorSystem()`
- **FR-006**: Font picker MUST support Google Fonts with live preview
- **FR-007**: Spacing density MUST offer 4 presets: Compact, Normal, Generous, Spacious
- **FR-008**: Border radius MUST offer 5 presets: None, Subtle, Rounded, Extra-rounded, Pill
- **FR-009**: Button customization MUST support shape (4 options), size (3 options), variant (3 options)
- **FR-010**: Custom CSS MUST be supported with live preview and consumer site injection
- **FR-011**: All settings MUST persist via the settings API
- **FR-012**: Template preview MUST show representative brand content (hero, cards, buttons)

### Key Entities

- **DesignSettings**: website_template, text_color, muted_color, surface_color, border_color, button_shape, button_size, button_variant, spacing_density, border_radius, custom_css, animation_style
- **WebsiteTemplate**: 16 templates with fonts, colors, and preview configuration

## Success Criteria

### Measurable Outcomes

- **SC-001**: Preview updates within 100ms of any setting change
- **SC-002**: Design Studio preview matches consumer site rendering with 100% fidelity
- **SC-003**: WCAG validation catches 100% of contrast failures
- **SC-004**: Auto-fix resolves all contrast errors while maintaining palette intent
- **SC-005**: Font changes are reflected on consumer site after save and page refresh
