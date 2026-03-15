# Mayasura — Product Specification (v1.0)

> **Status:** Draft for review  
> **Date:** 2026-03-15  
> **Author:** Mayasura (AI Architect) + Vikram Gorla  
> **Purpose:** Full specification for production rebuild from scratch

---

## 1. Vision & Identity

**Mayasura** is an open-source framework that lets any brand instantiate their complete digital communication ecosystem — website, e-commerce, blog, AI chatbot, and analytics — all AI-orchestrated, in minutes.

Named after the divine architect from the Mahabharata who built the Maya Sabha — a palace of illusions that amazed even the gods.

### Core Principles
1. **Open source first** — MIT Licensed, self-hostable, no paid tiers
2. **Composable over monolithic** — every component swappable
3. **Instantiate, don't configure** — zero to full stack in minutes
4. **Protocol-native** — MCP, A2A, UCP as first-class integration surfaces
5. **Agent-orchestrated** — AI manages the stack, humans steer

### What Mayasura is NOT
- Not a SaaS with pricing tiers
- Not a Shopify competitor (it's infrastructure for brands to self-host)
- Not a website builder (it's a brand ecosystem generator)

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Mayasura                            │
│                                                          │
│  PUBLIC PAGES              ADMIN                         │
│  ┌──────────────┐         ┌──────────────────────┐      │
│  │ Landing Page  │         │ Dashboard (16 pages) │      │
│  │ /site/[slug]  │         │ /dashboard/[brandId] │      │
│  │ /shop/[slug]  │         │ Design Studio        │      │
│  │ /blog/[slug]  │         │ AI Content Tools     │      │
│  │ /chat/[slug]  │         │ Analytics & CRM      │      │
│  └──────────────┘         └──────────────────────┘      │
│                                                          │
│  ┌───────────────────────────────────────────────┐      │
│  │              Next.js API Layer (53 routes)     │      │
│  │  Auth · Brands · Products · Orders · AI · CMS │      │
│  └───────────────────────────────────────────────┘      │
│                                                          │
│  ┌──────────────────┐   ┌────────────────────────┐      │
│  │   SQLite (WAL)    │   │   Anthropic Claude AI  │      │
│  │   23 tables       │   │   Content generation   │      │
│  │   better-sqlite3  │   │   Chatbot · SEO · Blog │      │
│  └──────────────────┘   └────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 15+ (App Router) | SSR, API routes, React Server Components |
| Language | TypeScript (strict) | Type safety across full stack |
| Database | SQLite via better-sqlite3 | Zero-infra, portable, WAL mode |
| ORM | Raw SQL (prepared statements) | Control, performance, no abstraction leaks |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components |
| AI | Anthropic Claude API | Best creative writing, structured output |
| Auth | JWT (jose) + bcryptjs | Stateless, cookie-based sessions |
| Deployment | Railway / Vercel / Docker | One-click deploy, persistent volumes |

---

## 3. User Flows

### 3.1 Landing Page (/)
Public marketing page for the open-source project.

**Sections:**
1. Hero — Typing effect, "Build your [Brand] digital palace in minutes"
2. Features grid — 6 real capabilities (AI branding, design studio, e-commerce, blog, chatbot, analytics)
3. Live Demo — Interactive brand morphing showing 4 example brands
4. Template showcase — 4 preview templates with browser mockup
5. How It Works — 3-step process (Tell → AI Builds → Launch)
6. Deploy Anywhere — Self-hosting options (Railway, Vercel, Docker)
7. Architecture — AI-Powered, Open Source, Composable
8. FAQ — 8 questions about the OSS project
9. Final CTA — "Create Your Brand" + "Star on GitHub"
10. Footer — Product links, GitHub, MIT License

**Key rules:**
- NO fake data (no fabricated user counts, testimonials, or stats)
- NO commercial elements (no pricing, no "free trial", no "contact sales")
- Only show real, verifiable numbers (template count, font count, etc.)

### 3.2 Onboarding Wizard (/create)
6-step guided brand creation process.

**Step 1 — Brand Basics:**
- Brand name (required, 2-60 chars)
- Industry/category (autocomplete from 20 options + custom)
- Tagline (optional, 120 chars)
- Description (optional, 1000 chars)
- AI suggest for names and taglines
- Live slug preview with availability check

**Step 2 — Visual Identity:**
- Primary, secondary, accent colors (color pickers)
- AI color palette generation based on industry
- Heading font + body font (34 options grouped by category)
- Website template selection (16 templates)
- Live preview of color/font choices

**Step 3 — Products:**
- Add products manually (name, description, price, currency, category)
- AI product description generation
- Drag-and-drop reordering
- Bulk import (future)

**Step 4 — Content & Tone:**
- Brand voice description (free text)
- Tone keywords selection (8 options: Professional, Casual, Bold, etc.)
- AI voice analysis

**Step 5 — Channels:**
- Toggle channels: Website, AI Chatbot, E-Commerce, Email, Social, Push, CRM
- Each with description of what gets generated

**Step 6 — Review & Launch:**
- Website preview (SitePreview component with device toggle)
- Brand summary (colors, fonts, products, channels)
- Launch button → creates brand + AI generates initial content
- Post-launch: links to dashboard, consumer site, shop

**Technical:**
- Draft auto-save to localStorage
- Template pre-fill if started from template gallery
- JWT-authenticated (redirects to /signup if not logged in)

### 3.3 Authentication
- Sign up: email + name + password → bcrypt hash → JWT cookie
- Login: email + password → JWT verification → cookie
- Session: HTTP-only cookie `mayasura-session`, verified via jose
- Token versioning for revocation
- Middleware protects /dashboard/* and /create/*

### 3.4 Dashboard (/dashboard/[brandId])
Admin interface for managing a brand. 16 pages:

| Page | What it does | Data source |
|------|-------------|-------------|
| **Home** | Metrics overview, quick actions, activity feed, brand score | Real API: /counts, /analytics, /brand-score |
| **Products** | CRUD, batch delete, reorder, categories | DB: products table |
| **Orders** | Order list, status update, detail modal, CSV export | DB: orders table |
| **Blog** | AI blog writer (4-step), post CRUD, publish | DB: blog_posts, AI API |
| **Content** | Content management, templates, status workflow | DB: content table |
| **Design** | Template switching, fonts, colors, CSS, preview | DB: brands + brand_settings |
| **Analytics** | Page views, visitors, device breakdown, referrers | DB: page_views table |
| **Chatbot** | Tone controls, FAQ editing, greeting, stats | DB: chatbot_faqs, brands |
| **Strategy** | AI advisor, content calendar, competitor tracker | DB: brand_strategies + AI |
| **Settings** | Brand info, integrations, API keys, export/import | DB: brands + brand_settings |
| **Website** | Page tree, device preview, baseline perf scores | DB: brand_pages |
| **Support** | Ticket system, customer communications | DB: tickets + ticket_messages |
| **Testimonials** | Drag-and-drop, AI generation, featured toggle | DB: testimonials |
| **Social** | Social media preview (Twitter, IG, LinkedIn, SERP) | Brand data |
| **Reviews** | Review moderation (approve/reject), stats | DB: reviews |
| **Discounts** | Create/manage discount codes | DB: discount_codes |

**Shared dashboard components:**
- Sidebar navigation with active state
- Breadcrumbs on all pages
- Notification bell (real notifications from DB)
- Brand score radial (calculated from real completeness)
- Onboarding checklist (checks real brand data)
- Command palette (Cmd+K)
- What's New modal (real changelog)

### 3.5 Consumer Site (/site/[slug])
Public-facing brand website generated per brand.

**Pages:**
- Homepage — Hero (template-specific), featured products, testimonials, newsletter signup
- About — Brand story, values
- Products — Product grid with template-specific card styles
- Contact — Contact form (saves to contact_submissions)

**Template system:**
- 16 website templates, each with unique:
  - Hero style (centered, left-aligned, split, full-width, stacked)
  - Card style (minimal, bordered, elevated, flat, rounded)
  - Nav style (minimal, centered, spread, classic, playful)
  - Typography (weight, tracking, case)
  - Spacing (compact, normal, generous, spacious)
  - Border radius
  - Color scheme (light + dark variants)
  - Font pairings

**Features:**
- Newsletter popup (configurable delay)
- Cookie consent banner
- Search overlay (Cmd+K)
- Scroll-to-top button
- Share buttons
- SEO meta tags + JSON-LD structured data
- OpenGraph images (dynamic)

### 3.6 Shop (/shop/[slug])
E-commerce storefront per brand.

**Pages:**
- Product listing — filterable grid
- Product detail — gallery, description, reviews, add to cart
- Cart — quantity management, discount codes
- Checkout — customer info, shipping, order summary
- Order confirmation — receipt, social share, print

**Features:**
- Client-side cart (localStorage)
- Discount code validation (server-side)
- Order creation (saves to orders + order_items)
- Product reviews (consumer-submitted, admin-moderated)

### 3.7 Blog (/blog/[slug])
Public blog per brand.

**Pages:**
- Blog listing — featured post, category filter, reading time
- Individual post — TOC sidebar, share buttons, related posts

### 3.8 Chat (/chat/[slug])
AI chatbot page per brand.

- Chat interface with typing indicator
- Powered by Claude AI with brand context (voice, products, FAQs)
- Suggestion chips
- Session-based conversation history

---

## 4. Database Schema

### 23 Tables

```
users                    — Admin users (email/password auth)
brands                   — Core brand data (name, slug, colors, fonts, template)
products                 — Product catalog per brand
content                  — CMS content items per brand
chat_messages            — Chatbot conversation history
tickets                  — Support tickets
ticket_messages          — Ticket conversation threads
activities               — Activity log per brand
orders                   — E-commerce orders
order_items              — Line items per order
contact_submissions      — Contact form entries
newsletter_subscribers   — Email subscribers per brand
brand_settings           — Key-value settings per brand
brand_pages              — CMS pages per brand
blog_posts               — Blog content per brand
chatbot_faqs             — FAQ answers for AI chatbot
consumer_users           — Consumer-facing user accounts
page_views               — Analytics tracking
notifications            — Admin notifications per brand
testimonials             — Customer testimonials per brand
brand_strategies         — AI strategy results (persisted)
reviews                  — Product reviews (consumer-submitted)
discount_codes           — Discount/coupon codes per brand
```

### Key relationships
- All tables FK → brands(id) with ON DELETE CASCADE
- tickets → ticket_messages (1:N)
- orders → order_items (1:N)
- brands.slug is UNIQUE (enforced via index)
- brands.user_id → users(id) (ownership)

---

## 5. API Design

### Authentication
```
POST /api/auth/signup     — Create account
POST /api/auth/login      — Login
POST /api/auth/logout     — Logout
GET  /api/auth/me          — Current user
```

### Brands (authenticated)
```
GET    /api/brands                    — List user's brands
POST   /api/brands                    — Create brand (unique slug)
GET    /api/brands/[id]               — Get brand
PUT    /api/brands/[id]               — Update brand
DELETE /api/brands/[id]               — Delete brand + cascade
GET    /api/brands/slug-check?name=X  — Check slug availability
POST   /api/brands/import             — Import brand from JSON
GET    /api/brands/[id]/export        — Export brand as JSON
```

### Brand resources (authenticated, owner-only)
```
Products:      GET/POST /api/brands/[id]/products
               PUT/DELETE via product id
Orders:        GET /api/brands/[id]/orders
Blog:          GET/POST /api/brands/[id]/blog
               GET/PUT/DELETE /api/brands/[id]/blog/[postId]
Content:       GET/POST /api/brands/[id]/content
Analytics:     GET /api/brands/[id]/analytics
Chatbot FAQs:  GET/POST/PUT/DELETE /api/brands/[id]/chatbot-faqs
Settings:      GET/PUT /api/brands/[id]/settings
Testimonials:  GET/POST/PUT/DELETE /api/brands/[id]/testimonials
Reviews:       GET /api/brands/[id]/reviews (+ status update)
Discounts:     GET/POST/PUT/DELETE /api/brands/[id]/discounts
Subscribers:   GET /api/brands/[id]/subscribers
Contacts:      GET /api/brands/[id]/contacts
Tickets:       GET/POST /api/brands/[id]/tickets
Notifications: GET /api/brands/[id]/notifications
Brand Score:   GET /api/brands/[id]/brand-score
Strategy:      GET/POST /api/brands/[id]/strategy
```

### AI routes (authenticated)
```
POST /api/ai/suggest          — Brand names, taglines
POST /api/ai/colors           — Color palette generation
POST /api/ai/copy             — Content copy
POST /api/ai/seo              — SEO optimization
POST /api/ai/blog-writer      — 4-step blog generation
POST /api/ai/voice-analyze    — Brand voice analysis
POST /api/ai/competitor       — Competitor positioning
POST /api/brands/[id]/generate         — Full brand content generation
POST /api/brands/[id]/social-posts     — Social media content
POST /api/brands/[id]/enhance-description — Product description enhancer
POST /api/brands/[id]/health-report    — Brand health analysis
```

### Public routes (unauthenticated)
```
GET  /api/public/brand/[slug]                    — Brand info
POST /api/public/brand/[slug]/chat               — Chatbot
POST /api/public/brand/[slug]/contact            — Contact form
POST /api/public/brand/[slug]/newsletter         — Subscribe
POST /api/public/brand/[slug]/orders             — Create order
GET  /api/public/brand/[slug]/products/[id]/reviews — Product reviews
POST /api/public/brand/[slug]/products/[id]/reviews — Submit review
GET  /api/public/brand/[slug]/search             — Site search
POST /api/public/brand/[slug]/track              — Page view tracking
GET  /api/public/brand/[slug]/widget             — Embeddable chat widget
```

---

## 6. Design System

### Typography
- **Display font:** Plus Jakarta Sans (headings, hero text)
- **Body font:** Inter (paragraphs, UI text)
- **Monospace:** JetBrains Mono (code blocks, terminal)
- **Scale:** 4px base unit, consistent spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96

### Color System
- **Background:** CSS custom properties (--bg-primary, --bg-secondary, --bg-surface)
- **Text:** --text-primary, --text-secondary, --text-tertiary
- **Border:** --border-primary
- **Brand:** Violet-600 (#7C3AED) as primary accent
- **Dark mode:** Full support via CSS custom properties + Tailwind dark: prefix

### Component Library (shadcn/ui based)
- Button (variants: default, brand, outline, ghost, destructive; sizes: sm, default, lg, xl)
- Input, Textarea, Select
- Card, Badge, Dialog, Tabs, Accordion, Tooltip
- Toast notifications
- Skeleton loaders
- Empty states
- Progress, Switch
- Breadcrumbs, Avatar

### Template-Specific Design Tokens
Each of the 16 website templates defines:
```typescript
{
  id: string;
  fonts: { heading, body, headingWeight };
  colors: { light: TemplateColors, dark: TemplateColors };
  preview: {
    heroStyle, cardStyle, navStyle,
    typography: { headingWeight, headingTracking, headingCase, bodySize },
    spacing, borderRadius, accentUsage
  };
}
```

### Website Templates (16)
| ID | Name | Best For | Hero Style | Key Visual Trait |
|----|------|----------|------------|------------------|
| minimal | Minimal | Luxury, tech | Left-aligned | Ultra-clean whitespace |
| editorial | Editorial | Food, lifestyle | Split | Magazine-style serif type |
| bold | Bold | Music, sports | Full-width | Black bg, uppercase, heavy |
| classic | Classic | Professional | Centered | Timeless, balanced |
| playful | Playful | Kids, toys | Stacked | Rounded, colorful |
| startup | Startup | SaaS, apps | Left-aligned | Modern gradient accents |
| portfolio | Portfolio | Creative | Split | Asymmetric grid |
| magazine | Magazine | Media | Full-width | Editorial cards |
| boutique | Boutique | Fashion, luxury | Centered | Gold accents, serif |
| tech | Tech | Developer tools | Left-aligned | Monospace, dark |
| wellness | Wellness | Health, spa | Centered | Soft, organic |
| restaurant | Restaurant | Food, dining | Split | Warm, appetizing |
| neon | Neon | Gaming, nightlife | Full-width | Glowing dark theme |
| organic | Organic | Eco, natural | Stacked | Earthy, textured |
| artisan | Artisan | Handmade, craft | Split | Warm, authentic |
| corporate | Corporate | B2B, enterprise | Left-aligned | Blue, structured |

### Starter Templates (10)
Pre-configured brand setups (industry + products + voice + colors):
Restaurant, Fashion, Tech, Fitness, Education, Real Estate, Beauty, Music, Retail, Healthcare

---

## 7. Security

### Authentication & Authorization
- Passwords: bcrypt with salt rounds
- Sessions: JWT (jose) in HTTP-only cookies
- Token versioning for revocation
- Middleware on /dashboard/* and /create/*
- Brand ownership check: `requireBrandOwner(id)` on all brand API routes

### Data Protection
- SQL injection: Prepared statements everywhere, field whitelists for updates
- XSS: Input sanitization via `sanitizeInput()`, length validation
- Slug uniqueness: UNIQUE index, reserved slug list, `generateUniqueSlug()`
- Rate limiting: Client-side cooldowns on AI endpoints (30s)

### Public Route Security
- Public routes only expose published brand data
- No cross-brand data leakage
- Chatbot scoped to brand context only

---

## 8. AI Integration

### Provider
Anthropic Claude API (claude-sonnet-4-20250514 for speed, claude-opus-4-20250514 for quality)

### AI-Powered Features
1. **Brand name suggestions** — Industry + keywords → 5 name ideas
2. **Tagline generation** — Brand name + industry → 5 taglines
3. **Color palette** — Industry + mood → primary/secondary/accent
4. **Content generation** — Full brand content on launch (homepage, about, products)
5. **Blog writer** — 4-step flow: topic → outline → article → SEO optimization
6. **Chatbot** — Brand-aware AI chat with product knowledge + FAQ context
7. **Social media posts** — Platform-specific content (Twitter, IG, LinkedIn)
8. **Product description enhancer** — Before/after comparison
9. **Voice analyzer** — Analyze brand voice consistency
10. **Competitor positioning** — Strategic analysis
11. **Health report** — Brand completeness analysis with radar chart
12. **SEO optimization** — Meta tags, descriptions, keyword suggestions

### Graceful Degradation
- Lazy-initialized client (doesn't crash on import without key)
- Clear error message when ANTHROPIC_API_KEY is not set
- Dashboard shows "Configure in Settings" when AI unavailable
- All features usable without AI (manual input always available)

---

## 9. Deployment

### Self-Hosting Requirements
- Node.js 20+
- SQLite (included, zero-config)
- Environment variables: JWT_SECRET, ANTHROPIC_API_KEY (optional)
- Persistent storage for SQLite database file

### Supported Platforms
- **Railway** — One-click deploy, persistent volumes
- **Vercel** — Edge-optimized (needs external DB for production)
- **Docker** — Container-ready Dockerfile
- **Any Node.js host** — `npm install && npm run build && npm start`

### Environment Variables
```
DATABASE_PATH=/data/mayasura.db    # SQLite file location
JWT_SECRET=<random-string>          # Session signing key
ANTHROPIC_API_KEY=<api-key>         # Optional, enables AI features
NODE_ENV=production
```

---

## 10. Learnings from POC (What to Fix in v2)

### Architecture Issues
1. **Monolithic db.ts** — 1,833 lines, all tables + all operations in one file. Split into domain modules.
2. **No ORM/query builder** — Raw SQL everywhere makes migrations fragile. Consider Drizzle ORM.
3. **No test coverage** — Tests exist but are minimal and broken. Need proper E2E + unit tests.
4. **No design system tokens** — CSS custom properties are scattered. Need a centralized design token system.
5. **Component sprawl** — 72 components with inconsistent patterns. Need component catalog (Storybook).

### Code Quality Issues
6. **Pages too large** — Several dashboard pages are 800-1000+ lines. Split into focused components.
7. **Inline data** — Template data, industry lists, font lists embedded in component files. Extract to config.
8. **Inconsistent error handling** — Some routes return detailed errors, others generic 500s.
9. **No API versioning** — All routes at /api/. Need /api/v1/ prefix.
10. **No request validation** — Zod or similar for runtime type checking on API inputs.

### Feature Issues
11. **Content calendar not persisted** — Uses MOCK_CALENDAR_POSTS in memory.
12. **Lighthouse scores are estimates** — Not actual measurements.
13. **Realtime visitors simulated** — Derived from page view count, not WebSocket.
14. **No payment integration** — Orders created but no Stripe/payment flow.
15. **No email sending** — Newsletter subscribers collected but no email delivery.
16. **No image upload** — Products/logos reference URLs but no upload mechanism.
17. **Consumer auth is basic** — No password reset, no OAuth.
18. **No multi-tenancy** — Single SQLite file, no tenant isolation beyond user_id.

### Design Issues
19. **Preview ≠ reality** — Design studio preview is a mini-mockup, not actual template rendering.
20. **Inconsistent dark mode** — Some pages have full dark mode, others partially.
21. **Mobile responsiveness varies** — Landing page is polished, some dashboard pages less so.
22. **Accessibility gaps** — Skip-to-content exists, ARIA roles inconsistent across pages.

---

## 11. v2 Re-Architecture Plan

### Phase 1: Foundation (Week 1-2)
- [ ] Set up clean Next.js 15 project with strict TypeScript
- [ ] Design system: CSS custom properties, design tokens, component catalog
- [ ] Database: Drizzle ORM + SQLite with proper schema file
- [ ] Auth: Refactored auth module with proper middleware
- [ ] API layer: Zod validation, consistent error handling, /api/v1/ prefix
- [ ] Testing: Vitest + Playwright setup from day one

### Phase 2: Core Brand Engine (Week 3-4)
- [ ] Brand CRUD with unique slug enforcement
- [ ] Template system: 16 templates with proper rendering pipeline
- [ ] AI integration: Provider-agnostic adapter (support Claude + others)
- [ ] SitePreview component: Real template rendering at scale
- [ ] Wizard: 6-step flow with live preview

### Phase 3: Consumer Sites (Week 5-6)
- [ ] /site/[slug] — Template-driven rendering
- [ ] /shop/[slug] — E-commerce with proper cart
- [ ] /blog/[slug] — Blog system
- [ ] /chat/[slug] — AI chatbot
- [ ] SEO: Meta tags, JSON-LD, OG images, sitemap

### Phase 4: Dashboard (Week 7-8)
- [ ] Dashboard shell: Layout, nav, breadcrumbs
- [ ] Products, orders, blog, content management
- [ ] Design studio with real-time preview
- [ ] Analytics with real data visualization
- [ ] Settings, export/import

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Full dark mode audit
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Documentation (README, API docs, self-hosting guide)
- [ ] Docker image + one-click deploy templates
- [ ] Landing page with real examples

---

## 12. Future Ideas for Evolution

Features validated in POC but not yet production-ready:

1. **Payment integration** — Stripe/LemonSqueezy for real checkout
2. **Email delivery** — Resend/Postmark for newsletters and transactional email
3. **Image upload** — Cloudflare R2 or S3-compatible object storage
4. **Real analytics** — Plausible/Umami integration or custom WebSocket tracking
5. **Content calendar** — Persistent planning tool with drag-and-drop
6. **Social media publishing** — Direct posting to platforms via APIs
7. **Multi-language** — i18n support for consumer sites
8. **Custom domains** — DNS verification + SSL provisioning
9. **Plugin system** — Extensible architecture for third-party additions
10. **MCP server** — Expose brand management as MCP tools for AI agents
11. **A2A protocol** — Agent-to-agent orchestration for multi-brand management
12. **White-label** — Remove Mayasura branding for agencies
13. **Real Lighthouse** — Puppeteer-based actual performance measurement
14. **OAuth** — Google/GitHub social login for consumers and admins
15. **Webhook system** — Event-driven notifications for order/contact/subscriber events
