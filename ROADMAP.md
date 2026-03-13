# ROADMAP.md — Mayasura Development Phases

## Phase 0: Foundation ✅
- [x] Set up workspace and repo
- [x] Landscape research — protocols, competitors, existing tools
- [x] Define the minimal brand communication stack
- [x] First architecture decisions (ADRs)
- [x] Create GitHub issues for all work

## Phase 1: Core Application
- [ ] Initialize Next.js 15 project with App Router
- [ ] Set up Tailwind CSS + shadcn/ui
- [ ] Configure SQLite database with schema
- [ ] Build landing page (`/`)
- [ ] Build brand creation wizard (`/create`)
  - [ ] Step 1: Brand basics
  - [ ] Step 2: Brand identity
  - [ ] Step 3: Products & services
  - [ ] Step 4: Content & tone
  - [ ] Step 5: Channel selection
  - [ ] Step 6: Review & launch
- [ ] Build API routes (CRUD for brands, products, content)

## Phase 2: AI Integration
- [ ] Anthropic Claude API integration
- [ ] Brand name suggestion engine
- [ ] Tagline generator
- [ ] Product description writer
- [ ] Content generator (blog, social, email)
- [ ] Brand voice analyzer
- [ ] AI chatbot per brand

## Phase 3: Dashboard & Management
- [ ] Brand dashboard (`/dashboard/:brandId`)
- [ ] Website preview & generation
- [ ] Product management UI
- [ ] Content hub (create, edit, organize)
- [ ] Chatbot configuration & testing
- [ ] Analytics placeholder

## Phase 4: Deployment & Polish
- [ ] Railway deployment setup
- [ ] Environment configuration
- [ ] Database persistence
- [ ] Performance optimization
- [ ] Error handling & loading states
- [ ] Mobile responsiveness
- [ ] Accessibility audit

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
