"use client";

import { useState } from "react";
import { ChevronDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCountdownToMidnight } from "@/hooks/use-countdown";
import { getGuessFeedback, getShareText, type GuessFeedback } from "@/lib/game";
import type { DailyProgress, LifetimeStats } from "@/lib/storage";
import type { OphthoCase } from "@/types/case";
import { MAX_GUESSES } from "@/lib/config";
import { cn } from "@/lib/utils";

// Large solid fills, not text — the brighter --green/--amber/--slate tones are fine here.
const CELL_COLOR: Record<GuessFeedback, string> = {
  correct: "#2f9e6e",
  close: "#e0a82e",
  wrong: "#8b98ab",
};

interface ResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: Extract<DailyProgress["status"], "won" | "lost">;
  stats: LifetimeStats;
  dayNumber: number;
  progress: DailyProgress;
  todaysCase: OphthoCase;
  allCases: OphthoCase[];
}

export function ResultModal({
  open,
  onOpenChange,
  status,
  stats,
  dayNumber,
  progress,
  todaysCase,
  allCases,
}: ResultModalProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const countdown = useCountdownToMidnight();
  const won = status === "won";
  const guessCount = progress.guesses.length;

  const winRate = stats.played > 0 ? `${Math.round((stats.won / stats.played) * 100)}%` : "0%";
  const summaryPoints = todaysCase.teachingPoints.slice(1);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(getShareText(dayNumber, progress));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — clipboard access was blocked");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-[min(460px,100%)] max-w-[min(460px,100%)] gap-0 overflow-y-auto rounded-2xl bg-surface p-0 shadow-[0_30px_80px_rgba(9,22,42,.4)]"
      >
        <div
          className="rounded-t-2xl px-7.5 pt-7.5 pb-6"
          style={{
            // Darker than --green/--amber's decorative values: pure white small text on
            // #2f9e6e only clears ~3.4:1, below the 4.5:1 floor for this caption/tag copy.
            background: won
              ? "linear-gradient(135deg,#1f7e56,#17603f)"
              : "linear-gradient(135deg,#5b6b82,#3e4b60)",
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-2 font-mono text-[11px] tracking-[0.18em] text-white uppercase">
                {won ? `Solved in ${guessCount}/${MAX_GUESSES}` : "Better luck tomorrow"}
              </p>
              <DialogTitle className="font-display text-[30px] font-extrabold tracking-tight text-white">
                {won ? "Correct!" : "Out of guesses"}
              </DialogTitle>
            </div>
            <DialogClose className="p-0.5 text-[22px] leading-none text-white transition-transform hover:scale-110">
              ×
            </DialogClose>
          </div>
          <DialogDescription className="mt-4 text-sm text-white">The diagnosis was</DialogDescription>
          <p className="mt-0.5 text-[22px] leading-[1.25] font-bold text-white">{todaysCase.diagnosis}</p>
        </div>

        <div className="flex flex-col gap-5 px-7.5 pt-6 pb-7.5">
          <div className="rounded-[11px] border border-[#cde6da] bg-[#f0f7f3] px-4.5 py-4">
            <p className="mb-1.5 font-mono text-[10.5px] tracking-[0.16em] text-green-text uppercase">Teaching pearl</p>
            <p className="text-[14.5px] leading-[1.6] text-[#26463a]">{todaysCase.teachingPoints[0]}</p>
          </div>

          {summaryPoints.length > 0 && (
            <div className="overflow-hidden rounded-[11px] border border-border">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between bg-[#fafbfc] px-4 py-3.5 transition-colors duration-150 hover:bg-[#f2f5f9]"
              >
                <span className="font-mono text-[10.5px] tracking-[0.16em] text-cobalt uppercase">
                  Diagnosis summary
                </span>
                <ChevronDown
                  className={cn("size-4 text-slate transition-transform duration-200", summaryOpen && "rotate-180")}
                />
              </button>
              {summaryOpen && (
                <div className="flex flex-col gap-3 px-4 pt-1 pb-3.5">
                  {summaryPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cobalt" />
                      <p className="text-sm leading-[1.55] text-[#3a4a63]">{pt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-around text-center">
            <div>
              <div className="text-[27px] font-extrabold text-cobalt-deep">{winRate}</div>
              <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] text-slate uppercase">Win rate</div>
            </div>
            <div>
              <div className="text-[27px] font-extrabold text-cobalt-deep">{stats.currentStreak}</div>
              <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] text-slate uppercase">Streak</div>
            </div>
            <div>
              <div className="text-[27px] font-extrabold text-cobalt-deep">{stats.maxStreak}</div>
              <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.1em] text-slate uppercase">Max streak</div>
            </div>
          </div>

          <div>
            <p className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-slate uppercase">Your path today</p>
            <div className="flex gap-1.75">
              {Array.from({ length: MAX_GUESSES }, (_, i) => {
                const g = progress.guesses[i];
                const color = g ? CELL_COLOR[getGuessFeedback(g, todaysCase, allCases)] : "#eef1f5";
                return <div key={i} className="h-10 flex-1 rounded-[7px]" style={{ background: color }} />;
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-[#eef1f5] pt-5">
            <div className="flex-1">
              <p className="font-mono text-[10px] tracking-[0.14em] text-slate uppercase">Next case in</p>
              <p className="mt-0.5 text-[22px] font-extrabold text-cobalt-deep tabular-nums">{countdown}</p>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="flex shrink-0 items-center gap-2 rounded-[10px] bg-green px-6 py-3.5 font-body text-[15px] font-bold text-white transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-green-hover"
            >
              {copied ? "Copied!" : "Share"}
              <Share2 className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
