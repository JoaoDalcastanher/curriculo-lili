import { describe, expect, test } from "bun:test";

import {
  formatPeriod,
  formatYearMonth,
  getCurrentYear,
  parseYearMonth,
  yearMonthSortKey,
  yearsSince,
} from "./datetime";

// 2026-01-01T01:00Z is still 2025-12-31 in São Paulo — guards the timezone boundary.
const NEW_YEAR_UTC = new Date("2026-01-01T01:00:00Z");

describe("parseYearMonth", () => {
  test("parses YYYY-MM", () => {
    expect(parseYearMonth("2019-03")).toEqual({ year: 2019, month: 3 });
  });

  test("rejects malformed values and invalid months", () => {
    expect(parseYearMonth("2019-3")).toBeNull();
    expect(parseYearMonth("2019-13")).toBeNull();
    expect(parseYearMonth("março")).toBeNull();
  });
});

describe("formatting", () => {
  test("formats a year-month in Portuguese", () => {
    expect(formatYearMonth("2019-03")).toBe("mar 2019");
    expect(formatYearMonth("2020-12")).toBe("dez 2020");
  });

  test("returns invalid input untouched", () => {
    expect(formatYearMonth("em breve")).toBe("em breve");
  });

  test("formats closed and ongoing periods", () => {
    expect(formatPeriod("2018-02", "2020-12")).toBe("fev 2018 — dez 2020");
    expect(formatPeriod("2021-02", null)).toBe("fev 2021 — atual");
  });
});

describe("yearsSince", () => {
  test("counts whole years in the app timezone", () => {
    expect(yearsSince("2016-02", new Date("2026-09-28T12:00:00Z"))).toBe(10);
    expect(yearsSince("2016-12", new Date("2026-09-28T12:00:00Z"))).toBe(9);
  });

  test("uses São Paulo time at the year boundary", () => {
    expect(getCurrentYear(NEW_YEAR_UTC)).toBe(2025);
    expect(yearsSince("2025-01", NEW_YEAR_UTC)).toBe(0);
  });

  test("never goes negative or breaks on bad input", () => {
    expect(yearsSince("2099-01", NEW_YEAR_UTC)).toBe(0);
    expect(yearsSince("???", NEW_YEAR_UTC)).toBe(0);
  });
});

describe("yearMonthSortKey", () => {
  test("orders chronologically with ongoing last", () => {
    expect(yearMonthSortKey("2019-03")).toBeLessThan(yearMonthSortKey("2019-04"));
    expect(yearMonthSortKey(null)).toBeGreaterThan(yearMonthSortKey("2999-12"));
  });
});
