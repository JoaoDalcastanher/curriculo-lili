# ADR-0008: Everything is Environment-Configurable

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Hardcoded values — timeouts, URLs, limits, feature flags, secrets — are a recurring source of problems:
- Changing them requires a code change and a deploy.
- Different environments (dev, staging, prod) need different values but share the same code.
- Secrets committed to source control are a security risk.

---

## Decision

**Every value that could reasonably differ between environments, customers, or deployments must be driven by an environment variable.**

### What Gets an Env Var

| Category | Examples |
|---|---|
| Secrets | Database URLs, API keys, session secrets, OAuth credentials |
| URLs | External service endpoints, CDN base URLs, callback URLs |
| Timeouts | HTTP request timeouts, queue processing timeouts, cron retry delays |
| Limits | Pagination page sizes, upload size limits, rate limit thresholds |
| Feature flags | `FEATURE_X_ENABLED=true` |
| Timing | Cron schedules (when they might differ per environment) |
| Customer config | Brand name, default locale, default timezone |

### `.env.example` is Mandatory

Every project ships with a `.env.example` file committed to version control. It lists every env var the application reads, with:
- A description comment above each variable.
- A non-secret placeholder value (or `REQUIRED` for secrets).
- No actual secret values.

`.env` is always in `.gitignore`.

### Validation at Startup

All env vars are read and validated at application startup, not lazily on first use. If a required variable is missing or invalid, the application fails fast with a clear error message.

A dedicated `env.ts` (or `config.ts`) module reads all env vars and exports typed constants. No other file reads from `process.env` directly.

```ts
// backend/src/config/env.ts
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  HTTP_TIMEOUT_MS: z.coerce.number().default(5000),
  FEATURE_NEW_DASHBOARD: z.coerce.boolean().default(false),
});

export const env = envSchema.parse(process.env);
```

### No Magic Defaults in Business Logic

Default values for env vars may exist in the schema (as shown above), but they must be explicit and documented. Business logic must not contain fallback values like `process.env.TIMEOUT ?? 5000` scattered inline — those go in the env module.

---

## Consequences

- The same Docker image runs in dev, staging, and production with different env vars.
- New engineers can spin up the project by copying `.env.example` to `.env` and filling in secrets.
- Rotating a secret, changing a timeout, or enabling a feature flag requires no code change — only a config change and a restart.
- **Rule:** before adding any literal number, URL, or flag to business logic, ask if it should be an env var. If there is any chance it changes between environments or customers, it must be.
