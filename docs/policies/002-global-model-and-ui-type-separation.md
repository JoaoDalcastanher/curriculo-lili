# Policy 002 — Global Model and UI Type Separation

**Status:** Active  
**Date:** 2026-06-05

*Ported and generalized from pequeno-caminho Policy 002.*

---

## Context

Frontend pages and components can easily accumulate mixed responsibilities:
- UI rendering logic
- Reusable domain models
- Reusable UI contracts and helper types
- Page-local input interfaces

When reusable types are declared directly inside pages/components, ownership becomes unclear and reuse gets harder across hooks, services, pages, and components.

Page input interfaces are part of a page's local contract and should remain with the page for local clarity.

---

## Policy

1. **Reusable frontend domain models must be centralized under `frontend/src/models/`**
   - Canonical domain types and constants for any feature must live in `frontend/src/models/` with a feature-appropriate file name.
   - Example: `frontend/src/models/user.ts`, `frontend/src/models/order.ts`, `frontend/src/models/product.ts`.

2. **Reusable frontend UI/component types must be centralized under `frontend/src/models/`**
   - Shared props and helper typings reused across components/pages must live in `frontend/src/models/` with a UI-focused file name.
   - Example: `frontend/src/models/orderUi.ts`, `frontend/src/models/userUi.ts`.

3. **Exception: page input interfaces stay with the page**
   - Interfaces that describe data received directly by a page component must remain in that page file.

---

## Enforcement Rules

- For all frontend feature code, do not define reusable domain/UI types inside pages/components.
- Add reusable types to `frontend/src/models/` using feature-oriented names.
- Keep only page input interfaces with the page file itself.
- Hooks, pages, and components must import reusable types from `frontend/src/models/`.
