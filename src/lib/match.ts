import type { OphthoCase } from "../types/case";

/**
 * Normalizes text for comparison: strips diacritics, lowercases,
 * drops punctuation that carries no diagnostic meaning, and treats
 * hyphens/slashes/underscores as word separators. Lets "Coats' disease",
 * "Coats disease", and "coats' Disease" all match the same way.
 */
export function normalize(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’".,]/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True if `rawGuess` matches the case's diagnosis or any of its aliases. */
export function isCorrectGuess(caseData: OphthoCase, rawGuess: string): boolean {
  const norm = normalize(rawGuess);
  if (!norm) return false;
  if (normalize(caseData.diagnosis) === norm) return true;
  return caseData.aliases.some((alias) => normalize(alias) === norm);
}

export interface DiagnosisOption {
  caseId: number;
  /** The canonical diagnosis name to display and submit — even if the query matched an alias. */
  canonicalName: string;
  /** The specific alias text that matched, or null if the diagnosis itself matched. */
  matchedAlias: string | null;
}

/**
 * Autocomplete search across every case's diagnosis + aliases. A query
 * matching an alias ("Wet AMD") still resolves to the canonical
 * diagnosis name, per the product spec. Each case appears at most once,
 * even if multiple aliases match. Prefix matches rank above
 * mid-string matches; ties keep spreadsheet order.
 */
export function searchDiagnoses(
  cases: OphthoCase[],
  query: string,
  limit = 8,
): DiagnosisOption[] {
  const norm = normalize(query);
  if (!norm) return [];

  type Scored = DiagnosisOption & { rank: number; index: number };
  const results: Scored[] = [];

  const matchRank = (label: string): number | null => {
    const normLabel = normalize(label);
    if (normLabel === norm) return 0;
    if (normLabel.startsWith(norm)) return 1;
    if (normLabel.includes(norm)) return 2;
    return null;
  };

  cases.forEach((c, index) => {
    const candidates: Array<{ matchedAlias: string | null; rank: number }> = [];

    const diagRank = matchRank(c.diagnosis);
    if (diagRank !== null) candidates.push({ matchedAlias: null, rank: diagRank });
    for (const alias of c.aliases) {
      const aliasRank = matchRank(alias);
      if (aliasRank !== null) candidates.push({ matchedAlias: alias, rank: aliasRank });
    }

    if (candidates.length === 0) return;
    const best = candidates.reduce((a, b) => (b.rank < a.rank ? b : a));

    results.push({
      caseId: c.id,
      canonicalName: c.diagnosis,
      matchedAlias: best.matchedAlias,
      rank: best.rank,
      index,
    });
  });

  results.sort((a, b) => a.rank - b.rank || a.index - b.index);
  return results.slice(0, limit).map(({ caseId, canonicalName, matchedAlias }) => ({
    caseId,
    canonicalName,
    matchedAlias,
  }));
}
