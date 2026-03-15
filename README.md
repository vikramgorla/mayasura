# 🏛️ Mayasura

> **Build your brand's digital palace in minutes.**

Mayasura is an open-source framework that generates a complete digital ecosystem for your brand — website, shop, blog, chatbot, analytics, and more — all from a single AI-powered wizard. Named after the divine architect from the Mahabharata who built the Maya Sabha, the palace of illusions that amazed even the gods.

**MIT Licensed · Self-hostable · Next.js + SQLite + AI**

---

## ✨ Features

- **🤖 AI-Powered Brand Wizard** — Generate brand names, taglines, color palettes, and content from a guided 6-step wizard
- **🎨 16 Website Templates** — Minimal, Editorial, Bold, Classic, Playful, Startup, Portfolio, Magazine, Boutique, Tech, Wellness, Restaurant, Neon, Organic, Artisan, Corporate
- **🛍️ E-Commerce** — Product catalog, shopping cart, checkout flow, order management
- **📝 Blog Engine** — AI-powered blog writer with SEO optimization, markdown support
- **💬 AI Chatbot** — Customer-facing chatbot that understands your brand context
- **📊 Analytics Dashboard** — Page views, unique visitors, top pages, devices, referrers
- **🎯 Design Studio** — 34 fonts, 16 color palettes, live preview customization
- **📧 Email & Social** — Social media post generator, email template system
- **🎫 Customer Support** — Ticket system with priority levels and status tracking
- **🔐 Auth System** — JWT-based authentication with secure password hashing

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/vikramgorla/mayasura.git
cd mayasura

# Copy environment variables
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start building your brand.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Language** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 + CSS custom properties design system |
| **Database** | SQLite via better-sqlite3 + Drizzle ORM |
| **Auth** | JWT (jose) + bcryptjs |
| **AI** | Anthropic Claude (bring your own API key) |
| **Animations** | Framer Motion |
| **Validation** | Zod schemas |
| **Components** | shadcn/ui-inspired, class-variance-authority |
| **Icons** | Lucide React |

## 📁 Project Structure

```
mayasura/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing page
│   │   ├── create/             # Brand creation wizard
│   │   ├── dashboard/          # Admin dashboard
│   │   │   └── [brandId]/      # Brand-specific pages
│   │   │       ├── analytics/  # Analytics dashboard
│   │   │       ├── blog/       # Blog management
│   │   │       ├── chatbot/    # AI chatbot config
│   │   │       ├── design/     # Design studio
│   │   │       ├── email/      # Email templates
│   │   │       ├── settings/   # Brand settings
│   │   │       ├── shop/       # Product & order management
│   │   │       ├── social/     # Social media tools
│   │   │       └── support/    # Customer support tickets
│   │   ├── site/[slug]/        # Consumer-facing brand sites
│   │   ├── templates/          # Template gallery
│   │   ├── login/              # Authentication
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── landing/            # Landing page sections
│   │   ├── wizard/             # Brand creation wizard steps
│   │   ├── dashboard/          # Dashboard components
│   │   ├── design/             # Design studio controls
│   │   ├── site/               # Consumer site components
│   │   ├── shop/               # E-commerce components
│   │   ├── seo/                # SEO utilities
│   │   └── ui/                 # Design system primitives
│   └── lib/
│       ├── db/                 # Database schema & client
│       ├── auth/               # Authentication utilities
│       ├── ai/                 # AI integration (Anthropic)
│       ├── templates/          # 16 website templates + design utils
│       └── validation/         # Zod schemas
├── specs/                      # 13 feature specifications
├── docs/                       # Design system documentation
└── memory/                     # Session logs
```

## 🏗️ Self-Hosting

### Railway

1. Fork or clone the repository
2. Connect to [Railway](https://railway.app) and create a new project from your repo
3. Set environment variables (see `.env.example`)
4. Railway auto-detects Next.js and deploys

### Docker

```bash
# Build the image
docker build -t mayasura .

# Run with environment variables
docker run -p 3000:3000 \
  -e DATABASE_PATH=/app/data/mayasura.db \
  -e JWT_SECRET=your-secret-here \
  -e ANTHROPIC_API_KEY=your-key-here \
  -v mayasura-data:/app/data \
  mayasura
```

### Manual Deploy

```bash
git clone https://github.com/vikramgorla/mayasura.git
cd mayasura
cp .env.example .env
# Edit .env with your configuration
npm ci
npm run build
npm start
```

The app runs on port 3000 by default. Use a reverse proxy (nginx, Caddy) for HTTPS.

## ⚙️ Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_PATH` | Yes | Path to SQLite database file |
| `JWT_SECRET` | Yes | Secret for JWT token signing |
| `ANTHROPIC_API_KEY` | Optional | Anthropic API key for AI features |
| `NEXT_PUBLIC_APP_URL` | Optional | Public URL for the app (default: http://localhost:3000) |

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Make your changes with granular commits
4. Run type checking (`npx tsc --noEmit`) and build (`npm run build`)
5. Open a pull request

### Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npx tsc --noEmit  # Type check
```

## 📐 Design System

The design system is documented in [`docs/DESIGN-PRINCIPLES.md`](./docs/DESIGN-PRINCIPLES.md) and covers:

- Typography (Plus Jakarta Sans, Inter, JetBrains Mono)
- Color system (zinc-based dark mode, violet brand accent)
- Spacing (4px base unit)
- Shadows, borders, animations
- 16 template design tokens
- WCAG 2.1 AA accessibility compliance

## 📋 Specifications

Feature specifications live in [`specs/`](./specs/) — 13 detailed specs covering every aspect of the platform from onboarding to the landing page.

## 📄 License

[MIT](./LICENSE) — use it however you want.

---

Built with ❤️ by the Mayasura community.
