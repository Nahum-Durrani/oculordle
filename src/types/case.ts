export type Difficulty = "Easy" | "Medium" | "Hard";

export const DIFFICULTIES: readonly Difficulty[] = ["Easy", "Medium", "Hard"];

/**
 * A single daily case. `categories` is an ordered tag list split from the
 * spreadsheet's "/"-joined category column; categories[0] is the primary
 * category shown on the badge. Order is preserved as-authored and not
 * canonicalized (e.g. "Retina/Uveitis" and "Uveitis/Retina" are distinct).
 */
export interface OphthoCase {
  /** Stable 1-based id, equal to the spreadsheet's "Case #" column. */
  id: number;
  diagnosis: string;
  aliases: string[];
  categories: string[];
  difficulty: Difficulty;
  /** Ordered generic -> specific. clues[0] is shown for free before any guess. */
  clues: [string, string, string, string, string];
  teachingPoints: [string, string, string, string];
}

export interface CaseSet {
  generatedAt: string;
  sourceFile: string;
  count: number;
  cases: OphthoCase[];
}
