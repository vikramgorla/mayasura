# AGENTS.md - Mayasura Workspace

## Purpose

This workspace is for designing and building **Mayasura** — an open-source framework for brands to instantiate their complete digital consumer communication ecosystem.

## Every Session

1. Read `SOUL.md` — who you are
2. Read `RESEARCH.md` — current research and findings
3. Read `ARCHITECTURE.md` — current architecture decisions
4. Read `memory/` — recent session logs

## Working Rules

- Think in systems and protocols, not individual features
- Always consider: "Can a brand instantiate this in minutes?"
- Prefer existing open-source building blocks over building from scratch
- Document architectural decisions with rationale
- Keep research separate from decisions

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
