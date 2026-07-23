/**
 * Converts data/source/optho-puzzle-365.xlsx into src/data/cases.json.
 *
 * Run with: npm run build:data
 *
 * Validates every row against a strict schema and cross-case rules
 * (unique ids, unique diagnoses, no alias/diagnosis collisions across
 * cases). On any failure, prints every problem found and exits non-zero
 * without touching the output file, so bad data never silently ships.
 */
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import ExcelJS from "exceljs";
import { z } from "zod";
import type { CaseSet, Difficulty, OphthoCase } from "../src/types/case.ts";
import { DIFFICULTIES } from "../src/types/case.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SOURCE_PATH = path.join(ROOT, "data/source/optho-puzzle-365.xlsx");
const OUTPUT_PATH = path.join(ROOT, "src/data/cases.json");
const EXPECTED_CASE_COUNT = 365;

const EXPECTED_HEADERS = [
  "Case #",
  "Condition / Diagnosis",
  "Aliases",
  "Category",
  "Difficulty",
  "Clue 1 (Most Generic)",
  "Clue 2",
  "Clue 3",
  "Clue 4",
  "Clue 5 (Most Specific)",
  "Teaching Point 1",
  "Teaching Point 2",
  "Teaching Point 3",
  "Teaching Point 4",
] as const;

const CaseSchema = z.object({
  id: z.number().int().positive(),
  diagnosis: z.string().trim().min(1),
  aliases: z.array(z.string().trim().min(1)).min(1),
  categories: z.array(z.string().trim().min(1)).min(1),
  difficulty: z.enum(DIFFICULTIES as [Difficulty, ...Difficulty[]]),
  clues: z.tuple([
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
  ]),
  teachingPoints: z.tuple([
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
    z.string().trim().min(1),
  ]),
});

type RowError = { row: number; caseNum: number | null; message: string };

function cellToString(value: ExcelJS.CellValue): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((run) => run.text).join("");
    }
    if ("result" in value && value.result !== undefined) {
      return cellToString(value.result as ExcelJS.CellValue);
    }
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }
    
    
  }
  return String(value);
}

function splitList(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function main() {
  if (!fs.existsSync(SOURCE_PATH)) {
    console.error(`Source spreadsheet not found at ${SOURCE_PATH}`);
    process.exit(1);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(SOURCE_PATH);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    console.error("Workbook has no worksheets.");
    process.exit(1);
  }

  const headerRow = worksheet.getRow(1);
  const actualHeaders = EXPECTED_HEADERS.map((_, i) =>
    cellToString(headerRow.getCell(i + 1).value)?.trim() ?? "",
  );
  const headerMismatches = EXPECTED_HEADERS.map((expected, i) => ({
    col: i + 1,
    expected,
    actual: actualHeaders[i],
  })).filter((h) => h.expected !== h.actual);

  if (headerMismatches.length > 0) {
    console.error(
      "Spreadsheet header row does not match the expected column layout. " +
        "Either the sheet changed shape or a column was renamed/reordered:",
    );
    for (const m of headerMismatches) {
      console.error(
        `  column ${m.col}: expected "${m.expected}", found "${m.actual}"`,
      );
    }
    process.exit(1);
  }

  const errors: RowError[] = [];
  const parsedCases: OphthoCase[] = [];

  const lastRow = worksheet.lastRow?.number ?? 1;
  for (let rowNumber = 2; rowNumber <= lastRow; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    if (row.cellCount === 0) continue; // skip fully blank trailing rows

    const get = (col: number) => cellToString(row.getCell(col).value);

    const idRaw = get(1);
    const candidate = {
      id: idRaw ? Number(idRaw) : NaN,
      diagnosis: get(2) ?? "",
      aliases: splitList(get(3)),
      categories: (get(4) ?? "").split("/").map((s) => s.trim()).filter(Boolean),
      difficulty: (get(5) ?? "") as Difficulty,
      clues: [get(6) ?? "", get(7) ?? "", get(8) ?? "", get(9) ?? "", get(10) ?? ""] as [
        string,
        string,
        string,
        string,
        string,
      ],
      teachingPoints: [get(11) ?? "", get(12) ?? "", get(13) ?? "", get(14) ?? ""] as [
        string,
        string,
        string,
        string,
      ],
    };

    const result = CaseSchema.safeParse(candidate);
    const caseNum = Number.isFinite(candidate.id) ? candidate.id : null;
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          row: rowNumber,
          caseNum,
          message: `${issue.path.join(".")}: ${issue.message}`,
        });
      }
      continue;
    }
    parsedCases.push(result.data);
  }

  // Cross-case validation
  const seenIds = new Map<number, number>(); // id -> row
  const seenDiagnoses = new Map<string, number>(); // lowercase diagnosis -> id
  const nameOwner = new Map<string, { id: number; kind: "diagnosis" | "alias" }>();

  for (const c of parsedCases) {
    if (seenIds.has(c.id)) {
      errors.push({
        row: -1,
        caseNum: c.id,
        message: `duplicate case id (also used by row ${seenIds.get(c.id)})`,
      });
    } else {
      seenIds.set(c.id, c.id);
    }

    const diagKey = c.diagnosis.toLowerCase();
    if (seenDiagnoses.has(diagKey)) {
      errors.push({
        row: -1,
        caseNum: c.id,
        message: `duplicate diagnosis text (also case #${seenDiagnoses.get(diagKey)})`,
      });
    } else {
      seenDiagnoses.set(diagKey, c.id);
    }

    const aliasKeysThisRow = new Set<string>();
    for (const alias of c.aliases) {
      const key = alias.toLowerCase();
      if (aliasKeysThisRow.has(key)) {
        errors.push({
          row: -1,
          caseNum: c.id,
          message: `duplicate alias "${alias}" within the same case`,
        });
      }
      aliasKeysThisRow.add(key);
    }
  }

  // Second pass: alias/diagnosis collisions across the whole set, now that
  // every diagnosis is registered.
  for (const c of parsedCases) {
    const diagKey = c.diagnosis.toLowerCase();
    if (!nameOwner.has(diagKey)) nameOwner.set(diagKey, { id: c.id, kind: "diagnosis" });
  }
  for (const c of parsedCases) {
    for (const alias of c.aliases) {
      const key = alias.toLowerCase();
      const owner = nameOwner.get(key);
      if (owner && owner.id !== c.id) {
        errors.push({
          row: -1,
          caseNum: c.id,
          message: `alias "${alias}" collides with ${owner.kind} of case #${owner.id}`,
        });
      } else if (!owner) {
        nameOwner.set(key, { id: c.id, kind: "alias" });
      }
    }
  }

  if (parsedCases.length !== EXPECTED_CASE_COUNT) {
    errors.push({
      row: -1,
      caseNum: null,
      message: `expected exactly ${EXPECTED_CASE_COUNT} valid cases, got ${parsedCases.length}`,
    });
  }

  const sortedIds = [...parsedCases.map((c) => c.id)].sort((a, b) => a - b);
  for (let i = 0; i < sortedIds.length; i++) {
    if (sortedIds[i] !== i + 1) {
      errors.push({
        row: -1,
        caseNum: sortedIds[i] ?? null,
        message: `case ids are not a contiguous 1..N sequence (gap or duplicate near id ${sortedIds[i]})`,
      });
      break;
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} problem(s) found. Output not written.\n`);
    for (const e of errors) {
      const loc = e.row >= 0 ? `row ${e.row}` : "cross-case check";
      const caseLabel = e.caseNum != null ? ` (case #${e.caseNum})` : "";
      console.error(`  ${loc}${caseLabel}: ${e.message}`);
    }
    process.exit(1);
  }

  parsedCases.sort((a, b) => a.id - b.id);

  const output: CaseSet = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(ROOT, SOURCE_PATH),
    count: parsedCases.length,
    cases: parsedCases,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + "\n", "utf-8");

  const byDifficulty: Record<string, number> = {};
  const byPrimaryCategory: Record<string, number> = {};
  for (const c of parsedCases) {
    byDifficulty[c.difficulty] = (byDifficulty[c.difficulty] ?? 0) + 1;
    const primary = c.categories[0] ?? "?";
    byPrimaryCategory[primary] = (byPrimaryCategory[primary] ?? 0) + 1;
  }

  console.log(`Wrote ${parsedCases.length} cases to ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log("By difficulty:", byDifficulty);
  console.log("By primary category:", byPrimaryCategory);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


