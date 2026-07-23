"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { getShareText } from "@/lib/game";
import type { DailyProgress } from "@/lib/storage";

export function ShareButton({ dayNumber, progress }: { dayNumber: number; progress: DailyProgress }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const text = getShareText(dayNumber, progress);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — clipboard access was blocked");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-green py-3.5 font-body text-base font-bold text-white transition-[background-color,transform] duration-150 hover:-translate-y-px hover:bg-green-hover"
    >
      {copied ? "Copied!" : "Share result"}
      <Share2 className="size-4" aria-hidden="true" />
    </button>
  );
}
