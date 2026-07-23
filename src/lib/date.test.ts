import { describe, expect, it } from "vitest";
import { daysBetween, getDailyCaseIndex, getDayKey, getDayNumber, isConsecutiveDay } from "./date";

describe("getDayKey", () => {
  it("formats local calendar date as YYYY-MM-DD", () => {
    expect(getDayKey(new Date(2026, 0, 1))).toBe("2026-01-01");
    expect(getDayKey(new Date(2026, 10, 9))).toBe("2026-11-09");
  });
});

describe("daysBetween", () => {
  it("counts whole calendar days regardless of time-of-day", () => {
    const morning = new Date(2026, 0, 1, 0, 5);
    const night = new Date(2026, 0, 2, 23, 55);
    expect(daysBetween(morning, night)).toBe(1);
  });

  it("is negative when `to` precedes `from`", () => {
    expect(daysBetween(new Date(2026, 0, 5), new Date(2026, 0, 1))).toBe(-4);
  });
});

describe("isConsecutiveDay", () => {
  it("is true for back-to-back local days", () => {
    expect(isConsecutiveDay("2026-01-01", "2026-01-02")).toBe(true);
  });

  it("is false for a gap or same day", () => {
    expect(isConsecutiveDay("2026-01-01", "2026-01-03")).toBe(false);
    expect(isConsecutiveDay("2026-01-01", "2026-01-01")).toBe(false);
  });

  it("is false for malformed keys", () => {
    expect(isConsecutiveDay("not-a-date", "2026-01-02")).toBe(false);
  });
});

describe("getDayNumber", () => {
  it("is 1 on launch day and increments daily after", () => {
    const launch = new Date(2026, 0, 1);
    expect(getDayNumber(new Date(2026, 0, 1), launch)).toBe(1);
    expect(getDayNumber(new Date(2026, 0, 2), launch)).toBe(2);
    expect(getDayNumber(new Date(2025, 11, 31), launch)).toBe(0);
  });
});

describe("getDailyCaseIndex", () => {
  const launch = new Date(2026, 0, 1);

  it("is 0 on launch day and increments daily", () => {
    expect(getDailyCaseIndex(365, new Date(2026, 0, 1), launch)).toBe(0);
    expect(getDailyCaseIndex(365, new Date(2026, 0, 2), launch)).toBe(1);
  });

  it("wraps around after caseCount days", () => {
    const dayAfterFullCycle = new Date(2027, 0, 1); // 365 days after launch
    expect(getDailyCaseIndex(365, dayAfterFullCycle, launch)).toBe(0);
  });

  it("wraps backwards for dates before launch instead of going negative", () => {
    const dayBefore = new Date(2025, 11, 31);
    const index = getDailyCaseIndex(365, dayBefore, launch);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(365);
    expect(index).toBe(364);
  });

  it("throws for a non-positive case count", () => {
    expect(() => getDailyCaseIndex(0, new Date(), launch)).toThrow();
  });
});
