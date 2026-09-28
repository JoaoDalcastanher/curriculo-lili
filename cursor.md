# Cursor Rules

## Mandatory Pre-Work

Before writing any code, read:
1. `docs/adr/` — at least one ADR must inform every decision. If you cannot identify a relevant ADR, stop and ask the user.
2. `docs/policies/` — all active policies are enforcement rules, not suggestions.
3. `docs/features/` — read the feature doc for any area being modified.

If any doc is unclear or missing, stop and ask. Do not guess.

---

## Language Rule

**The user communicates in Portuguese by default.**

When creating a **new project from scratch**, before writing any code or files, always ask:

> "Este projeto precisa suportar inglês, ou posso desenvolver tudo em português?"
> *(Does this project need to support English, or can I develop everything in Portuguese?)*

Wait for the answer. Document the decision in the README under **Linguagem / Language** before proceeding.

- **Portuguese only:** all user-facing strings are written in Portuguese from the first line.
- **English or multilingual:** add i18n support immediately. Never write inline strings planning to translate later.
- **ADRs and technical docs** are always in English.

---

## Commits and Branches

- Never commit without explicit user approval (IDE). In cloud sessions, commit only to non-main branches.
- Never work on `main`. Use a worktree or branch per feature.
- If a new task is unrelated to the current branch, open a new worktree.
- Add the developer as co-author on every commit (`Co-authored-by: Name <email>`).

---

## Code Style

- No `else`. No `else if`. Use early returns.
- No single-line `if` statements. Always use blocks.
- No `any` or `unknown`.
- Classes for controllers, services, repositories — not object literals.
- Named types in `backend/src/model/` for all layer-crossing shapes.
- Env vars for all configurable values — read through `backend/src/config/env.ts`, never raw `process.env`.
- All date logic through `backend/src/utils/dateUtils.ts` or `frontend/src/utils/datetime.ts`.

---

## Architecture

- Router → Service → Repository. No skipping layers.
- No business logic in routers. No ORM calls in services.
- No inline anonymous types at layer boundaries.
- No hardcoded customer-specific content — use config/env.

---

## Testing

Every new feature or bug fix ships with tests. No exceptions. See ADR-0010.

---

## When In Doubt

Ask. Do not guess, do not assume. Stop and ask.
