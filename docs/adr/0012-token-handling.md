# ADR-0012: Token Handling — Session Auth and CSRF

**Status:** Accepted  
**Date:** 2026-06-05

*Ported and generalized from pequeno-caminho ADR-004.*

---

## Context

Two distinct concerns must be addressed for authenticated requests:

1. **Session authentication** — identifying who the user is across requests.
2. **CSRF protection** — ensuring mutating requests originate from our frontend, not a third-party site.

These concerns are orthogonal: a valid session does not prove the request came from the UI, and a valid CSRF token does not prove the user is logged in.

---

## Decisions

### 1. Sessions — `express-session` with Redis

User identity is managed via server-side sessions. The session ID is stored in an `httpOnly`, `secure`, `sameSite: strict` cookie.

| Property | Value | Reason |
|---|---|---|
| Store | Redis (`connect-redis`) in production; `MemoryStore` in dev | Redis survives restarts and scales horizontally |
| Max age | 48 hours | Active users never see a forced logout; inactive sessions expire |
| Rolling | `true` | Every request resets the 48h window |

**Session lifecycle:**
- **Login:** `req.session.regenerate()` — new session ID, prevents session fixation.
- **Logout:** `req.session.destroy()` — removes from Redis entirely.

**tRPC auth layers:**
- `publicProcedure` — no auth check.
- `protectedProcedure` — reads `req.session.userId`; throws `UNAUTHORIZED` if absent.
- `createAdminProcedure(actionName)` — extends `protectedProcedure` with permission checks.

### 2. CSRF — `csrf-sync` (Synchronizer Token Pattern)

Mutating requests include a valid CSRF token in the `x-csrf-token` header.

**Flow:**
1. Frontend calls `GET /api/csrf-token` → backend returns `{ token: "..." }`.
2. Frontend caches the token **in memory only** (never localStorage or cookies) and attaches it as `x-csrf-token` on every mutation.
3. Backend validates the token per-request.
4. After validation, the token is **revoked** — each token is single-use.
5. Frontend clears its cached token after every mutation, forcing a fresh fetch before the next.

### 3. Automatic Retry on 403

When a mutation fails with HTTP 403 (expired/invalid CSRF token), the frontend automatically retries once:
1. Clear the stale cached token.
2. Fetch a fresh token from `GET /api/csrf-token`.
3. Replay the original request with the new token.
4. Surface an error to the user only if the retry also fails.

This transparently handles race conditions (double-clicks, concurrent tabs) without weakening security.

---

## Request Lifecycle

```
Browser → POST /api/trpc/mutation
  ├─ Cookie: session=<session_id>
  └─ Header: x-csrf-token=<token>

Server:
  1. express-session loads session from Redis
  2. Validate x-csrf-token → 403 if invalid (frontend retries once)
  3. revokeToken(), continue
  4. protectedProcedure checks ctx.user → 401 if missing
  5. Execute procedure, extend rolling session
```

---

## Consequences

- No tokens in localStorage or cookies (beyond the session cookie itself) — CSRF tokens in JS memory only, reducing XSS attack surface.
- Single-use CSRF tokens add one round-trip (`GET /csrf-token`) before each mutation, negligible in practice.
- Redis sessions mean any backend instance can serve any user — horizontal scaling works (see ADR-0009).
- **Rule:** CSRF tokens live only in JavaScript memory. Session tokens live only in the `httpOnly` cookie. Neither appears in localStorage.
