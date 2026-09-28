// All backend date/time operations go through this file.
// Never use new Date(), toLocaleDateString(), or timezone strings elsewhere (ADR-0011, Policy 001).

// Set APP_TIMEZONE in your environment. Defaults to UTC.
// Example: APP_TIMEZONE=America/Sao_Paulo
const TIMEZONE = process.env.APP_TIMEZONE ?? "UTC";

// Infrastructure-only export — for cron libraries and ORM config that need the raw string.
// Never use this in business logic or as a display value (ADR-0011).
export const DEFAULT_TIMEZONE = TIMEZONE;

type DateInput = Date | string | null | undefined;

function getDateFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getDateTimeFormatter(timeZone: string): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
}

/**
 * Returns the given instant as "YYYY-MM-DD HH:mm:ss.SSS" in the application timezone.
 * Used as the timestamp for structured log entries (Policy 001, ADR-0013).
 */
export function getTimestampWithMillis(now: Date = new Date()): string {
  const parts = getDateTimeFormatter(TIMEZONE).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((p) => p.type === type)?.value ?? "";
  const ms = String(now.getMilliseconds()).padStart(3, "0");
  return `${part("year")}-${part("month")}-${part("day")} ${part("hour")}:${part("minute")}:${part("second")}.${ms}`;
}

/** Returns today's date as MM-DD in the application timezone. */
export function getTodayMMDD(): string {
  const now = new Date();
  const dateString = getDateFormatter(TIMEZONE).format(now);
  const [, month, day] = dateString.split("-");
  return `${month}-${day}`;
}

/** Returns today's calendar date as YYYY-MM-DD in the application timezone. */
export function getTodayYYYYMMDDInAppTimezone(now: Date = new Date()): string {
  return getDateFormatter(TIMEZONE).format(now);
}

/**
 * Returns today's date as a Date at midnight UTC,
 * based on the current date in the application timezone.
 */
export function getTodayAsDate(): Date {
  const now = new Date();
  const dateString = getDateFormatter(TIMEZONE).format(now);
  return new Date(dateString + "T00:00:00.000Z");
}

/** Returns the current year in the application timezone. */
export function getCurrentYear(): number {
  const now = new Date();
  const dateString = getDateFormatter(TIMEZONE).format(now);
  return parseInt(dateString.split("-")[0], 10);
}

export function getISODateInTimezone(value: DateInput, timezone: string = TIMEZONE): string {
  if (value == null) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return getDateFormatter(timezone).format(date);
}

export function getISODateOnly(value: DateInput): string {
  if (typeof value === "string" && value.length > 0) return value.slice(0, 10);
  if (value == null) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function addDaysToISODate(dateISO: string, daysToAdd: number): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  const ms = Date.UTC(year, month - 1, day) + daysToAdd * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString().slice(0, 10);
}

export function parseISODateStringToUTCDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function parseNullableDateStringToDate(dateString: string | null | undefined): Date | null {
  if (dateString == null || dateString === "") return null;
  return parseDateStringToDate(dateString);
}

/**
 * Parses a YYYY-MM-DD string to a Date at noon UTC.
 * Avoids timezone shifts: new Date("1990-04-04") interprets as UTC midnight,
 * which can shift to the previous day in negative-offset timezones.
 */
export function parseDateStringToDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

/**
 * Parses a wall-clock datetime string to a comparable numeric value for range filtering.
 * Accepts "YYYY-MM-DD HH:mm:ss.SSS", "YYYY-MM-DDTHH:mm", and similar. The components are
 * interpreted as-is (via Date.UTC) so both stored log timestamps and filter inputs compare
 * consistently regardless of the runtime timezone. Returns null when unparseable.
 */
export function parseWallClockToComparableTs(value: string): number | null {
  const match = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?/);
  if (match === null) {
    return null;
  }
  const [, year, month, day, hour, minute, second, millis] = match;
  return Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second ?? "0"),
    Number(millis ?? "0"),
  );
}

export interface FormatApproximateDateParams {
  date: Date | null;
  isApproximation: boolean;
  isBeforeChrist: boolean;
}

export function formatApproximateDate(params: FormatApproximateDateParams): string | null {
  const { date, isApproximation, isBeforeChrist } = params;
  if (date === null) {
    return null;
  }
  const year = date.getUTCFullYear();
  const prefix = isApproximation ? "~" : "";
  const suffix = isBeforeChrist ? " BC" : "";
  return `${prefix}${year}${suffix}`;
}

export function parseDate(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (value instanceof Date) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, "0");
    const day = String(value.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  if (typeof value === "string" && value.length > 0) return value.split("T")[0];
  return null;
}
