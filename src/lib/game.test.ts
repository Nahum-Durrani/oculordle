import { describe, expect, it } from "vitest";
import type { OphthoCase } from "../types/case";
import {
  applyGuess,
  buildShareGrid,
  createInitialProgress,
  getOrInitProgress,
  getShareText,
  updateStatsForCompletedGame,
} from "./game";
import { EMPTY_STATS, type DailyProgress } from "./storage";

function makeCase(overrides: Partial<OphthoCase> = {}): OphthoCase {
  return {
    id: 1,
    diagnosis: "Primary Open-Angle Glaucoma",
    aliases: ["POAG"],
    categories: ["Glaucoma"],
    difficulty: "Medium",
    clues: ["c1", "c2", "c3", "c4", "c5"],
    teachingPoints: ["t1", "t2", "t3", "t4"],
    ...overrides,
  };
}

const otherCase = makeCase({ id: 2, diagnosis: "Angle-Closure Glaucoma", aliases: ["ACG"] });

describe("createInitialProgress", () => {
  it("starts in-progress with only the free clue revealed", () => {
    const p = createInitialProgress(1, new Date(2026, 0, 1));
    expect(p).toMatchObject({ caseId: 1, status: "in-progress", cluesRevealed: 1, guesses: [] });
    expect(p.dateKey).toBe("2026-01-01");
  });
});

describe("getOrInitProgress", () => {
  it("resumes saved progress for the same day and case", () => {
    const saved = createInitialProgress(1, new Date(2026, 0, 1));
    saved.cluesRevealed = 3;
    const result = getOrInitProgress(saved, makeCase({ id: 1 }), new Date(2026, 0, 1));
    expect(result).toBe(saved);
  });

  it("starts fresh if the saved progress is for a different day", () => {
    const saved = createInitialProgress(1, new Date(2026, 0, 1));
    const result = getOrInitProgress(saved, makeCase({ id: 1 }), new Date(2026, 0, 2));
    expect(result.dateKey).toBe("2026-01-02");
    expect(result.guesses).toEqual([]);
  });

  it("starts fresh if there is no saved progress", () => {
    const result = getOrInitProgress(null, makeCase({ id: 1 }), new Date(2026, 0, 1));
    expect(result.guesses).toEqual([]);
  });
});

describe("applyGuess", () => {
  const today = makeCase();
  const allCases = [today, otherCase];

  it("wins on the first guess with a correct diagnosis", () => {
    const p = createInitialProgress(today.id);
    const { progress, justCompleted } = applyGuess(p, today, allCases, "Primary Open-Angle Glaucoma");
    expect(progress.status).toBe("won");
    expect(progress.guesses).toHaveLength(1);
    expect(justCompleted).toBe(true);
  });

  it("wins on an alias guess and reveals no extra clue", () => {
    const p = createInitialProgress(today.id);
    const { progress } = applyGuess(p, today, allCases, "POAG");
    expect(progress.status).toBe("won");
    expect(progress.cluesRevealed).toBe(1);
  });

  it("reveals the next clue on a wrong guess and stays in-progress", () => {
    const p = createInitialProgress(today.id);
    const { progress, justCompleted } = applyGuess(p, today, allCases, "totally wrong");
    expect(progress.status).toBe("in-progress");
    expect(progress.cluesRevealed).toBe(2);
    expect(justCompleted).toBe(false);
  });

  it("resolves a wrong guess that names a different known case to its canonical name", () => {
    const p = createInitialProgress(today.id);
    const { progress } = applyGuess(p, today, allCases, "ACG");
    expect(progress.guesses[0]).toMatchObject({
      raw: "ACG",
      resolved: "Angle-Closure Glaucoma",
      outcome: "incorrect",
    });
  });

  it("resolves a guess matching nothing at all to null", () => {
    const p = createInitialProgress(today.id);
    const { progress } = applyGuess(p, today, allCases, "asdkfjasldkfj");
    expect(progress.guesses[0]?.resolved).toBeNull();
  });

  it("loses after 5 wrong guesses, capping clues at 5", () => {
    let progress = createInitialProgress(today.id);
    for (let i = 0; i < 4; i++) {
      progress = applyGuess(progress, today, allCases, `wrong ${i}`).progress;
    }
    expect(progress.status).toBe("in-progress");
    expect(progress.cluesRevealed).toBe(5);

    const final = applyGuess(progress, today, allCases, "wrong 5");
    expect(final.progress.status).toBe("lost");
    expect(final.progress.cluesRevealed).toBe(5);
    expect(final.justCompleted).toBe(true);
  });

  it("is a no-op once the round is already complete", () => {
    const p = createInitialProgress(today.id);
    const won = applyGuess(p, today, allCases, "POAG").progress;
    const after = applyGuess(won, today, allCases, "anything");
    expect(after.progress).toBe(won);
    expect(after.justCompleted).toBe(false);
  });

  it("rejects an exact-repeat guess without consuming an attempt", () => {
    const p = createInitialProgress(today.id);
    const first = applyGuess(p, today, allCases, "ACG").progress;
    const repeat = applyGuess(first, today, allCases, "ACG");
    expect(repeat.duplicate).toBe(true);
    expect(repeat.progress).toBe(first);
    expect(repeat.progress.guesses).toHaveLength(1);
  });

  it("rejects a repeat guess that resolves to the same diagnosis via a different alias", () => {
    const p = createInitialProgress(today.id);
    const first = applyGuess(p, today, allCases, "ACG").progress;
    const repeat = applyGuess(first, today, allCases, "Angle-Closure Glaucoma");
    expect(repeat.duplicate).toBe(true);
    expect(repeat.progress.guesses).toHaveLength(1);
  });

  it("rejects a repeat of the exact same unmatched free text", () => {
    const p = createInitialProgress(today.id);
    const first = applyGuess(p, today, allCases, "asdkfjasldkfj").progress;
    const repeat = applyGuess(first, today, allCases, "asdkfjasldkfj");
    expect(repeat.duplicate).toBe(true);
    expect(repeat.progress.guesses).toHaveLength(1);
  });

  it("does not treat two different unmatched guesses as duplicates", () => {
    const p = createInitialProgress(today.id);
    const first = applyGuess(p, today, allCases, "totally wrong").progress;
    const second = applyGuess(first, today, allCases, "also wrong");
    expect(second.duplicate).toBe(false);
    expect(second.progress.guesses).toHaveLength(2);
  });
});

describe("updateStatsForCompletedGame", () => {
  function won(dateKey: string, guessCount: number): DailyProgress {
    return {
      dateKey,
      caseId: 1,
      status: "won",
      cluesRevealed: guessCount,
      guesses: Array.from({ length: guessCount }, (_, i) => ({
        raw: `g${i}`,
        resolved: i === guessCount - 1 ? "X" : null,
        outcome: i === guessCount - 1 ? ("correct" as const) : ("incorrect" as const),
      })),
    };
  }

  function lost(dateKey: string): DailyProgress {
    return {
      dateKey,
      caseId: 1,
      status: "lost",
      cluesRevealed: 5,
      guesses: Array.from({ length: 5 }, (_, i) => ({
        raw: `g${i}`,
        resolved: null,
        outcome: "incorrect" as const,
      })),
    };
  }

  it("records a win, updates guess distribution, and starts a streak", () => {
    const stats = updateStatsForCompletedGame(EMPTY_STATS, won("2026-01-01", 3));
    expect(stats.played).toBe(1);
    expect(stats.won).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
    expect(stats.guessDistribution).toEqual([0, 0, 1, 0, 0]);
    expect(stats.lastPlayedDateKey).toBe("2026-01-01");
  });

  it("extends the streak on a consecutive-day win", () => {
    const day1 = updateStatsForCompletedGame(EMPTY_STATS, won("2026-01-01", 1));
    const day2 = updateStatsForCompletedGame(day1, won("2026-01-02", 2));
    expect(day2.currentStreak).toBe(2);
    expect(day2.maxStreak).toBe(2);
  });

  it("resets the streak to 1 (not 0) on a win after a gap", () => {
    const day1 = updateStatsForCompletedGame(EMPTY_STATS, won("2026-01-01", 1));
    const day5 = updateStatsForCompletedGame(day1, won("2026-01-05", 1));
    expect(day5.currentStreak).toBe(1);
    expect(day5.maxStreak).toBe(1);
  });

  it("resets the streak to 0 on a loss and keeps maxStreak", () => {
    const day1 = updateStatsForCompletedGame(EMPTY_STATS, won("2026-01-01", 1));
    const day2 = updateStatsForCompletedGame(day1, won("2026-01-02", 1));
    const day3 = updateStatsForCompletedGame(day2, lost("2026-01-03"));
    expect(day3.currentStreak).toBe(0);
    expect(day3.maxStreak).toBe(2);
    expect(day3.played).toBe(3);
    expect(day3.won).toBe(2);
  });
});

describe("share text", () => {
  it("builds a green/black grid for a win with clues to spare", () => {
    const p: DailyProgress = {
      dateKey: "2026-01-01",
      caseId: 1,
      status: "won",
      cluesRevealed: 2,
      guesses: [
        { raw: "wrong", resolved: null, outcome: "incorrect" },
        { raw: "right", resolved: "X", outcome: "correct" },
      ],
    };
    expect(buildShareGrid(p)).toBe("\u{1F7E5}\u{1F7E9}\u{2B1B}\u{2B1B}\u{2B1B}");
    expect(getShareText(12, p)).toBe(`Oculordle #12 2/5\n${buildShareGrid(p)}`);
  });

  it("shows X/5 for a loss", () => {
    const p: DailyProgress = {
      dateKey: "2026-01-01",
      caseId: 1,
      status: "lost",
      cluesRevealed: 5,
      guesses: Array.from({ length: 5 }, () => ({
        raw: "wrong",
        resolved: null,
        outcome: "incorrect" as const,
      })),
    };
    expect(getShareText(1, p)).toContain("X/5");
  });
});
