import { describe, expect, it } from "vitest";
import { getAllCases, getCaseById, getCaseCount, getDailyCase } from "./case-data";

describe("case-data", () => {
  it("loads exactly 365 cases", async () => {
    expect(await getCaseCount()).toBe(365);
    expect(await getAllCases()).toHaveLength(365);
  });

  it("looks up a case by id", async () => {
    const c = await getCaseById(1);
    expect(c?.diagnosis).toBe("Age-Related Macular Degeneration (Wet)");
    expect(await getCaseById(9999)).toBeNull();
  });

  it("returns a real case for the daily selection, deterministically for the same date", async () => {
    const date = new Date(2026, 5, 15);
    const a = await getDailyCase(date);
    const b = await getDailyCase(date);
    expect(a.id).toBe(b.id);
    expect(a).toEqual(await getCaseById(a.id));
  });

  it("returns different cases across a full year without repeats", async () => {
    const seen = new Set<number>();
    const launch = new Date(2026, 0, 1);
    for (let i = 0; i < 365; i++) {
      const d = new Date(launch);
      d.setDate(d.getDate() + i);
      const c = await getDailyCase(d);
      seen.add(c.id);
    }
    expect(seen.size).toBe(365);
  });
});
