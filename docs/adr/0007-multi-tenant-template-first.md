# ADR-0007: Multi-Tenant and Template-First Architecture

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

This organization builds software that is not owned by us — it is sold to customers who own it. Multiple customers often need software that is functionally similar but branded differently: different logos, colors, copy, legal texts, and sometimes feature flags.

Without a deliberate policy, projects accumulate customer-specific strings, images, and logic directly in the codebase, making it impossible to reuse the same code for a second customer without a significant rewrite.

---

## Decision

**Every project is a template first.** Before committing customer-specific details to code, ask: "Could another customer use this same code with different configuration?"

### 1. Customer-Specific Content is Never Hardcoded

The following must always be configurable — never hardcoded in source files:

- Brand name, tagline, legal name
- Logos, favicons, and brand images
- Primary/secondary colors (drive them from theme configuration)
- Contact information, addresses, emails
- Locale and timezone defaults
- Feature flags per customer (see ADR-0008 for env-driven flags)

### 2. Configuration Sources (in order of preference)

| Source | Use for |
|---|---|
| Environment variables | Secrets, URLs, feature flags, service keys |
| A JSON config file (committed or injected) | Branding, copy, locale, non-secret settings |
| A theme file | Colors, typography, spacing |

If two customers can use the same Docker image with different environment variables and/or a different config JSON, the project is template-ready.

### 3. Template Repo Pattern

When a project is mature enough to serve multiple customers, extract a template repo:
- The template repo contains the full application with no customer-specific values.
- Each customer's deployment is a repo (or branch, or config directory) that supplies the JSON and env vars the template expects.
- The template repo must never contain a customer's proprietary data.

Example structure for a customer-configured deployment:
```
customer-config/
  brand.json          ← name, logo URL, colors
  features.json       ← enabled/disabled features
  .env                ← secrets, URLs (never committed)
```

### 4. Avoid Deep Customer Forks

Do not fork the template per customer and diverge the code. Keep customer differences in configuration, not in code. When a customer needs a genuinely different behavior:
- First ask if it can be a feature flag.
- If not, design it as a plugin point in the template.
- Only fork as a last resort, and document why.

---

## Consequences

- New customer onboarding is a configuration exercise, not a development project.
- Bug fixes and improvements in the template propagate to all customers.
- The codebase stays lean — no `if (customer === "acme")` branches.
- **Rule:** before adding any customer-specific string, image, or logic to source code, ask if it can go in a config file or env var instead. If it can, it must.
