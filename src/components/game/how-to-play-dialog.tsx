"use client";

import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogClose } from "@/components/ui/dialog";

const RULES = [
  "Each day brings one new case. You get five guesses to name the diagnosis.",
  "The first clue is free. Every wrong guess reveals the next one, up to all five.",
  "Type a diagnosis into the guess box — recognized aliases and synonyms count too.",
  "Guess right within five tries to win. Run out, and the case (and answer) is revealed.",
  "A new case appears at your local midnight. Come back tomorrow.",
] as const;

const FEEDBACK = [
  { color: "#2f9e6e", label: "Correct", text: "you named the exact diagnosis. The case ends." },
  { color: "#e0a82e", label: "Close", text: "right category, wrong diagnosis." },
  { color: "#8b98ab", label: "Wrong", text: "a new clue unlocks to help you." },
] as const;

export function HowToPlayDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-[480px] gap-0 rounded-2xl bg-surface p-8 pb-7 sm:p-8">
        <DialogDescription className="sr-only">Rules for Oculordle</DialogDescription>

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
              <Stethoscope className="size-5" aria-hidden="true" />
            </div>
            <DialogTitle className="font-display text-[27px] font-extrabold tracking-tight text-ink">
              Diagnose the daily case
            </DialogTitle>
          </div>
          <DialogClose className="-mt-1 -mr-1.5 flex size-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-slate transition-colors hover:bg-surface-sunken hover:text-ink">
            <span aria-hidden="true">×</span>
            <span className="sr-only">Close</span>
          </DialogClose>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          {RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-cobalt-soft text-sm font-bold text-cobalt">
                {i + 1}
              </div>
              <p className="pt-0.5 text-[15px] leading-[1.55] text-[#3a4a63]">{rule}</p>
            </div>
          ))}
        </div>

        <p className="mb-2.5 font-mono text-[10.5px] tracking-[0.16em] text-ink-soft uppercase">Feedback</p>
        <div className="mb-6 flex flex-col gap-2.5">
          {FEEDBACK.map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="size-[34px] shrink-0 rounded-lg" style={{ background: f.color }} />
              <span className="text-sm text-[#3a4a63]">
                <b>{f.label}</b> — {f.text}
              </span>
            </div>
          ))}
        </div>

        <DialogClose asChild>
          <Link
            href="/play"
            className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-cobalt py-[15px] font-body text-base font-bold text-white transition-colors duration-150 hover:bg-cobalt-hover"
          >
            Start playing
            <ArrowRight className="size-[17px]" aria-hidden="true" />
          </Link>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
