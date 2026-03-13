# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

### 1Password

**Primary:** 1Password vault `openclaw` (via `~/.op_service_token`)

```bash
export OP_SERVICE_ACCOUNT_TOKEN=$(cat ~/.op_service_token)
op read "op://openclaw/ITEM/FIELD"
```

### Railway

- **Token:** `op://openclaw/railway/password` (workspace-scoped API token)
- **Project:** mayasura
- **Project ID:** `e4fdde5d-5523-422a-a87f-828d7369b7db`
- **Production Env ID:** `431f14f4-f5a8-485c-a767-6833bcefd95d`
- **API:** GraphQL at `https://backboard.railway.com/graphql/v2`
- **Note:** Railway CLI doesn't support arm64 Linux — use GraphQL API directly

```bash
export OP_SERVICE_ACCOUNT_TOKEN=$(cat ~/.op_service_token)
RAILWAY_TOKEN=$(op read "op://openclaw/railway/password")
curl -s -X POST https://backboard.railway.com/graphql/v2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -d '{"query": "..."}'
```

### GitHub

- **Repo:** `vikramgorla/mayasura` (private)

---

Add whatever helps you do your job. This is your cheat sheet.
