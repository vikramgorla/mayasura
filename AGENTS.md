# AGENTS.md - Mayasura Workspace

## Purpose

This workspace is for designing and building **Mayasura** — an open-source framework for brands to instantiate their complete digital consumer communication ecosystem.

## Every Session

1. Read `RESEARCH.md` + `ARCHITECTURE.md` for current state
2. Read `memory/` — recent session logs
*(SOUL.md auto-injected — don't re-read)*

## Working Rules

- Think in systems and protocols, not individual features
- Always consider: "Can a brand instantiate this in minutes?"
- Prefer existing open-source building blocks over building from scratch
- Document architectural decisions with rationale
- Keep research separate from decisions

## Git Identity — CRITICAL

**Always run `source ~/.openclaw/scripts/github-apps/setup-agent-git.sh mayasura` before any git/gh operation in every session.**

- All commits are authored as `Agent Mayasura 🏗️ <268343911+agent-mayasura[bot]@users.noreply.github.com>`
- Never use Vik's personal credentials for commits or PRs
- Push via HTTPS (GIT_ASKPASS handles auth after sourcing setup script)
- Sub-agents MUST also source the setup script before committing

### Sub-agent commit template:
```bash
source ~/.openclaw/scripts/github-apps/setup-agent-git.sh mayasura
git add <files>
git commit -m "feat: your commit title"
git push origin <branch>
```

## Development Style (NON-NEGOTIABLE)

1. **GitHub Issue first** — Create a GitHub issue BEFORE starting any feature, fix, or change. Every single change needs a tracked issue with proper labels.
2. **Granular commits** — Commit in small, logical pieces. NOT one giant commit. Each commit references its issue number (e.g., `fix(dark-mode): use CSS variables #42`).
3. **Push frequently** — Don't batch pushes. Push after each logical unit of work.
4. **Every subagent** must follow this workflow — include these rules in every spawn task.

This applies to ALL work — features, fixes, refactors, docs. No exceptions.

## Key Files

- `SOUL.md` — identity and mission
- `RESEARCH.md` — landscape research, competitor analysis, protocol specs
- `ARCHITECTURE.md` — architectural decisions and tech stack
- `ROADMAP.md` — what to build and in what order
- `memory/` — session logs
