// All frontend date/time operations go through this file (ADR-0011, Policy 001).
// Never use new Date(), toLocaleDateString() or timezone strings in pages or components.
// The profile only deals with whole years, so this stays small.

import type { YearRange } from "@/models/profile";

const APP_TIMEZONE = "America/Sao_Paulo";
const ONGOING_LABEL = "hoje";

export function getCurrentYear(now: Date = new Date()): number {
  const year = new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE, year: "numeric" }).format(
    now,
  );
  return Number(year);
}

/** { start: 2021, end: null } → "2021 — hoje". */
export function formatYearRange(range: YearRange): string {
  const end = range.end === null ? ONGOING_LABEL : String(range.end);
  return `${range.start} — ${end}`;
}

/** Sort key where an ongoing range (end: null) is the most recent. */
export function yearRangeSortKey(range: YearRange): number {
  const end = range.end ?? Number.MAX_SAFE_INTEGER;
  return end * 10_000 + range.start;
}
