# 🏛️ Mayasura

> The divine architect of digital ecosystems — an open-source framework that lets any brand instantiate their complete digital communication stack in minutes.

**Version:** 3.3.0 · **Live:** [mayasura-web-production.up.railway.app](https://mayasura-web-production.up.railway.app)

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

### 📰 Newsletter & Subscribers
- Subscriber management with name, status, and CSV export
- Dashboard subscriber count widget
- Subscriber list with analytics integration
- Public newsletter signup with double-opt-in

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

### ✍️ Blog System
- **Admin**: Premium card-based UI with status tabs, SEO preview, content preview
- **Consumer**: Magazine-style layout with reading progress bar, author card, load more

### 🎯 Landing Page Conversion
- Floating CTA that appears on scroll
- Live interactive demo section
- Social proof with logos and stats
- Before/after comparison slider
- Feature comparison table
- Scroll-triggered CTA modal
- Enhanced pricing section with hover effects

### 🖥️ Consumer Site Polish
- Per-template hero animations (typewriter, parallax, bouncy, floating orbs)
- Scroll-triggered section reveals
- Animated stats counters
- Quick-view product modals
- Contact page hover cards
- Cookie consent banner
- Scroll-to-top button
- Share buttons for content

### ⚡ UX & Performance
- **Page transitions** — smooth fade + slide animations on all dashboard pages
- **Navigation progress bar** — slim animated bar during route changes
- **Onboarding checklist** — floating bottom-right widget with spring animation
- **Skeleton loading states** — every page has properly animated loading UI
- **Lazy-loaded components** — CommandPalette, AI palette loaded on demand
- **Error boundaries** — graceful error handling with recovery options
- **Offline banner** — detect and show connectivity status
- **Toast notifications** — spring-animated slide-in toasts for all actions

### 🔒 Security
- All AI endpoints protected with JWT authentication
- Brand ownership verification on all brand-specific API routes
- Input sanitization and length validation
- SQL injection prevention with field whitelists

### ♿ Accessibility
- Skip-to-content links
- ARIA labels on all interactive elements
- Keyboard navigation for FAQs and modals
- Focus ring consistency (violet accent)
- Reduced motion support

---

## ✨ Complete Feature List

### Core Platform
- 🔐 **Authentication** — JWT sessions with jose, bcryptjs password hashing, token revocation
- 🎨 **Design System** — CSS custom properties, dark mode (system + manual), 20+ UI components
- 📱 **Mobile-First** — responsive wizard, dashboard, shop, and consumer site
- ⌘ **Command Palette** — `⌘K` quick navigation with context-aware actions
- 🔔 **Notifications** — real-time notification bell with unread count
- ⌨️ **Keyboard Shortcuts** — modal with all available shortcuts

### Brand Management
- 🧙 **Creation Wizard** — 6-step guided brand setup with localStorage auto-save
- 📦 **Starter Templates** — 10 industry templates with pre-filled data
- 🏷️ **Products** — CRUD with drag-and-drop reorder, batch delete, stock tracking
- 📝 **Content** — social posts, email drafts with AI generation
- 💬 **Chatbot** — AI chat with custom tone, FAQ management, test mode
- 🎫 **Support Tickets** — create, track, resolve with priority and satisfaction ratings
- 📈 **Analytics** — page views, orders, subscribers, device breakdown, referrers
- ⚙️ **Settings** — general, SEO, integrations tabs with masked API keys

### Consumer-Facing
- 🌐 **Brand Website** — 5 templates (Minimal, Bold, Classic, Playful, Editorial)
- 🛍️ **Shop** — product grid with hover effects, cart, multi-step checkout
- 📰 **Blog** — featured posts, categories, reading time, tag system
- 💬 **Chat Widget** — embeddable chatbot for consumer sites
- 📧 **Newsletter** — public signup, subscriber management
- 📞 **Contact Form** — form submissions with admin dashboard

### AI Features
- 🎨 Color palette generation
- ✏️ Copy generation (hero, taglines, about, meta descriptions)
- 🏷️ Brand name suggestions
- 📝 Product description enhancement
- 🔍 SEO analysis and optimization
- 📊 Brand health reports
- 📱 Social media post generation
- 🧠 Strategy advisor (brand, competitor, SEO, content calendar, consistency)

---

## 🏗️ Tech Stack

```
Next.js 16 (App Router) + React 19 + TypeScript
├── Tailwind CSS v4 ────────── styling with CSS custom properties
├── SQLite (better-sqlite3) ── embedded database with WAL mode
├── Anthropic Claude API ───── AI features (SDK v0.78)
├── Framer Motion 12 ───────── animations & page transitions
├── Recharts 3 ─────────────── analytics charts
├── cmdk ───────────────────── command palette
├── jose ───────────────────── JWT auth (edge-compatible)
├── bcryptjs ───────────────── password hashing
├── canvas-confetti ────────── celebration animations
├── @dnd-kit ───────────────── drag-and-drop product reorder
├── class-variance-authority ─ component variant system
├── Lucide React ───────────── icon library
├── Vitest + Testing Library ─ unit & component tests
└── Playwright ─────────────── E2E tests
```

## 🚀 Getting Started

```bash
# Clone
git clone git@github.com:vikramgorla/mayasura.git
cd mayasura

# Install
npm install

# Environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Run
npm run dev

# Test
npm test

# Build
npm run build
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Login, signup, logout, session
│   │   ├── brands/[id]/     # Brand CRUD, products, content, blog, orders,
│   │   │                    # chatbot, tickets, settings, analytics, strategy,
│   │   │                    # notifications, export, health-report, social-posts
│   │   ├── ai/              # Color, copy, SEO, suggestion endpoints
│   │   ├── public/          # Consumer-facing brand API (no auth)
│   │   └── sitemap/         # Dynamic sitemap generation
│   ├── create/              # Brand creation wizard
│   ├── dashboard/[brandId]/ # Per-brand management pages
│   ├── site/[slug]/         # Consumer brand website
│   ├── shop/[slug]/         # E-commerce storefront
│   ├── blog/[slug]/         # Public blog
│   ├── chat/[slug]/         # Embeddable chatbot
│   ├── templates/           # Template gallery
│   ├── login/ & signup/     # Authentication pages
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Design system (20+ components)
│   ├── design/              # Design studio components
│   ├── wizard/              # Brand creation wizard steps
│   ├── landing/             # Landing page sections
│   ├── site/                # Consumer site components
│   └── seo/                 # SEO components (JSON-LD, meta)
├── hooks/                   # Custom React hooks
├── lib/                     # Core: db, auth, ai, types, templates, utils
└── __tests__/               # Test suites
```

## 📸 Screenshots

> Screenshots of the Mayasura dashboard and consumer site:

| Screenshot | Description |
|:-----------|:------------|
| Landing page | Premium landing with floating CTA, live demo, social proof |
| Brand creation wizard | 6-step guided setup with AI suggestions |
| Dashboard overview | Stats cards, activity feed, quick actions, onboarding checklist |
| Design studio | Template picker, color system, font pairing, live preview |
| Analytics dashboard | Area charts, conversion funnel, device breakdown, subscriber list |
| Consumer site | Template-driven brand website with hero animations |
| E-commerce shop | Product grid, cart, multi-step checkout |
| Blog | Magazine-style layout with reading progress |

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:e2e      # Playwright E2E tests
```

Unit tests cover: utilities, types, templates, auth, hooks, and components.
E2E tests cover: authentication flow, brand creation, dashboard navigation, consumer site.

## 📄 License

MIT — Built with ❤️ by Vikram Gorla

*Inspired by Mayasura, the divine architect from the Mahabharata who built the Maya Sabha — the palace of illusions.*
