// All frontend date/time operations go through this file.
// Never use toLocaleDateString(), new Date(), or timezone strings in pages or components.
// If a feature needs new date behaviour, add a function here first (ADR-0011, Policy 001).

// Set this to your application's actual timezone.
// Example: "America/Sao_Paulo", "Europe/London", "Asia/Tokyo"
const APP_TIMEZONE = "UTC";

type DateInput = Date | string | null | undefined;

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function toDate(value: DateInput): Date | null {
  if (value == null) return null;
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function getAppTimezone(): string {
  return APP_TIMEZONE;
}

export function getTodayInAppTimezoneISO(now: Date = new Date()): string {
  return getFormatter(APP_TIMEZONE).format(now);
}

export function getISODateInTimezone(
  value: DateInput,
  timezone: string = APP_TIMEZONE,
): string {
  const date = toDate(value);
  if (date == null) return "";
  return getFormatter(timezone).format(date);
}

export function getISODateOnly(value: DateInput): string {
  if (typeof value === "string" && value.length > 0) return value.slice(0, 10);
  const date = toDate(value);
  if (date == null) return "";
  return date.toISOString().slice(0, 10);
}

export function isCompleteISODateInput(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function isValidISODateInput(value: string): boolean {
  if (!isCompleteISODateInput(value)) return false;
  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const year = parsed.getFullYear().toString().padStart(4, "0");
  const month = (parsed.getMonth() + 1).toString().padStart(2, "0");
  const day = parsed.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}` === value;
}

export function addDaysToISODate(dateISO: string, daysToAdd: number): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const ms = Date.UTC(year, month - 1, day) + daysToAdd * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

export function formatISOToDDMMYYYY(value: string | null | undefined): string {
  if (!value || value.length === 0) return "";
  const [year, month, day] = value.split("T")[0].split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function formatISODateForLocale(
  value: DateInput,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = toDate(value);
  if (date == null) return "";
  return date.toLocaleDateString(locale, options);
}

export function formatISODateOnlyForLocale(
  dateISO: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  if (!year || !month || !day) return "";
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale, options);
}

export function getNextMidnightInTimezone(
  timezone: string = APP_TIMEZONE,
  now: Date = new Date(),
): Date {
  const todayISO = getISODateInTimezone(now, timezone);
  const tomorrowISO = addDaysToISODate(todayISO, 1);
  const tomorrowStart = new Date(`${tomorrowISO}T00:00:00.000Z`);
  const candidate = new Date(tomorrowStart);
  const formatter = getFormatter(timezone);

  while (formatter.format(candidate) !== tomorrowISO) {
    candidate.setUTCMinutes(candidate.getUTCMinutes() + 15);
  }
  while (formatter.format(candidate) === tomorrowISO) {
    candidate.setUTCMinutes(candidate.getUTCMinutes() - 1);
  }
  candidate.setUTCMinutes(candidate.getUTCMinutes() + 1);
  candidate.setUTCSeconds(0);
  candidate.setUTCMilliseconds(0);
  return candidate;
}
