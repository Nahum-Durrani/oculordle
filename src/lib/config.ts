/**
 * The calendar date case #1 goes live. Day numbers and daily case
 * selection are both computed relative to this. Local time, not UTC —
 * a new case appears at the player's own midnight, matching how Wordle
 * behaves.
 */
export const LAUNCH_DATE = new Date(2026, 6, 23);

export const MAX_GUESSES = 5;
export const CLUES_PER_CASE = 5;
export const TEACHING_POINTS_PER_CASE = 4;

export const STORAGE_VERSION = "v1";

/** Generic slot labels for the 5 clue positions, most- to least-specific. */
export const CLUE_KIND_LABELS = ["PRESENTATION", "EXAM", "FINDINGS", "IMAGING", "MANAGEMENT"] as const;
