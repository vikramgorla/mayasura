# ARCHITECTURE.md — Architectural Decisions

## System Overview

```
┌─────────────────────────────────────────────────┐
│                   Mayasura                        │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Landing   │  │ Wizard   │  │  Dashboard   │   │
│  │ Page      │  │ (6-step) │  │  (per brand) │   │
│  └──────────┘  └──────────┘  └──────────────┘   │
│                                                   │
│  ┌───────────────────────────────────────────┐   │
│  │            Next.js API Routes              │   │
│  │  /api/brands  /api/ai  /api/chatbot       │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│  ┌──────────────┐  ┌────────────────────────┐   │
│  │   SQLite DB   │  │  Anthropic Claude API  │   │
│  │ (better-sqlite3) │  (content generation) │   │
│  └──────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

## ADRs (Architecture Decision Records)

### ADR-001: Next.js 15 App Router
- **Status**: Accepted
- **Context**: Need a full-stack framework that handles SSR, API routes, and modern React
- **Decision**: Next.js 15 with App Router
- **Rationale**: Server Components, colocated API routes, excellent DX, Railway-compatible
- **Consequences**: Tied to React ecosystem; requires Node.js runtime

### ADR-002: SQLite via better-sqlite3
- **Status**: Accepted
- **Context**: Need a database with zero infrastructure overhead for MVP
- **Decision**: SQLite with better-sqlite3 (synchronous driver)
- **Rationale**: Single file, no external service, fast reads, Railway persistent volume compatible
- **Consequences**: Single-writer limitation; will need migration path to Postgres for scale
- **Migration path**: Drizzle ORM or raw SQL that's Postgres-compatible

### ADR-003: Tailwind CSS + shadcn/ui
- **Status**: Accepted
- **Context**: Need a design system that enables Swiss-style clean design with rapid iteration
- **Decision**: Tailwind CSS for utilities, shadcn/ui for accessible component primitives
- **Rationale**: Composable, tree-shakeable, accessible by default, beautiful
- **Consequences**: Utility-class verbosity (acceptable trade-off)

### ADR-004: Anthropic Claude API for AI Features
- **Status**: Accepted
- **Context**: Need AI for brand name suggestions, content generation, chatbot
- **Decision**: Anthropic Claude API (claude-sonnet-4-20250514 for speed, claude-opus-4-20250514 for quality)
- **Rationale**: Best-in-class creative writing, structured output, brand voice consistency
- **Consequences**: API costs; need rate limiting and caching

### ADR-005: Swiss-Style Design System
- **Status**: Accepted
- **Context**: Need a distinctive, professional aesthetic
- **Decision**: Swiss/International Typographic Style — grid-based, clean typography, generous whitespace
- **Rationale**: Timeless, professional, scalable across brand contexts
- **Principles**:
  - Grid: 12-column responsive grid
  - Typography: Inter (sans-serif), system font stack fallback
  - Spacing: 4px base unit, consistent scale
  - Colors: Neutral base (slate/zinc), brand accent injection
  - Motion: Subtle, purposeful transitions (150-300ms)

### ADR-006: Wizard-Based Brand Creation
- **Status**: Accepted
- **Context**: Brands need a guided, step-by-step process to create their ecosystem
- **Decision**: 6-step wizard with AI assistance at each step
- **Steps**:
  1. Brand Basics (name, tagline)
  2. Brand Identity (colors, logo, typography)
  3. Products & Services
  4. Content & Tone
  5. Channel Selection
  6. Review & Launch
- **Rationale**: Reduces cognitive load; AI assists at each step; progressive disclosure

## Database Schema

```sql
-- Brands table
CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#000000',
  secondary_color TEXT DEFAULT '#ffffff',
  accent_color TEXT DEFAULT '#3b82f6',
  font_heading TEXT DEFAULT 'Inter',
  font_body TEXT DEFAULT 'Inter',
  brand_voice TEXT,
  channels TEXT, -- JSON array of enabled channels
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  name TEXT NOT NULL,
  description TEXT,
  price REAL,
  currency TEXT DEFAULT 'USD',
  image_url TEXT,
  category TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Content table
CREATE TABLE content (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  type TEXT NOT NULL, -- 'blog', 'social', 'email', 'page'
  title TEXT,
  body TEXT,
  metadata TEXT, -- JSON
  status TEXT DEFAULT 'draft',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Chat messages table
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id),
  role TEXT NOT NULL, -- 'user', 'assistant'
  content TEXT NOT NULL,
  session_id TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

## API Design

All API routes follow RESTful conventions with JSON responses:

```
GET    /api/brands          — List all brands
POST   /api/brands          — Create a brand
GET    /api/brands/[id]     — Get brand details
PUT    /api/brands/[id]     — Update brand
DELETE /api/brands/[id]     — Delete brand

POST   /api/brands/[id]/generate  — Generate AI content for brand
GET    /api/brands/[id]/products  — List products
POST   /api/brands/[id]/products  — Add product
GET    /api/brands/[id]/content   — List content
POST   /api/brands/[id]/content   — Create content

POST   /api/brands/[id]/chatbot   — Chat with brand's AI
POST   /api/ai/suggest             — AI suggestions (names, taglines, etc.)
```

## Deployment Architecture

```
Railway Project
└── mayasura-web (Service)
    ├── Next.js App (Port 3000)
    ├── SQLite DB (persistent volume at /data)
    └── Environment Variables
        ├── ANTHROPIC_API_KEY
        ├── DATABASE_PATH=/data/mayasura.db
        └── NODE_ENV=production
```

## Guiding Constraints

1. Must be instantiable by a brand in minutes
2. Every component must be swappable
3. Protocols (MCP, A2A, UCP) are integration surfaces, not implementation details
4. Agent-orchestrated by default, human-manageable when needed
5. Open source — permissive licensing preferred
