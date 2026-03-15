# Feature Specification: Dashboard Admin Shell

**Feature Branch**: `011-dashboard-admin`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/dashboard/[brandId]/layout.tsx, page.tsx, settings/page.tsx

## User Scenarios & Testing

### User Story 1 — Dashboard Overview (Priority: P1)

Brand owner visits /dashboard/[brandId] and sees a comprehensive overview: welcome banner, key metrics, brand score, quick actions, revenue chart, AI insights, recent activity, and live ecosystem links.

**Why this priority**: The overview is the daily command center. It must provide instant actionable context.

**Independent Test**: Login, navigate to dashboard, verify all sections render with real data.

**Acceptance Scenarios**:

1. **Given** dashboard overview, **When** it loads, **Then** time-aware welcome banner shows (Good morning/afternoon/evening + brand name) with motivational copy
2. **Given** overview, **When** key metrics render, **Then** 4 metric cards show: Page Views, Unique Visitors, Subscribers, Revenue — each with animated counter, sparkline, and trend badge
3. **Given** overview, **When** brand score card loads, **Then** it shows a score (0–100) calculated from completeness checks (name, tagline, products, content, etc.)
4. **Given** overview, **When** quick actions render, **Then** 8 actions show in 2×4 grid: Add Product, Write Blog Post, Design Site, View Analytics, Manage Chat, Share Site, Manage Orders, AI Strategy
5. **Given** overview, **When** revenue chart loads, **Then** dual-axis area chart shows traffic (violet) and revenue (emerald) over 7 days
6. **Given** overview, **When** AI insights card loads, **Then** contextual recommendation based on brand data (traffic trend, product count, blog status, open tickets)
7. **Given** overview, **When** recent activity loads, **Then** timeline shows brand events (brand created, products added, posts published, orders) with emoji icons and "time ago" labels
8. **Given** a launched brand, **When** live ecosystem section renders, **Then** 4 links show: Website, Shop, Blog, Chatbot — each opening in new tab
9. **Given** incomplete onboarding, **When** checklist renders, **Then** completed/pending items show with progress (e.g., "4/6 setup steps complete")

---

### User Story 2 — Dashboard Layout & Navigation (Priority: P1)

Dashboard has a persistent sidebar (desktop) or hamburger menu (mobile) with 16 navigation items, theme toggle, export, keyboard shortcuts, and notification bell.

**Why this priority**: Navigation is present on every dashboard page. Must be reliable and discoverable.

**Independent Test**: Navigate between all dashboard sections, verify sidebar highlighting, mobile menu, and keyboard shortcuts.

**Acceptance Scenarios**:

1. **Given** desktop viewport, **When** dashboard loads, **Then** 256px sidebar shows with brand avatar, name, tagline, and 16 nav items
2. **Given** sidebar, **When** current route matches a nav item, **Then** active indicator (animated violet bar via layoutId) highlights that item
3. **Given** mobile viewport, **When** hamburger is tapped, **Then** slide-in sidebar overlay appears (spring animation, backdrop blur)
4. **Given** sidebar footer, **When** it renders, **Then** it shows: What's New badge, Export Brand Data, Light/Dark Mode toggle, color swatches, font info, ⌘K Palette hint, ⌘? Shortcuts button, user nav, notification bell
5. **Given** any dashboard page, **When** user presses ⌘K, **Then** command palette opens for quick navigation
6. **Given** any dashboard page, **When** user presses ⌘?, **Then** keyboard shortcuts modal opens
7. **Given** mobile header, **When** it renders, **Then** it shows brand icon, name, notification bell, and theme toggle

---

### User Story 3 — Brand Settings (Priority: P2)

Brand owner manages settings at /dashboard/[brandId]/settings — updating brand info, colors, fonts, channels, slug, and status. Includes data export and import.

**Why this priority**: Settings are where brand identity is refined post-launch.

**Independent Test**: Update brand name, change colors, toggle channels, export/import data, verify all changes persist.

**Acceptance Scenarios**:

1. **Given** settings page, **When** it loads, **Then** all editable fields show: name, tagline, description, industry, primary/secondary/accent colors, heading/body fonts, channels, status
2. **Given** color fields, **When** admin changes accent color, **Then** color picker updates and save persists the change
3. **Given** channels section, **When** admin toggles a channel, **Then** channel array is updated
4. **Given** settings, **When** admin clicks "Export Brand Data", **Then** JSON file downloads with complete brand data
5. **Given** settings, **When** admin imports a JSON file, **Then** brand data is updated from the import
6. **Given** settings, **When** admin changes status to "draft", **Then** consumer site returns 404

---

### User Story 4 — Notification System (Priority: P3)

Notification bell shows recent brand events. Tips and announcement banners provide contextual guidance.

**Why this priority**: Notifications keep admins informed without requiring dashboard checks.

**Independent Test**: Trigger a brand event, verify notification appears in bell dropdown.

**Acceptance Scenarios**:

1. **Given** notification bell, **When** clicked, **Then** dropdown shows recent notifications (orders, contacts, milestones)
2. **Given** dashboard overview, **When** it loads, **Then** random tip banner shows with dismiss option and action link
3. **Given** a milestone achieved (first product, first blog, first visitor), **When** dashboard detects it, **Then** celebration toast + confetti shows once per milestone

---

### Edge Cases

- What happens when brand ID doesn't exist? → "Brand not found" page with link to /dashboard
- What happens when analytics API fails? → Metric cards show 0 with no trend
- What happens when localStorage is unavailable? → Milestones and dismissed tips are not persisted
- What happens when brand has no activity? → Activity timeline shows empty state

## Requirements

### Functional Requirements

- **FR-001**: Dashboard layout MUST provide persistent sidebar (desktop) and hamburger menu (mobile)
- **FR-002**: Sidebar MUST show 16 nav items with animated active indicator
- **FR-003**: Overview MUST show welcome banner, metrics, brand score, quick actions, charts, AI insights, activity
- **FR-004**: Command palette (⌘K) MUST provide quick navigation to all dashboard sections
- **FR-005**: AI command palette MUST allow AI-generated brand name, tagline, and color changes
- **FR-006**: Keyboard shortcuts (⌘?) MUST be documented in a modal
- **FR-007**: Theme toggle MUST switch between light and dark mode
- **FR-008**: Export MUST download complete brand data as JSON
- **FR-009**: Import MUST accept JSON and update brand data
- **FR-010**: Settings MUST allow editing all brand properties
- **FR-011**: Notification bell MUST show recent brand events
- **FR-012**: Page transitions MUST use Framer Motion fade + slide
- **FR-013**: Dashboard pages MUST include noindex meta tag
- **FR-014**: Critical routes MUST be prefetched after initial render (2s delay)
- **FR-015**: Breadcrumbs MUST show navigation hierarchy on all pages

### Key Entities

- **Brand**: All brand properties (name, tagline, colors, fonts, channels, status, etc.)
- **Notification**: id, brand_id, type, message, read, created_at
- **BrandScore**: score (0–100), recommendations[]
- **Activity**: id, type, description, created_at, metadata

## Success Criteria

### Measurable Outcomes

- **SC-001**: Dashboard overview loads all sections in under 3 seconds
- **SC-002**: Sidebar navigation switches sections in under 200ms
- **SC-003**: Command palette opens in under 100ms from keypress
- **SC-004**: Mobile menu animation completes in under 300ms
- **SC-005**: Brand score accurately reflects completeness (all 10 checks)
- **SC-006**: All data displayed is real (from DB), never fabricated
