"use client";

import { motion, useReducedMotion } from "framer-motion";
import { getGuessFeedback, type GuessFeedback } from "@/lib/game";
import { MAX_GUESSES } from "@/lib/config";
import type { GuessRecord } from "@/lib/storage";
import type { OphthoCase } from "@/types/case";
import { cn } from "@/lib/utils";

// tagColor intentionally matches `text` here (not the brighter --green/--amber/--slate
// fills used elsewhere) — those brighter tones fail 4.5:1 small-text contrast on these
// pale tinted backgrounds.
const FEEDBACK_STYLE: Record<GuessFeedback, { bg: string; border: string; text: string; tag: string; tagColor: string }> = {
  correct: { bg: "#eaf6f0", border: "#b7e0cc", text: "#22754f", tag: "Correct", tagColor: "#1f7e56" },
  close: { bg: "#fbf3e2", border: "#edd9a9", text: "#8a6410", tag: "Close", tagColor: "#8a6410" },
  wrong: { bg: "#f2f4f7", border: "#e0e5ec", text: "#5b6b82", tag: "Wrong", tagColor: "#5b6b82" },
};

interface GuessHistoryProps {
  guesses: GuessRecord[];
  todaysCase: OphthoCase;
  allCases: OphthoCase[];
  showPlaceholders?: boolean;
  className?: string;
}

export function GuessHistory({
  guesses,
  todaysCase,
  allCases,
  showPlaceholders = true,
  className,
}: GuessHistoryProps) {
  const reduceMotion = useReducedMotion();
  const placeholderCount = showPlaceholders ? Math.max(0, MAX_GUESSES - guesses.length) : 0;

  if (guesses.length === 0 && placeholderCount === 0) return null;

  return (
    <ol className={cn("flex flex-col gap-2.5", className)}>
      {guesses.map((g, i) => {
        const feedback = getGuessFeedback(g, todaysCase, allCases);
        const s = FEEDBACK_STYLE[feedback];
        return (
          <motion.li
            key={i}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="flex items-center justify-between gap-3 rounded-[11px] border px-[17px] py-3.5"
            style={{ background: s.bg, borderColor: s.border }}
          >
            <span className="truncate text-[15px] font-semibold" style={{ color: s.text }}>
              {g.resolved ?? g.raw}
            </span>
            <span
              className="shrink-0 font-mono text-[11px] tracking-[0.14em] uppercase"
              style={{ color: s.tagColor }}
            >
              {s.tag}
            </span>
          </motion.li>
        );
      })}
      {Array.from({ length: placeholderCount }, (_, i) => (
        <li
          key={`empty-${i}`}
          className="rounded-[11px] border border-dashed border-border px-[17px] py-3.5 font-body text-[15px] font-medium text-slate"
        >
          Guess {guesses.length + i + 1}
        </li>
      ))}
    </ol>
  );
}
