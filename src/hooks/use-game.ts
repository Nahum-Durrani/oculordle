"use client";

import { useCallback, useEffect, useState } from "react";
import type { OphthoCase } from "@/types/case";
import { getAllCases, getDailyCase } from "@/lib/case-data";
import { getDayNumber } from "@/lib/date";
import { applyGuess, getOrInitProgress, updateStatsForCompletedGame } from "@/lib/game";
import {
  EMPTY_STATS,
  loadProgress,
  loadStats,
  saveProgress,
  saveStats,
  type DailyProgress,
  type LifetimeStats,
} from "@/lib/storage";

interface UseGameResult {
  loading: boolean;
  todaysCase: OphthoCase | null;
  allCases: OphthoCase[];
  progress: DailyProgress | null;
  stats: LifetimeStats;
  dayNumber: number;
  /** Returns true when the guess repeated an already-tried diagnosis and was rejected without consuming an attempt. */
  submitGuess: (raw: string) => boolean;
}

export function useGame(): UseGameResult {
  const [loading, setLoading] = useState(true);
  const [todaysCase, setTodaysCase] = useState<OphthoCase | null>(null);
  const [allCases, setAllCases] = useState<OphthoCase[]>([]);
  const [progress, setProgress] = useState<DailyProgress | null>(null);
  const [stats, setStats] = useState<LifetimeStats>(EMPTY_STATS);
  const [dayNumber, setDayNumber] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const now = new Date();
      const [cases, daily] = await Promise.all([getAllCases(), getDailyCase(now)]);
      if (cancelled) return;

      const initial = getOrInitProgress(loadProgress(), daily, now);
      saveProgress(initial);

      setAllCases(cases);
      setTodaysCase(daily);
      setProgress(initial);
      setStats(loadStats());
      setDayNumber(getDayNumber(now));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const submitGuess = useCallback(
    (raw: string) => {
      if (!todaysCase || !progress) return false;
      const { progress: next, justCompleted, duplicate } = applyGuess(progress, todaysCase, allCases, raw);
      if (duplicate) return true;

      setProgress(next);
      saveProgress(next);

      if (justCompleted) {
        setStats((prevStats) => {
          const nextStats = updateStatsForCompletedGame(prevStats, next);
          saveStats(nextStats);
          return nextStats;
        });
      }
      return false;
    },
    [todaysCase, progress, allCases],
  );

  return { loading, todaysCase, allCases, progress, stats, dayNumber, submitGuess };
}
