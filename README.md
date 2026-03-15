# 🏛️ Mayasura

> Build your brand's digital palace — open-source framework for brands to instantiate their complete digital communication ecosystem.

Named after the divine architect from the Mahabharata who built the Maya Sabha — the palace of illusions that amazed even the gods.

## Quick Start

```bash
# Clone
git clone https://github.com/vikramgorla/mayasura.git
cd mayasura

# Install
npm install

# Configure
cp .env.example .env.local
# Edit .env.local with your settings

# Generate DB
npx drizzle-kit push

# Develop
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4 + design system tokens |
| Database | SQLite via better-sqlite3 + Drizzle ORM |
| Auth | JWT via jose + bcryptjs |
| Validation | Zod |
| AI | Anthropic Claude (optional, graceful degradation) |
| Testing | Vitest + Playwright |

## Project Structure

```
src/
├── app/           # Next.js App Router pages & API routes
├── components/    # Shared React components
│   ├── ui/        # Design system primitives
│   └── providers/ # Context providers
└── lib/           # Utilities, DB, auth, validation
    ├── db/        # Drizzle ORM schema & client
    ├── auth/      # JWT, password, guards
    ├── validation/# Zod schemas
    └── api/       # Response helpers
```

## Specifications

Detailed feature specs live in [`specs/`](./specs/) — 13 specs covering onboarding, website, e-commerce, blog, chatbot, analytics, social, email, customer service, dashboard, design studio, and landing page.

Design system documentation: [`docs/DESIGN-PRINCIPLES.md`](./docs/DESIGN-PRINCIPLES.md)

## License

[MIT](./LICENSE)
