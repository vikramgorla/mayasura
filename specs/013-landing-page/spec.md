# Feature Specification: Landing Page

**Feature Branch**: `013-landing-page`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis — src/app/page.tsx, src/components/landing/*.tsx

## User Scenarios & Testing

### User Story 1 — Visitor Discovers Mayasura (Priority: P1)

A visitor arrives at the Mayasura homepage (/) and understands what Mayasura is, sees its features, watches a live demo, browses templates, learns how it works, and finds deployment instructions — all honest, no fake data.

**Why this priority**: The landing page is the primary conversion surface for the open-source project.

**Independent Test**: Visit /, scroll through all sections, verify all content is accurate, interactive elements work, links are valid.

**Acceptance Scenarios**:

1. **Given** landing page, **When** hero loads, **Then** it shows "Build your [typing effect] in minutes" with cycling brand types (Restaurant, Boutique, Agency, Studio, Clinic, Startup, Portfolio, Brand)
2. **Given** hero section, **When** typing effect renders, **Then** cursor blinks, words type at 80ms/char, pause 1.8s, delete at 45ms/char, cycling through all types
3. **Given** hero, **When** CTA buttons render, **Then** "Get Started — It's Free" (links to /create) and "View on GitHub" (external link) are shown
4. **Given** below hero, **When** scrolling, **Then** 6 feature cards appear with staggered fade-up animations: AI Branding, Design Studio, E-Commerce, Blog & Content, Customer Support, Analytics
5. **Given** feature grid, **When** cards render, **Then** each has gradient icon background, title, and honest description

---

### User Story 2 — Live Demo & Template Showcase (Priority: P1)

Visitor interacts with a live demo showing a brand creation preview and browses all 16 available templates.

**Why this priority**: Showing the product in action is the strongest conversion tool.

**Independent Test**: Interact with live demo, browse templates, verify all 16 render correctly.

**Acceptance Scenarios**:

1. **Given** live demo section, **When** it loads (lazy-loaded), **Then** interactive brand creation preview appears
2. **Given** template showcase, **When** it renders, **Then** all 16 templates are displayed with name, description, color preview, and "best for" tags
3. **Given** a template card, **When** user clicks "Use Template", **Then** they navigate to /create?template=[id]

---

### User Story 3 — How It Works & Deploy (Priority: P2)

Visitor understands the 3-step process and finds deployment instructions.

**Why this priority**: Clear value proposition and easy setup drive adoption.

**Independent Test**: Verify 3-step flow renders with correct descriptions, deploy section shows real commands.

**Acceptance Scenarios**:

1. **Given** "How it Works" section, **When** it renders, **Then** 3 steps show: (01) Tell us about your brand, (02) AI builds your ecosystem, (03) Launch & grow — with badge labels "2 min", "Instant", "Live"
2. **Given** deploy section, **When** it renders, **Then** real deployment commands are shown (git clone, npm install, npm run dev)
3. **Given** deploy section, **When** technology stack is listed, **Then** it shows Next.js 15, SQLite, Anthropic Claude, Tailwind CSS

---

### User Story 4 — FAQ & Footer (Priority: P3)

Visitor finds answers to common questions and project information.

**Why this priority**: FAQ reduces friction and builds trust.

**Independent Test**: Verify FAQ accordion works, all questions have accurate answers, footer links are valid.

**Acceptance Scenarios**:

1. **Given** FAQ section, **When** it renders, **Then** accordion shows questions about what Mayasura is, pricing (free), AI features, self-hosting, etc.
2. **Given** FAQ item, **When** clicked, **Then** answer expands with smooth animation
3. **Given** footer, **When** it renders, **Then** it shows Mayasura branding, "Built with ❤️" message, and GitHub link
4. **Given** responsive mobile viewport, **When** landing page renders, **Then** hero stacks CTAs vertically, feature grid becomes single column, no horizontal overflow

---

### Edge Cases

- What happens on very small screens (< 320px)? → Hero padding adjusts, CTAs stack, no overflow
- What happens when JavaScript is disabled? → Static content renders, typing effect shows first word
- What happens when lazy-loaded demo fails? → Skeleton placeholder shows

## Requirements

### Functional Requirements

- **FR-001**: Hero MUST show typing effect cycling through brand types at specified speeds
- **FR-002**: Hero MUST include two CTAs: "Get Started" and "View on GitHub"
- **FR-003**: Feature grid MUST show 6 features with gradient icon backgrounds and honest descriptions
- **FR-004**: Live demo section MUST be lazy-loaded for performance
- **FR-005**: Template showcase MUST display all 16 templates with metadata and "Use Template" links
- **FR-006**: "How it Works" MUST show 3 steps with numbered cards and time badges
- **FR-007**: Deploy section MUST show real, accurate deployment commands
- **FR-008**: FAQ MUST use accordion pattern with smooth expand/collapse
- **FR-009**: All content MUST be honest (Constitution Principle II) — no fake user counts or testimonials
- **FR-010**: Page MUST be fully responsive with no horizontal overflow
- **FR-011**: Scroll animations MUST use staggered fade-up variants
- **FR-012**: Mobile nav MUST include hamburger menu with all page sections

### Key Entities

- **Feature**: icon, title, description, gradient color
- **Step**: number, title, description, icon, badge
- **FAQ**: question, answer
- **Template**: id, name, description, bestFor[], colors

## Success Criteria

### Measurable Outcomes

- **SC-001**: Landing page achieves Lighthouse Performance score ≥ 90
- **SC-002**: Above-the-fold content renders in under 1.5 seconds
- **SC-003**: Live demo section loads within 3 seconds of scrolling into view
- **SC-004**: All 16 templates are visible and correctly styled in the showcase
- **SC-005**: Zero horizontal overflow on viewports from 320px to 2560px
- **SC-006**: All content is factually accurate — no inflated metrics or fabricated testimonials
