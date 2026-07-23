import type { OphthoCase } from "../types/case";
import { MAX_GUESSES } from "./config";
import { getDayKey, isConsecutiveDay } from "./date";
import { isCorrectGuess, normalize, searchDiagnoses } from "./match";
import type { DailyProgress, GuessRecord, LifetimeStats } from "./storage";

/** Fresh progress for a brand-new round. Clue 1 is free, so it starts revealed. */
export function createInitialProgress(caseId: number, now: Date = new Date()): DailyProgress {
  return {
    dateKey: getDayKey(now),
    caseId,
    guesses: [],
    status: "in-progress",
    cluesRevealed: 1,
  };
}

/**
 * Progress to resume for `now`: the saved progress if it's still for
 * today's case, otherwise a fresh round for today's case.
 */
export function getOrInitProgress(
  saved: DailyProgress | null,
  todaysCase: OphthoCase,
  now: Date = new Date(),
): DailyProgress {
  const todayKey = getDayKey(now);
  if (saved && saved.dateKey === todayKey && saved.caseId === todaysCase.id) {
    return saved;
  }
  return createInitialProgress(todaysCase.id, now);
}

export interface ApplyGuessResult {
  progress: DailyProgress;
  /** True exactly once, the guess that ends the round (win or exhausted attempts). */
  justCompleted: boolean;
  /** True when this guess resolved to a diagnosis (or raw text) already tried this round — no attempt was consumed. */
  duplicate: boolean;
}

/**
 * Applies one guess to a round already in progress. Resolves the raw
 * text against the full case set (not just today's case) so a guess
 * that names a *different* known diagnosis still displays its
 * canonical name in the guess history. Reveals the next clue on a
 * wrong guess, unless all 5 are already showing.
 *
 * A guess that resolves to a diagnosis already present in
 * `progress.guesses` (or, for unmatched free text, repeats the exact
 * same raw text) is rejected without consuming an attempt — nothing
 * new can be learned from trying the same answer twice.
 */
export function applyGuess(
  progress: DailyProgress,
  todaysCase: OphthoCase,
  allCases: OphthoCase[],
  rawGuess: string,
): ApplyGuessResult {
  if (progress.status !== "in-progress") {
    return { progress, justCompleted: false, duplicate: false };
  }

  const correct = isCorrectGuess(todaysCase, rawGuess);
  const [topMatch] = searchDiagnoses(allCases, rawGuess, 1);
  const resolved = correct
    ? todaysCase.diagnosis
    : (topMatch?.canonicalName ?? null);

  const isDuplicate = progress.guesses.some((g) =>
    resolved !== null ? g.resolved === resolved : g.resolved === null && normalize(g.raw) === normalize(rawGuess),
  );
  if (isDuplicate) {
    return { progress, justCompleted: false, duplicate: true };
  }

  const record: GuessRecord = {
    raw: rawGuess,
    resolved,
    outcome: correct ? "correct" : "incorrect",
  };

  const guesses = [...progress.guesses, record];
  const guessesUsed = guesses.length;
  const cluesRevealed = correct
    ? progress.cluesRevealed
    : Math.min(progress.cluesRevealed + 1, MAX_GUESSES);

  const status = correct ? "won" : guessesUsed >= MAX_GUESSES ? "lost" : "in-progress";

  const nextProgress: DailyProgress = {
    ...progress,
    guesses,
    cluesRevealed,
    status,
  };

  return { progress: nextProgress, justCompleted: status !== "in-progress", duplicate: false };
}

/**
 * Folds one completed round into lifetime stats. Call exactly once per
 * completed round (when `applyGuess` returns `justCompleted: true`) —
 * calling it twice for the same round double-counts.
 */
export function updateStatsForCompletedGame(
  stats: LifetimeStats,
  progress: DailyProgress,
): LifetimeStats {
  const won = progress.status === "won";
  const played = stats.played + 1;

  let currentStreak: number;
  if (won) {
    const continuesStreak =
      stats.lastPlayedDateKey !== null &&
      isConsecutiveDay(stats.lastPlayedDateKey, progress.dateKey);
    currentStreak = continuesStreak ? stats.currentStreak + 1 : 1;
  } else {
    currentStreak = 0;
  }

  const guessDistribution = [...stats.guessDistribution] as LifetimeStats["guessDistribution"];
  if (won) {
    const idx = progress.guesses.length - 1;
    if (idx >= 0 && idx < guessDistribution.length) {
      guessDistribution[idx] = (guessDistribution[idx] ?? 0) + 1;
    }
  }

  return {
    played,
    won: stats.won + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    guessDistribution,
    lastPlayedDateKey: progress.dateKey,
  };
}

/** ⬛/🟩/🟥 row for the share grid: one cell per guess, padded to MAX_GUESSES. */
export function buildShareGrid(progress: DailyProgress): string {
  const cells: string[] = progress.guesses.map((g) => (g.outcome === "correct" ? "\u{1F7E9}" : "\u{1F7E5}"));
  while (cells.length < MAX_GUESSES) cells.push("\u{2B1B}");
  return cells.join("");
}

export function getShareText(dayNumber: number, progress: DailyProgress): string {
  const scoreLabel = progress.status === "won" ? `${progress.guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  return `Oculordle #${dayNumber} ${scoreLabel}\n${buildShareGrid(progress)}`;
}

export type GuessFeedback = "correct" | "close" | "wrong";

/**
 * Visual feedback tier for one guess row: "close" means the resolved
 * diagnosis shares a category with today's case (same differential
 * family) even though it's not the answer. A guess that matched no
 * known diagnosis (`resolved === null`) can't be scored for category
 * overlap, so it always reads as "wrong".
 */
export function getGuessFeedback(
  guess: GuessRecord,
  todaysCase: OphthoCase,
  allCases: OphthoCase[],
): GuessFeedback {
  if (guess.outcome === "correct") return "correct";
  if (!guess.resolved) return "wrong";
  const matched = allCases.find((c) => c.diagnosis === guess.resolved);
  if (matched && matched.categories.some((cat) => todaysCase.categories.includes(cat))) return "close";
  return "wrong";
}

/** Points if the player solves on their very next guess, given how many guesses are already used. */
export function potentialPoints(guessesMade: number): number {
  return Math.max(40, 200 - guessesMade * 40);
}

/** Points actually awarded for winning after using `guessesUsed` guesses. */
export function earnedPoints(guessesUsed: number): number {
  return Math.max(40, 200 - (guessesUsed - 1) * 40);
}
