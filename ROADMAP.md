# ROADMAP.md — Mayasura Development Phases

## Phase 0: Foundation ✅
- [x] Set up workspace and repo
- [x] Landscape research — protocols, competitors, existing tools
- [x] Define the minimal brand communication stack
- [x] First architecture decisions (ADRs)
- [x] Create GitHub issues (28 issues, 8 epics)

## Phase 1: Core Application ✅
- [x] Initialize Next.js 15 project with App Router
- [x] Set up Tailwind CSS + shadcn/ui components
- [x] Configure SQLite database with better-sqlite3
- [x] Build landing page (`/`)
- [x] Build brand creation wizard (`/create`)
  - [x] Step 1: Brand basics (name, tagline — AI suggestions)
  - [x] Step 2: Brand identity (colors, typography, logo placeholder)
  - [x] Step 3: Products & services (AI descriptions)
  - [x] Step 4: Content & tone (brand voice, AI analysis)
  - [x] Step 5: Channel selection (7 channels)
  - [x] Step 6: Review & launch
- [x] Build API routes (CRUD for brands, products, content)

## Phase 2: AI Integration ✅
- [x] Anthropic Claude API integration
- [x] Brand name suggestion engine
- [x] Tagline generator
- [x] Product description writer
- [x] Content generator (blog, social, email, landing, about)
- [x] Brand voice analyzer
- [x] AI chatbot per brand

## Phase 3: Dashboard & Management ✅
- [x] Brand dashboard overview (`/dashboard/[brandId]`)
- [x] Website preview & generation
- [x] Product management UI
- [x] Content hub (create, edit, organize)
- [x] Chatbot configuration & testing
- [x] Analytics placeholder

## Phase 4: Deployment & Polish ✅
- [x] Railway deployment setup
- [x] Environment configuration (ANTHROPIC_API_KEY, DATABASE_PATH)
- [x] Database persistence (Railway volume)
- [x] Auto-deploys from GitHub
- [x] Error handling & loading states
- [x] Responsive design
- [x] Swiss-style design system

## Phase 5: Future (Post-MVP)
- [ ] Multi-tenant with auth (Clerk/NextAuth)
- [ ] Real logo generation (DALL-E / Stability AI)
- [ ] Custom domain support per brand
- [ ] Webhook integrations
- [ ] MCP server for agent access
- [ ] A2A protocol support
- [ ] Email sending (Resend/SendGrid)
- [ ] Push notification infrastructure
- [ ] Postgres migration for scale
- [ ] Export/import brand configurations
