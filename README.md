# 🏛️ Mayasura

> The divine architect of digital ecosystems — an open-source framework that lets any brand instantiate their complete digital communication stack in minutes.

**Version:** 3.5.0 · **Live:** [mayasura-web-production.up.railway.app](https://mayasura-web-production.up.railway.app)

---

## 🆕 What's New in v3.5

### 🎟️ Discount Codes System
- Full discount engine: percentage, fixed-amount, and free-shipping codes
- Admin dashboard with code generator, usage tracking, and expiry dates
- Automatic validation at checkout with real-time discount application
- Bulk create, enable/disable, and delete with usage analytics

### ⭐ Product Reviews
- Consumer-facing review submission with star ratings and text
- Admin moderation dashboard — approve, reject, flag reviews
- Review aggregation (avg rating, count) on product pages
- Verified purchase badges and review filtering

### 🔔 Notification Center
- Slide-out notification panel with unread count badge
- Notification types: orders, reviews, subscribers, system alerts
- Sound toggle for audio notifications
- Toast notifications for real-time actions
- Mark all read, filter by type, persistent storage

### 🔍 Consumer Search
- Full-text product search on shop pages
- Live search with debouncing and highlighted results
- Filter by category, price range, availability
- Search analytics (popular queries tracked)

### 🤖 AI Blog Writer
- Side drawer with three-stage workflow: outline → article → SEO
- AI generates full blog posts from a topic prompt
- SEO optimization suggestions built in
- One-click publish directly to brand blog

### 📤 Brand Export / Import
- Export complete brand configuration as JSON (products, content, design, settings)
- Import / clone a brand from exported JSON
- Progress bar with validation during import
- Supports template migration between environments

### 📅 Content Strategy Calendar
- Visual content calendar grid (monthly/weekly views)
- Competitor tracker with benchmarking
- Brand health dashboard with scoring
- Growth playbook with actionable recommendations
- PDF export for strategy reports

### 🎨 9 Templates
New templates added: **Neon**, **Organic**, **Artisan**, **Corporate** (joining Bold, Playful, Classic, Minimal, Tech)

### 📱 Mobile Responsive Overhaul
- Comprehensive audit and fixes across all major pages
- Dashboard, wizard, shop, blog, and consumer site all fully mobile-optimized
- Sticky mobile CTAs and bottom navigation
- Touch-friendly interactions throughout

### 🧙 Wizard Polish
- Industry autocomplete with icons and micro-animations
- Spring-physics step transitions
- Auto-save with visual feedback
- Improved error states and validation

---

## What's New in v3.3

### 🎨 Design Studio Overhaul
- **Design presets** — one-click color schemes per industry
- **Font pairing suggestions** — AI-recommended heading + body font combos
- **Undo/redo** — full history stack for design changes
- **Template confirmation modal** — prevent accidental template switches
- **Recent colors** — quick-access palette of recently used colors
- **Export/import** — save and restore design configurations as JSON

### 🤖 AI-Powered Features
- **Brand health report** — comprehensive scoring with improvement suggestions
- **Social media post generator** — platform-optimized content from brand context
- **Product description enhancer** — AI rewrite with brand voice consistency
- **AI color palette generation** — industry-aware palette suggestions
- **AI copy generation** — hero text, taglines, about sections, meta descriptions
- **SEO analyzer** — keyword suggestions, content optimization tips
- **AI Strategy Advisor** — brand strategy, competitor analysis, content calendar, brand consistency scoring

### 📊 Premium Analytics Dashboard
- **Area charts** — visitor trends with period comparison
- **Conversion funnel** — visitors → subscribers → orders pipeline
- **Device breakdown** — mobile/tablet/desktop distribution
- **Referrer analysis** — traffic source breakdown
- **Real-time indicators** — live visitor count approximation
- **Subscriber list with CSV export** — full subscriber management

### 🛒 E-Commerce Enhancements
- **Multi-step checkout** — animated step-by-step purchase flow with trust badges
- **Premium cart page** — free shipping progress bar, product suggestions, animations
- **Order management dashboard** — stats cards, search, bulk actions, status timeline
- **Order confirmation** — tracking timeline with email prompt
- **Product detail pages** — gallery zoom, tabbed info, sticky CTA, share buttons

### 🎯 Landing Page Conversion
- Floating CTA that appears on scroll
- Live interactive demo section
- Social proof with logos and stats
- Before/after comparison slider
- Feature comparison table
- Scroll-triggered CTA modal
- Enhanced pricing section with hover effects

---

## ✨ Complete Feature List

### Core Platform
- 🔐 **Authentication** — JWT sessions with jose, bcryptjs password hashing, token revocation
- 🎨 **Design System** — CSS custom properties, dark mode (system + manual), 20+ UI components
- 📱 **Mobile-First** — fully responsive wizard, dashboard, shop, and consumer site
- ⌘ **Command Palette** — `⌘K` quick navigation with context-aware actions
- ⌨️ **Keyboard Shortcuts** — modal with all available shortcuts
- 🧙 **Creation Wizard** — 6-step guided brand setup with localStorage auto-save and micro-animations

### Brand Management
- 🏷️ **Products** — CRUD with drag-and-drop reorder, batch delete, stock tracking
- 📝 **Content** — social posts, email drafts with AI generation
- 💬 **Chatbot** — AI chat with custom tone, FAQ management, personality settings, test mode
- 🎫 **Support Tickets** — create, track, resolve with priority and satisfaction ratings
- 📈 **Analytics** — page views, orders, subscribers, device breakdown, referrers, conversion funnel
- ⚙️ **Settings** — general, SEO, integrations tabs with masked API keys
- 🎟️ **Discounts** — code generation, usage tracking, expiry, percentage/fixed/free-shipping types
- ⭐ **Reviews** — consumer submissions, admin moderation, verified badges
- 🔔 **Notifications** — real-time notification center, types, sound toggle, toasts
- 📅 **Strategy** — content calendar, competitor tracker, brand health dashboard, growth playbook

### Consumer-Facing
- 🌐 **Brand Website** — 9 templates: Bold, Playful, Classic, Minimal, Tech, Neon, Organic, Artisan, Corporate
- 🛍️ **Shop** — product grid, search, cart, discount codes, multi-step checkout
- 📰 **Blog** — AI-written posts, featured, categories, reading time, tag system
- 💬 **Chat Widget** — embeddable chatbot with brand customization
- 📧 **Newsletter** — public signup, subscriber management
- 📞 **Contact Form** — form submissions with admin dashboard

### AI Features
- 🎨 Color palette generation (industry-aware)
- ✏️ Copy generation (hero, taglines, about, meta descriptions)
- 🏷️ Brand name suggestions
- 📝 Product description enhancement
- 🔍 SEO analysis and optimization
- 📊 Brand health reports
- 📱 Social media post generation
- 🧠 Strategy advisor (brand, competitor, SEO, content calendar, consistency)
- ✍️ AI Blog Writer (outline → article → SEO, 3-stage workflow)

### Export / Import
- 📤 Full brand export as JSON
- 📥 Brand import / clone with progress validation
- 🎨 Design configuration export/import

---

## 🏗️ Tech Stack

```
Next.js 16 (App Router) + React 19 + TypeScript
├── Tailwind CSS v4 ────────── styling with CSS custom properties
├── SQLite (better-sqlite3) ── embedded database with WAL mode
├── Anthropic Claude API ───── AI features (SDK v0.78)
├── Framer Motion 12 ───────── animations, page transitions, micro-interactions
├── Recharts 3 ─────────────── analytics charts (area, bar, pie, funnel)
├── cmdk ───────────────────── command palette
├── jose ───────────────────── JWT auth (edge-compatible)
├── bcryptjs ───────────────── password hashing
├── canvas-confetti ────────── celebration animations
├── @dnd-kit ───────────────── drag-and-drop product reorder
├── class-variance-authority ─ component variant system
├── Lucide React ───────────── icon library (600+ icons)
├── nanoid / uuid ──────────── ID generation
├── Vitest + Testing Library ─ unit & component tests
└── Playwright ─────────────── E2E tests
```

---

## 🚀 Getting Started

```bash
# Clone
git clone git@github.com:vikramgorla/mayasura.git
cd mayasura

# Install
npm install

# Environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY and JWT_SECRET to .env

# Run
npm run dev

# Test
npm test

# Build
npm run build
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                     # 52 API routes
│   │   ├── auth/                # Login, signup, logout, session
│   │   ├── brands/              # Brand CRUD & export/import
│   │   ├── brands/[id]/         # Per-brand: products, content, blog, orders,
│   │   │                        # chatbot, tickets, settings, analytics, strategy,
│   │   │                        # notifications, discounts, reviews, export, health
│   │   ├── ai/                  # Color, copy, SEO, blog-writer endpoints
│   │   ├── public/              # Consumer-facing brand API (no auth required)
│   │   └── sitemap/             # Dynamic sitemap generation
│   ├── create/                  # Brand creation wizard (6 steps)
│   ├── dashboard/[brandId]/     # 14 per-brand management pages
│   │   ├── analytics/           # Premium analytics dashboard
│   │   ├── blog/                # AI blog writer + post management
│   │   ├── chatbot/             # Chatbot customization
│   │   ├── content/             # Social posts & email drafts
│   │   ├── design/              # Design studio
│   │   ├── discounts/           # Discount codes
│   │   ├── notifications/       # Notification center
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product management
│   │   ├── reviews/             # Review moderation
│   │   ├── settings/            # Brand settings
│   │   ├── social/              # Social media
│   │   ├── strategy/            # Content strategy & calendar
│   │   ├── support/             # Support tickets
│   │   ├── testimonials/        # Testimonial management
│   │   └── website/             # Website builder
│   ├── site/[slug]/             # Consumer brand website (4 pages)
│   ├── shop/[slug]/             # E-commerce storefront (5 pages)
│   ├── blog/[slug]/             # Public blog
│   ├── chat/[slug]/             # Embeddable chatbot
│   ├── templates/               # Template gallery (9 templates)
│   ├── login/ & signup/         # Authentication
│   └── page.tsx                 # Landing page
├── components/
│   ├── ui/                      # Design system (20+ components)
│   ├── design/                  # Design studio components
│   ├── wizard/                  # Brand creation wizard steps
│   ├── landing/                 # Landing page sections
│   ├── site/                    # Consumer site components
│   └── seo/                     # SEO (JSON-LD, meta tags)
├── hooks/                       # Custom React hooks
├── lib/                         # Core: db, auth, ai, types, templates, utils
└── __tests__/                   # Test suites
```

---

## 📸 Screenshots

| Screenshot | Description |
|:-----------|:------------|
| Landing page | Premium conversion-optimized landing with social proof |
| Brand creation wizard | 6-step guided setup with industry autocomplete & AI |
| Dashboard overview | Stats cards, activity feed, quick actions, onboarding checklist |
| Design studio | 9 templates, color system, font pairing, undo/redo |
| Analytics dashboard | Area charts, conversion funnel, device breakdown |
| Discount codes | Code generator, usage tracking, expiry management |
| Reviews moderation | Consumer reviews, approval workflow, verified badges |
| AI Blog Writer | 3-stage workflow: outline → article → SEO |
| Content strategy | Calendar grid, competitor tracker, growth playbook |
| Consumer site | 9 template-driven brand websites |
| E-commerce shop | Product search, cart, discount codes, checkout |

---

## 🧪 Testing

```bash
npm test              # Run all unit tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
npm run test:e2e      # Playwright E2E tests
```

Unit tests: utilities, types, templates, auth, hooks, and components.
E2E tests: authentication flow, brand creation, dashboard navigation, consumer site.

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features.

---

## 📄 License

MIT — Built with ❤️ by Vikram Gorla

*Inspired by Mayasura, the divine architect from the Mahabharata who built the Maya Sabha — the palace of illusions that amazed even the gods.*
