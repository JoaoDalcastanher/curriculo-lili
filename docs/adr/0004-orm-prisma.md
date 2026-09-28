# ADR-0004: ORM Choice — Prisma (Recommended)

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

TypeScript backends need a way to interact with a relational database. The main ORMs and query builders available in the TypeScript ecosystem were evaluated:

| Tool | Type | Maturity |
|---|---|---|
| Prisma | Schema-first ORM | High |
| TypeORM | Decorator-based ORM | High |
| Drizzle ORM | Type-safe query builder | Growing |
| MikroORM | Data-mapper ORM | Medium |
| Kysely | Type-safe query builder | Medium |

---

## Decision

**Prisma is the recommended ORM.** It is not mandatory — a project with a strong reason to use something else may do so, documented in a project-level ADR — but Prisma is the default and should be the first choice evaluated.

---

## Why Prisma

### Schema as source of truth
`schema.prisma` defines models, relations, and enums in one file. Migrations are generated from it. The TypeScript client is generated from it. There is one canonical place to understand the database shape.

### Generated, fully typed client
The Prisma client is generated from the schema. There is no manual type annotation of query results. Autocomplete works on relation includes. Compiler errors catch invalid field names.

### Migration workflow
`prisma migrate dev` generates SQL migrations from schema diffs. Migrations are committed to version control. There is an audit trail of every schema change.

### Readable queries
Prisma's query API is flat and readable. `include`, `where`, `orderBy`, and `select` are plain objects, not chained method calls or decorator metadata.

---

## Honest Comparison

### TypeORM
**Better than Prisma at:** decorator-based entity definitions feel natural to developers coming from Java/Spring; supports the active-record pattern; broader database driver support.  
**Worse than Prisma at:** type safety is weaker — `find` returns `any` by default without explicit generic typing; migrations can be fragile; complex queries require raw SQL or QueryBuilder, which is verbose; decorator metadata at runtime adds overhead.  
**Verdict:** Not recommended. Type safety gaps are incompatible with our strictness requirements.

### Drizzle ORM
**Better than Prisma at:** zero code generation step — types come directly from schema definitions; very lightweight; closer to raw SQL; works well with edge runtimes and serverless; supports more advanced PostgreSQL features (e.g., RLS) more naturally.  
**Worse than Prisma at:** less mature ecosystem; fewer integrations; relations API is newer and less battle-tested; steeper learning curve for engineers unfamiliar with SQL builder patterns.  
**Verdict:** Strong alternative, especially for projects where bundle size or edge runtime compatibility matters. Worth choosing if Prisma's generated client is a problem.

### MikroORM
**Better than Prisma at:** Unit of Work pattern; identity map; supports more advanced ORM patterns (lazy loading, cascades) that Prisma intentionally avoids.  
**Worse than Prisma at:** more complex mental model; smaller community; less documentation and tooling.  
**Verdict:** Niche choice for projects that need advanced ORM patterns. Overkill for most projects.

### Kysely
**Better than Prisma at:** pure query builder — no magic, no schema sync; very close to raw SQL; excellent for complex queries and custom types; no migration opinions.  
**Worse than Prisma at:** no schema management; no relation handling; more verbose for simple CRUD.  
**Verdict:** Excellent choice if you want full control over SQL and are comfortable managing migrations separately. Not a full ORM.

---

## When to Deviate

Choose Drizzle instead of Prisma if:
- The project targets an edge runtime (Cloudflare Workers, Vercel Edge).
- Bundle size is a constraint.
- The team prefers SQL-first development.

Choose Kysely instead of Prisma if:
- Complex analytical queries dominate and Prisma's query API gets in the way.
- The project needs schema migrations managed separately.

---

## Consequences

- Every project starts with `backend/prisma/schema.prisma` and `prisma migrate dev` as the database workflow.
- The generated Prisma client is imported from `@prisma/client` — never re-exported or wrapped unnecessarily.
- Repositories (see ADR-0005) are the only layer that imports and uses the Prisma client.
- If a project chooses a different ORM, it documents why in a project-level ADR and ensures repositories still satisfy their interfaces (see ADR-0005).
