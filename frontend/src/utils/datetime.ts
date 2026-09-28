// All frontend date/time operations go through this file (ADR-0011, Policy 001).
// Never use new Date(), toLocaleDateString() or timezone strings in pages or components.
// The profile only deals with year-month values ("YYYY-MM"), so this stays small.

import type { ISOYearMonth } from "@/models/profile";

const APP_TIMEZONE = "America/Sao_Paulo";

const MONTHS_SHORT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
] as const;

type YearMonth = {
  year: number;
  month: number; // 1–12
};

export function parseYearMonth(value: ISOYearMonth): YearMonth | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (match === null) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  if (month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}

export function getCurrentYearMonth(now: Date = new Date()): YearMonth {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return { year, month };
}

export function getCurrentYear(now: Date = new Date()): number {
  return getCurrentYearMonth(now).year;
}

/** "2019-03" → "mar 2019". Invalid input is returned untouched. */
export function formatYearMonth(value: ISOYearMonth): string {
  const parsed = parseYearMonth(value);
  if (parsed === null) {
    return value;
  }
  return `${MONTHS_SHORT[parsed.month - 1]} ${parsed.year}`;
}

/** ("2019-03", null) → "mar 2019 — atual". */
export function formatPeriod(start: ISOYearMonth, end: ISOYearMonth | null): string {
  const endLabel = end === null ? "atual" : formatYearMonth(end);
  return `${formatYearMonth(start)} — ${endLabel}`;
}

/** Whole years elapsed since a year-month, never negative. */
export function yearsSince(start: ISOYearMonth, now: Date = new Date()): number {
  const parsed = parseYearMonth(start);
  if (parsed === null) {
    return 0;
  }
  const current = getCurrentYearMonth(now);
  const months = (current.year - parsed.year) * 12 + (current.month - parsed.month);
  return Math.max(0, Math.floor(months / 12));
}

/** Sort key: "2019-03" → 201903. Null (ongoing) sorts as the most recent. */
export function yearMonthSortKey(value: ISOYearMonth | null): number {
  if (value === null) {
    return Number.MAX_SAFE_INTEGER;
  }
  const parsed = parseYearMonth(value);
  if (parsed === null) {
    return 0;
  }
  return parsed.year * 100 + parsed.month;
}
