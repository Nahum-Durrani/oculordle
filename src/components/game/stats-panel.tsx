"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { LifetimeStats } from "@/lib/storage";
import { cn } from "@/lib/utils";

function CountUp({ value, reduceMotion }: { value: number; reduceMotion: boolean }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, value, {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setAnimated(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{reduceMotion ? value : animated}</>;
}

function StatCard({ label, value, reduceMotion }: { label: string; value: number | string; reduceMotion: boolean }) {
  return (
    <div className="rounded-[13px] border border-border bg-surface px-5 py-5.5 shadow-[0_2px_10px_rgba(16,35,58,.04)]">
      <div className="font-display text-[34px] leading-none font-extrabold tracking-tight text-cobalt-deep">
        {typeof value === "number" ? <CountUp value={value} reduceMotion={reduceMotion} /> : value}
      </div>
      <div className="mt-1.5 font-mono text-[10.5px] tracking-[0.13em] text-slate uppercase">{label}</div>
    </div>
  );
}

export function StatsPanel({ stats, className }: { stats: LifetimeStats; className?: string }) {
  const reduceMotion = Boolean(useReducedMotion());
  const winPct = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const losses = Math.max(0, stats.played - stats.won);
  const bars: Array<[string, number]> = [
    ...stats.guessDistribution.map((count, i): [string, number] => [String(i + 1), count]),
    ["X", losses],
  ];
  const maxCount = Math.max(1, ...bars.map(([, c]) => c));

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Played" value={stats.played} reduceMotion={reduceMotion} />
        <StatCard label="Win rate" value={`${winPct}%`} reduceMotion={reduceMotion} />
        <StatCard label="Current streak" value={stats.currentStreak} reduceMotion={reduceMotion} />
        <StatCard label="Max streak" value={stats.maxStreak} reduceMotion={reduceMotion} />
      </div>

      <div className="rounded-2xl border border-border bg-surface px-6.5 py-7 shadow-[0_2px_10px_rgba(16,35,58,.04)]">
        <p className="mb-5 font-mono text-[11px] tracking-[0.16em] text-cobalt uppercase">Guess distribution</p>
        <div className="flex flex-col gap-2.5">
          {bars.map(([label, count]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-[26px] shrink-0 font-mono text-xs text-ink-soft">{label}</span>
              <div className="h-[26px] flex-1 overflow-hidden rounded-md bg-[#f1f4f8]">
                <div
                  className="flex h-full items-center justify-end rounded-md pr-2.5 font-mono text-[11px] font-semibold text-white transition-[width] duration-500 ease-out"
                  style={{
                    width: `${12 + (count / maxCount) * 88}%`,
                    // #8b98ab (the decorative --slate/--amber tone) can't carry the
                    // white count text at 4.5:1; --ink-soft's #5b6b82 can.
                    background: label === "X" ? "#5b6b82" : "#1957a4",
                  }}
                >
                  {count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
