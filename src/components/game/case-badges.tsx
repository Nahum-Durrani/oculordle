import type { Difficulty } from "@/types/case";

/** For dots, fills, and other large-area decoration — not text (fails small-text contrast on white). */
export const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: "#2f9e6e",
  Medium: "#e0a82e",
  Hard: "#d9534f",
};

/** Darkened variants of DIFFICULTY_COLOR that clear 4.5:1 on white/near-white — use for text. */
export const DIFFICULTY_TEXT_COLOR: Record<Difficulty, string> = {
  Easy: "#1f7e56",
  Medium: "#8a6410",
  Hard: "#b23b37",
};
