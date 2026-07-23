import { STORAGE_VERSION } from "./config";

export type GuessOutcome = "correct" | "incorrect";

export interface GuessRecord {
  /** Exactly what the player typed/selected. */
  raw: string;
  /** Canonical diagnosis name this resolved to, or null if it matched no known case. */
  resolved: string | null;
  outcome: GuessOutcome;
}

export type RoundStatus = "in-progress" | "won" | "lost";

export interface DailyProgress {
  dateKey: string;
  caseId: number;
  guesses: GuessRecord[];
  status: RoundStatus;
  /** How many of the 5 clues are currently revealed (starts at 1 — the free clue). */
  cluesRevealed: number;
}

export interface LifetimeStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  /** Wins by guess count used: index 0 = won on guess 1, ... index 4 = won on guess 5. */
  guessDistribution: [number, number, number, number, number];
  lastPlayedDateKey: string | null;
}

export const EMPTY_STATS: LifetimeStats = {
  played: 0,
  won: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0],
  lastPlayedDateKey: null,
};

const PROGRESS_KEY = `ophtho-ordle:${STORAGE_VERSION}:progress`;
const STATS_KEY = `ophtho-ordle:${STORAGE_VERSION}:stats`;

function hasLocalStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function readJSON<T>(key: string): T | null {
  if (!hasLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown): void {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable (private browsing, quota exceeded) — fail silently,
    // the round still works in-memory for the current page load.
  }
}

/** Today's saved progress, or null if nothing was saved for today (or storage is unavailable). */
export function loadProgress(): DailyProgress | null {
  return readJSON<DailyProgress>(PROGRESS_KEY);
}

export function saveProgress(progress: DailyProgress): void {
  writeJSON(PROGRESS_KEY, progress);
}

export function loadStats(): LifetimeStats {
  return readJSON<LifetimeStats>(STATS_KEY) ?? EMPTY_STATS;
}

export function saveStats(stats: LifetimeStats): void {
  writeJSON(STATS_KEY, stats);
}
