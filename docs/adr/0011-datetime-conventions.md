# ADR-0011: Centralized Datetime Conventions

**Status:** Accepted  
**Date:** 2026-06-05

*Ported and generalized from pequeno-caminho ADR-003.*

---

## Context

When timezone handling is scattered across services, cron jobs, and utility functions, two problems arise:
1. **Inconsistency** — if the timezone or date formatting convention changes, every file needs updating.
2. **Duplication** — "get today's date" logic is copy-pasted with subtle differences between callers.

---

## Decisions

### 1. All Date/Time Operations Go Through a Central Utility

**Backend:** `backend/src/utils/dateUtils.ts`  
**Frontend:** `frontend/src/utils/datetime.ts`

No page, component, router, service, or repository contains inline timezone conversion or date business logic. If a feature needs new date behavior, a helper is added to the appropriate utility file first, then consumed.

Helpers are named by what they return, not by implementation details:

| Function | Returns | Purpose |
|---|---|---|
| `getTodayAsDate()` | `Date` (midnight UTC) | Creating date-keyed DB records |
| `getCurrentYear()` | `number` | Current year for computation |
| `parseDateStringToDate(s)` | `Date` | Parsing `YYYY-MM-DD` strings safely |
| `formatDate(d)` | `"YYYY-MM-DD"` | Normalizing `Date` objects to strings |

Add helpers to this list as the project grows.

### 2. Timezone is an Implementation Detail

The application timezone is a private constant inside `dateUtils.ts`. It is never exported as a raw string for consumers to use in display or logic.

A `DEFAULT_TIMEZONE` constant may be exported **only** for infrastructure that requires it as a configuration string (e.g., cron library options, ORM column defaults). It must never be used as a display string or in business logic comparisons.

### 3. Cron Retry Logic is Centralized

Database connection retry logic lives in `backend/src/utils/cronRetry.ts` as a single `runWithRetry(fn, jobName)` function. All cron jobs call this function — no cron job implements its own retry loop.

```ts
runWithRetry(() => doWork(), "My cron job");
```

### 4. No Timezone in Names

Function names describe the return value: `getTodayAsDate()`, `getCurrentYear()`. They do not include timezone identifiers (`getTodayInBerlinTime`) — the timezone is the application's only timezone and should not appear in the function API.

---

## File Structure

```
backend/src/utils/
  dateUtils.ts       ← all date/time operations; timezone as private constant
  cronRetry.ts       ← isDatabaseConnectionError + runWithRetry
frontend/src/utils/
  datetime.ts        ← all frontend date/time utilities
```

---

## Consequences

- The timezone string appears exactly once per layer.
- Adding a new date operation means adding a function to the utility, not scattering inline calls.
- All cron jobs share the same retry behavior.
- **Rule:** never use `new Date()`, `toLocaleDateString()`, `toISOString().slice(0, 10)`, or a timezone string literal outside the two utility files.
