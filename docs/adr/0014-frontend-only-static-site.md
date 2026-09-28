# ADR-0014: Frontend-Only Static Site

**Status:** Accepted
**Date:** 2026-09-28

---

## Context

This repository started from the organization's base template (Bun + TanStack Start +
tRPC + Prisma + session auth + Winston logging). Its actual purpose is much smaller: a
personal résumé/portfolio page for a teacher. There is no user data, no login, no forms
that persist anything, and no external calls. Content changes rarely and is edited by a
developer.

Keeping the backend, database, session store and logging infrastructure would add
operating cost (Postgres, Redis, a second service on Railway) and cognitive load with
zero user-facing value.

---

## Decision

**The project is a frontend-only, statically prerendered site.**

- **Removed:** `backend/` (tRPC, Prisma, sessions, CSRF, rate limiting, Redis, workers,
  Winston external-call logging, `/admin/logs`), TanStack Query, tRPC client, notistack,
  and `.env.example`.
- **Kept:** Bun (ADR-0002), TanStack Start/Router + MUI (ADR-0001, frontend half),
  responsive layout (ADR-0006), env-configurable server settings (ADR-0008),
  centralized datetime (ADR-0011), testing (ADR-0010).
- **Superseded for this project:** ADR-0003 (MVC/DDD backend layers), ADR-0004 (Prisma),
  ADR-0005 (repository classes), ADR-0007 (multi-tenant), ADR-0009 (Bun workers),
  ADR-0012 (session/CSRF tokens), ADR-0013 (external-call logging). Their files were
  deleted from this repo; they remain valid in the base template.

### Content

All copy lives in `frontend/src/content/profile.ts`, typed by
`frontend/src/models/profile.ts`. Components contain no hardcoded personal content — the
content file is this project's equivalent of "customer config" (ADR-0008).

Presentation logic (sorting, stats) lives in the `ProfileService` class
(`frontend/src/services/ProfileService.ts`), keeping pages free of logic.

### Build and hosting

- `vite build` prerenders every route to static HTML in `frontend/dist/client`
  (TanStack Start `prerender`, with link crawling).
- On Railway, `bun run start` runs `frontend/server.ts` — a small `Bun.serve` class that
  serves those files, honoring the `PORT` env var. No SSR at request time.
- `railway.json` pins the build and start commands.

---

## Consequences

- One Railway service, no database, no secrets.
- Editing the site means editing `content/profile.ts` and redeploying.
- If the site ever needs dynamic data (contact form, admin editing), a backend must be
  reintroduced following the base template's ADRs — write a new ADR first.
