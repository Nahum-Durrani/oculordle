"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/game/site-header";
import { SiteFooter } from "@/components/game/site-footer";
import { StatsPanel } from "@/components/game/stats-panel";
import { useHeaderPoints } from "@/hooks/use-header-points";
import { EMPTY_STATS, loadStats, type LifetimeStats } from "@/lib/storage";

export function StatsView() {
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);
  const points = useHeaderPoints();

  useEffect(() => {
    (() => {
      setStats(loadStats());
    })();
  }, []);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader points={points} />

      <main className="mx-auto flex w-full max-w-[860px] flex-1 flex-col gap-7.5 px-7 py-11.5 sm:py-11.5">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-[34px] font-extrabold tracking-tight text-ink">
            How you&rsquo;re reading the retina
          </h1>
          <p className="text-[15px] text-ink-soft">Every case you&rsquo;ve guessed, win or lose, tallied here.</p>
        </div>

        <StatsPanel stats={stats} />
      </main>

      <SiteFooter />
    </div>
  );
}
