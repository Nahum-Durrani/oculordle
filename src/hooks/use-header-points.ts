"use client";

import { useEffect, useState } from "react";
import { getDailyCase } from "@/lib/case-data";
import { earnedPoints, getOrInitProgress, potentialPoints } from "@/lib/game";
import { loadProgress } from "@/lib/storage";

/** Today's points-chip value for pages that don't already hold game state (Archive, Stats). */
export function useHeaderPoints(): number | undefined {
  const [points, setPoints] = useState<number>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const daily = await getDailyCase(now);
      if (cancelled) return;
      const progress = getOrInitProgress(loadProgress(), daily, now);
      if (progress.status === "won") setPoints(earnedPoints(progress.guesses.length));
      else if (progress.status === "lost") setPoints(0);
      else setPoints(potentialPoints(progress.guesses.length));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return points;
}
