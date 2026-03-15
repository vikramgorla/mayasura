# Feature Specification: Brand Ecosystem — Overview

**Feature Branch**: `001-brand-ecosystem`  
**Created**: 2026-03-15  
**Status**: Index  
**Input**: POC analysis of Mayasura v3.6.0 (57K lines, 261 files, 23 tables, 53 API routes)

## Overview

Mayasura enables brands to instantiate their complete digital consumer communication ecosystem in minutes. This specification is organized as a suite of focused feature specs, each independently testable and deployable.

## Architecture

A brand flows through these stages:

```
Creation (Wizard) → Configuration (Dashboard) → Consumer Experience (Public Sites)
```

### Feature Specifications

| # | Feature | Path | Consumer Path | Description |
|---|---------|------|---------------|-------------|
| [002](../002-onboarding-wizard/spec.md) | **Onboarding Wizard** | /create | — | 6-step brand creation: Basics → Identity → Products → Content → Channels → Review & Launch |
| [003](../003-website-channel/spec.md) | **Website Channel** | — | /site/[slug] | 16-template consumer website: Homepage, About, Contact, Products |
| [004](../004-ecommerce-channel/spec.md) | **E-Commerce Channel** | — | /shop/[slug] | Product catalog, cart, checkout, orders, discounts, reviews |
| [005](../005-blog-channel/spec.md) | **Blog Channel** | /dashboard/[id]/blog | /blog/[slug] | Blog management, AI writer, consumer reading experience |
| [006](../006-chatbot-channel/spec.md) | **Chatbot Channel** | /dashboard/[id]/chatbot | /chat/[slug] | AI chatbot with brand voice, FAQs, admin tone controls |
| [007](../007-analytics-channel/spec.md) | **Analytics Channel** | /dashboard/[id]/analytics | — | Page views, visitors, devices, referrers, revenue tracking |
| [008](../008-social-channel/spec.md) | **Social Media Channel** | /dashboard/[id]/social | — | Platform-specific previews, AI post generation |
| [009](../009-email-channel/spec.md) | **Email Channel** | — | — | Newsletter subscription, subscriber management, CSV export |
| [010](../010-customer-service/spec.md) | **Customer Service** | /dashboard/[id]/support | /site/[slug]/contact | Contact forms → tickets → admin management |
| [011](../011-dashboard-admin/spec.md) | **Dashboard Admin** | /dashboard/[id] | — | Admin shell: sidebar, overview, settings, notifications, export/import |
| [012](../012-design-studio/spec.md) | **Design Studio** | /dashboard/[id]/design | — | Visual customization: templates, colors, fonts, spacing, buttons, custom CSS |
| [013](../013-landing-page/spec.md) | **Landing Page** | / | — | OSS project marketing: hero, features, live demo, template showcase |

### Cross-Cutting Concerns

| Document | Location | Description |
|----------|----------|-------------|
| **Design Principles** | [docs/DESIGN-PRINCIPLES.md](../../docs/DESIGN-PRINCIPLES.md) | Complete design system: typography, colors, spacing, shadows, animations, templates, accessibility |
| **Constitution** | [.specify/memory/constitution.md](../../.specify/memory/constitution.md) | Core principles: open source, honesty, preview=reality, composable architecture |

### Key Principles (from Constitution)

1. **Open Source First** — MIT Licensed, self-hostable, no paid tiers
2. **Honesty Over Hype** — No fake data, fabricated testimonials, or inflated metrics
3. **Preview = Reality** — Design Studio preview matches consumer site exactly
4. **Composable Architecture** — Every component is swappable
5. **Design System Discipline** — All UI derives from a single design token system

### System Stats (v3.6.0)

- **Lines of code**: ~57,000
- **Files**: 261
- **Database tables**: 23
- **API routes**: 53
- **Website templates**: 16
- **Dashboard nav items**: 16
- **Consumer-facing routes**: /site, /shop, /blog, /chat (each with [slug])
