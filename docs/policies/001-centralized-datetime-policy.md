# Policy 001 — Centralized Datetime Policy

**Status:** Active  
**Date:** 2026-06-05

*Ported and generalized from pequeno-caminho Policy 001.*

---

## Context

Date and timezone handling tends to spread across pages, components, routers, services, and utility files. Different areas implement their own parsing and formatting rules with local `new Date(...)`, `toISOString().slice(0, 10)`, and `toLocaleDateString(...)` usage.

This causes drift between frontend and backend behavior, especially around:
- Day boundaries near midnight
- Date-only fields (`YYYY-MM-DD`) being interpreted as datetime values
- Duplicated timezone conversion logic with subtle differences

Datetime behavior is centralized in exactly two files:
- Frontend: `frontend/src/utils/datetime.ts`
- Backend: `backend/src/utils/dateUtils.ts`

See ADR-0011 for the architectural rationale.

---

## Policy

1. **All datetime logic must live in centralized date utils**
   - Frontend code must use `frontend/src/utils/datetime.ts`.
   - Backend code must use `backend/src/utils/dateUtils.ts`.
   - Pages, components, routers, services, repositories, and transformers must not implement inline timezone/date business logic.

2. **Dates must always be handled with timezone-aware utilities**
   - Any conversion of "today", day comparisons, date string generation, and day-boundary calculations must go through date utils.
   - The application timezone is an implementation detail inside date utils, not a duplicated string literal across features.

3. **Date-only and datetime transformations are standardized**
   - Parsing, normalization, formatting, and date arithmetic are provided by shared utility functions.
   - Callers consume named helpers instead of re-implementing date math.

---

## Enforcement Rules

- Do not add inline timezone/date business logic outside the two utility files.
- If a feature needs new date behavior, add a helper to the corresponding date util first, then consume it.
- Avoid direct usage of raw timezone strings outside date utils.
- Prefer date util functions for all date parsing, formatting, comparisons, and day-boundary calculations.
