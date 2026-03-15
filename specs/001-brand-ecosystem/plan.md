# Implementation Plan: Mayasura v2 — Clean Rebuild

**Branch**: `v2` | **Date**: 2026-03-15 | **Spec**: [specs/001-brand-ecosystem](./spec.md)
**Input**: 12 feature specifications, design principles, constitution, POC learnings

## Summary

Clean rebuild of Mayasura from scratch, applying all learnings from the POC (v3.6.0-poc). The POC validated the product concept across 57K lines — now we build it properly with strict TypeScript, Drizzle ORM, Zod validation, test-first development, and a disciplined design system.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode, no `any`)  
**Framework**: Next.js 15+ (App Router, Server Components)  
**Primary Dependencies**: Tailwind CSS v4, shadcn/ui, Drizzle ORM, Zod, jose, bcryptjs  
**Storage**: SQLite (development/self-host) via better-sqlite3, Postgres-ready via Drizzle  
**AI Provider**: Anthropic Claude API (provider-agnostic adapter layer)  
**Testing**: Vitest (unit) + Playwright (E2E)  
**Target Platform**: Node.js 20+, self-hostable, Railway/Vercel/Docker  
**Project Type**: Full-stack web application (monorepo single package)  
**Performance Goals**: Lighthouse 90+ on all consumer pages, <2s FCP  
**Constraints**: Zero external service dependencies for core features (AI is optional enhancement)  
**Scale/Scope**: Single-instance SQLite for v2 (Postgres migration path for future multi-tenant)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Open Source First | ✅ Pass | MIT License, no paid tiers, self-hostable |
| II. Honesty Over Hype | ✅ Pass | No fake data in specs — all metrics from real DB |
| III. Preview = Reality | ✅ Pass | SitePreview component uses actual template tokens |
| IV. Composable Architecture | ✅ Pass | Drizzle adapter, AI provider interface, template system |
| V. Test-First Quality | ✅ Pass | E2E + unit tests in plan, Vitest + Playwright from day 1 |
| VI. Design System Discipline | ✅ Pass | Design tokens in CSS custom properties, documented |
| VII. Pixel-Perfect Consistency | ✅ Pass | All states (empty/loading/error/populated) designed |
| VIII. Clean Code Boundaries | ✅ Pass | Pages <300 lines, domain modules, Zod validation |

## Project Structure

### Documentation

```
specs/
├── 001-brand-ecosystem/
│   ├── spec.md              # Overview & index
│   └── plan.md              # This file
├── 002-onboarding-wizard/
│   └── spec.md              # 4 stories, 19 scenarios
├── 003-website-channel/
│   └── spec.md              # 5 stories, 18 scenarios
├── 004-ecommerce-channel/
│   └── spec.md              # 5 stories, 21 scenarios
├── 005-blog-channel/
│   └── spec.md              # 3 stories, 18 scenarios
├── 006-chatbot-channel/
│   └── spec.md              # 2 stories, 14 scenarios
├── 007-analytics-channel/
│   └── spec.md              # 4 stories, 12 scenarios
├── 008-social-channel/
│   └── spec.md              # 2 stories, 8 scenarios
├── 009-email-channel/
│   └── spec.md              # 3 stories, 9 scenarios
├── 010-customer-service/
│   └── spec.md              # 3 stories, 10 scenarios
├── 011-dashboard-admin/
│   └── spec.md              # 4 stories, 22 scenarios
├── 012-design-studio/
│   └── spec.md              # 5 stories, 17 scenarios
└── 013-landing-page/
    └── spec.md              # 4 stories, 13 scenarios
docs/
├── SPEC.md                  # Full reference spec
└── DESIGN-PRINCIPLES.md     # Design system reference
.specify/
└── memory/constitution.md   # 8 development principles
```

### Source Code (v2)

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth group: login, signup
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Landing page
│   │   └── templates/page.tsx    # Template gallery
│   ├── create/                   # Onboarding wizard
│   │   └── page.tsx
│   ├── dashboard/                # Admin dashboard
│   │   └── [brandId]/
│   │       ├── layout.tsx        # Dashboard shell
│   │       ├── page.tsx          # Overview
│   │       ├── products/
│   │       ├── orders/
│   │       ├── blog/
│   │       ├── design/
│   │       ├── chatbot/
│   │       ├── analytics/
│   │       ├── social/
│   │       ├── support/
│   │       ├── testimonials/
│   │       ├── reviews/
│   │       ├── discounts/
│   │       └── settings/
│   ├── site/[slug]/              # Consumer website
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── about/
│   │   ├── contact/
│   │   └── products/
│   ├── shop/[slug]/              # E-commerce
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── product/[id]/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── order/[orderId]/
│   ├── blog/[slug]/              # Public blog
│   │   ├── page.tsx
│   │   └── [postSlug]/page.tsx
│   ├── chat/[slug]/              # AI chatbot
│   │   └── page.tsx
│   └── api/v1/                   # API routes (versioned)
│       ├── auth/
│       ├── brands/
│       ├── ai/
│       └── public/
│
├── components/                   # Shared components
│   ├── ui/                       # Design system primitives (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── toast.tsx
│   │   ├── skeleton.tsx
│   │   ├── empty-state.tsx
│   │   └── ...
│   ├── wizard/                   # Onboarding wizard steps
│   │   ├── step-basics.tsx
│   │   ├── step-identity.tsx
│   │   ├── step-products.tsx
│   │   ├── step-content.tsx
│   │   ├── step-channels.tsx
│   │   └── step-review.tsx
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── sidebar-nav.tsx
│   │   ├── brand-score.tsx
│   │   ├── notification-bell.tsx
│   │   └── onboarding-checklist.tsx
│   ├── site/                     # Consumer site components
│   │   ├── site-preview.tsx      # THE preview = reality component
│   │   ├── hero-section.tsx
│   │   ├── product-card.tsx
│   │   ├── nav-bar.tsx
│   │   ├── footer.tsx
│   │   └── newsletter-popup.tsx
│   ├── design/                   # Design studio components
│   │   ├── color-picker.tsx
│   │   ├── font-picker.tsx
│   │   ├── template-selector.tsx
│   │   └── spacing-controls.tsx
│   └── landing/                  # Landing page sections
│       ├── hero.tsx
│       ├── features.tsx
│       ├── live-demo.tsx
│       └── deploy-section.tsx
│
├── lib/                          # Shared utilities & business logic
│   ├── db/                       # Database layer (Drizzle ORM)
│   │   ├── schema.ts             # All table definitions
│   │   ├── migrations/           # Generated migrations
│   │   ├── client.ts             # Database connection
│   │   ├── brands.ts             # Brand queries
│   │   ├── products.ts           # Product queries
│   │   ├── orders.ts             # Order queries
│   │   ├── blog.ts               # Blog queries
│   │   ├── auth.ts               # User queries
│   │   └── analytics.ts          # Page view queries
│   ├── ai/                       # AI provider layer
│   │   ├── provider.ts           # Provider interface
│   │   ├── anthropic.ts          # Claude implementation
│   │   ├── suggest.ts            # Name/tagline/color suggestions
│   │   ├── content.ts            # Content generation
│   │   └── chatbot.ts            # Chat completion
│   ├── auth/                     # Authentication
│   │   ├── jwt.ts                # Token creation/verification
│   │   ├── middleware.ts         # Route protection
│   │   └── guards.ts            # requireAuth, requireBrandOwner
│   ├── templates/                # Template system
│   │   ├── definitions.ts        # 16 template configs
│   │   ├── starters.ts          # 10 starter brand configs
│   │   └── renderer.ts          # Template → CSS variables
│   ├── design/                   # Design system
│   │   ├── tokens.ts            # Design token definitions
│   │   ├── colors.ts            # Color utilities, WCAG checks
│   │   ├── fonts.ts             # Font definitions, Google Fonts URL builder
│   │   └── settings.ts          # Button shapes, spacing, etc.
│   ├── validation/              # Zod schemas
│   │   ├── brand.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── auth.ts
│   │   └── common.ts            # Shared validators (slug, email, etc.)
│   └── utils.ts                 # cn(), formatters, etc.
│
├── styles/                       # Global styles
│   ├── globals.css               # Design tokens, CSS custom properties
│   ├── templates.css             # Template-specific CSS
│   └── animations.css            # Animation keyframes
│
└── __tests__/                    # Test files (mirror src structure)
    ├── e2e/
    │   ├── signup-wizard.spec.ts
    │   ├── dashboard-crud.spec.ts
    │   ├── consumer-site.spec.ts
    │   └── shop-checkout.spec.ts
    └── unit/
        ├── db/
        ├── ai/
        ├── auth/
        └── validation/
```

### Key Architectural Changes from POC

| Area | POC (v3.6.0) | v2 |
|------|-------------|-----|
| Database | 1 monolithic `db.ts` (1,833 lines) | Drizzle ORM with domain modules (`db/brands.ts`, `db/products.ts`, etc.) |
| Validation | Ad-hoc sanitization | Zod schemas on all API inputs |
| API | `/api/` flat | `/api/v1/` versioned with consistent response envelope |
| AI | Direct Anthropic SDK calls | Provider-agnostic interface (`ai/provider.ts`) |
| Components | 72 files, some 800+ lines | Max 300 lines per file, strict component boundaries |
| Design tokens | Scattered in globals.css + inline | Centralized in `lib/design/tokens.ts` → CSS variables |
| Templates | Mixed in `website-templates.ts` + CSS | Clean separation: `templates/definitions.ts` + `templates.css` |
| Testing | Minimal, broken tests | Vitest + Playwright from day 1 |
| Auth | JWT + middleware | Same, but with Zod-validated inputs and proper guards |
| Error handling | Inconsistent | Consistent envelope: `{ data?, error?, meta? }` |

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal**: Clean project setup with design system, database, auth, and testing infrastructure. No features yet — just the skeleton.

**Deliverables**:
- Next.js 15 project with strict TypeScript
- Tailwind CSS v4 with design tokens from `DESIGN-PRINCIPLES.md`
- shadcn/ui component library initialized
- Drizzle ORM + SQLite with full schema (all 23 tables)
- Auth module (signup, login, logout, JWT, middleware)
- Zod validation schemas for all entities
- Vitest + Playwright configured
- API response envelope utility
- CI: TypeScript check + tests on every push

**Depends on**: Nothing — start immediately

---

### Phase 2: Onboarding Wizard + Brand Engine (Week 2)

**Goal**: Users can sign up and create a brand via the 6-step wizard. AI features work when API key is set.

**Spec**: [002-onboarding-wizard](../002-onboarding-wizard/spec.md)

**Deliverables**:
- Sign up / login pages
- 6-step wizard: Basics → Identity → Products → Content → Channels → Review
- Brand CRUD API with unique slug enforcement
- AI suggestion APIs (names, taglines, colors) with graceful degradation
- Template definitions (16 templates) + starter templates (10)
- SitePreview component in wizard review step
- Draft auto-save to localStorage
- E2E test: full signup → wizard → brand creation flow

**Depends on**: Phase 1 (foundation)

---

### Phase 3: Consumer Website + Design Studio (Week 3)

**Goal**: Brands have a live consumer site that matches the design studio preview exactly.

**Specs**: [003-website](../003-website-channel/spec.md), [012-design-studio](../012-design-studio/spec.md)

**Deliverables**:
- Consumer site layout with template rendering
- Homepage, About, Contact, Products pages
- All 16 templates rendering with correct fonts/colors/layout
- Design studio: template switching, color picker, font picker, spacing, buttons
- Save design settings to DB → consumer site reflects changes
- SitePreview integration in design studio (preview = reality)
- SEO: meta tags, JSON-LD, OG images, sitemap
- E2E test: change template in design studio → verify consumer site matches

**Depends on**: Phase 2 (brands exist)

---

### Phase 4: E-Commerce + Blog (Week 4)

**Goal**: Brands can sell products and publish blog content.

**Specs**: [004-ecommerce](../004-ecommerce-channel/spec.md), [005-blog](../005-blog-channel/spec.md)

**Deliverables**:
- Shop: product listing, product detail, cart, checkout, order confirmation
- Order management dashboard (list, status updates, detail view)
- Discount codes (create, validate, apply at checkout)
- Product reviews (submit, moderate, display)
- Blog: AI 4-step writer, post CRUD, publish workflow
- Consumer blog: listing with categories, individual post with TOC
- E2E tests: full checkout flow, blog publish flow

**Depends on**: Phase 3 (consumer site works)

---

### Phase 5: Chatbot + Support + Analytics (Week 5)

**Goal**: AI chatbot, customer support tickets, and analytics.

**Specs**: [006-chatbot](../006-chatbot-channel/spec.md), [010-customer-service](../010-customer-service/spec.md), [007-analytics](../007-analytics-channel/spec.md)

**Deliverables**:
- AI chatbot: chat interface, brand context, FAQ integration, session history
- Admin chatbot config: tone controls, greeting, FAQ editing
- Contact form → ticket creation
- Ticket management dashboard (list, status, reply)
- Analytics: page view tracking pixel, charts, device breakdown, referrers
- Date range filtering, comparison with previous period
- E2E tests: chatbot conversation, ticket flow, analytics rendering

**Depends on**: Phase 4 (products and content exist for chatbot context)

---

### Phase 6: Remaining Channels + Dashboard Polish (Week 6)

**Goal**: Complete all remaining features and polish the dashboard.

**Specs**: [008-social](../008-social-channel/spec.md), [009-email](../009-email-channel/spec.md), [011-dashboard](../011-dashboard-admin/spec.md)

**Deliverables**:
- Social media preview (Twitter, IG, LinkedIn, SERP mockups)
- AI social post generation
- Newsletter subscription (consumer popup + form)
- Subscriber management dashboard + CSV export
- Dashboard overview: real metrics, brand score, activity feed, quick actions
- Notification system, command palette, keyboard shortcuts
- Brand settings: export/import, integrations tab
- Testimonials management (CRUD, drag-and-drop, featured toggle)

**Depends on**: Phase 5

---

### Phase 7: Landing Page + Deploy + Final Polish (Week 7)

**Goal**: Production-ready with landing page, deployment templates, and full quality audit.

**Spec**: [013-landing-page](../013-landing-page/spec.md)

**Deliverables**:
- Landing page (honest, OSS-focused, no fake data)
- Template gallery page
- Dockerfile + docker-compose.yml
- Railway one-click deploy template
- README with setup instructions
- Full dark mode audit (every page)
- Full mobile audit (every page at 375px, 768px, 1280px)
- Full accessibility audit (WCAG 2.1 AA)
- Lighthouse check on consumer pages (target: 90+ all categories)
- Final E2E test suite green

**Depends on**: Phase 6

---

## Dependencies & Execution Order

```
Phase 1: Foundation
    ↓
Phase 2: Wizard + Brands
    ↓
Phase 3: Consumer Site + Design Studio
    ↓
Phase 4: E-Commerce + Blog
    ↓
Phase 5: Chatbot + Support + Analytics
    ↓
Phase 6: Social + Email + Dashboard Polish
    ↓
Phase 7: Landing + Deploy + Final QA
```

### Parallel Opportunities
- Within each phase, frontend and backend work can proceed in parallel
- Component development (UI primitives) can happen alongside API development
- E2E test writing can start as soon as the feature is functionally complete
- Design token refinement is ongoing throughout all phases

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Template rendering inconsistency | SitePreview and consumer site share the same rendering logic — not separate implementations |
| Database migration complexity | Drizzle ORM generates migrations from schema — no manual SQL |
| AI provider lock-in | Provider interface abstracts Anthropic; can add OpenAI/Gemini later |
| Performance on consumer sites | Server Components default, lazy loading, image optimization from day 1 |
| Scope creep | Specs have clear acceptance scenarios — a feature is done when scenarios pass |
| Design inconsistency | Single design token file → CSS variables → all components. No one-off styles allowed. |

---

## Notes

- Each phase ends with a deployable increment (MVP at Phase 2, progressively enhanced)
- POC code is preserved at tag `v3.6.0-poc` for reference — do not copy-paste from it
- All code written fresh, informed by POC learnings but not inheriting its technical debt
- Constitution compliance check at every phase boundary
