/**
 * The only module that touches the generated case data. Every other
 * module goes through these functions, not through src/data/cases.json
 * directly, so switching from a bundled JSON file to a live API later
 * means editing this file and nothing else.
 *
 * Functions are async even though the current implementation is
 * synchronous under the hood, so call sites already await and won't
 * need to change when this starts doing a real fetch.
 */
import type { OphthoCase } from "../types/case";
import caseSet from "../data/cases.json";
import { dateForDay, getDailyCaseIndex } from "./date";

const CASES = caseSet.cases as OphthoCase[];

export async function getAllCases(): Promise<OphthoCase[]> {
  return CASES;
}

export async function getCaseCount(): Promise<number> {
  return CASES.length;
}

export async function getCaseById(id: number): Promise<OphthoCase | null> {
  return CASES.find((c) => c.id === id) ?? null;
}

/** The case for `now` (defaults to the current moment), chosen by date math. */
export async function getDailyCase(now: Date = new Date()): Promise<OphthoCase> {
  const index = getDailyCaseIndex(CASES.length, now);
  const found = CASES[index];
  if (!found) {
    throw new Error(`getDailyCase: no case at computed index ${index}`);
  }
  return found;
}

/** The case that was (or will be) the daily case on the given 1-based day number — used to replay archive entries. */
export async function getCaseForDay(dayNumber: number): Promise<OphthoCase> {
  return getDailyCase(dateForDay(dayNumber));
}
