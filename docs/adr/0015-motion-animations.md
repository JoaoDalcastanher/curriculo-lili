# ADR-0015: Motion for Animations

**Status:** Accepted
**Date:** 2026-09-28

---

## Context

The site's visual design was produced in Claude Design (`Gabrieli.dc.html`). Movement is a
core part of it: a spring-driven letter entrance, a morphing blob, floating shapes with
scroll parallax, scroll-triggered reveals, a timeline drawn by scroll progress, FLIP
re-layout when filtering projects, and a shared-element morph from a project card into
its detail dialog.

The design implements all of this with the vanilla API of **Motion** (`animate`,
`inView`, `scroll`, `stagger`) over data attributes in the DOM.

---

## Decision

- Use the `motion` package (vanilla DOM API) for every animation. No other animation
  library.
- Keep the design's data-attribute contract (`data-letter`, `data-hero`, `data-reveal`,
  `data-stagger`, `data-float`, `data-parallax`, `data-timeline`, `data-card`, …) so the
  code maps 1:1 to the handoff.
- Choreography lives in classes under `frontend/src/animation/`:
  - `HomeMotion` — page-level entrance, parallax, reveals and timeline.
  - `ProjectMotion` — project filtering and the card ↔ dialog morph.
  Components only render markup; the `useHomeMotion` hook wires `HomeMotion` to the page.
- Prerendered HTML must never flash its final state: an inline script adds the
  `js-motion` class to `<html>` before first paint, and CSS hides only the hero entrance
  elements while that class is present. Without JavaScript or with
  `prefers-reduced-motion`, the class is never added and everything is visible.
- `prefers-reduced-motion: reduce` disables all animation; filters and the dialog switch
  instantly.

---

## Consequences

- One small dependency (`motion`) covers springs, scroll and in-view triggers.
- The animation code is imperative DOM work, isolated from React state; React owns
  content, the classes own movement.
- E2E tests cover both the animated path and the reduced-motion path.
