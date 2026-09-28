# ADR-0006: Avoid Fixed Widths — Responsive Layout First

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Frontend components can accumulate fixed pixel widths in `sx` props:

```tsx
<TextField sx={{ width: 200 }} />
<TextField sx={{ width: 140 }} />
<Select sx={{ minWidth: 110 }} />
```

Fixed widths degrade responsiveness:
- On narrow screens they **cause overflow** or push siblings outside the container instead of shrinking.
- On wide screens they **do not expand** to fill available space, leaving unbalanced layouts.
- They couple the component to a specific viewport assumption, so the same component reused in another container breaks.

All projects are mobile-first — the narrowest viewport is the baseline.

---

## Decision

**Do not use fixed pixel widths (`width: <number>`, `minWidth: <number>`) for layout.** Size elements with responsive tools instead:

| Instead of | Use |
|---|---|
| `sx={{ width: 200 }}` on a form field | `fullWidth` (or `sx={{ flex: 1, minWidth: 0 }}` inside a flex row) |
| `sx={{ width: 140 }}` stacked | `fullWidth` inside a vertical `Stack` |
| `sx={{ minWidth: 110 }}` | let content size it, or use `flex` |
| fixed widths side by side | `flexGrow` / `flex: 1` + `flexWrap: "wrap"` |

Principles:

1. **Form fields** use `fullWidth` inside a container with `maxWidth` — the cap lives on the container, not the field.
2. **Horizontal rows** use flexbox (`flex: 1`, `flexGrow`, `justifyContent`) and wrap (`flexWrap: "wrap"`) on narrow screens.
3. **`maxWidth` is allowed** — it is a responsive cap: limits on large screens but shrinks freely on small ones. Prefer `maxWidth` on a container over `width` on a child.
4. **Breakpoint-responsive values** (`sx={{ width: { xs: "100%", md: "50%" } }}`) are acceptable when a proportion is required; still prefer percentages/flex over pixels.

### Exception: Intrinsic Sizes of Graphic Elements

Graphic elements with a **fixed aspect ratio** that are not part of the document flow are exempt, because their "width" is an intrinsic size, not a layout decision:

- Icons and `Avatar`/thumbnails (`width: 24, height: 24`).
- Decorative orbs/glows in pseudo-elements (`::before` with `width`/`height` + `borderRadius: "50%"`).

These must remain square/circular and intentionally declare both `width` and `height`.

---

## Consequences

- Forms and tables shrink and grow with the container; the same component works in narrow cards and wide layouts without adjustment.
- The width cap lives in one place (the container's `maxWidth`), making layout changes easy to find.
- **Rule:** when writing an `sx` prop, never reach for `width: <number>` for layout. Use `fullWidth`, `flex`, percentages, or `maxWidth` on the container. Fixed widths/heights only for icon and decoration intrinsic sizes.
