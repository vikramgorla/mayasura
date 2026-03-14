# Deployment

> Railway deployment setup, environment variables, and operational considerations

---

## Hosting

Mayasura is deployed on **Railway** — a cloud platform that builds and deploys from Git pushes.

### Railway Configuration

| Setting | Value |
|---------|-------|
| **Platform** | Railway (railway.app) |
| **Project** | mayasura |
| **Build Command** | `npm run build` (Next.js build) |
| **Start Command** | `npm run start` (Next.js start) |
| **Runtime** | Node.js |
| **Region** | Default (US West) |
| **Branch** | `main` (auto-deploy) |

### Project IDs

```
Project ID:    e4fdde5d-5523-422a-a87f-828d7369b7db
Environment:   431f14f4-f5a8-485c-a767-6833bcefd95d (production)
```

---

## Environment Variables

### Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `JWT_SECRET` | Secret key for JWT signing (HS256) | Random 32+ char string |
| `DATABASE_PATH` | Path to SQLite database file | `/app/data/mayasura.db` |

### Optional

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | Anthropic Claude API key for AI features | `sk-ant-...` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (Railway sets automatically) | `3000` |

### Setting Variables on Railway

Use the Railway dashboard or GraphQL API:

```bash
# Via Railway GraphQL API
RAILWAY_TOKEN=$(op read "op://openclaw/railway/password")
curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{
    "query": "mutation { variableUpsert(input: { projectId: \"...\", environmentId: \"...\", name: \"JWT_SECRET\", value: \"...\" }) }"
  }'
```

---

## Build Process

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
```

### Production Build

```bash
npm run build        # Next.js production build
npm run start        # Start production server
```

### Build Verification

```bash
# Test build with required env vars
JWT_SECRET=test npm run build

# Run unit tests
npm run test

# Run E2E tests (requires running server)
npm run test:e2e
```

### CI Pipeline

On every push to `main`:
1. `npm ci` — Install exact dependencies
2. `npm run build` — Build Next.js (catches TypeScript & build errors)
3. `npm run test` — Run Vitest unit tests
4. Railway auto-deploys from main branch

---

## Database (SQLite)

### Why SQLite?

- **Zero-ops** — No separate database server to manage
- **Fast** — Embedded, no network latency
- **WAL mode** — Concurrent readers while writing
- **Single file** — Easy to backup, move, inspect
- **Perfect for Railway** — Persistent volume support

### Storage Location

- **Development:** `./data/mayasura.db` (relative to project root)
- **Production:** Set via `DATABASE_PATH` environment variable
- **Railway:** Stored on persistent volume

### Database Features

- **WAL mode** — Write-Ahead Logging for better concurrency
- **Foreign keys** — Enabled (`PRAGMA foreign_keys = ON`)
- **Auto-migrations** — Schema updates run on startup
- **16 tables** — users, brands, products, content, orders, blog_posts, tickets, etc.
- **11 indexes** — Optimized queries on common access patterns

### Backup Strategy

SQLite in WAL mode can be safely backed up by copying:
1. `mayasura.db` — main database file
2. `mayasura.db-wal` — WAL file (if exists)
3. `mayasura.db-shm` — shared memory file (if exists)

For a consistent backup, use the SQLite `.backup` command:
```bash
sqlite3 /path/to/mayasura.db ".backup /path/to/backup.db"
```

### Scaling Considerations

SQLite is excellent for single-server deployments. If scaling to multiple servers:

1. **Read replicas** — Use Litestream for SQLite replication
2. **Migration to PostgreSQL** — The `better-sqlite3` queries are mostly standard SQL
3. **Edge deployment** — Consider Turso (libSQL) for edge-native SQLite

### Database Schema Migrations

Migrations run automatically on first request via `runMigrations()`:

```
v1.0: Base schema (users, brands, products, content, chat_messages)
v2.0: Support tickets (tickets, ticket_messages, activities)
v3.0: E-commerce (orders, order_items, contact_submissions, newsletter_subscribers)
      Blog (blog_posts), CMS (brand_pages), Settings (brand_settings)
      Consumer users, Page views, Chatbot FAQs
v3.2: Token revocation (users.token_version), Product stock (products.stock_count)
v3.3: Website templates (brands.website_template), Custom CSS (brands.custom_css)
```

Migrations use `ALTER TABLE ADD COLUMN` with existence checks — safe to run multiple times.

---

## Deployment Checklist

### First Deploy

- [ ] Set `JWT_SECRET` (generate: `openssl rand -base64 32`)
- [ ] Set `DATABASE_PATH` to persistent volume path
- [ ] Set `ANTHROPIC_API_KEY` for AI features (optional)
- [ ] Verify build succeeds: `JWT_SECRET=test npm run build`
- [ ] Push to `main` for auto-deploy
- [ ] Verify database initialization (first request creates tables)

### Environment Maintenance

- [ ] Rotate `JWT_SECRET` periodically (will invalidate all sessions)
- [ ] Monitor database file size
- [ ] Back up database regularly
- [ ] Monitor Railway deployment logs for errors
- [ ] Keep dependencies updated (`npm audit`)

### Monitoring

| What | How |
|------|-----|
| Application errors | Railway logs |
| Database size | `ls -la data/mayasura.db` |
| Build failures | GitHub Actions / Railway build logs |
| API health | `GET /api/auth/me` (returns 401 = healthy) |

---

## Security Notes

1. **JWT_SECRET** must be kept secret — never commit to repo
2. **Database file** should not be publicly accessible
3. **HTTPS** is enforced by Railway
4. **httpOnly cookies** prevent XSS token theft
5. **Input sanitization** strips HTML from all text inputs
6. **SQL injection** prevented by parameterized queries + column whitelisting
7. **CORS** — configured via Next.js middleware
8. **CSP headers** — Content-Security-Policy configured for XSS prevention
