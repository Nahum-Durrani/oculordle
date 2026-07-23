"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Command as CommandPrimitive } from "cmdk";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { searchDiagnoses, type DiagnosisOption } from "@/lib/match";
import { potentialPoints } from "@/lib/game";
import { MAX_GUESSES } from "@/lib/config";
import type { OphthoCase } from "@/types/case";
import { cn } from "@/lib/utils";

interface GuessComboboxProps {
  cases: OphthoCase[];
  guessesMade: number;
  disabled?: boolean;
  /** Returns true when the guess was rejected as a duplicate of one already tried this round. */
  onSubmit: (raw: string) => boolean;
  className?: string;
}

/**
 * Free-typing diagnosis autocomplete. Built on cmdk directly rather than
 * the shared shadcn Command wrapper, whose forced rounded-xl!/bg-popover
 * chrome fights our own card styling here.
 *
 * Enter always submits the current input text, even with the list open —
 * a wrong/unmatched guess still resolves and counts. Suggestions are a
 * convenience, accepted by click (or Tab), not by Enter.
 */
export function GuessCombobox({ cases, guessesMade, disabled, onSubmit, className }: GuessComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);
  const inputId = useId();
  const listId = useId();
  const reduceMotion = useReducedMotion();
  // cmdk refocuses its input after a selection (for keyboard-continuation UX),
  // which re-fires onFocus a tick after handleSelect closes the list — this
  // flag suppresses that one reopen so a click-selection actually closes it.
  const justSelectedRef = useRef(false);

  const results = useMemo<DiagnosisOption[]>(
    () => (query.trim() ? searchDiagnoses(cases, query, 6) : []),
    [cases, query],
  );

  const handleSelect = (canonicalName: string) => {
    justSelectedRef.current = true;
    setQuery(canonicalName);
    setOpen(false);
    setDuplicateError(false);
  };

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || disabled) return;
    const wasDuplicate = onSubmit(trimmed);
    if (wasDuplicate) {
      setDuplicateError(true);
      setOpen(false);
      return;
    }
    setQuery("");
    setOpen(false);
    setDuplicateError(false);
  };

  const showList = open && results.length > 0;
  const remaining = MAX_GUESSES - guessesMade;

  return (
    <div className={cn("flex flex-col", className)}>
      <CommandPrimitive shouldFilter={false} loop className="relative flex flex-col">
      <div className="flex gap-2.5">
        <div className="flex-1">
          <Label htmlFor={inputId} className="sr-only">
            Diagnosis guess
          </Label>
          <CommandPrimitive.Input
            id={inputId}
            value={query}
            onValueChange={(v) => {
              setQuery(v);
              setOpen(true);
              setDuplicateError(false);
            }}
            onFocus={() => {
              if (justSelectedRef.current) {
                justSelectedRef.current = false;
                return;
              }
              setOpen(true);
            }}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              } else if (e.key === "Escape") {
                setOpen(false);
              }
            }}
            placeholder="Start typing a diagnosis (abbreviations work)…"
            disabled={disabled}
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            className={cn(
              "h-[54px] w-full rounded-xl border-[1.5px] bg-surface px-[18px] font-body text-base text-ink outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-slate focus-visible:shadow-[0_0_0_4px_rgba(25,87,164,.13)] disabled:cursor-not-allowed disabled:opacity-60",
              duplicateError ? "border-destructive" : "border-border-strong focus-visible:border-cobalt",
            )}
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !query.trim()}
          className="flex h-[54px] shrink-0 items-center gap-2 rounded-xl bg-cobalt px-6 font-body text-base font-bold text-white transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-cobalt-hover disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
          <ArrowRight className="size-[17px]" aria-hidden="true" />
        </button>
      </div>

      {/* Anchored to the full row (input + Submit button), not just the input
          column, so it fully covers the guess-history row underneath instead
          of leaving a sliver where prior tags peek out from its right edge. */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97, y: -4 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: reduceMotion ? 0 : 0.16, ease: [0.23, 1, 0.32, 1] },
            }}
            exit={{
              opacity: 0,
              scale: reduceMotion ? 1 : 0.97,
              y: reduceMotion ? 0 : -4,
              transition: { duration: reduceMotion ? 0 : 0.12, ease: "easeOut" },
            }}
            style={{ transformOrigin: "top" }}
            className="absolute top-full right-0 left-0 z-20 mt-1.5"
          >
            <CommandPrimitive.List
              id={listId}
              className="max-h-65 w-full overflow-y-auto rounded-xl border border-border bg-surface shadow-[0_12px_34px_rgba(16,35,58,.16)]"
            >
              <CommandPrimitive.Group>
                {results.map((r) => (
                  <CommandPrimitive.Item
                    key={r.caseId}
                    value={`${r.caseId}-${r.canonicalName}`}
                    onSelect={() => handleSelect(r.canonicalName)}
                    className="flex cursor-default items-center justify-between gap-2.5 border-b border-[#f1f4f8] px-4 py-3 text-[15px] text-ink transition-colors duration-100 last:border-b-0 data-[selected=true]:bg-cobalt-soft"
                  >
                    <span>{r.canonicalName}</span>
                    <span className="font-mono text-[10px] tracking-[0.1em] text-slate uppercase">
                      {r.matchedAlias ?? ""}
                    </span>
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            </CommandPrimitive.List>
          </motion.div>
        )}
      </AnimatePresence>
      </CommandPrimitive>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5">
        <span
          className={cn(
            "font-mono text-[11px] tracking-[0.1em]",
            duplicateError ? "text-destructive-text" : "text-slate",
          )}
        >
          {duplicateError ? "You already tried this — pick another diagnosis" : `${remaining} guess${remaining === 1 ? "" : "es"} left`}
        </span>
        <span className="font-mono text-[11px] tracking-[0.1em] text-green-text uppercase">
          Solve now · +{potentialPoints(guessesMade)} pts
        </span>
      </div>
    </div>
  );
}
