"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { OphthoCase } from "@/types/case";
import type { RoundStatus } from "@/lib/storage";
import { MAX_GUESSES } from "@/lib/config";
import { cn } from "@/lib/utils";

interface ResultPanelProps {
  caseData: OphthoCase;
  status: Extract<RoundStatus, "won" | "lost">;
  guessCount: number;
  className?: string;
}

export function ResultPanel({ caseData, status, guessCount, className }: ResultPanelProps) {
  const reduceMotion = useReducedMotion();
  const won = status === "won";

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
      className={cn("flex flex-col items-center gap-3 text-center", className)}
      aria-live="polite"
    >
      <p className="font-mono text-[11px] font-semibold tracking-[0.18em] uppercase" style={{ color: won ? "#1f7e56" : "#5b6b82" }}>
        {won ? `Solved in ${guessCount}/${MAX_GUESSES}` : "Better luck tomorrow"}
      </p>
      <h2 className="font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-ink text-balance sm:text-4xl">
        {caseData.diagnosis}
      </h2>
      {caseData.aliases.length > 0 && (
        <p className="text-lg text-ink-soft italic">{caseData.aliases.join(", ")}</p>
      )}
    </motion.section>
  );
}
