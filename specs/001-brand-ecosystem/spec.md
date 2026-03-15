# Feature Specification: Complete Brand Ecosystem

**Feature Branch**: `001-brand-ecosystem`  
**Created**: 2026-03-15  
**Status**: Draft  
**Input**: POC analysis of Mayasura v3.6.0 (57K lines, 261 files, 23 tables, 53 API routes)

## User Scenarios & Testing

### User Story 1 — Create a Brand via Wizard (Priority: P1)

A new user signs up and creates their first brand using the guided 6-step wizard. AI assists at each step: suggesting names, generating color palettes, creating content. At the end, the user has a live consumer site with homepage, product catalog, blog, and AI chatbot.

**Why this priority**: This is the core value proposition — zero to full brand in minutes. Without this, there is no product.

**Independent Test**: User signs up, completes wizard, sees their brand at /site/[slug] with real content, products, and working chatbot.

**Acceptance Scenarios**:

1. **Given** a new user at /signup, **When** they enter email/name/password, **Then** account is created and they're redirected to /create
2. **Given** a user at Step 1 (Basics), **When** they enter brand name "Sunrise Café", **Then** slug preview shows "sunrise-cafe" with availability indicator
3. **Given** a user at Step 1, **When** they click "AI Suggest" for brand names with industry "Coffee", **Then** 5 relevant name suggestions appear
4. **Given** a user at Step 2 (Identity), **When** they click "AI Generate Palette", **Then** a cohesive color palette is generated matching the industry
5. **Given** a user at Step 2, **When** they select template "editorial" and font "Playfair Display", **Then** the preview updates in real-time to show the editorial layout with Playfair Display
6. **Given** a user at Step 3 (Products), **When** they add a product with name and price, **Then** it appears in the product list with drag-to-reorder
7. **Given** a user at Step 6 (Review), **When** they see the SitePreview, **Then** it shows a realistic rendering matching their chosen template, colors, fonts, and products
8. **Given** a user clicks "Launch Brand", **When** AI content generation completes, **Then** they see links to their live site, shop, and dashboard
9. **Given** two users create brands named "My Coffee", **When** the second brand is created, **Then** it gets slug "my-coffee-2" (unique enforcement)
10. **Given** a user tries slug "admin" or "dashboard", **When** brand creation runs, **Then** slug is rejected as reserved

---

### User Story 2 — Manage Brand via Dashboard (Priority: P1)

A brand owner accesses their dashboard to manage products, orders, blog posts, design, analytics, and settings. All data is real (from DB), no fake metrics. Features not yet implemented show clean "Coming Soon" states.

**Why this priority**: Equal to wizard — users need to manage their brand after creation. Dashboard is where retention happens.

**Independent Test**: User logs in, sees dashboard with real metrics, can CRUD products/blog/content, change design, view analytics from real page views.

**Acceptance Scenarios**:

1. **Given** a brand owner at /dashboard/[id], **When** page loads, **Then** metrics (products, orders, subscribers, page views) show real counts from DB
2. **Given** a user on Products page, **When** they add/edit/delete a product, **Then** changes persist and appear on the consumer site immediately
3. **Given** a user on Design page, **When** they change template from "minimal" to "bold", **Then** the live preview updates and saving persists the change to DB
4. **Given** a user on Design page, **When** they change accent color, **Then** the consumer site reflects the new color on next visit
5. **Given** a user on Blog page, **When** they use AI Blog Writer, **Then** a 4-step flow produces a publishable blog post
6. **Given** a user on Analytics page, **When** their site has page views, **Then** charts show real data from page_views table
7. **Given** a user on Analytics page, **When** their site has zero page views, **Then** an empty state is shown (not fake chart data)
8. **Given** a user on Chatbot page, **When** they add FAQ entries, **Then** the consumer chatbot uses those FAQs in responses
9. **Given** a brand with ANTHROPIC_API_KEY not set, **When** user tries AI features, **Then** a clear message says "Configure API key in Settings" (not a crash)
10. **Given** a user on Settings page, **When** they export brand data, **Then** a complete JSON is downloaded with all brand data

---

### User Story 3 — Visit Consumer Site (Priority: P1)

A visitor accesses a brand's public site (/site/[slug]), shops (/shop/[slug]), reads the blog (/blog/[slug]), or chats with the AI (/chat/[slug]). The site renders using the brand's chosen template, colors, fonts, and real data.

**Why this priority**: The consumer site is what brands show to their customers — it must work flawlessly and look exactly like the template promises.

**Independent Test**: Visitor navigates to /site/my-brand, sees a fully-rendered site with the chosen template's layout, fonts, colors, real products, and working contact form.

**Acceptance Scenarios**:

1. **Given** a launched brand with template "editorial", **When** a visitor loads /site/[slug], **Then** they see the editorial layout with Playfair Display headings, warm tones, and split hero
2. **Given** a brand with 5 products, **When** visitor loads /shop/[slug], **Then** all 5 products are displayed with correct prices, descriptions, and template-specific card styles
3. **Given** a visitor adds products to cart, **When** they proceed to checkout, **Then** order form collects customer info and creates an order in DB
4. **Given** a brand with blog posts, **When** visitor loads /blog/[slug], **Then** published posts appear with reading time, categories, and proper typography
5. **Given** a visitor at /chat/[slug], **When** they ask about products, **Then** the AI chatbot responds using the brand's voice, product catalog, and FAQ entries
6. **Given** a visitor submits the contact form, **When** form is valid, **Then** submission appears in the brand owner's Support dashboard
7. **Given** a visitor on any consumer page, **When** they view page source, **Then** proper meta tags, OG tags, and JSON-LD structured data are present
8. **Given** a non-existent slug, **When** visitor loads /site/fake-brand, **Then** a 404 page is shown (not a crash)

---

### User Story 4 — Landing Page & Onboarding (Priority: P2)

A potential user visits mayasura.com and understands what Mayasura is — an open-source brand ecosystem framework. The page is honest (no fake data), informative (shows real features), and drives them to either create a brand or star on GitHub.

**Why this priority**: Important for adoption but not the core product — the wizard and dashboard deliver the actual value.

**Independent Test**: Visitor loads /, sees honest feature descriptions, interactive template demo, self-hosting instructions, and can navigate to /create or GitHub.

**Acceptance Scenarios**:

1. **Given** a visitor at /, **When** page loads, **Then** NO fake testimonials, user counts, or pricing tiers are shown
2. **Given** a visitor at /, **When** they see the stats bar, **Then** only real numbers appear (template count, font count — features of the codebase, not user metrics)
3. **Given** a visitor at /, **When** they click "Create a Brand", **Then** they're taken to /signup (or /create if logged in)
4. **Given** a visitor at /, **When** they click "View on GitHub", **Then** they're taken to the actual GitHub repo
5. **Given** a visitor at /, **When** they see the deploy section, **Then** a working `git clone` + `npm install` command is shown

---

### User Story 5 — Self-Hosting & Deployment (Priority: P2)

A developer clones the repo, installs dependencies, configures env vars, and runs Mayasura locally or deploys to Railway/Vercel/Docker. The entire setup works in under 10 minutes.

**Why this priority**: Self-hosting is how people adopt an open-source tool — if setup is broken, adoption dies.

**Independent Test**: Clone repo, run `npm install && npm run dev`, create a brand, see it live at localhost.

**Acceptance Scenarios**:

1. **Given** a developer clones the repo, **When** they run `npm install && npm run dev`, **Then** the app starts on localhost:3000 with SQLite auto-created
2. **Given** no ANTHROPIC_API_KEY set, **When** the app runs, **Then** all non-AI features work perfectly (manual brand creation, products, site rendering)
3. **Given** a Railway deploy, **When** DATABASE_PATH is set to persistent volume, **Then** data persists across redeploys
4. **Given** a Docker build, **When** `docker build . && docker run`, **Then** the app runs correctly

---

### Edge Cases

- What happens when AI API is rate-limited? → Show queue message, allow retry
- What happens when two users simultaneously create same brand name? → Second gets slug suffix (-2)
- What happens when a brand is deleted? → CASCADE deletes all related data, consumer site returns 404
- What happens when database file is corrupted? → Graceful error page, not crash
- What happens when font fails to load? → Fallback to system font stack
- What happens with very long brand names? → Truncated in UI, slug limited to 100 chars
- What happens with special characters in brand name? → Sanitized to alphanumeric + hyphens for slug
- What happens on mobile? → All pages responsive, touch targets 44px minimum

## Requirements

### Functional Requirements

- **FR-001**: System MUST allow user registration with email, name, and password
- **FR-002**: System MUST generate unique slugs for brands with collision handling
- **FR-003**: System MUST support 16 distinct website templates with unique visual identities
- **FR-004**: System MUST render consumer sites using brand's chosen template, colors, and fonts
- **FR-005**: System MUST provide AI-powered content generation (names, taglines, blog, chatbot)
- **FR-006**: System MUST gracefully degrade when AI API key is not configured
- **FR-007**: System MUST persist all user data in SQLite with proper foreign key relationships
- **FR-008**: System MUST support brand export/import as JSON
- **FR-009**: System MUST display only real data — no fake metrics, testimonials, or stats
- **FR-010**: System MUST show preview that matches actual consumer site rendering
- **FR-011**: System MUST support full CRUD for products, blog posts, content, testimonials, FAQs
- **FR-012**: System MUST track page views for analytics (real data from page_views table)
- **FR-013**: System MUST support discount codes with validation (percentage/fixed, expiry, min order)
- **FR-014**: System MUST support order creation with customer info and line items
- **FR-015**: System MUST support consumer-submitted product reviews with admin moderation
- **FR-016**: System MUST enforce brand ownership (users can only access their own brands)
- **FR-017**: System MUST support dark mode across all pages
- **FR-018**: System MUST meet WCAG 2.1 AA accessibility standards
- **FR-019**: System MUST be self-hostable with zero external service dependencies (except optional AI)
- **FR-020**: System MUST generate SEO meta tags, OG images, JSON-LD, and sitemap

### Key Entities

- **User**: Admin account (email, name, password hash). Owns zero or more Brands.
- **Brand**: Core entity (name, slug, colors, fonts, template, voice). Owned by one User. Has many Products, Content, Orders, etc.
- **Product**: Catalog item (name, description, price, category, image URL, stock). Belongs to Brand.
- **Order**: Purchase record (customer info, items, total, status). Belongs to Brand.
- **BlogPost**: Content piece (title, slug, content, excerpt, status). Belongs to Brand.
- **Template**: Design configuration (fonts, colors, hero/card/nav styles, spacing). Defined in code, selected per Brand.

## Success Criteria

### Measurable Outcomes

- **SC-001**: User can go from signup to live consumer site in under 5 minutes
- **SC-002**: All 16 templates produce visually distinct, professional consumer sites
- **SC-003**: Preview (wizard + design studio) matches consumer site within 95% fidelity
- **SC-004**: Zero fake data visible anywhere in the application
- **SC-005**: `npm install && npm run dev` works on clean clone within 2 minutes
- **SC-006**: All API endpoints return consistent error format, never crash with unhandled exceptions
- **SC-007**: TypeScript compilation passes with zero errors in strict mode
- **SC-008**: E2E tests cover: signup, wizard, brand creation, consumer site visit, dashboard CRUD
- **SC-009**: Lighthouse scores > 90 for performance, accessibility, best practices, SEO on consumer site
- **SC-010**: All pages render correctly on mobile (375px), tablet (768px), and desktop (1280px+)
