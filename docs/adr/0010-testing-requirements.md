# ADR-0010: Testing Requirements — Unit, Integration, and E2E

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Features are added continuously. Without tests, regressions are discovered in production. Without a CI gate, tests that exist don't actually run on every change.

The question was not whether to test, but which types to require and how to enforce them.

---

## Decision

**All three testing levels are mandatory for every project:**

| Level | Tool | Scope |
|---|---|---|
| Unit | `bun test` | Individual functions, classes, and utilities in isolation |
| Integration | `bun test` (with a test DB) | Service + repository layer with a real database |
| E2E | Playwright | Full user flows through the UI |

### CI Requirement

Every project must have a CI workflow (GitHub Actions) that runs at minimum one testing level on every pull request. The preferred workflow runs all three. A PR that breaks a test must not be merged.

Minimum acceptable CI configuration:
```yaml
- name: Run tests
  run: bun test
```

Full preferred configuration: unit tests, integration tests (with a test database), and E2E tests (with a running server and browser).

### What Needs Tests

- **Every new feature** must ship with at least unit tests covering its core logic.
- **Every bug fix** must ship with a test that reproduces the bug and passes after the fix.
- **Every API change** (new tRPC procedure, changed response shape) must have integration tests.
- **Critical user flows** (auth, checkout, form submission) must have E2E tests.

### When Writing Code, Write Tests

Agents and engineers implementing features are required to create or update tests. A plan that does not mention tests is incomplete. A PR with no tests for new behavior should not be approved.

### Test File Conventions

- Unit and integration tests: colocated with the module they test, named `*.test.ts`.
- E2E tests: in a top-level `e2e/` directory, named `*.spec.ts`.
- Mocks and fixtures: in a `__mocks__/` or `test/fixtures/` directory adjacent to the tests that use them.

---

## Consequences

- CI blocks merges on test failures.
- New features have a documented behavioral contract via tests.
- The test suite grows alongside the codebase — it is never a "we'll add tests later" situation.
- **Rule:** when creating a plan or implementing a feature, include test creation or test updates. A task with no tests for new behavior is not done.
