"use client";

import { useEffect, useState } from "react";

function formatCountdown(now: Date): string {
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  let s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  s %= 3600;
  const m = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${ss}`;
}

/** Live `HH:MM:SS` countdown to the player's local midnight (when the next case appears). */
export function useCountdownToMidnight(): string {
  const [label, setLabel] = useState(() => formatCountdown(new Date()));

  useEffect(() => {
    const id = setInterval(() => setLabel(formatCountdown(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return label;
}
