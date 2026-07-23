"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGame } from "@/hooks/use-game";
import { DIFFICULTY_TEXT_COLOR, DifficultyDot } from "@/components/game/case-badges";
import { ClueList } from "@/components/game/clue-list";
import { GuessCombobox } from "@/components/game/guess-combobox";
import { GuessHistory } from "@/components/game/guess-history";
import { ResultModal } from "@/components/game/result-modal";
import { ResultPanel } from "@/components/game/result-panel";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";
import { StatsPanel } from "@/components/game/stats-panel";
import { ShareButton } from "@/components/game/share-button";
import { earnedPoints, potentialPoints } from "@/lib/game";
import { cn } from "@/lib/utils";

/** Mirrors the loaded layout's shape (banner, case header, five clue cards, input row) so nothing jumps into place once data arrives. */
function GameScreenSkeleton() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex flex-1 justify-center px-4 py-6.5 sm:px-5.5">
        <div className="flex w-full max-w-[720px] animate-pulse flex-col gap-5" aria-hidden="true">
          <div className="flex items-center justify-between">
            <div className="h-3 w-40 rounded-full bg-[#eef1f5]" />
            <div className="h-3 w-32 rounded-full bg-[#eef1f5]" />
          </div>
          <div className="flex flex-col gap-2.5">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-start gap-3.5 rounded-xl border border-border px-4.5 py-4">
                <div className="size-[26px] shrink-0 rounded-[7px] bg-[#eef1f5]" />
                <div className="flex-1 py-1">
                  <div className="h-2.5 w-24 rounded-full bg-[#eef1f5]" />
                  {i === 0 && <div className="mt-2.5 h-3.5 w-3/4 rounded-full bg-[#eef1f5]" />}
                </div>
              </div>
            ))}
          </div>
          <div className="h-[54px] rounded-xl bg-[#eef1f5]" />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function GameScreen() {
  const { loading, todaysCase, allCases, progress, stats, dayNumber, submitGuess } = useGame();
  const reduceMotion = useReducedMotion();
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [prevIsDone, setPrevIsDone] = useState(false);

  const isDone = progress != null && progress.status !== "in-progress";

  // Opens once when the round ends (or on load, if today's round was
  // already finished) — never reopens on its own once dismissed.
  if (isDone !== prevIsDone) {
    setPrevIsDone(isDone);
    if (isDone) setResultModalOpen(true);
  }

  if (loading || !todaysCase || !progress) {
    return <GameScreenSkeleton />;
  }

  const won = progress.status === "won";
  const lost = progress.status === "lost";
  const displayRevealed = isDone ? 5 : progress.cluesRevealed;
  const points = won ? earnedPoints(progress.guesses.length) : lost ? 0 : potentialPoints(progress.guesses.length);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader points={points} />

      <main className="flex flex-1 justify-center px-4 py-6.5 sm:px-5.5">
        <div className="flex w-full max-w-[720px] flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <DifficultyDot difficulty={todaysCase.difficulty} />
              <span className="font-mono text-xs tracking-[0.14em] text-cobalt uppercase">
                Case #{dayNumber} · {todaysCase.categories[0]} ·{" "}
                <span style={{ color: DIFFICULTY_TEXT_COLOR[todaysCase.difficulty] }}>{todaysCase.difficulty}</span>
              </span>
            </div>
            <span className="font-mono text-xs tracking-[0.14em] text-slate uppercase">
              Clue {displayRevealed} of 5 revealed
            </span>
          </div>

          <ClueList clues={todaysCase.clues} revealed={displayRevealed} />

          {isDone ? (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: "easeOut" }}
              className="flex flex-col gap-8 border-t border-border pt-7"
            >
              <ResultPanel caseData={todaysCase} status={progress.status as "won" | "lost"} guessCount={progress.guesses.length} />
              <GuessHistory
                guesses={progress.guesses}
                todaysCase={todaysCase}
                allCases={allCases}
                showPlaceholders={false}
              />
              <StatsPanel stats={stats} />
              <ShareButton dayNumber={dayNumber} progress={progress} />
            </motion.div>
          ) : (
            <div className={cn("flex flex-col gap-5")}>
              <GuessCombobox
                cases={allCases}
                guessesMade={progress.guesses.length}
                onSubmit={submitGuess}
                disabled={isDone}
              />
              <GuessHistory guesses={progress.guesses} todaysCase={todaysCase} allCases={allCases} />
            </div>
          )}
        </div>
      </main>

      <SiteFooter />

      {isDone && (
        <ResultModal
          open={resultModalOpen}
          onOpenChange={setResultModalOpen}
          status={progress.status as "won" | "lost"}
          stats={stats}
          dayNumber={dayNumber}
          progress={progress}
          todaysCase={todaysCase}
          allCases={allCases}
        />
      )}
    </div>
  );
}
