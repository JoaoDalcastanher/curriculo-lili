# ADR-0013: Structured Logging of External Calls

**Status:** Accepted
**Date:** 2026-07-18

---

## Context

Every non-trivial service eventually makes outbound HTTP calls to third parties (auth
providers, partner APIs, payment gateways). When those calls misbehave — a partner returns
500s, a retry storm builds up, a payload is malformed — the first question is always "what
did we send, what came back, and how many times did we try?". Without a durable, structured
record, that question is unanswerable after the fact.

The sibling service `transito-api` (same `Inside Core` family) solved this with Winston plus
a self-truncating file transport and a TanStack-Table log viewer. We are porting that pattern
into the base template so **every project scaffolded from this repo ships with external-call
observability already built**, instead of each service reinventing it (usually badly, or not
at all).

Two things are deliberately different from a naive copy:

1. **Only the `external` concern.** `transito-api` has many log levels (combined, error,
   query, retrys, memory, per-cron channels). The template has no crons and no business
   queries, so copying those would be building for a hypothetical. A derived repo adds more
   concerns if and when it grows a need.
2. **Credential redaction.** External integrations routinely put secrets *inside* the very
   request/response we want to log (a password in a POST body, a token in a query string). A
   template must be safe by default, so redaction is a first-class part of the logger — this
   does not exist in `transito-api`.

## Decision

### File-based, not a database table

Log entries are written to `backend/logs/external.log`, **one JSON object per line**, via a
Winston logger with a custom `TruncatingFileTransport` that caps the file at ~15 MB and
auto-truncates from the front (keeping the most recent ~80%).

For a **template**, file-based logging is the right default:

- **Zero setup.** No table, no Prisma model, no migration to run in every derived repo before
  logging works. It functions before a database is even provisioned.
- **No schema coupling.** Adding a `logs` table to every project (and keeping it migrated)
  is exactly the kind of boilerplate a template should remove, not add.
- Reads are a parse of the file on demand (pagination and filtering in memory) — the same
  approach `transito-api` uses.

If a specific service later needs queryable, long-retention logs, it can add a sink of its
own; the file remains the always-on baseline.

### One entry per attempt

The shared HTTP client (`backend/src/utils/httpClient.ts`, `requestWithRetry`) logs **one
entry per attempt**, not just the final outcome. Retry/backoff behaviour is only visible if
each attempt is recorded, so the entry carries an `attempt` number.

### Credential redaction before write

Before an entry is written, `redactSensitiveFields` walks request/response bodies and
`redactSensitiveQueryParams` walks the URL query string, replacing the values of sensitive
keys (`senha`, `password`, `token`, `secret`, `authorization`, …) with `"[REDACTED]"`. Secrets
never reach the log file in cleartext.

### Request correlation via AsyncLocalStorage

Each inbound request is wrapped in a `requestIdStorage.run(...)` scope
(`backend/src/utils/requestContext.ts`) that assigns a short `request_id`. Every external call
that request triggers picks the id up through `getRequestId()`, so all log lines for one
request correlate.

### tRPC router, admin-gated

Logs are read through a tRPC procedure (`logs.listExternalCalls`), consistent with the rest of
the stack (ADR-0001), and the frontend viewer lives at `/admin/logs` (per the CLAUDE.md rule
that admin/internal pages live under `/admin`).

The read endpoint uses `createAdminProcedure("admin.logs.read")`, the secure default.

> **Known handoff (tech debt):** the template ships no login flow that populates
> `session.userId`, so `createAdminProcedure` (currently `protectedProcedure`) will reject with
> `UNAUTHORIZED` until a derived repo implements real authentication. Until then `/admin/logs`
> shows the error state rather than data. This is intentional: the alternative — shipping an
> ungated admin data endpoint into every new repo — is worse. When a project adds
> authentication (ADR-0012 infra), wire `createAdminProcedure` to the real permission check and
> the page works with no other change.

### Permanent infrastructure

`httpClient.ts`, the logger, the read path, and `/admin/logs` are **permanent template
infrastructure** — not `example.*` scaffolding. New features should make outbound calls through
`requestWithRetry` to get logging, retries, correlation, and redaction for free. They are not
in the README cleanup checklist.

## Consequences

- Any new service has external-call observability from commit one, with credentials protected.
- Configuration is env-driven (ADR-0008): retries, backoff, timeout, log size, and log
  directory are all `EXTERNAL_*` variables in `backend/src/config/env.ts`.
- `backend/logs/` is git-ignored; logs are runtime artifacts.
- The logging file is self-bounding (15 MB), so it cannot fill the disk unattended.
- **Open item:** authentication gating of the read endpoint, tracked above, to be resolved when
  a project introduces real auth.
