# Architecture

> Mayasura — The divine architect of digital ecosystems

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
│  ┌──────────┐  ┌────────────┐  ┌──────────────────────┐ │
│  │ Landing   │  │ Dashboard  │  │ Consumer Sites       │ │
│  │ Page      │  │ (Admin)    │  │ /site/[slug]         │ │
│  │           │  │            │  │ /shop/[slug]         │ │
│  │           │  │ • Wizard   │  │ /blog/[slug]         │ │
│  │           │  │ • Design   │  │ /chat/[slug]         │ │
│  │           │  │ • Products │  │                      │ │
│  │           │  │ • Blog     │  │ Rendered dynamically │ │
│  │           │  │ • Orders   │  │ per brand settings   │ │
│  │           │  │ • Support  │  │ & template choice    │ │
│  └──────────┘  └────────────┘  └──────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────────┐
│               Next.js 16 App Router                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │             API Routes (src/app/api/)                │ │
│  │  /api/auth/*        — signup, login, logout, me     │ │
│  │  /api/brands/*      — CRUD, settings, design        │ │
│  │  /api/brands/[id]/* — products, blog, orders, etc.  │ │
│  │  /api/public/*      — consumer-facing endpoints     │ │
│  │  /api/ai/suggest    — AI-powered suggestions        │ │
│  │  /api/migrate       — database migrations           │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │              Library Layer (src/lib/)                │ │
│  │  db.ts          — SQLite via better-sqlite3         │ │
│  │  auth.ts        — JWT auth (jose), bcrypt, cookies  │ │
│  │  api-auth.ts    — request auth guards, sanitization │ │
│  │  ai.ts          — Anthropic Claude integration      │ │
│  │  website-templates.ts — 5 design templates          │ │
│  │  page-layout.ts — section-based page builder        │ │
│  │  templates.ts   — 10 industry starter templates     │ │
│  │  font-loader.ts — Google Fonts URL builder          │ │
│  │  types.ts       — TypeScript interfaces & constants │ │
│  │  utils.ts       — cn() utility (clsx + tailwind)    │ │
│  └──────────────────────┬──────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                  SQLite Database                         │
│                 (better-sqlite3, WAL mode)               │
│                                                          │
│  users, brands, products, content, orders,               │
│  blog_posts, tickets, ticket_messages, activities,       │
│  contact_submissions, newsletter_subscribers,            │
│  brand_settings, brand_pages, chatbot_faqs,              │
│  consumer_users, page_views, chat_messages               │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 16.1.x | Full-stack React framework with App Router |
| UI Library | React | 19.2.x | Component rendering |
| Database | SQLite | via better-sqlite3 | Embedded relational database |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| Animation | Framer Motion | 12.x | Layout animations, transitions |
| Auth | jose + bcryptjs | — | JWT tokens (HS256) + password hashing |
| AI | Anthropic SDK | — | Claude for brand suggestions, chatbot, content |
| UI Components | CVA + Lucide | — | Variant-based components + icon library |
| DnD | @dnd-kit | — | Drag-and-drop for product reordering |
| IDs | nanoid | — | Short unique IDs for all entities |

## Directory Structure

```
mayasura/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout (providers, fonts)
│   │   ├── login/                # Login page
│   │   ├── signup/               # Signup page
│   │   ├── create/               # Brand creation wizard
│   │   ├── templates/            # Template gallery page
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Brand list / dashboard home
│   │   │   └── [brandId]/
│   │   │       ├── page.tsx      # Brand overview
│   │   │       ├── layout.tsx    # Dashboard sidebar layout
│   │   │       ├── design/       # Design Studio
│   │   │       ├── products/     # Product management
│   │   │       ├── blog/         # Blog management
│   │   │       ├── orders/       # Order management
│   │   │       ├── content/      # Content management
│   │   │       ├── chatbot/      # Chatbot configuration
│   │   │       ├── analytics/    # Analytics dashboard
│   │   │       ├── settings/     # Brand settings
│   │   │       ├── support/      # Support tickets
│   │   │       ├── strategy/     # AI strategy advisor
│   │   │       └── website/      # Website management
│   │   ├── site/[slug]/          # Consumer website (dynamic)
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/            # About page
│   │   │   ├── products/         # Products page
│   │   │   └── contact/          # Contact page
│   │   ├── shop/[slug]/          # E-commerce storefront
│   │   │   ├── page.tsx          # Shop home
│   │   │   ├── product/[id]/     # Product detail
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Checkout flow
│   │   │   └── order/[orderId]/  # Order confirmation
│   │   ├── blog/[slug]/          # Public blog
│   │   │   ├── page.tsx          # Blog listing
│   │   │   └── [postSlug]/       # Blog post detail
│   │   ├── chat/[slug]/          # Consumer chatbot page
│   │   └── api/                  # API routes (see API.md)
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI primitives
│   │   │   ├── button.tsx        # CVA-based button variants
│   │   │   ├── input.tsx         # Form input
│   │   │   ├── textarea.tsx      # Multiline input
│   │   │   ├── tabs.tsx          # Animated tab system
│   │   │   ├── toast.tsx         # Toast notification system
│   │   │   ├── dialog.tsx        # Modal dialogs
│   │   │   ├── card.tsx          # Card container
│   │   │   ├── badge.tsx         # Status badges
│   │   │   ├── select.tsx        # Dropdown select
│   │   │   ├── switch.tsx        # Toggle switch
│   │   │   ├── accordion.tsx     # Collapsible sections
│   │   │   ├── avatar.tsx        # User avatar
│   │   │   ├── loading.tsx       # Loading spinners
│   │   │   ├── progress.tsx      # Progress bar
│   │   │   ├── skeleton.tsx      # Loading skeletons
│   │   │   └── tooltip.tsx       # Tooltips
│   │   ├── design/               # Design Studio components
│   │   │   ├── color-system.tsx  # Color picker + palettes
│   │   │   ├── font-picker.tsx   # Font selection w/ preview
│   │   │   ├── style-controls.tsx # Button/spacing/radius
│   │   │   ├── template-preview.tsx # Live template preview
│   │   │   ├── layout-editor.tsx # Section-based page builder
│   │   │   └── index.ts          # Barrel export
│   │   ├── wizard/               # Brand creation wizard steps
│   │   │   ├── StepBasics.tsx    # Step 1: Name, industry, tagline
│   │   │   ├── StepIdentity.tsx  # Step 2: Colors, fonts, template
│   │   │   ├── StepProducts.tsx  # Step 3: Product catalog
│   │   │   ├── StepContent.tsx   # Step 4: Brand voice & tone
│   │   │   ├── StepChannels.tsx  # Step 5: Channel selection
│   │   │   └── StepReview.tsx    # Step 6: Review & launch
│   │   ├── site/
│   │   │   └── section-renderer.tsx # Renders page sections
│   │   ├── auth-provider.tsx     # Authentication context
│   │   ├── client-providers.tsx  # Client-side provider wrapper
│   │   ├── command-palette.tsx   # ⌘K command palette
│   │   ├── error-boundary.tsx    # React error boundary
│   │   ├── theme-provider.tsx    # Dark/light theme
│   │   └── user-nav.tsx          # User navigation menu
│   │
│   ├── lib/                      # Core business logic
│   │   ├── db.ts                 # Database operations
│   │   ├── auth.ts               # Authentication
│   │   ├── api-auth.ts           # API auth guards
│   │   ├── ai.ts                 # AI integration
│   │   ├── website-templates.ts  # Design templates
│   │   ├── page-layout.ts        # Page layout system
│   │   ├── templates.ts          # Industry starter templates
│   │   ├── font-loader.ts        # Google Fonts loader
│   │   ├── types.ts              # TypeScript types
│   │   └── utils.ts              # Utilities
│   │
│   └── __tests__/                # Test setup & utilities
│
├── e2e/                          # Playwright E2E tests
├── docs/                         # This documentation
├── data/                         # SQLite database file (gitignored)
├── public/                       # Static assets
├── vitest.config.ts              # Unit test configuration
├── playwright.config.ts          # E2E test configuration
└── package.json                  # Dependencies & scripts
```

## Data Flow

### Brand Creation → Storage → Consumer Site Rendering

```
1. USER fills brand creation wizard (6 steps)
   │
   ├─ Step 1: Basics (name, industry, tagline, description)
   ├─ Step 2: Identity (template, colors, fonts)
   ├─ Step 3: Products (catalog items)
   ├─ Step 4: Content (brand voice, tone keywords)
   ├─ Step 5: Channels (website, chatbot, e-commerce, etc.)
   └─ Step 6: Review & Create
   │
2. POST /api/brands
   │ Creates brand record + products + content
   │ Generates slug from brand name
   │
3. Brand stored in SQLite
   │ brands table → core brand data
   │ products table → product catalog
   │ brand_settings → key-value pairs (page_layout, etc.)
   │
4. Consumer visits /site/[slug]
   │
   ├─ Server fetches brand by slug (getBrandBySlug)
   ├─ Loads website template config (getWebsiteTemplate)
   ├─ Loads page layout (getBrandSetting → page_layout)
   ├─ Loads products, blog posts
   │
   └─ Renders with:
      ├─ Template-specific CSS variables (colors, fonts, spacing)
      ├─ Section-based layout (hero, features, products, blog, etc.)
      ├─ Google Fonts loaded dynamically
      └─ Brand-specific content & products
```

## Template System Architecture

Mayasura uses a **two-layer template system**:

### Layer 1: Website Templates (`website-templates.ts`)
Design system presets that define visual personality:

| Template | Hero Style | Card Style | Typography | Spacing | Best For |
|----------|-----------|------------|------------|---------|----------|
| **Minimal** | Left-aligned | Minimal | Light (300) | Spacious | Luxury, tech, design |
| **Editorial** | Split | Flat | Bold (700) serif | Generous | Media, food, lifestyle |
| **Bold** | Full-width | Bordered | Bold (700) uppercase | Normal | Startup, fitness, music |
| **Classic** | Centered | Elevated | Semi-bold (600) serif | Normal | Healthcare, finance, legal |
| **Playful** | Stacked | Rounded | Bold (700) | Generous | Kids, pets, food, retail |

Each template defines:
- Color scheme (light + dark mode)
- Font pairing (heading + body)
- Component styles (hero, cards, nav)
- Spacing & border radius
- Accent usage intensity

### Layer 2: Starter Templates (`templates.ts`)
Pre-built brand configurations for quick starts:

10 industry-specific templates (restaurant, fashion, tech, fitness, education, real estate, beauty, music, retail, healthcare) each providing:
- Pre-configured colors, fonts, and brand voice
- Sample products with realistic pricing
- Suggested channels
- Chatbot persona

### How Templates Flow Together

```
User selects Industry → Starter Template fills wizard data
                      → Website Template controls visual rendering
                      → User can customize everything in Design Studio
```

## Design System Architecture

The design system is built on **CSS custom properties** generated from brand settings:

```
Brand Settings (DB)
  │
  ├── primary_color, secondary_color, accent_color
  ├── font_heading, font_body
  ├── website_template (→ template config)
  └── brand_settings.page_layout (→ section order)
  │
  ▼
CSS Custom Properties (runtime)
  │
  ├── --brand-primary: #...
  ├── --brand-secondary: #...
  ├── --brand-accent: #...
  ├── --brand-font-heading: '...'
  ├── --brand-font-body: '...'
  ├── --brand-radius: ...px
  └── --brand-spacing: ...
  │
  ▼
Component Rendering
  │
  ├── Template-aware section renderer
  ├── Dynamic Google Fonts loading
  └── Responsive layout with template-specific breakpoints
```

## Authentication Architecture

```
Signup → bcrypt hash → Store user → Issue JWT (HS256, 7-day expiry)
                                      │
Login → Verify bcrypt → Issue JWT ────┤
                                      │
                              Cookie: mayasura-session
                              httpOnly, secure (prod), sameSite: lax
                                      │
API Request → Extract cookie → Verify JWT → Check token_version
                                                    │
                                          Revocation: incrementTokenVersion()
                                          invalidates all existing tokens
```

## Security Measures

- **Input sanitization** — HTML tag stripping on all text inputs
- **SQL injection prevention** — Whitelisted column names for updates
- **CSRF protection** — httpOnly, sameSite cookies
- **Password policy** — Min 8 chars, uppercase, lowercase, number
- **Token revocation** — Version-based JWT invalidation
- **Brand ownership** — `requireBrandOwner()` guard on all brand operations
- **Content-Security-Policy** — Configured headers for XSS prevention
