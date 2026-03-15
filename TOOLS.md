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

### GitHub Identity (Agent Mayasura GitHub App)

**Always use your GitHub App identity for all git/GitHub operations.**

```bash
source ~/.openclaw/scripts/github-apps/setup-agent-git.sh mayasura
```

This configures git author/committer + `GH_TOKEN` for ~1 hour.

- **Git name:** `Agent Mayasura 🏗️`
- **Git email:** `268343911+agent-mayasura[bot]@users.noreply.github.com`
- **GitHub displays as:** `agent-mayasura[bot]`

#### Pushing (HTTPS with app token)
After sourcing the setup script, just use `git push origin <branch>` — GIT_ASKPASS handles auth automatically.

- **Repo:** `vikramgorla/mayasura` (private)
- **1Password:** `agent-mayasura.github-app` (vault: openclaw) — fields: `app_id`, `private key`
- **Installation ID:** `116529102` (on vikramgorla account, repo: mayasura)

---

Add whatever helps you do your job. This is your cheat sheet.
