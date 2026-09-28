# ADR-0005: Classes for Repositories and Named Models in `/model`

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Repositories implemented as plain object literals cause two problems when introducing dependency injection and mock implementations for testing:

1. **Object literals do not satisfy structural interfaces consistently.** `typeof someRepository` resolves to internal ORM types that simple `Promise<T>` returns in mocks cannot match. Separate anonymous object-type aliases produce unnamed, structurally fragile contracts.

2. **Inline anonymous types have no canonical location or name.** A type like `{ id: string; name: string; description: string | null }` scattered across repository, service, and interface files cannot be safely refactored and creates no shared vocabulary in the codebase.

---

## Decisions

### 1. Repositories are Classes

Every repository is a `class` that `implements` its interface, exported as a singleton:

```ts
// user.repository.ts
export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserRow | null> { ... }
  async create(data: CreateUserInput): Promise<UserRow> { ... }
}

export const userRepository = new UserRepository();
```

Mock repositories follow the same shape:

```ts
// mock/user.mock.ts
export class MockUserRepository implements IUserRepository {
  private users: UserRow[] = [...seedUsers];
  async findById(id: string): Promise<UserRow | null> { ... }
}
```

Using a class:
- Makes `implements IUserRepository` an explicit contract verified at compile time.
- Allows `private` state in mocks without closure hacks.
- Produces a named, importable type that appears in stack traces and IDE tooling.

### 2. All Domain Shapes Live in `backend/src/model/`

Any object that crosses a layer boundary — returned from a repository, accepted by a service, exposed via tRPC — must be a **named type or interface** defined in `backend/src/model/`. Anonymous inline types are forbidden at layer boundaries.

```
backend/src/model/
  user.ts          ← UserRow, UserSummary, UserWithRoles, ...
  order.ts         ← OrderRow, OrderWithItems, PaginatedResult<OrderRow>, ...
  product.ts       ← ProductRow, ProductSummary, ...
```

These are plain TypeScript `interface` or `type` declarations — not ORM-generated types, not anonymous shapes.

### 3. Interfaces Reference Only Named Models

Repository interfaces use only named types from `backend/src/model/`:

```ts
// Before (forbidden)
interface IUserRepository {
  list(...): Promise<{ items: Array<{ id: string; name: string }>; total: number }>;
}

// After (required)
import type { UserRow, PaginatedResult } from "../model/user";

interface IUserRepository {
  list(...): Promise<PaginatedResult<UserRow>>;
}
```

---

## Consequences

- Repository interfaces are clean, readable, and stable — changing a returned shape means updating one named type in `/model`.
- Mock repositories implement the same interface with the same named types, so TypeScript guarantees compatibility.
- Stack traces, "find usages", and code navigation work with named symbols.
- The `/model` directory becomes the canonical domain vocabulary — any new concept that crosses layers must be named there first.
- **Rule:** never write an anonymous inline type at a layer boundary. If you need a shape, name it in `/model` and import it.
