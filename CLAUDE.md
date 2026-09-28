# Claude Instructions

## Pre-coding Checklist (MANDATORY — do this before every implementation)

Before writing any code, verify each item:

1. Read `docs/adr/` — find at least one ADR that applies to the work. If you cannot identify a relevant ADR, ask the user before proceeding.
2. Read all files in `docs/policies/` and apply every enforcement rule.
3. Read the relevant file in `docs/features/` for the feature being modified (if it exists).
4. Read `docs/ai_context.md` for the project overview and entry points (if it exists).
5. Never skip this checklist. If a relevant doc is unclear or missing, ask the user before proceeding.

---

## Language Rule

**The user communicates in Portuguese by default.**

When creating a **new project from scratch** — before writing any code, creating any files, or making any decisions — always stop and ask:

> "Este projeto precisa suportar inglês, ou posso desenvolver tudo em português?"
> _(Does this project need to support English, or can I develop everything in Portuguese?)_

Wait for the answer. Then document the decision in the README under **Linguagem / Language** before proceeding with anything else.

Rules that follow from the answer:

- **Portuguese only:** all UI strings, error messages, labels, button text, validation messages, and every piece of user-facing copy are written in Portuguese from the first line of code.
- **English or multilingual:** add i18n support from the start. Never write strings inline with the intention of translating later — that never happens.
- **ADRs and technical documentation** are always written in English, regardless of the project language. This is not negotiable.

---

## Working Rules

### Committing — Cloud Sessions vs IDE Sessions

The commit rule depends on the context Claude is running in:

**Cloud sessions** (claude.ai/code, GitHub Actions, or any remote/automated environment):

- Claude **may commit and push autonomously**, but **only to a non-main branch**.
- Every commit goes to a feature or review branch — never directly to `main`.
- The branch is opened for the developer to review and merge.
- **Every commit must include the developer who gave the order as a co-author.** The developer is as responsible for the work as Claude — the commit history must reflect that. Use the git trailer format:
  ```
  Co-authored-by: Full Name <email>
  ```
  The developer's name and email come from the session context, their GitHub profile, or `docs/ai_context.md` if defined in the project.

**IDE sessions** (VS Code extension, JetBrains plugin, or any local developer session):

- Claude **must never commit without explicit developer approval**.
- Present the plan, list the files that will change, and wait for a clear "go ahead" before writing or committing anything.
- When the developer approves a commit, still add yourself as a co-author if the work was collaborative.

**The rule that never changes regardless of context:** never commit to `main`. All work lands on a branch.

### Other Working Rules

- **Always use git worktrees for new features.** If a new task does not belong to the current worktree, create a new worktree. Never work directly on `main`.
- **In any doubt, ask.** Do not guess. If anything is unclear — architecture, business rule, scope, or which ADR applies — stop and ask before proceeding.
- **Never execute anything before presenting a plan and receiving explicit acceptance** (IDE sessions) or before confirming the task scope is understood (cloud sessions).

---

## Code Rules

- Use early returns instead of `else`. No `else` blocks.
- Avoid `if` chains — let the code flow select the path.
- Never use `any` or `unknown`. Use the most specific type available.
- Never use single-line `if` statements — always use blocks. Ternary operators are allowed.
- Always use classes for controllers, services, and repositories — never plain object literals or standalone functions for these roles.
- Every admin page goes in the `/admin` folder. Components the user cannot see go there too.
- Feature flags are determined by the backend. The frontend requests active flags, stores them in memory (never localStorage or cookies), and shows the UI only if the flag is active.

---

## Architecture Cheatsheet

This project is a **frontend-only static site** (ADR-0014). There is no backend, database,
auth or logging. Backend rules from the base template do not apply here.

| Concern                 | Lives in                                        | Rule                                                                |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Site content (all copy) | `frontend/src/content/`                         | The only place personal text lives. Components never hardcode it.   |
| Domain / UI models      | `frontend/src/models/`                          | Reusable types. Never defined inside pages/components (Policy 002). |
| Presentation logic      | `frontend/src/services/`                        | Classes (e.g. `ProfileService`). Pages only render.                 |
| Components              | `frontend/src/components/`                      | Pure rendering from props.                                          |
| Theme                   | `frontend/src/theme/theme.ts`                   | All colors and fonts.                                               |
| Animation               | `frontend/src/animation/`                       | Motion choreography classes (ADR-0015). Components never animate.   |
| Date utilities          | `frontend/src/utils/datetime.ts`                | All date/time logic. Never inline.                                  |
| Static server           | `frontend/server.ts` + `frontend/config/env.ts` | Serves `dist/client` on Railway. Env reads only in `env.ts`.        |

---

## ADR Index (read before touching the relevant concern)

| ADR  | Topic                                                                           |
| ---- | ------------------------------------------------------------------------------- |
| 0001 | Tech stack (TanStack, MUI) — backend half superseded by 0014                    |
| 0002 | Bun as runtime and package manager                                              |
| 0006 | Responsive layout — no fixed pixel widths                                       |
| 0008 | Everything is env-configurable                                                  |
| 0010 | Testing requirements (unit + E2E)                                               |
| 0011 | Datetime conventions                                                            |
| 0014 | Frontend-only static site (supersedes 0003, 0004, 0005, 0007, 0009, 0012, 0013) |
| 0015 | Motion for animations                                                           |

---

## Testing

Every implementation must include or update tests. A feature with no tests is not done. See ADR-0010.
