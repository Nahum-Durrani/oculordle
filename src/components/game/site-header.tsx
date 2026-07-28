"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { MenuDrawer } from "@/components/game/menu-drawer";
import { HowToPlayDialog } from "@/components/game/how-to-play-dialog";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 grid grid-cols-[1fr_auto_1fr] items-center border-b border-border bg-surface px-6 py-4">
      <button
        type="button"
        aria-label="Menu"
        onClick={() => setMenuOpen(true)}
        className="-m-2 flex flex-col gap-[5px] p-3.5 justify-self-start"
      >
        <Menu className="size-6 text-ink" strokeWidth={1.75} aria-hidden="true" />
      </button>

      <Link href="/" aria-label="Oculordle home" className="flex items-center justify-self-center">
        <Image
          src="/oculordle-logo.png"
          alt="Oculordle"
          width={1446}
          height={298}
          priority
          className="h-[27px] w-auto opacity-90 brightness-0 saturate-100"
        />
      </Link>

      <MenuDrawer open={menuOpen} onOpenChange={setMenuOpen} onHowToPlay={() => setHowToPlayOpen(true)} />
      <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
    </header>
  );
}
