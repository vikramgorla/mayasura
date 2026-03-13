# 🏛️ Mayasura

**Build your brand's digital palace in minutes.**

Mayasura is an open-source framework that lets any brand instantiate their complete digital consumer communication ecosystem — website, chatbot, e-commerce, content, and more — all AI-powered, all in one click.

## Features

- **🧙 AI-Guided Wizard** — 6-step brand creation with AI assistance at every step
- **🌐 Website Generation** — Landing pages, product pages, about & contact
- **🤖 AI Chatbot** — Intelligent customer support that knows your brand
- **🛒 E-Commerce** — Product catalog and storefront
- **📧 Email Templates** — Welcome sequences, newsletters
- **📊 Dashboard** — Manage your entire brand ecosystem
- **🎨 Swiss-Style Design** — Clean, professional, beautiful

## Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API
- **Database**: SQLite via better-sqlite3
- **Deployment**: Railway

## Getting Started

```bash
# Clone
git clone https://github.com/vikramgorla/mayasura.git
cd mayasura

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your ANTHROPIC_API_KEY

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your brand.

## Environment Variables

| Variable | Description |
|----------|------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for AI features |
| `DATABASE_PATH` | Path to SQLite database (default: `./data/mayasura.db`) |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architectural decisions.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for development phases.

## License

MIT — see [LICENSE](./LICENSE).

---

*Named after Mayasura, the divine architect from the Mahabharata who built the Maya Sabha — the palace of illusions that amazed even the gods.*
