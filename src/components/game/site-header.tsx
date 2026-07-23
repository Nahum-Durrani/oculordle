"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MenuDrawer } from "@/components/game/menu-drawer";
import { HowToPlayDialog } from "@/components/game/how-to-play-dialog";

export function SiteHeader({ points }: { points?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setMenuOpen(true)}
        className="-m-2 flex flex-col gap-[5px] p-3.5"
      >
        <Menu className="size-6 text-ink" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <Link href="/" aria-label="Oculordle home" className="flex items-center">
        <Image
          src="/oculordle-logo.png"
          alt="Oculordle"
          width={1446}
          height={298}
          priority
          className="h-[27px] w-auto opacity-90 brightness-0 saturate-100"
        />
      </Link>

      <div className="flex items-center gap-1.5 rounded-full border border-[#dbe5f2] bg-cobalt-soft py-1.5 pr-3.5 pl-2.5">
        <span className="size-2 rounded-full bg-green" aria-hidden="true" />
        <span className="text-[15px] font-bold text-cobalt-deep tabular-nums">{points ?? "—"}</span>
        <span className="font-mono text-[10px] tracking-[0.12em] text-slate uppercase">Pts</span>
      </div>

      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} onHowToPlay={() => setHowToPlayOpen(true)} />
      <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
    </header>
  );
}
