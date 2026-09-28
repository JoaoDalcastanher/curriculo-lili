# [Project Name]

> **TEMPLATE README — REPLACE THIS FILE**
>
> This README is part of the Inside Core base template. Once you have real features:
> 1. Replace the title and description above with your project's actual name and purpose.
> 2. Delete the entire **Template Guide** section below.
> 3. Delete all `example.*` files listed in the **Cleanup checklist** at the bottom.
> 4. Write real documentation: what this app does, how to run it, what the key concepts are.
> 5. Keep the **Linguagem / Language** section — fill it in and leave it as permanent project documentation.

---

## Linguagem / Language

| Setting | Value |
|---|---|
| Primary language | <!-- Portuguese / English --> |
| Multilingual support | <!-- Yes / No --> |
| i18n library | <!-- e.g. react-i18next / none --> |

> **This section must be filled in during initial project setup, before any code is written.**
> The language choice is made by asking the user: *"Este projeto precisa suportar inglês, ou posso desenvolver tudo em português?"*
> ADRs and technical documentation are always in English regardless of this choice.

---

## Template Guide

### Stack

| Concern | Choice |
|---|---|
| Frontend framework | TanStack Start |
| Routing | TanStack Router (file-based) |
| Server state | TanStack Query (`useQuery` / `useMutation`) |
| Tables | TanStack Table |
| UI components | Material UI |
| API layer | tRPC (end-to-end type safety, no codegen) |
| Runtime & package manager | Bun |
| ORM | Prisma |
| Auth | Session-based (`express-session` + Redis) |

See `docs/adr/` for the rationale behind every choice.

---

### Getting started

**1. Install dependencies**
```bash
bun install
```

**2. Configure environment**
```bash
cp .env.example .env
# Fill in every value marked REQUIRED
```

**3. Run database migrations**
```bash
cd backend && bunx prisma migrate dev
```

**4. Start development servers**
```bash
bun run dev
```

---

### How the stack connects

```
Browser
  └─ TanStack Router (file-based routing in frontend/src/routes/)
       └─ TanStack Query  (useQuery / useMutation)
            └─ tRPC React client  (frontend/src/lib/trpc.ts)
                 └─ HTTP /api/trpc
                      └─ tRPC Router  (backend/src/routers/index.ts)
                           └─ Service  (business logic only)
                                └─ Repository  (Prisma queries only)
                                     └─ PostgreSQL
```

The three backend layers map directly to ADR-0003. Every type that crosses a layer boundary is a named model from `backend/src/model/` (ADR-0005).

---

### Permanent infrastructure — keep it, don't delete it

Unlike the `example.*` scaffolding below, these ship as ready-to-use infrastructure. They are **not** in the cleanup checklist:

- **External-call logging (ADR-0013).** Make every outbound HTTP request through `requestWithRetry` in `backend/src/utils/httpClient.ts`. Each attempt is logged (with credentials redacted) to `backend/logs/external.log`, correlated by request id, and viewable at **`/admin/logs`**. The log-read endpoint is admin-gated and returns `UNAUTHORIZED` until you wire real authentication — see ADR-0013.
- **Linting & formatting.** `eslint.config.mjs` (strict, type-checked) plus Prettier. Run `bun run lint` and `bun run format`. CI enforces both on changed files (`.github/workflows/lint.yml`); `.github/workflows/lint-autofix.yml` can auto-fix a PR on demand.

---

### Example code — study it, then delete it

The `example` module is a working end-to-end scaffold that demonstrates every pattern in the stack. Read each file once in the order below, then implement real features and delete it.

#### Step 1 — Named models
**`backend/src/model/example.ts`**

All shapes that cross a layer boundary (`ExampleItem`, `CreateExampleInput`, `PaginatedResult`) live here as named TypeScript types. Anonymous inline types are never used at boundaries (ADR-0005).

#### Step 2 — Repository
**`backend/src/repositories/example.repository.ts`**

A `class` implementing `IExampleRepository` (defined in `interfaces.ts`). The only layer that calls Prisma. Returns `ExampleItem` — never a raw Prisma type.

#### Step 3 — Service
**`backend/src/services/example.service.ts`**

A `class` containing all business logic. Calls the repository. Never imports Prisma. When a requested item does not exist, this is where the `NOT_FOUND` error is thrown.

#### Step 4 — tRPC Router
**`backend/src/routers/example.router.ts`**

Defines two procedures:
- `example.list` — a **query** (read). Input is optional pagination params; returns `PaginatedResult<ExampleItem>`.
- `example.create` — a **mutation** (write). Input is validated with Zod; returns the created `ExampleItem`.

No business logic here — only input validation, one service call, and a return.

#### Step 5 — Frontend page
**`frontend/src/routes/example/index.tsx`**

Shows how to use:
- `trpc.example.list.useQuery()` — fetches data, gives you `data`, `isLoading`, `refetch`.
- `trpc.example.create.useMutation()` — submits data, `onSuccess` triggers a refetch.

---

### Adding a real feature

1. Define models in `backend/src/model/<feature>.ts`.
2. Add the interface to `backend/src/repositories/interfaces.ts`.
3. Create `backend/src/repositories/<feature>.repository.ts` (class implementing the interface).
4. Create `backend/src/services/<feature>.service.ts` (class injecting the repository).
5. Create `backend/src/routers/<feature>.router.ts` and register it in `backend/src/routers/index.ts`.
6. Create `frontend/src/routes/<feature>/index.tsx` using the tRPC hooks.
7. Write tests for the service and repository. A feature without tests is not done (ADR-0010).

---

### Cleanup checklist

Delete these files once you have at least one real feature:

- [ ] `backend/src/model/example.ts`
- [ ] `backend/src/repositories/example.repository.ts` (keep `interfaces.ts`, add your own interfaces)
- [ ] `backend/src/services/example.service.ts`
- [ ] `backend/src/routers/example.router.ts`
- [ ] Remove `example: exampleRouter` from `backend/src/routers/index.ts`
- [ ] Remove the `Example` model from `backend/prisma/schema.prisma` and run `prisma migrate dev`
- [ ] `frontend/src/routes/example/index.tsx`
- [ ] Replace the placeholder homepage in `frontend/src/routes/index.tsx` with the real landing page
- [ ] **Replace this entire README** with your project's real documentation
- [ ] **Keep and fill in** the `Linguagem / Language` section at the top
