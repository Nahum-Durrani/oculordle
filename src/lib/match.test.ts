import { describe, expect, it } from "vitest";
import type { OphthoCase } from "../types/case";
import { isCorrectGuess, normalize, searchDiagnoses } from "./match";

function makeCase(overrides: Partial<OphthoCase> = {}): OphthoCase {
  return {
    id: 1,
    diagnosis: "Age-Related Macular Degeneration (Wet)",
    aliases: ["Wet AMD", "Neovascular AMD", "Exudative AMD"],
    categories: ["Retina"],
    difficulty: "Easy",
    clues: ["c1", "c2", "c3", "c4", "c5"],
    teachingPoints: ["t1", "t2", "t3", "t4"],
    ...overrides,
  };
}

describe("normalize", () => {
  it("lowercases and trims", () => {
    expect(normalize("  Wet AMD  ")).toBe("wet amd");
  });

  it("strips apostrophes and periods without breaking word boundaries", () => {
    expect(normalize("Coats' Disease")).toBe("coats disease");
  });

  it("treats hyphens, slashes and underscores as spaces", () => {
    expect(normalize("Non-Arteritic AION")).toBe("non arteritic aion");
    expect(normalize("A/V nicking")).toBe("a v nicking");
  });

  it("strips diacritics", () => {
    expect(normalize("Café")).toBe("cafe");
  });

  it("collapses repeated whitespace", () => {
    expect(normalize("Wet   AMD")).toBe("wet amd");
  });
});

describe("isCorrectGuess", () => {
  const c = makeCase();

  it("matches the canonical diagnosis, case-insensitively", () => {
    expect(isCorrectGuess(c, "age-related macular degeneration (wet)")).toBe(true);
  });

  it("matches any alias", () => {
    expect(isCorrectGuess(c, "Wet AMD")).toBe(true);
    expect(isCorrectGuess(c, "exudative amd")).toBe(true);
  });

  it("rejects unrelated text", () => {
    expect(isCorrectGuess(c, "Dry AMD")).toBe(false);
  });

  it("rejects empty or whitespace-only guesses", () => {
    expect(isCorrectGuess(c, "")).toBe(false);
    expect(isCorrectGuess(c, "   ")).toBe(false);
  });
});

describe("searchDiagnoses", () => {
  const cases = [
    makeCase({ id: 1, diagnosis: "Age-Related Macular Degeneration (Wet)", aliases: ["Wet AMD"] }),
    makeCase({ id: 2, diagnosis: "Age-Related Macular Degeneration (Dry)", aliases: ["Dry AMD"] }),
    makeCase({ id: 3, diagnosis: "Primary Open-Angle Glaucoma", aliases: ["POAG"] }),
  ];

  it("returns nothing for an empty query", () => {
    expect(searchDiagnoses(cases, "")).toEqual([]);
  });

  it("resolves an alias match to the canonical diagnosis name", () => {
    const results = searchDiagnoses(cases, "Wet AMD");
    expect(results[0]).toMatchObject({
      caseId: 1,
      canonicalName: "Age-Related Macular Degeneration (Wet)",
      matchedAlias: "Wet AMD",
    });
  });

  it("matches abbreviation aliases directly", () => {
    const results = searchDiagnoses(cases, "POAG");
    expect(results[0]?.caseId).toBe(3);
  });

  it("ranks prefix matches above mid-string matches", () => {
    const withMidString = makeCase({ id: 4, diagnosis: "Something Age-Related", aliases: [] });
    const results = searchDiagnoses([...cases, withMidString], "Age-Related");
    // Two case-1/2 diagnoses start with "Age-Related"; case 4 only contains it mid-string.
    expect(results.slice(0, 2).map((r) => r.caseId).sort()).toEqual([1, 2]);
    expect(results.at(-1)?.caseId).toBe(4);
  });

  it("returns each case at most once even with multiple matching aliases", () => {
    const multiAlias = makeCase({ id: 5, diagnosis: "Foo Bar", aliases: ["Foo", "Foobar", "Foo Baz"] });
    const results = searchDiagnoses([multiAlias], "foo");
    expect(results).toHaveLength(1);
  });

  it("respects the limit", () => {
    const many = Array.from({ length: 20 }, (_, i) =>
      makeCase({ id: i + 100, diagnosis: `Glaucoma Type ${i}`, aliases: [] }),
    );
    expect(searchDiagnoses(many, "glaucoma", 5)).toHaveLength(5);
  });
});
