import { LAUNCH_DATE } from "./config";

/** Midnight, local time, of the given date. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Whole local calendar days between `from` and `to` (can be negative). */
export function daysBetween(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** `YYYY-MM-DD` for the given date's local calendar day. Used as the storage key for "today". */
export function getDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** True if `curr` is exactly the local calendar day after `prev`. */
export function isConsecutiveDay(prevKey: string, currKey: string): boolean {
  const prev = parseDayKey(prevKey);
  const curr = parseDayKey(currKey);
  if (!prev || !curr) return false;
  return daysBetween(prev, curr) === 1;
}

function parseDayKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  const [, y, m, d] = match;
  return new Date(Number(y), Number(m) - 1, Number(d));
}

/**
 * 1-indexed day number since launch (launch day itself is day 1), shown
 * in the share text as "Oculordle #N". Dates before launch yield
 * numbers <= 0, which callers can treat as "not live yet".
 */
export function getDayNumber(now: Date = new Date(), launch: Date = LAUNCH_DATE): number {
  return daysBetween(launch, now) + 1;
}

/**
 * Index into the case array for a given day, wrapping around after
 * `caseCount` days so the rotation repeats every N days. Handles dates
 * before launch by wrapping backwards instead of returning a negative
 * index, which keeps local dev/testing sane.
 */
export function getDailyCaseIndex(
  caseCount: number,
  now: Date = new Date(),
  launch: Date = LAUNCH_DATE,
): number {
  if (caseCount <= 0) {
    throw new Error("getDailyCaseIndex: caseCount must be positive");
  }
  const diff = daysBetween(launch, now);
  return ((diff % caseCount) + caseCount) % caseCount;
}

/** The calendar date for a given 1-based day number (inverse of `getDayNumber`). */
export function dateForDay(dayNumber: number, launch: Date = LAUNCH_DATE): Date {
  const date = startOfDay(launch);
  date.setDate(date.getDate() + (dayNumber - 1));
  return date;
}
