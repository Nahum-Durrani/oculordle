import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DailyProgress, LifetimeStats } from "./storage";

class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  removeItem(key: string) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

describe("storage (localStorage present)", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { localStorage: new MemoryStorage() });
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("round-trips progress", async () => {
    const { loadProgress, saveProgress } = await import("./storage");
    expect(loadProgress()).toBeNull();

    const progress: DailyProgress = {
      dateKey: "2026-01-01",
      caseId: 5,
      status: "in-progress",
      cluesRevealed: 2,
      guesses: [{ raw: "x", resolved: null, outcome: "incorrect" }],
    };
    saveProgress(progress);
    expect(loadProgress()).toEqual(progress);
  });

  it("round-trips stats and defaults to EMPTY_STATS when unset", async () => {
    const { loadStats, saveStats, EMPTY_STATS } = await import("./storage");
    expect(loadStats()).toEqual(EMPTY_STATS);

    const stats: LifetimeStats = {
      played: 3,
      won: 2,
      currentStreak: 1,
      maxStreak: 2,
      guessDistribution: [0, 1, 1, 0, 0],
      lastPlayedDateKey: "2026-01-03",
    };
    saveStats(stats);
    expect(loadStats()).toEqual(stats);
  });

  it("falls back to defaults on corrupt JSON instead of throwing", async () => {
    const { loadStats, EMPTY_STATS } = await import("./storage");
    (window as unknown as { localStorage: MemoryStorage }).localStorage.setItem(
      "ophtho-ordle:v1:stats",
      "{not valid json",
    );
    expect(loadStats()).toEqual(EMPTY_STATS);
  });
});

describe("storage (no window / SSR)", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("read functions return null/defaults instead of throwing", async () => {
    const { loadProgress, loadStats, EMPTY_STATS } = await import("./storage");
    expect(loadProgress()).toBeNull();
    expect(loadStats()).toEqual(EMPTY_STATS);
  });

  it("write functions are silent no-ops", async () => {
    const { saveProgress, saveStats } = await import("./storage");
    expect(() =>
      saveProgress({ dateKey: "2026-01-01", caseId: 1, status: "in-progress", cluesRevealed: 1, guesses: [] }),
    ).not.toThrow();
    expect(() =>
      saveStats({ played: 0, won: 0, currentStreak: 0, maxStreak: 0, guessDistribution: [0, 0, 0, 0, 0], lastPlayedDateKey: null }),
    ).not.toThrow();
  });
});
