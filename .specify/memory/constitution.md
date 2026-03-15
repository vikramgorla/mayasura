# Mayasura Constitution

## Core Principles

### I. Open Source First
Mayasura is MIT Licensed, self-hostable, free. No paid tiers, no premium features, no commercial upsells. Every feature is available to every user. Revenue comes from optional managed hosting, never from gating features.

### II. Honesty Over Hype
No fake data anywhere. No fabricated testimonials, inflated user counts, or simulated metrics. If data doesn't exist yet, show an empty state. If a feature is estimated, label it clearly. If something is a future idea, say so.

### III. Preview = Reality
What users see in previews (wizard, design studio, template gallery) must match what appears on the actual consumer site. Same fonts, same colors, same layout structure. No "colored rectangles pretending to be websites."

### IV. Composable Architecture
Every component must be swappable. Template system, AI provider, database, auth — all have clear interfaces. No deep coupling. Build palaces from bricks, not monoliths from concrete.

### V. Test-First Quality
Tests are written before implementation. Red → Green → Refactor. E2E tests cover all critical user flows. Unit tests cover all business logic. No untested code ships to main.

### VI. Design System Discipline
All UI derives from a single design token system. Typography scale, color system, spacing grid, component variants — all defined once, used everywhere. No one-off styles. No magic numbers.

### VII. Pixel-Perfect Consistency
Every page, every component, every state (empty, loading, error, populated) must be designed intentionally. Mobile-first responsive design. WCAG 2.1 AA accessibility. Full dark mode support.

### VIII. Clean Code Boundaries
- Pages under 300 lines (split into focused components)
- Database operations in domain-specific modules (not one monolithic file)
- API routes with Zod validation on all inputs
- Consistent error handling across all endpoints
- No inline data blobs — extract to config files

## Technical Standards

### Language & Framework
- **Next.js 15+** with App Router (Server Components default)
- **TypeScript** in strict mode — no `any`, no `@ts-ignore`
- **Tailwind CSS** with design tokens via CSS custom properties
- **shadcn/ui** for accessible component primitives

### Data Layer
- **Drizzle ORM** with SQLite (development) and Postgres (production option)
- Schema-first: all tables defined in schema files, migrations generated
- Prepared statements only — no string concatenation in queries

### Testing
- **Vitest** for unit tests
- **Playwright** for E2E tests
- Tests live next to source: `src/lib/__tests__/`, `src/components/__tests__/`
- CI runs all tests before merge

### API Design
- All routes under `/api/v1/`
- Zod schemas for request validation
- Consistent response envelope: `{ data?, error?, meta? }`
- Auth middleware via `requireAuth()` and `requireBrandOwner()`

### Git Workflow
- Feature branches from `main`
- Granular commits referencing issue numbers
- All commits via GitHub App identity (agent-mayasura[bot])
- PR required for all changes (no direct push to main in v2)

## Governance
- This constitution supersedes all other practices
- Amendments require documentation + rationale
- All PRs must pass constitution compliance check
- Complexity must be justified — default to simplicity

**Version**: 1.0 | **Ratified**: 2026-03-15 | **Last Amended**: 2026-03-15
