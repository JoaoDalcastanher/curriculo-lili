# ADR-0003: MVC Architecture and Domain-Driven Design

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Without an explicit architecture decision, backends grow organically and business logic ends up wherever it is convenient: in route handlers, in database queries, inline in API responses. This makes code hard to test, reason about, and hand off.

Two patterns were evaluated: a flat service layer (routers call services, services talk to the ORM directly) and a layered MVC + DDD approach.

---

## Decisions

### 1. MVC Layering — Router → Service → Repository

All backend code follows a strict three-layer architecture:

```
tRPC Router (Controller)
  ↓  calls
Service
  ↓  calls
Repository
  ↓  calls
Prisma / external APIs
```

**Routers (Controllers)**
- Receive the tRPC request context.
- Validate inputs (via Zod schemas attached to the procedure).
- Call one or more service methods.
- Return the result or throw a tRPC error.
- **No business logic.** A router that does anything besides validate, delegate, and return has too much responsibility.

**Services**
- Contain all business logic and orchestration.
- May call multiple repositories.
- May call other services (sparingly; prefer flat over nested).
- Never import from a router. Never touch the ORM directly.
- Are classes that implement an interface (see ADR-0005).

**Repositories**
- Contain all data access logic (Prisma calls, external API calls).
- Return named domain models defined in `/model` (see ADR-0005).
- No business logic — if a query has a condition, the service told it to have that condition.
- Are classes that implement an interface (see ADR-0005).

### 2. Domain-Driven Design — Model First

Every concept that crosses a layer boundary must be a named type defined in `backend/src/model/`:

```
backend/src/model/
  user.ts          ← UserRow, UserSummary, ...
  order.ts         ← OrderRow, OrderWithItems, ...
  product.ts       ← ProductRow, ProductSummary, ...
```

Rules:
- Inline anonymous types (`{ id: string; name: string }`) are forbidden at layer boundaries.
- A service that returns data to a router shapes it using a named model.
- A repository that returns data to a service shapes it using a named model.
- Types that only exist inside one layer (e.g., a query filter private to a repository method) may remain local.

This enforces DDD's core idea: the domain model is the shared language of the system, not an implementation detail of the data layer.

### 3. No Logic in tRPC Middleware Beyond Auth

tRPC middleware handles auth (`protectedProcedure`, `createAdminProcedure`) and CSRF. It does not contain business rules. The router is the first layer that knows about domain concepts, and even there it only passes them through.

---

## Why Not a Flat Service Layer

A flat service layer (router → service, service talks to Prisma) is simpler to start but tends to produce services that grow to hundreds of lines mixing querying with business rules. Separating repositories makes data access independently testable and mockable.

---

## Consequences

- Every new feature follows the same entry path: create a router, a service, and a repository.
- Business logic is always in services — reviewers know where to look.
- Repositories can be swapped for mocks in tests without touching services (see ADR-0005).
- The `/model` directory becomes the authoritative vocabulary for the domain.
- **Rule:** if you find yourself calling the ORM from a router or service, move the call to a repository. If you find business logic in a router, move it to a service.
