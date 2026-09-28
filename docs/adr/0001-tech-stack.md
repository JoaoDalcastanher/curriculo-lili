# ADR-0001: Core Technology Stack

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

New projects in this organization need a standard, agreed-upon technology stack that enables:
- Type-safe, end-to-end development
- Fast iteration with good DX
- Mobile-first responsive UIs
- Scalable backend architecture

The choices below reflect lessons from existing projects and current team expertise.

---

## Decisions

### Frontend

| Concern | Choice | Rationale |
|---|---|---|
| Framework | TanStack Start | SSR/SSG + full-stack, file-based routing, no framework lock-in |
| Routing | TanStack Router | Type-safe routes, search params, nested layouts |
| Server state | TanStack Query | Mutations, cache invalidation, optimistic updates |
| Tables | TanStack Table | Headless, composable, works with any UI library |
| UI components | Material UI (preferred) | Team familiarity, extensive component library; not mandatory — projects may swap if justified |
| Styling | MUI `sx` prop + theme | Consistent theming, responsive via breakpoints |

### Backend

| Concern | Choice | Rationale |
|---|---|---|
| Runtime | Bun | See ADR-0002 |
| API layer | tRPC | End-to-end type safety between frontend and backend, no code-gen step |
| ORM | Prisma (recommended) | See ADR-0004 |
| Auth | Session-based | Credentials stay in the backend; see ADR-0012 |

### API Contract

tRPC is the canonical connector between frontend and backend. All procedures are typed at the source — no manual schema sync, no code generation, no REST-style fetch wrappers.

Mutations go through tRPC and carry a CSRF token (see ADR-0012). Public data reads may use `publicProcedure`; anything user-specific requires `protectedProcedure`.

### Auth

Auth is always session-based by default. The session ID lives in an `httpOnly`, `secure`, `sameSite: strict` cookie. JWTs in localStorage or cookies are not used. Individual customer requirements may change this, but session-based is the baseline (see ADR-0012).

### Material UI — Note on Optionality

MUI is the current preference because it is already in use across projects. It is **not a hard requirement**. If a project has a strong reason to choose a different component library (design system contract, accessibility requirements, bundle size concerns), document the reason in a project-level ADR and proceed.

---

## Consequences

- The frontend and backend are in the same monorepo, connected by tRPC.
- Type errors at the API boundary are caught at compile time.
- Routing, querying, and table state are all managed by TanStack libraries, which share compatible design principles.
- The team does not maintain multiple competing stacks across projects — new engineers have a single learning path.
