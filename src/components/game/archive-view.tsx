"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";
import { DIFFICULTY_COLOR } from "@/components/game/case-badges";
import { getAllCases, getCaseForDay, getDailyCase } from "@/lib/case-data";
import { dateForDay, getDayNumber } from "@/lib/date";
import { getOrInitProgress } from "@/lib/game";
import { useHeaderPoints } from "@/hooks/use-header-points";
import { loadProgress, type RoundStatus } from "@/lib/storage";
import type { Difficulty, OphthoCase } from "@/types/case";
import { cn } from "@/lib/utils";

interface ArchiveEntry {
  day: number;
  date: Date;
  case: OphthoCase;
  isToday: boolean;
  status: RoundStatus | null;
  guessCount: number;
}

const FILTERS = ["All", "Easy", "Medium", "Hard"] as const;
type Filter = (typeof FILTERS)[number];

function formatArchiveDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase()
    .replace(",", "");
}

function statusLabel(entry: ArchiveEntry): { text: string; color: string } | null {
  if (!entry.isToday) return null;
  if (entry.status === "won") return { text: `✓ Solved ${entry.guessCount}/5`, color: "#1f7e56" };
  if (entry.status === "lost") return { text: "✗ Out of guesses", color: "#5b6b82" };
  return { text: "● Today", color: "#1957a4" };
}

function ArchiveCard({ entry }: { entry: ArchiveEntry }) {
  const label = statusLabel(entry);
  return (
    <Link href={entry.isToday ? "/play" : `/archive/${entry.day}`} className="rounded-[13px]">
      <div
        className={cn(
          "flex min-h-[176px] flex-col gap-2.5 rounded-[13px] border border-border bg-surface p-5 shadow-[0_2px_10px_rgba(16,35,58,.04)]",
          "transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(16,35,58,.1)]",
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold tracking-[0.08em] text-cobalt-deep">
            {formatArchiveDate(entry.date)}
          </span>
          <span
            aria-hidden="true"
            className="size-3 rounded-[3px]"
            style={{ background: DIFFICULTY_COLOR[entry.case.difficulty] }}
          />
        </div>
        <p className="flex-1 text-base leading-[1.35] font-bold text-ink">{entry.case.clues[0]}</p>
        <p className="font-mono text-[10px] tracking-[0.1em] text-slate uppercase">
          {entry.case.categories[0]} · {entry.case.difficulty}
        </p>
        <p
          className="font-mono text-[10.5px] tracking-[0.14em] uppercase"
          style={{ color: label?.color ?? "#1957a4" }}
        >
          {label?.text ?? "↻ Practice"}
        </p>
      </div>
    </Link>
  );
}

export function ArchiveView() {
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [caseCount, setCaseCount] = useState(0);
  const [dayNumber, setDayNumber] = useState(0);
  const [filter, setFilter] = useState<Filter>("All");
  const points = useHeaderPoints();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const [cases, todaysCase] = await Promise.all([getAllCases(), getDailyCase(now)]);
      if (cancelled) return;

      const today = getDayNumber(now);
      const todayProgress = getOrInitProgress(loadProgress(), todaysCase, now);

      const days = Array.from({ length: today }, (_, i) => today - i);
      const dayCases = await Promise.all(
        days.map((day) => (day === today ? Promise.resolve(todaysCase) : getCaseForDay(day))),
      );
      if (cancelled) return;

      const list: ArchiveEntry[] = days.map((day, i) => {
        const isToday = day === today;
        return {
          day,
          date: dateForDay(day),
          case: dayCases[i]!,
          isToday,
          status: isToday ? todayProgress.status : null,
          guessCount: isToday ? todayProgress.guesses.length : 0,
        };
      });

      setEntries(list);
      setCaseCount(cases.length);
      setDayNumber(today);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? entries : entries.filter((e) => e.case.difficulty === (filter as Difficulty))),
    [entries, filter],
  );

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader points={points} />

      <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col px-7 py-11.5">
        <h1 className="mb-2 font-display text-[34px] font-extrabold tracking-tight text-ink">
          Every case, replayable
        </h1>
        {dayNumber > 0 && (
          <p className="mb-6.5 text-[15px] text-ink-soft">
            You&rsquo;re on case {dayNumber} of {caseCount} — replay any of the others below.
          </p>
        )}

        <div className="mb-6.5 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 py-1.75 font-mono text-[10.5px] tracking-[0.12em] uppercase transition-colors",
                filter === f ? "text-ink" : "text-ink-soft hover:text-ink",
              )}
            >
              {f !== "All" && (
                <span
                  className="size-1.75 rounded-full"
                  style={{ background: DIFFICULTY_COLOR[f as Difficulty] }}
                />
              )}
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="flex min-h-[176px] animate-pulse flex-col gap-3 rounded-[13px] border border-border bg-surface p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 rounded-full bg-[#eef1f5]" />
                  <div className="size-3 rounded-[3px] bg-[#eef1f5]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-full rounded-full bg-[#eef1f5]" />
                  <div className="h-3.5 w-4/5 rounded-full bg-[#eef1f5]" />
                </div>
                <div className="h-2.5 w-24 rounded-full bg-[#eef1f5]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((entry) => (
              <ArchiveCard key={entry.day} entry={entry} />
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
