# 🏛️ Mayasura

> The divine architect of digital ecosystems — an open-source framework that lets any brand instantiate their complete digital communication stack in minutes.

**Live:** [mayasura-web-production.up.railway.app](https://mayasura-web-production.up.railway.app)

## ✨ Features (v2)

### 🔐 Authentication
- JWT-based session management with `jose`
- Password hashing with `bcryptjs`
- Login/signup pages with secure cookie sessions

### 🎨 Design System
- CSS custom properties for theming (colors, spacing, typography, shadows)
- Dark mode support (system preference + manual toggle)
- Component library: Dialog, Tabs, Tooltip, Avatar, Progress, Skeleton, Switch, Select, Accordion
- Toast notification system with animations
- Micro-animations throughout (framer-motion)

### 📱 Mobile-First
- Slide-out mobile menu with animated transitions
- Touch-friendly 44×44px tap targets
- Responsive wizard, dashboard, and all pages
- Mobile-optimized cards, tables, and navigation

### 📦 Starter Kit Templates
10 industry templates with pre-filled brand data:

| 🍕 Restaurant | 👗 Fashion | 💻 Tech/SaaS | 🏋️ Fitness | 📚 Education |
|:-:|:-:|:-:|:-:|:-:|
| 🏠 Real Estate | ✂️ Beauty | 🎵 Music | 🛒 Retail | 🏥 Healthcare |

Each includes: products, colors, fonts, brand voice, channels, chatbot persona.

### 🎧 Customer Support
- Ticket management system (create, track, resolve)
- Priority levels (low/medium/high/urgent)
- Status workflow: open → in-progress → resolved → closed
- Message threads (customer/agent/AI)
- Support analytics dashboard

### 🧠 AI Strategy Advisor
- Brand strategy analysis (strengths, opportunities, positioning)
- Competitor analysis with differentiation suggestions
- SEO optimization (keywords, meta descriptions, content topics)
- Content calendar generation (2-week plan)
- Brand consistency checker with scoring

### 🖥️ Website Preview
- Desktop/tablet/mobile viewport toggle
- Live multi-section preview (Hero, Products, About, Testimonials, Contact)
- Download as static HTML

### ⌘ Command Palette
- `⌘K` / `Ctrl+K` for quick navigation
- Context-aware actions (brand-specific when in dashboard)

### 🎉 UX Polish
- Confetti animation on brand launch (uses brand colors!)
- Animated stat counters
- Brand health score
- Onboarding checklist
- Skeleton loading states
- Error boundaries
- Toast notifications for all actions
- Page transitions with framer-motion

## 🏗️ Architecture

```
Next.js 15 (App Router) + TypeScript
├── SQLite (better-sqlite3) — database
├── Anthropic Claude API — AI features
├── framer-motion — animations
├── cmdk — command palette
├── jose — JWT auth (edge-compatible)
├── bcryptjs — password hashing
├── canvas-confetti — celebrations
├── @dnd-kit — drag-and-drop
├── Tailwind CSS v4 — styling
├── shadcn/ui-inspired — component library
└── Vitest — testing (42 tests)
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
│   ├── api/            # API routes (brands, auth, ai, tickets, strategy)
│   ├── create/         # Brand creation wizard
│   ├── dashboard/      # Brand management dashboard
│   │   └── [brandId]/  # Per-brand pages (overview, website, chatbot, products, content, support, strategy, analytics)
│   ├── login/          # Login page
│   ├── signup/         # Signup page
│   └── templates/      # Template gallery
├── components/
│   ├── ui/             # Design system components
│   ├── wizard/         # Wizard step components
│   ├── command-palette.tsx
│   ├── theme-provider.tsx
│   ├── error-boundary.tsx
│   └── client-providers.tsx
├── hooks/              # Custom React hooks
├── lib/                # Core utilities (db, auth, ai, types, templates)
└── __tests__/          # Test suites
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

42 tests across 6 suites: utils, types, templates, auth, hooks, components.

## 📄 License

MIT — Built with ❤️ by Vikram Gorla

*Inspired by Mayasura, the divine architect from the Mahabharata who built the Maya Sabha — the palace of illusions.*
