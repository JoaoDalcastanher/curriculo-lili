import { describe, expect, test } from "bun:test";

import { compareYearRangesDesc, formatYearRange, getCurrentYear } from "./datetime";

describe("getCurrentYear", () => {
  test("uses São Paulo time at the year boundary", () => {
    // 2026-01-01T01:00Z is still 2025-12-31 in São Paulo.
    expect(getCurrentYear(new Date("2026-01-01T01:00:00Z"))).toBe(2025);
    expect(getCurrentYear(new Date("2026-01-01T12:00:00Z"))).toBe(2026);
  });
});

describe("formatYearRange", () => {
  test("formats closed and ongoing ranges", () => {
    expect(formatYearRange({ start: 2018, end: 2021 })).toBe("2018 — 2021");
    expect(formatYearRange({ start: 2021, end: null })).toBe("2021 — hoje");
  });

  test("accepts a custom ongoing label", () => {
    expect(formatYearRange({ start: 2024, end: null }, "em andamento")).toBe("2024 — em andamento");
  });

  test("collapses a single-year range", () => {
    expect(formatYearRange({ start: 2025, end: 2025 })).toBe("2025");
  });
});

describe("compareYearRangesDesc", () => {
  const sort = (ranges: { start: number; end: number | null }[]) =>
    [...ranges].sort(compareYearRangesDesc).map((range) => `${range.start}-${range.end}`);

  test("puts ongoing ranges first, the most recently started on top", () => {
    expect(
      sort([
        { start: 2020, end: 2022 },
        { start: 2024, end: null },
        { start: 2026, end: null },
      ]),
    ).toEqual(["2026-null", "2024-null", "2020-2022"]);
  });

  test("orders closed ranges by end year, then start year", () => {
    expect(
      sort([
        { start: 2015, end: 2018 },
        { start: 2014, end: 2021 },
        { start: 2018, end: 2021 },
      ]),
    ).toEqual(["2018-2021", "2014-2021", "2015-2018"]);
  });
});
