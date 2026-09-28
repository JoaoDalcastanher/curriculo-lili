// All frontend date/time operations go through this file (ADR-0011, Policy 001).
// Never use new Date(), toLocaleDateString() or timezone strings in pages or components.
// The profile only deals with whole years, so this stays small.

import type { YearRange } from "@/models/profile";

const APP_TIMEZONE = "America/Sao_Paulo";

export function getCurrentYear(now: Date = new Date()): number {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE, year: "numeric" }).format(
    now,
  );
  return Number(year);
}

/**
 * { start: 2021, end: null } → "2021 — hoje" (or the given ongoing label);
 * { start: 2025, end: 2025 } → "2025".
 */
export function formatYearRange(range: YearRange, ongoingLabel = "hoje"): string {
  if (range.end === range.start) {
    return String(range.start);
  }
  const end = range.end === null ? ongoingLabel : String(range.end);
  return `${range.start} — ${end}`;
}

/**
 * Comparator for most-recent-first order: by end year (ongoing first), then
 * by start year.
 */
export function compareYearRangesDesc(a: YearRange, b: YearRange): number {
  const endA = a.end ?? Number.POSITIVE_INFINITY;
  const endB = b.end ?? Number.POSITIVE_INFINITY;
  if (endA !== endB) {
    return endB > endA ? 1 : -1;
  }
  return b.start - a.start;
}
