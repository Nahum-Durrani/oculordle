"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { DIFFICULTY_TEXT_COLOR, DifficultyDot } from "@/components/game/case-badges";
import { ClueList } from "@/components/game/clue-list";
import { GuessCombobox } from "@/components/game/guess-combobox";
import { GuessHistory } from "@/components/game/guess-history";
import { ResultPanel } from "@/components/game/result-panel";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";
import { getAllCases, getCaseForDay } from "@/lib/case-data";
import { createInitialProgress, applyGuess, earnedPoints, potentialPoints } from "@/lib/game";
import type { DailyProgress } from "@/lib/storage";
import type { OphthoCase } from "@/types/case";

/**
 * Replays a past case outside the daily rotation. Deliberately does not
 * touch localStorage or lifetime stats — progress lives only in this
 * component's state, so replaying an old case can never corrupt the
 * real streak/win-rate the daily game tracks.
 */
export function PracticeScreen({ day }: { day: number }) {
  const reduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [caseData, setCaseData] = useState<OphthoCase | null>(null);
  const [allCases, setAllCases] = useState<OphthoCase[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!Number.isInteger(day) || day < 1) {
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
        return;
      }
      const [cases, dayCase] = await Promise.all([getAllCases(), getCaseForDay(day)]);
      if (cancelled) return;
      setAllCases(cases);
      setCaseData(dayCase);
      setProgress(createInitialProgress(dayCase.id));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [day]);

  const submitGuess = (raw: string): boolean => {
    if (!caseData || !progress) return false;
    const { progress: next, duplicate } = applyGuess(progress, caseData, allCases, raw);
    if (duplicate) return true;
    setProgress(next);
    return false;
  };

  if (notFound) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="font-mono text-xs tracking-widest text-slate uppercase">Case not found</p>
          <Link href="/archive" className="font-body text-base font-semibold text-cobalt hover:text-cobalt-hover">
            Back to archive
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (loading || !caseData || !progress) {
    return (
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center px-6">
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Loading case…</p>
        </main>
      </div>
    );
  }

  const isDone = progress.status !== "in-progress";
  const won = progress.status === "won";
  const lost = progress.status === "lost";
  const displayRevealed = isDone ? 5 : progress.cluesRevealed;
  const points = won ? earnedPoints(progress.guesses.length) : lost ? 0 : potentialPoints(progress.guesses.length);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader points={points} />

      <main className="flex flex-1 justify-center px-4 py-6.5 sm:px-5.5">
        <div className="flex w-full max-w-[720px] flex-col gap-5">
          <Link
            href="/archive"
            className="flex items-center gap-1.5 self-start font-mono text-xs tracking-[0.1em] text-slate uppercase transition-colors hover:text-cobalt"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            Back to archive
          </Link>

          <div className="flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <DifficultyDot difficulty={caseData.difficulty} />
                <span className="font-mono text-xs tracking-[0.14em] text-cobalt uppercase">
                  Case #{day} · {caseData.categories[0]} ·{" "}
                  <span style={{ color: DIFFICULTY_TEXT_COLOR[caseData.difficulty] }}>{caseData.difficulty}</span>
                </span>
              </div>
              <span className="font-mono text-xs tracking-[0.14em] text-slate uppercase">
                Clue {displayRevealed} of 5 revealed
              </span>
            </div>
            <p className="rounded-lg bg-cobalt-soft px-3.5 py-2 font-mono text-[10.5px] tracking-[0.1em] text-cobalt-deep uppercase">
              Practice run — doesn&rsquo;t affect your stats or streak
            </p>
          </div>

          <ClueList clues={caseData.clues} revealed={displayRevealed} />

          {isDone ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="flex flex-col gap-8 border-t border-border pt-7"
            >
              <ResultPanel caseData={caseData} status={progress.status as "won" | "lost"} guessCount={progress.guesses.length} />
              <GuessHistory guesses={progress.guesses} todaysCase={caseData} allCases={allCases} showPlaceholders={false} />
              <div className="rounded-[11px] border border-[#cde6da] bg-[#f0f7f3] px-4.5 py-4">
                <p className="mb-1.5 font-mono text-[10.5px] tracking-[0.16em] text-green-text uppercase">
                  Teaching pearl
                </p>
                <p className="text-[14.5px] leading-[1.6] text-[#26463a]">{caseData.teachingPoints[0]}</p>
              </div>
              <Link
                href="/archive"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-strong py-3.5 font-body text-base font-semibold text-ink transition-colors hover:bg-surface-sunken"
              >
                Back to archive
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              <GuessCombobox cases={allCases} guessesMade={progress.guesses.length} onSubmit={submitGuess} />
              <GuessHistory guesses={progress.guesses} todaysCase={caseData} allCases={allCases} />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
