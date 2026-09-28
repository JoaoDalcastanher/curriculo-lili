# Agent Instructions

This document applies to all AI agents (Claude, Cursor, Copilot, custom agents) working in this repository.

---

## First Steps — Always

1. **Read `docs/adr/`** — find at least one ADR that applies to the work. If none applies, ask the user before proceeding.
2. **Read `docs/policies/`** — these are enforcement rules. Apply all of them.
3. **Read `docs/features/<feature>.md`** — read the feature doc for any area you are touching.

If anything is unclear or missing, stop and ask. Do not infer. Do not guess.

---

## Language Rule

**The user communicates in Portuguese by default.**

When creating a **new project from scratch** — before writing any code, creating any files, or making any decisions — always stop and ask:

> "Este projeto precisa suportar inglês, ou posso desenvolver tudo em português?"
> _(Does this project need to support English, or can I develop everything in Portuguese?)_

Wait for the answer. Then document the decision in the README under **Linguagem / Language** before proceeding with anything else.

- **Portuguese only:** all UI strings, error messages, labels, button text, validation messages, and every piece of user-facing copy are written in Portuguese from the first line.
- **English or multilingual:** add i18n support from the start. Never write strings inline planning to translate later.
- **ADRs and technical documentation** are always in English, regardless of the project language.

---

## Commit and Branch Policy

- **Never commit without explicit user approval** (IDE sessions). In cloud sessions, commit autonomously but only to a non-main branch.
- **Never push to `main`.** All work happens on a feature branch or worktree.
- **One worktree per feature.** If a new task is unrelated to the current branch, open a new worktree.
- **Every commit must include the developer who gave the order as a co-author** (`Co-authored-by: Name <email>`).

---

## Code Rules

- No `else` or `else if` — use early returns.
- No single-line `if` statements — always use blocks.
- Never use `any` or `unknown`.
- Classes for services (e.g. `ProfileService`).
- Never define reusable types inside pages or components — put them in `frontend/src/models/`.
- All date/time logic through `frontend/src/utils/datetime.ts`.
- All env var access through `frontend/config/env.ts`. Never raw `process.env` elsewhere.
- No hardcoded customer content — all branding, text, images, and flags are configurable.

---

## Architecture

Frontend-only static site — see ADR-0014. All personal content lives in `frontend/src/content/`.

---

## Testing

Every implementation must include or update tests. A task without tests is not complete. See ADR-0010.

---

## Uncertainty

When in doubt — about scope, architecture, business rules, or anything else — ask the user. Do not proceed on assumptions.
