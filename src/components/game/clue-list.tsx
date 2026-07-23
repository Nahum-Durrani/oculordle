"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import { CLUE_KIND_LABELS } from "@/lib/config";
import { cn } from "@/lib/utils";

interface ClueListProps {
  clues: readonly [string, string, string, string, string];
  revealed: number;
  className?: string;
}

export function ClueList({ clues, revealed, className }: ClueListProps) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(1, Math.min(clues.length, revealed));

  return (
    <ol className={cn("flex flex-col gap-2.5", className)}>
      {clues.map((clue, i) => {
        const n = i + 1;
        const locked = n > clamped;
        return (
          <motion.li
            key={i}
            initial={false}
            animate={locked ? { opacity: 0.65 } : { opacity: 1 }}
            className={cn(
              "flex items-start gap-3.5 rounded-xl border border-border px-4.5 py-4",
              locked ? "bg-[#fafbfc]" : "bg-surface",
            )}
          >
            <div
              className={cn(
                "flex size-[26px] shrink-0 items-center justify-center rounded-[7px] font-mono text-xs font-semibold",
                locked ? "bg-[#eef1f5] text-slate" : "bg-cobalt-soft text-cobalt",
              )}
            >
              {n}
            </div>
            <div className="flex-1">
              <div
                className={cn(
                  "font-mono text-[9.5px] tracking-[0.14em] uppercase",
                  locked ? "text-slate" : "text-cobalt",
                )}
              >
                {locked ? `Clue ${n}` : `Clue ${n} · ${CLUE_KIND_LABELS[i]}`}
              </div>
              {locked ? (
                <div className="mt-1.5 flex items-center gap-2 text-slate">
                  <Lock className="size-3.5" aria-hidden="true" />
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase">
                    Locked · Unlocks after guess {n - 1}
                  </span>
                </div>
              ) : (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
                  className="mt-1 text-[15px] leading-[1.6] text-[#26364f]"
                >
                  <span className="sr-only">Clue {n}: </span>
                  {clue}
                </motion.div>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
